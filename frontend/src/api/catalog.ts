import { api } from './client';

export interface Sector {
  id: number;
  nombre: string;
  latitud?: number | null;
  longitud?: number | null;
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

export async function createSector(body: { nombre: string; latitud?: number; longitud?: number }) {
  return api.post<Sector>('/sectors', body);
}

export async function updateSector(
  id: number,
  body: { nombre?: string; latitud?: number; longitud?: number }
) {
  return api.patch<Sector>(`/sectors/${id}`, body);
}

export async function deleteSector(id: number) {
  return api.delete(`/sectors/${id}`);
}

export async function fetchFinishes(type?: 'piso' | 'cocina' | 'bano') {
  const q = type ? `?type=${type}` : '';
  return api.get<Acabado[]>(`/finishes${q}`);
}

export async function fetchFinishWeights() {
  return api.get<PonderacionAcabado[]>('/finish-weights');
}
