import { api } from './client';

export interface RunAmcBody {
  sectorId: number;
  areaM2: number;
  habitaciones: number;
  banos: number;
  parqueos: number;
  anioConstruccion?: number;
  finishPisoId?: number;
  finishCocinaId?: number;
  finishBanoId?: number;
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
  promedioPrecioComparables: number;
  medianaPrecioComparables: number;
  promedioAcabadoComparables: number;
  desviacionEstandarAcabados: number;
  tasaDesviacionAcabados: number;
  promedioAcabadoSujeto?: number;
  acabadosSujeto?: {
    piso: AcabadoSujeto;
    cocina: AcabadoSujeto;
    bano: AcabadoSujeto;
  };
  comparables: Array<{
    id: number;
    sectorId: number;
    sector: { id: number; nombre: string };
    latitud?: number | null;
    longitud?: number | null;
    precio: number;
    areaConstruccionM2: number;
    valorM2: number;
    promedioAcabado: number;
    habitaciones: number;
    banos: number;
    parqueos: number;
    anioConstruccion?: number | null;
    estado?: string;
    acabadoPiso: { id: number; nombre: string; puntaje: number };
    acabadoCocina: { id: number; nombre: string; puntaje: number };
    acabadoBano: { id: number; nombre: string; puntaje: number };
  }>;
}

export async function runAmc(body: RunAmcBody) {
  return api.post<AmcResult>('/amc/run', body);
}
