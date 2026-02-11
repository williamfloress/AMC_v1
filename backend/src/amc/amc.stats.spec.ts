import {
  mean,
  median,
  std,
  round2,
  round4,
  promedioAcabadoPonderado,
  valorConAcabados,
} from './amc.stats';

describe('amc.stats', () => {
  describe('mean', () => {
    it('devuelve 0 para array vacío', () => {
      expect(mean([])).toBe(0);
    });
    it('devuelve el único elemento con un valor', () => {
      expect(mean([5])).toBe(5);
    });
    it('calcula el promedio correcto', () => {
      expect(mean([10, 20, 30])).toBe(20);
      expect(mean([1, 2, 3, 4, 5])).toBe(3);
    });
  });

  describe('median', () => {
    it('devuelve 0 para array vacío', () => {
      expect(median([])).toBe(0);
    });
    it('devuelve el único elemento con un valor', () => {
      expect(median([7])).toBe(7);
    });
    it('calcula la mediana para cantidad impar', () => {
      expect(median([1, 3, 5])).toBe(3);
      expect(median([10, 20, 30])).toBe(20);
    });
    it('calcula la mediana para cantidad par (promedio de los dos centrales)', () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
      expect(median([10, 20, 30, 40])).toBe(25);
    });
    it('no modifica el array original (ordena copia)', () => {
      const arr = [3, 1, 2];
      median(arr);
      expect(arr).toEqual([3, 1, 2]);
    });
  });

  describe('std', () => {
    it('devuelve 0 para 0 o 1 elemento', () => {
      expect(std([])).toBe(0);
      expect(std([1])).toBe(0);
    });
    it('calcula la desviación estándar muestral', () => {
      const arr = [2, 4, 4, 4, 5, 5, 7, 9];
      const s = std(arr);
      expect(s).toBeCloseTo(2.138, 2);
    });
  });

  describe('round2 y round4', () => {
    it('round2 redondea a 2 decimales', () => {
      expect(round2(919.876)).toBe(919.88);
      expect(round2(100.111)).toBe(100.11);
    });
    it('round4 redondea a 4 decimales', () => {
      expect(round4(0.12345)).toBe(0.1235);
    });
  });

  describe('promedioAcabadoPonderado', () => {
    it('devuelve 0 si pesoTotal es 0', () => {
      expect(promedioAcabadoPonderado(1, 2, 3, 0, 0, 0)).toBe(0);
    });
    it('calcula promedio ponderado correcto (piso 7, bano 4, cocina 3)', () => {
      // puntajes 1, 1, 2 -> (1*7 + 1*3 + 2*4) / 14 = 18/14 ≈ 1.29
      const r = promedioAcabadoPonderado(1, 1, 2, 7, 3, 4);
      expect(r).toBeCloseTo(18 / 14, 5);
    });
    it('con ponderaciones iguales es el promedio simple', () => {
      expect(promedioAcabadoPonderado(2, 4, 6, 1, 1, 1)).toBe(4);
    });
  });

  describe('valorConAcabados', () => {
    it('devuelve valorBase si promedioAcabadoComparables es 0', () => {
      expect(valorConAcabados(100000, 5, 0)).toBe(100000);
    });
    it('devuelve valorBase si promedioAcabadoComparables es negativo', () => {
      expect(valorConAcabados(100000, 5, -1)).toBe(100000);
    });
    it('aumenta valor cuando sujeto tiene mejor acabado que promedio', () => {
      const valorBase = 100000;
      const sujeto = 6;
      const comparables = 4;
      expect(valorConAcabados(valorBase, sujeto, comparables)).toBe(150000);
    });
    it('disminuye valor cuando sujeto tiene peor acabado que promedio', () => {
      const valorBase = 100000;
      const sujeto = 2;
      const comparables = 4;
      expect(valorConAcabados(valorBase, sujeto, comparables)).toBe(50000);
    });
    it('mantiene valorBase cuando sujeto igual a promedio comparables', () => {
      expect(valorConAcabados(100000, 4, 4)).toBe(100000);
    });
  });
});
