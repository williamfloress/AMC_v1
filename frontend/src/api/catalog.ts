import { api } from './client';

export interface Sector {
  id: number;
  nombre: string;
}

export interface Acabado {
  id: number;
  tipo: string;
  nombre: string;
  puntaje: number;
}

export interface PonderacionAcabado {
  id: number;
  tipo: string;
  ponderacion: number;
}

export async function fetchSectors() {
  return api.get<Sector[]>('/sectors');
}

export async function fetchFinishes(type?: 'piso' | 'cocina' | 'bano') {
  const q = type ? `?type=${type}` : '';
  return api.get<Acabado[]>(`/finishes${q}`);
}

export async function fetchFinishWeights() {
  return api.get<PonderacionAcabado[]>('/finish-weights');
}
