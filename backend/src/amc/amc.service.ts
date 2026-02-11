import { Injectable, BadRequestException } from '@nestjs/common';
import { TipoAcabado } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AMC_CONFIG } from './amc.config';
import {
  mean,
  median,
  std,
  round2,
  round4,
  promedioAcabadoPonderado,
  valorConAcabados as computeValorConAcabados,
} from './amc.stats';
import { RunAmcDto } from './dto/run-amc.dto';

/** Un comparable con métricas calculadas (no persistidas) */
export interface ComparableItem {
  id: number;
  sectorId: number;
  precio: number;
  areaConstruccionM2: number;
  valorM2: number;
  promedioAcabado: number;
  habitaciones: number;
  banos: number;
  parqueos: number;
  acabadoPiso: { id: number; nombre: string; puntaje: number };
  acabadoCocina: { id: number; nombre: string; puntaje: number };
  acabadoBano: { id: number; nombre: string; puntaje: number };
}

export interface AmcResult {
  valorBase: number;
  valorConAcabados: number;
  promedioValorM2: number;
  medianaValorM2: number;
  desviacionEstandarValorM2: number;
  tasaDesviacion: number;
  cantidadComparables: number;
  comparables: ComparableItem[];
}

@Injectable()
export class AmcService {
  constructor(private readonly prisma: PrismaService) {}

  async run(dto: RunAmcDto): Promise<AmcResult> {
    const { sectorId, areaM2, finishPisoId, finishCocinaId, finishBanoId } = dto;
    const tol = AMC_CONFIG.TOLERANCIA_AREA_PCT;
    const areaMin = areaM2 * (1 - tol);
    const areaMax = areaM2 * (1 + tol);

    const [propiedades, ponderaciones, acabadoPiso, acabadoCocina, acabadoBano] =
      await Promise.all([
        this.prisma.propiedad.findMany({
          where: {
            sectorId,
            areaConstruccionM2: { gte: areaMin, lte: areaMax },
          },
          include: {
            sector: { select: { id: true, nombre: true } },
            acabadoPiso: { select: { id: true, nombre: true, puntaje: true } },
            acabadoCocina: { select: { id: true, nombre: true, puntaje: true } },
            acabadoBano: { select: { id: true, nombre: true, puntaje: true } },
          },
        }),
        this.prisma.ponderacionAcabado.findMany(),
        this.prisma.acabado.findUnique({ where: { id: finishPisoId } }),
        this.prisma.acabado.findUnique({ where: { id: finishCocinaId } }),
        this.prisma.acabado.findUnique({ where: { id: finishBanoId } }),
      ]);

    if (!acabadoPiso || !acabadoCocina || !acabadoBano) {
      throw new BadRequestException('Uno o más IDs de acabado no existen');
    }
    if (propiedades.length === 0) {
      throw new BadRequestException(
        'No hay propiedades comparables en el sector para el rango de área indicado',
      );
    }

    const ponderacionByTipo = new Map<TipoAcabado, number>();
    let sumaPonderacion = 0;
    for (const p of ponderaciones) {
      ponderacionByTipo.set(p.tipo, p.ponderacion);
      sumaPonderacion += p.ponderacion;
    }
    const pesoPiso = ponderacionByTipo.get('piso') ?? 7;
    const pesoCocina = ponderacionByTipo.get('cocina') ?? 3;
    const pesoBano = ponderacionByTipo.get('bano') ?? 4;
    const pesoTotal = pesoPiso + pesoCocina + pesoBano;

    const toNum = (v: unknown): number => (typeof v === 'number' ? v : Number(v));

    const comparables: ComparableItem[] = propiedades.map((p) => {
      const precio = toNum(p.precio);
      const area = toNum(p.areaConstruccionM2);
      const valorM2 = area > 0 ? precio / area : 0;
      const promedioAcabado = promedioAcabadoPonderado(
        toNum(p.acabadoPiso.puntaje),
        toNum(p.acabadoCocina.puntaje),
        toNum(p.acabadoBano.puntaje),
        pesoPiso,
        pesoCocina,
        pesoBano,
      );
      return {
        id: p.id,
        sectorId: p.sectorId,
        precio,
        areaConstruccionM2: area,
        valorM2,
        promedioAcabado,
        habitaciones: p.habitaciones,
        banos: p.banos,
        parqueos: p.parqueos,
        acabadoPiso: {
          id: p.acabadoPiso.id,
          nombre: p.acabadoPiso.nombre,
          puntaje: p.acabadoPiso.puntaje,
        },
        acabadoCocina: {
          id: p.acabadoCocina.id,
          nombre: p.acabadoCocina.nombre,
          puntaje: p.acabadoCocina.puntaje,
        },
        acabadoBano: {
          id: p.acabadoBano.id,
          nombre: p.acabadoBano.nombre,
          puntaje: p.acabadoBano.puntaje,
        },
      };
    });

    const valoresM2 = comparables.map((c) => c.valorM2);
    const promedioValorM2 = mean(valoresM2);
    const medianaValorM2 = median(valoresM2);
    const desviacionEstandarValorM2 = std(valoresM2);
    const tasaDesviacion =
      promedioValorM2 > 0 ? desviacionEstandarValorM2 / promedioValorM2 : 0;

    const valorBase = areaM2 * promedioValorM2;

    const promedioAcabadoSujeto = promedioAcabadoPonderado(
      toNum(acabadoPiso.puntaje),
      toNum(acabadoCocina.puntaje),
      toNum(acabadoBano.puntaje),
      pesoPiso,
      pesoCocina,
      pesoBano,
    );
    const promedioAcabadoComparables = mean(comparables.map((c) => c.promedioAcabado));
    const valorConAcabados = computeValorConAcabados(
      valorBase,
      promedioAcabadoSujeto,
      promedioAcabadoComparables,
    );

    return {
      valorBase: round2(valorBase),
      valorConAcabados: round2(valorConAcabados),
      promedioValorM2: round2(promedioValorM2),
      medianaValorM2: round2(medianaValorM2),
      desviacionEstandarValorM2: round2(desviacionEstandarValorM2),
      tasaDesviacion: round4(tasaDesviacion),
      cantidadComparables: comparables.length,
      comparables: comparables.map((c) => ({
        ...c,
        valorM2: round2(c.valorM2),
        promedioAcabado: round2(c.promedioAcabado),
      })),
    };
  }
}
