import { Injectable, BadRequestException } from '@nestjs/common';
import { TipoAcabado, EstadoPropiedad } from '@prisma/client';
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
  sector: { id: number; nombre: string };
  latitud: number | null;
  longitud: number | null;
  precio: number;
  areaConstruccionM2: number;
  valorM2: number;
  promedioAcabado: number;
  habitaciones: number;
  banos: number;
  parqueos: number;
  anioConstruccion: number | null;
  estado: EstadoPropiedad;
  acabadoPiso: { id: number; nombre: string; puntaje: number };
  acabadoCocina: { id: number; nombre: string; puntaje: number };
  acabadoBano: { id: number; nombre: string; puntaje: number };
}

export interface AcabadoSujeto {
  nombre: string;
  ponderacion: number;
}

export interface AmcResult {
  valorBase: number;
  valorConAcabados: number;
  promedioValorM2: number;
  medianaValorM2: number;
  desviacionEstandarValorM2: number;
  tasaDesviacion: number;
  cantidadComparables: number;
  /** Promedio de precios de los comparables (Promedio Ponderado en reportes) */
  promedioPrecioComparables: number;
  medianaPrecioComparables: number;
  /** Promedio del índice de acabados de los comparables */
  promedioAcabadoComparables: number;
  desviacionEstandarAcabados: number;
  tasaDesviacionAcabados: number;
  /** Solo cuando se aplicó ajuste por acabados */
  promedioAcabadoSujeto?: number;
  acabadosSujeto?: {
    piso: AcabadoSujeto;
    cocina: AcabadoSujeto;
    bano: AcabadoSujeto;
  };
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

    const tieneAcabados =
      finishPisoId != null &&
      finishPisoId > 0 &&
      finishCocinaId != null &&
      finishCocinaId > 0 &&
      finishBanoId != null &&
      finishBanoId > 0;

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
        tieneAcabados ? this.prisma.acabado.findUnique({ where: { id: finishPisoId! } }) : Promise.resolve(null),
        tieneAcabados ? this.prisma.acabado.findUnique({ where: { id: finishCocinaId! } }) : Promise.resolve(null),
        tieneAcabados ? this.prisma.acabado.findUnique({ where: { id: finishBanoId! } }) : Promise.resolve(null),
      ]);

    if (tieneAcabados && (!acabadoPiso || !acabadoCocina || !acabadoBano)) {
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
        sector: p.sector,
        latitud: p.latitud != null ? toNum(p.latitud) : null,
        longitud: p.longitud != null ? toNum(p.longitud) : null,
        precio,
        areaConstruccionM2: area,
        valorM2,
        promedioAcabado,
        habitaciones: p.habitaciones,
        banos: p.banos,
        parqueos: p.parqueos,
        anioConstruccion: p.anioConstruccion ?? null,
        estado: p.estado,
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
    const precios = comparables.map((c) => c.precio);
    const promediosAcabado = comparables.map((c) => c.promedioAcabado);

    const promedioValorM2 = mean(valoresM2);
    const medianaValorM2 = median(valoresM2);
    const desviacionEstandarValorM2 = std(valoresM2);
    const tasaDesviacion =
      promedioValorM2 > 0 ? desviacionEstandarValorM2 / promedioValorM2 : 0;

    const promedioPrecioComparables = mean(precios);
    const medianaPrecioComparables = median(precios);
    const promedioAcabadoComparables = mean(promediosAcabado);
    const desviacionEstandarAcabados = std(promediosAcabado);
    const tasaDesviacionAcabados =
      promedioAcabadoComparables > 0
        ? desviacionEstandarAcabados / promedioAcabadoComparables
        : 0;

    const valorBase = areaM2 * promedioValorM2;

    let valorConAcabados: number;
    let promedioAcabadoSujeto: number | undefined;
    let acabadosSujeto: AmcResult['acabadosSujeto'];

    if (tieneAcabados && acabadoPiso && acabadoCocina && acabadoBano) {
      promedioAcabadoSujeto = promedioAcabadoPonderado(
        toNum(acabadoPiso.puntaje),
        toNum(acabadoCocina.puntaje),
        toNum(acabadoBano.puntaje),
        pesoPiso,
        pesoCocina,
        pesoBano,
      );
      valorConAcabados = computeValorConAcabados(
        valorBase,
        promedioAcabadoSujeto,
        promedioAcabadoComparables,
      );
      acabadosSujeto = {
        piso: { nombre: acabadoPiso.nombre, ponderacion: pesoPiso },
        cocina: { nombre: acabadoCocina.nombre, ponderacion: pesoCocina },
        bano: { nombre: acabadoBano.nombre, ponderacion: pesoBano },
      };
    } else {
      valorConAcabados = valorBase;
    }

    return {
      valorBase: round2(valorBase),
      valorConAcabados: round2(valorConAcabados),
      promedioValorM2: round2(promedioValorM2),
      medianaValorM2: round2(medianaValorM2),
      desviacionEstandarValorM2: round2(desviacionEstandarValorM2),
      tasaDesviacion: round4(tasaDesviacion),
      cantidadComparables: comparables.length,
      promedioPrecioComparables: round2(promedioPrecioComparables),
      medianaPrecioComparables: round2(medianaPrecioComparables),
      promedioAcabadoComparables: round2(promedioAcabadoComparables),
      desviacionEstandarAcabados: round2(desviacionEstandarAcabados),
      tasaDesviacionAcabados: round4(tasaDesviacionAcabados),
      ...(promedioAcabadoSujeto !== undefined && {
        promedioAcabadoSujeto: round2(promedioAcabadoSujeto),
      }),
      ...(acabadosSujeto && { acabadosSujeto }),
      comparables: comparables.map((c) => ({
        ...c,
        valorM2: round2(c.valorM2),
        promedioAcabado: round2(c.promedioAcabado),
      })),
    };
  }
}
