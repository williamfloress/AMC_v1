/** Centro Caracas y coordenadas por sector (Caracas / Venezuela) para mapas */

export const CARACAS_CENTER: [number, number] = [10.4806, -66.9036];

export const SECTOR_CENTERS: Record<string, [number, number]> = {
  ALTAMIRA: [10.4919, -66.8372],
  CHACAO: [10.495, -66.853],
  'LOS PALOS GRANDES': [10.4733, -66.8583],
  'LA CASTELLANA': [10.4933, -66.8633],
  'EL ROSAL': [10.4683, -66.8683],
  'LAS MERCEDES': [10.4933, -66.8733],
  'SABANA GRANDE': [10.4917, -66.8783],
  'SAN BERNARDINO': [10.505, -66.8833],
};

export function getSectorCenter(sectorNombre: string): [number, number] {
  const key = sectorNombre.toUpperCase().trim();
  return SECTOR_CENTERS[key] ?? CARACAS_CENTER;
}
