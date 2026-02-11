/**
 * Funciones puras de estadística y redondeo para el AMC.
 * Exportadas para poder testearlas de forma aislada.
 */
export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]!
    : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

export function std(arr: number[]): number {
  if (arr.length <= 1) return 0;
  const m = mean(arr);
  const variance =
    arr.reduce((s, x) => s + (x - m) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

export function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

export function round4(x: number): number {
  return Math.round(x * 10000) / 10000;
}

/** Promedio acabado ponderado: (puntajePiso*pesoPiso + puntajeCocina*pesoCocina + puntajeBano*pesoBano) / pesoTotal */
export function promedioAcabadoPonderado(
  puntajePiso: number,
  puntajeCocina: number,
  puntajeBano: number,
  pesoPiso: number,
  pesoCocina: number,
  pesoBano: number,
): number {
  const pesoTotal = pesoPiso + pesoCocina + pesoBano;
  if (pesoTotal === 0) return 0;
  return (
    (puntajePiso * pesoPiso + puntajeCocina * pesoCocina + puntajeBano * pesoBano) /
    pesoTotal
  );
}

/** Valor con acabados = valorBase * (promedioAcabadoSujeto / promedioAcabadoComparables); si comparables es 0 devuelve valorBase */
export function valorConAcabados(
  valorBase: number,
  promedioAcabadoSujeto: number,
  promedioAcabadoComparables: number,
): number {
  if (promedioAcabadoComparables <= 0) return valorBase;
  return valorBase * (promedioAcabadoSujeto / promedioAcabadoComparables);
}
