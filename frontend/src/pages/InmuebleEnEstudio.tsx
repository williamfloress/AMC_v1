import { useState } from 'react';
import { useSectors, useFinishes } from '../hooks/useCatalog';
import { runAmc } from '../api/amc';
import type { AmcResult } from '../api/amc';
import { Loading, ApiErrorMessage } from '../components/ApiStatus';
import PropiedadesMap from '../components/PropiedadesMap';
import type { ApiError } from '../api/client';

export default function InmuebleEnEstudio() {
  const { sectors, loading: loadingSectors, error: errorSectors } = useSectors();
  const { finishes: finishesPiso } = useFinishes('piso');
  const { finishes: finishesCocina } = useFinishes('cocina');
  const { finishes: finishesBano } = useFinishes('bano');

  const [sectorId, setSectorId] = useState(0);
  const [areaM2, setAreaM2] = useState<string>('');
  const [habitaciones, setHabitaciones] = useState<string>('');
  const [banos, setBanos] = useState<string>('');
  const [parqueos, setParqueos] = useState<string>('');
  const [anioConstruccion, setAnioConstruccion] = useState<string>('');
  const [finishPisoId, setFinishPisoId] = useState(0);
  const [finishCocinaId, setFinishCocinaId] = useState(0);
  const [finishBanoId, setFinishBanoId] = useState(0);

  const [result, setResult] = useState<AmcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    const area = Number(areaM2);
    const hab = Number(habitaciones);
    const ban = Number(banos);
    const parq = Number(parqueos);
    const anio = anioConstruccion.trim() ? Number(anioConstruccion) : undefined;

    if (!areaM2.trim()) {
      setFieldErrors((prev) => ({ ...prev, area: 'Indique el área construida.' }));
      return;
    }
    if (Number.isNaN(area) || area <= 0) {
      setFieldErrors((prev) => ({ ...prev, area: 'El área debe ser un número mayor a 0.' }));
      return;
    }
    if (habitaciones.trim() === '' || Number.isNaN(hab) || hab < 0) {
      setFieldErrors((prev) => ({ ...prev, habitaciones: 'Indique la cantidad de cuartos.' }));
      return;
    }
    if (banos.trim() === '' || Number.isNaN(ban) || ban < 0) {
      setFieldErrors((prev) => ({ ...prev, banos: 'Indique la cantidad de baños.' }));
      return;
    }
    if (parqueos.trim() === '' || Number.isNaN(parq) || parq < 0) {
      setFieldErrors((prev) => ({ ...prev, parqueos: 'Indique el número de estacionamientos.' }));
      return;
    }
    if (anio !== undefined && (Number.isNaN(anio) || anio < 1900 || anio > 2100)) {
      setFieldErrors((prev) => ({ ...prev, anioConstruccion: 'Año entre 1900 y 2100.' }));
      return;
    }
    if (!sectorId) return;

    setResult(null);
    setLoading(true);
    const body: Parameters<typeof runAmc>[0] = {
      sectorId,
      areaM2: area,
      habitaciones: hab,
      banos: ban,
      parqueos: parq,
    };
    if (anio != null) body.anioConstruccion = anio;
    if (finishPisoId > 0) body.finishPisoId = finishPisoId;
    if (finishCocinaId > 0) body.finishCocinaId = finishCocinaId;
    if (finishBanoId > 0) body.finishBanoId = finishBanoId;

    runAmc(body).then((res) => {
      setLoading(false);
      if (res.error) setError(res.error);
      else if (res.data) setResult(res.data);
    });
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  if (loadingSectors) return <Loading />;
  if (errorSectors) return <ApiErrorMessage error={errorSectors} />;

  return (
    <div>
      <h1 className="acm-page-title" style={{ marginBottom: '0.25rem' }}>
        Reportes de Análisis Comparativo de Mercado (ACM)
      </h1>
      <p className="acm-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        Ingresa los datos del inmueble a valuar y calcula el valor de mercado estimado.
      </p>

      <div className="acm-card">
        <h2 className="acm-card-title">Datos del inmueble</h2>
        <p className="acm-muted" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
          Complete los datos prioritarios (sector, m², cuartos, baños, estacionamientos y año). Los acabados son opcionales y permiten afinar el valor.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem 0.875rem' }}>
            <div className="acm-form-row">
              <label className="acm-label">Sector</label>
              <select
                className="acm-select"
                value={sectorId}
                onChange={(e) => setSectorId(Number(e.target.value))}
                required
              >
                <option value={0}>Seleccione sector</option>
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>
            <div className="acm-form-row">
              <label className="acm-label">Área construida (m²)</label>
              <input
                type="number"
                min={0.01}
                step={0.01}
                className="acm-input"
                value={areaM2}
                onChange={(e) => { setAreaM2(e.target.value); clearFieldError('area'); }}
                placeholder="Ej. 128"
                required
              />
              {fieldErrors.area && <p className="acm-error-msg">{fieldErrors.area}</p>}
            </div>
            <div className="acm-form-row">
              <label className="acm-label">Cantidad de cuartos</label>
              <input
                type="number"
                min={0}
                className="acm-input"
                value={habitaciones}
                onChange={(e) => { setHabitaciones(e.target.value); clearFieldError('habitaciones'); }}
                placeholder="Ej. 3"
                required
              />
              {fieldErrors.habitaciones && <p className="acm-error-msg">{fieldErrors.habitaciones}</p>}
            </div>
            <div className="acm-form-row">
              <label className="acm-label">Cantidad de baños</label>
              <input
                type="number"
                min={0}
                className="acm-input"
                value={banos}
                onChange={(e) => { setBanos(e.target.value); clearFieldError('banos'); }}
                placeholder="Ej. 2"
                required
              />
              {fieldErrors.banos && <p className="acm-error-msg">{fieldErrors.banos}</p>}
            </div>
            <div className="acm-form-row">
              <label className="acm-label">Número de estacionamientos</label>
              <input
                type="number"
                min={0}
                className="acm-input"
                value={parqueos}
                onChange={(e) => { setParqueos(e.target.value); clearFieldError('parqueos'); }}
                placeholder="Ej. 2"
                required
              />
              {fieldErrors.parqueos && <p className="acm-error-msg">{fieldErrors.parqueos}</p>}
            </div>
            <div className="acm-form-row">
              <label className="acm-label">Año de construcción</label>
              <input
                type="number"
                min={1900}
                max={2100}
                className="acm-input"
                value={anioConstruccion}
                onChange={(e) => { setAnioConstruccion(e.target.value); clearFieldError('anioConstruccion'); }}
                placeholder="Opcional (ej. 2015)"
              />
              {fieldErrors.anioConstruccion && <p className="acm-error-msg">{fieldErrors.anioConstruccion}</p>}
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--acm-border)' }}>
            <p className="acm-muted" style={{ marginBottom: '0.75rem', fontSize: '0.8125rem' }}>Acabados (opcionales)</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1rem 0.875rem' }}>
              <div className="acm-form-row">
                <label className="acm-label">Acabado piso</label>
                <select
                  className="acm-select"
                  value={finishPisoId}
                  onChange={(e) => setFinishPisoId(Number(e.target.value))}
                >
                  <option value={0}>Opcional</option>
                  {finishesPiso.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="acm-form-row">
                <label className="acm-label">Acabado cocina</label>
                <select
                  className="acm-select"
                  value={finishCocinaId}
                  onChange={(e) => setFinishCocinaId(Number(e.target.value))}
                >
                  <option value={0}>Opcional</option>
                  {finishesCocina.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="acm-form-row">
                <label className="acm-label">Acabado baño</label>
                <select
                  className="acm-select"
                  value={finishBanoId}
                  onChange={(e) => setFinishBanoId(Number(e.target.value))}
                >
                  <option value={0}>Opcional</option>
                  {finishesBano.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="acm-btn-primary" style={{ marginTop: '1rem' }}>
            {loading ? 'Calculando…' : 'Calcular'}
          </button>
        </form>
      </div>

      {error && (
        <div className="acm-card acm-error-card">
          <ApiErrorMessage error={error} />
          {error.message.toLowerCase().includes('comparables') && (
            <p className="acm-muted" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
              No hay propiedades en el sector para el rango de área indicado (±15%). Sugerencia: agregue más propiedades comparables en &quot;Propiedades&quot; o amplíe el área de búsqueda.
            </p>
          )}
        </div>
      )}

      {result && (
        <>
          <div className="acm-card">
            <h2 className="acm-section-title">Estadísticas de los comparables</h2>
            <p className="acm-muted" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
              Cálculos a partir de las {result.cantidadComparables} propiedades comparables listadas.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 720 }}>
              <div>
                <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--acm-text)' }}>Datos generales (valor/m²)</h3>
                <table className="acm-table" style={{ marginBottom: 0 }}>
                  <tbody>
                    <tr>
                      <td style={{ background: 'var(--acm-bg)' }}>Promedio general</td>
                      <td>{result.promedioValorM2.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td style={{ background: 'var(--acm-bg)' }}>Mediana</td>
                      <td>{result.medianaValorM2.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td style={{ background: 'var(--acm-bg)' }}>Desviación estándar</td>
                      <td>{result.desviacionEstandarValorM2.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td style={{ background: 'var(--acm-bg)' }}>Tasa de desviación</td>
                      <td>{(result.tasaDesviacion * 100).toLocaleString('es', { maximumFractionDigits: 2 })}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--acm-text)' }}>Precios comparables</h3>
                <table className="acm-table" style={{ marginBottom: 0 }}>
                  <tbody>
                    <tr>
                      <td style={{ background: 'var(--acm-bg)' }}>Promedio ponderado (precio)</td>
                      <td>{result.promedioPrecioComparables.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td style={{ background: 'var(--acm-bg)' }}>Mediana precio</td>
                      <td>{result.medianaPrecioComparables.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--acm-text)' }}>Datos acabados (índice)</h3>
              <table className="acm-table" style={{ maxWidth: 420 }}>
                <tbody>
                  <tr>
                    <td style={{ background: 'var(--acm-bg)' }}>Pro. general data acabados</td>
                    <td>{result.promedioAcabadoComparables.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td style={{ background: 'var(--acm-bg)' }}>Desv. estándar data acabados</td>
                    <td>{result.desviacionEstandarAcabados.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td style={{ background: 'var(--acm-bg)' }}>Tasa de desv. data acabados</td>
                    <td>{(result.tasaDesviacionAcabados * 100).toLocaleString('es', { maximumFractionDigits: 2 })}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="acm-card acm-result-card">
            <h2 className="acm-section-title">Inmueble en estudio</h2>
            <table className="acm-table" style={{ maxWidth: 480, marginBottom: '1rem' }}>
              <tbody>
                <tr>
                  <td style={{ background: 'var(--acm-bg)' }}>Área de construcción (m²)</td>
                  <td>{areaM2 || String(result.valorBase / result.promedioValorM2)}</td>
                </tr>
                <tr>
                  <td style={{ background: 'var(--acm-bg)' }}>Valor de mercado</td>
                  <td>{result.valorBase.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                {result.acabadosSujeto && (
                  <>
                    <tr>
                      <td style={{ background: 'var(--acm-bg)' }}>Acabados pisos</td>
                      <td>{result.acabadosSujeto.piso.nombre} (ponderación {result.acabadosSujeto.piso.ponderacion})</td>
                    </tr>
                    <tr>
                      <td style={{ background: 'var(--acm-bg)' }}>Acabados baños</td>
                      <td>{result.acabadosSujeto.bano.nombre} (ponderación {result.acabadosSujeto.bano.ponderacion})</td>
                    </tr>
                    <tr>
                      <td style={{ background: 'var(--acm-bg)' }}>Acabados cocina</td>
                      <td>{result.acabadosSujeto.cocina.nombre} (ponderación {result.acabadosSujeto.cocina.ponderacion})</td>
                    </tr>
                    {result.promedioAcabadoSujeto != null && (
                      <tr>
                        <td style={{ background: 'var(--acm-bg)' }}>Promedio acabados</td>
                        <td>{result.promedioAcabadoSujeto.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    )}
                  </>
                )}
                <tr>
                  <td style={{ background: 'var(--acm-bg)' }}>Valor de mercado con acabados</td>
                  <td><strong>{result.valorConAcabados.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                </tr>
              </tbody>
            </table>
            <p className="acm-muted" style={{ marginBottom: 0 }}>
              Comparables usados: {result.cantidadComparables}
            </p>
          </div>

          {result.comparables.length > 0 && (
            <>
              <div className="acm-card">
                <h2 className="acm-section-title">Inmuebles similares</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table className="acm-table">
                    <thead>
                      <tr>
                        <th>Precio</th>
                        <th>m²</th>
                        <th>Hab</th>
                        <th>Baños</th>
                        <th>Parq.</th>
                        <th>Año</th>
                        <th>Estado</th>
                        <th>Valor/m²</th>
                        <th>Acabados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.comparables.map((c) => (
                        <tr key={c.id}>
                          <td>{c.precio.toLocaleString('es')}</td>
                          <td>{c.areaConstruccionM2}</td>
                          <td>{c.habitaciones}</td>
                          <td>{c.banos}</td>
                          <td>{c.parqueos}</td>
                          <td>{c.anioConstruccion ?? '-'}</td>
                          <td>
                            {c.estado ? (
                              <span className={`acm-badge acm-badge-${c.estado}`}>
                                {c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>{c.valorM2.toFixed(2)}</td>
                          <td>
                            {c.acabadoPiso.nombre} / {c.acabadoCocina.nombre} / {c.acabadoBano.nombre}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="acm-card" style={{ marginTop: '1.25rem' }}>
                <h2 className="acm-section-title">Mapa de inmuebles similares</h2>
                <PropiedadesMap
                  propiedades={result.comparables}
                  height="360px"
                  caption="Ubicación aproximada de los comparables por sector (Caracas)."
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
