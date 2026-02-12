import { useState } from 'react';
import { useSectors, useFinishes } from '../hooks/useCatalog';
import { runAmc } from '../api/amc';
import type { AmcResult } from '../api/amc';
import { Loading, ApiErrorMessage } from '../components/ApiStatus';
import type { ApiError } from '../api/client';

const cardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '1.25rem',
  borderRadius: 8,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  marginBottom: '1rem',
};
const formRow = { marginBottom: '0.75rem' };
const inputStyle = { padding: '0.5rem', width: '100%', maxWidth: 280 };

export default function InmuebleEnEstudio() {
  const { sectors, loading: loadingSectors, error: errorSectors } = useSectors();
  const { finishes: finishesPiso } = useFinishes('piso');
  const { finishes: finishesCocina } = useFinishes('cocina');
  const { finishes: finishesBano } = useFinishes('bano');

  const [sectorId, setSectorId] = useState(0);
  const [areaM2, setAreaM2] = useState<string>('');
  const [finishPisoId, setFinishPisoId] = useState(0);
  const [finishCocinaId, setFinishCocinaId] = useState(0);
  const [finishBanoId, setFinishBanoId] = useState(0);

  const [result, setResult] = useState<AmcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ area?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    const area = Number(areaM2);
    if (!areaM2.trim()) {
      setFieldErrors({ area: 'Indique el área construida.' });
      return;
    }
    if (Number.isNaN(area) || area <= 0) {
      setFieldErrors({ area: 'El área debe ser un número mayor a 0.' });
      return;
    }
    if (!sectorId || !finishPisoId || !finishCocinaId || !finishBanoId) return;
    setResult(null);
    setLoading(true);
    runAmc({
      sectorId,
      areaM2: area,
      finishPisoId,
      finishCocinaId,
      finishBanoId,
    }).then((res) => {
      setLoading(false);
      if (res.error) setError(res.error);
      else if (res.data) setResult(res.data);
    });
  };

  if (loadingSectors) return <Loading />;
  if (errorSectors) return <ApiErrorMessage error={errorSectors} />;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Inmueble en estudio</h1>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, fontSize: '1.125rem' }}>Datos del inmueble</h2>
        <form onSubmit={handleSubmit}>
          <div style={formRow}>
            <label>Sector</label>
            <select
              style={inputStyle}
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
          <div style={formRow}>
            <label>Área construida (m²)</label>
            <input
              type="number"
              min={0.01}
              step={0.01}
              style={inputStyle}
              value={areaM2}
              onChange={(e) => { setAreaM2(e.target.value); setFieldErrors((e2) => ({ ...e2, area: undefined })); }}
              placeholder="Ej. 128"
              required
            />
            {fieldErrors.area && <p style={{ color: '#b91c1c', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>{fieldErrors.area}</p>}
          </div>
          <div style={formRow}>
            <label>Acabado piso</label>
            <select
              style={inputStyle}
              value={finishPisoId}
              onChange={(e) => setFinishPisoId(Number(e.target.value))}
              required
            >
              <option value={0}>Seleccione</option>
              {finishesPiso.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          </div>
          <div style={formRow}>
            <label>Acabado cocina</label>
            <select
              style={inputStyle}
              value={finishCocinaId}
              onChange={(e) => setFinishCocinaId(Number(e.target.value))}
              required
            >
              <option value={0}>Seleccione</option>
              {finishesCocina.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          </div>
          <div style={formRow}>
            <label>Acabado baño</label>
            <select
              style={inputStyle}
              value={finishBanoId}
              onChange={(e) => setFinishBanoId(Number(e.target.value))}
              required
            >
              <option value={0}>Seleccione</option>
              {finishesBano.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.6rem 1.25rem',
              background: '#0ea5e9',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'wait' : 'pointer',
              fontSize: '1rem',
            }}
          >
            {loading ? 'Calculando…' : 'Calcular'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ ...cardStyle, border: '1px solid #b91c1c', background: '#fef2f2' }}>
          <ApiErrorMessage error={error} />
          {error.message.toLowerCase().includes('comparables') && (
            <p style={{ marginTop: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>
              No hay propiedades en el sector para el rango de área indicado (±15%). Sugerencia: agregue más propiedades comparables en &quot;Propiedades&quot; o amplíe el área de búsqueda.
            </p>
          )}
        </div>
      )}

      {result && (
        <>
          <div style={{ ...cardStyle, background: '#f0f9ff', border: '1px solid #0ea5e9' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.125rem' }}>Resultado</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0' }}>
              Valor base: {result.valorBase.toLocaleString('es')}
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0' }}>
              Valor con acabados: {result.valorConAcabados.toLocaleString('es')}
            </p>
            <p style={{ color: '#64748b', marginBottom: 0 }}>
              Comparables usados: {result.cantidadComparables}
            </p>
          </div>

          {result.comparables.length > 0 && (
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, fontSize: '1.125rem' }}>Comparables</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Precio</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>m²</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Valor/m²</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Acabados</th>
                  </tr>
                </thead>
                <tbody>
                  {result.comparables.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                      <td style={{ padding: '0.5rem' }}>{c.precio.toLocaleString('es')}</td>
                      <td style={{ padding: '0.5rem' }}>{c.areaConstruccionM2}</td>
                      <td style={{ padding: '0.5rem' }}>{c.valorM2.toFixed(2)}</td>
                      <td style={{ padding: '0.5rem' }}>
                        {c.acabadoPiso.nombre} / {c.acabadoCocina.nombre} / {c.acabadoBano.nombre}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
