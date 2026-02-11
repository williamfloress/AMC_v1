/**
 * Configuración central del módulo AMC.
 * Tolerancias de filtro (no persistir datos calculados).
 */
export const AMC_CONFIG = {
  /** Tolerancia de área: comparables con área entre areaM2 * (1 - TOLERANCIA_AREA_PCT) y areaM2 * (1 + TOLERANCIA_AREA_PCT) */
  TOLERANCIA_AREA_PCT: 0.15,
} as const;
