import { api } from './client';

export interface Propiedad {
  id: number;
  sectorId: number;
  precio: number;
  areaConstruccionM2: number;
  habitaciones: number;
  banos: number;
  parqueos: number;
  portal?: string | null;
  codPublicacion?: string | null;
  sector: { id: number; nombre: string };
  acabadoPiso: { id: number; nombre: string; puntaje: number };
  acabadoCocina: { id: number; nombre: string; puntaje: number };
  acabadoBano: { id: number; nombre: string; puntaje: number };
}

export interface CreatePropertyBody {
  sectorId: number;
  precio: number;
  areaConstruccionM2: number;
  habitaciones: number;
  banos: number;
  parqueos: number;
  acabadoPisoId: number;
  acabadoCocinaId: number;
  acabadoBanoId: number;
  portal?: string;
  codPublicacion?: string;
  columnaAux?: number;
}

export async function fetchProperties(params?: {
  sectorId?: number;
  minArea?: number;
  maxArea?: number;
  minPrecio?: number;
  maxPrecio?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.sectorId != null) sp.set('sectorId', String(params.sectorId));
  if (params?.minArea != null) sp.set('minArea', String(params.minArea));
  if (params?.maxArea != null) sp.set('maxArea', String(params.maxArea));
  if (params?.minPrecio != null) sp.set('minPrecio', String(params.minPrecio));
  if (params?.maxPrecio != null) sp.set('maxPrecio', String(params.maxPrecio));
  const q = sp.toString() ? `?${sp}` : '';
  return api.get<Propiedad[]>(`/properties${q}`);
}

export async function createProperty(body: CreatePropertyBody) {
  return api.post<Propiedad>('/properties', body);
}

export async function updateProperty(id: number, body: Partial<CreatePropertyBody>) {
  return api.patch<Propiedad>(`/properties/${id}`, body);
}

export async function deleteProperty(id: number) {
  return api.delete(`/properties/${id}`);
}
