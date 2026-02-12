import { api } from './client';

export interface RunAmcBody {
  sectorId: number;
  areaM2: number;
  finishPisoId: number;
  finishCocinaId: number;
  finishBanoId: number;
}

export interface AmcResult {
  valorBase: number;
  valorConAcabados: number;
  promedioValorM2: number;
  medianaValorM2: number;
  desviacionEstandarValorM2: number;
  tasaDesviacion: number;
  cantidadComparables: number;
  comparables: Array<{
    id: number;
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
  }>;
}

export async function runAmc(body: RunAmcBody) {
  return api.post<AmcResult>('/amc/run', body);
}
