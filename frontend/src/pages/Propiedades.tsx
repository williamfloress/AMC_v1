import { useState, useEffect } from 'react';
import { useSectors, useFinishes } from '../hooks/useCatalog';
import * as propertiesApi from '../api/properties';
import type { Propiedad, CreatePropertyBody } from '../api/properties';
import { Loading, ApiErrorMessage } from '../components/ApiStatus';
import type { ApiError } from '../api/client';

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};
const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem',
  borderBottom: '2px solid #e5e5e5',
};
const tdStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderBottom: '1px solid #e5e5e5',
};
const formRow = { marginBottom: '0.75rem' };
const inputStyle = { padding: '0.5rem', width: '100%', maxWidth: 200 };

export default function Propiedades() {
  const { sectors, loading: loadingSectors, error: errorSectors } = useSectors();
  const { finishes: finishesPiso } = useFinishes('piso');
  const { finishes: finishesCocina } = useFinishes('cocina');
  const { finishes: finishesBano } = useFinishes('bano');

  const [list, setList] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreatePropertyBody>({
    sectorId: 0,
    precio: 0,
    areaConstruccionM2: 0,
    habitaciones: 0,
    banos: 0,
    parqueos: 0,
    acabadoPisoId: 0,
    acabadoCocinaId: 0,
    acabadoBanoId: 0,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): string | null => {
    if (form.precio <= 0) return 'El precio debe ser mayor a 0.';
    if (form.areaConstruccionM2 <= 0) return 'El área debe ser mayor a 0.';
    return null;
  };

  const loadList = () => {
    setLoading(true);
    propertiesApi.fetchProperties().then((res) => {
      if (res.error) setError(res.error);
      else if (res.data) setList(res.data);
      setLoading(false);
    });
  };

  useEffect(() => loadList(), []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      sectorId: sectors[0]?.id ?? 0,
      precio: 0,
      areaConstruccionM2: 0,
      habitaciones: 0,
      banos: 0,
      parqueos: 0,
      acabadoPisoId: finishesPiso[0]?.id ?? 0,
      acabadoCocinaId: finishesCocina[0]?.id ?? 0,
      acabadoBanoId: finishesBano[0]?.id ?? 0,
    });
    setSubmitError(null);
    setModalOpen(true);
  };

  const openEdit = (p: Propiedad) => {
    setEditingId(p.id);
    setForm({
      sectorId: p.sectorId,
      precio: p.precio,
      areaConstruccionM2: p.areaConstruccionM2,
      habitaciones: p.habitaciones,
      banos: p.banos,
      parqueos: p.parqueos,
      acabadoPisoId: p.acabadoPiso.id,
      acabadoCocinaId: p.acabadoCocina.id,
      acabadoBanoId: p.acabadoBano.id,
    });
    setSubmitError(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const err = validateForm();
    if (err) {
      setSubmitError(err);
      return;
    }
    if (editingId !== null) {
      propertiesApi.updateProperty(editingId, form).then((res) => {
        if (res.error) setSubmitError(res.error.message);
        else {
          setModalOpen(false);
          loadList();
        }
      });
    } else {
      propertiesApi.createProperty(form).then((res) => {
        if (res.error) setSubmitError(res.error.message);
        else {
          setModalOpen(false);
          loadList();
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar esta propiedad?')) return;
    propertiesApi.deleteProperty(id).then((res) => {
      if (!res.error) loadList();
    });
  };

  if (loadingSectors || (loading && list.length === 0)) return <Loading />;
  if (errorSectors) return <ApiErrorMessage error={errorSectors} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Propiedades</h1>
        <button
          type="button"
          onClick={openCreate}
          style={{ padding: '0.5rem 1rem', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          + Agregar propiedad
        </button>
      </div>
      {error && <ApiErrorMessage error={error} />}
      {loading ? (
        <Loading />
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Sector</th>
              <th style={thStyle}>m²</th>
              <th style={thStyle}>Hab</th>
              <th style={thStyle}>Baños</th>
              <th style={thStyle}>Parq.</th>
              <th style={thStyle}>Acabados</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>Valor/m²</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td style={tdStyle}>{p.sector.nombre}</td>
                <td style={tdStyle}>{p.areaConstruccionM2}</td>
                <td style={tdStyle}>{p.habitaciones}</td>
                <td style={tdStyle}>{p.banos}</td>
                <td style={tdStyle}>{p.parqueos}</td>
                <td style={tdStyle}>
                  {p.acabadoPiso.nombre} / {p.acabadoCocina.nombre} / {p.acabadoBano.nombre}
                </td>
                <td style={tdStyle}>{p.precio.toLocaleString()}</td>
                <td style={tdStyle}>
                  {p.areaConstruccionM2 > 0
                    ? (p.precio / p.areaConstruccionM2).toFixed(2)
                    : '-'}
                </td>
                <td style={tdStyle}>
                  <button type="button" onClick={() => openEdit(p)} style={{ marginRight: 8 }}>Editar</button>
                  <button type="button" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {list.length === 0 && !loading && <p style={{ color: '#64748b' }}>No hay propiedades. Agregue al menos una.</p>}

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 8, maxWidth: 400, width: '90%' }}>
            <h2 style={{ marginTop: 0 }}>{editingId ? 'Editar propiedad' : 'Agregar propiedad'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={formRow}>
                <label>Sector</label>
                <select
                  style={inputStyle}
                  value={form.sectorId}
                  onChange={(e) => setForm({ ...form, sectorId: Number(e.target.value) })}
                  required
                >
                  {sectors.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>
              <div style={formRow}>
                <label>Precio</label>
                <input
                  type="number"
                  min={0.01}
                  step={0.01}
                  style={inputStyle}
                  value={form.precio || ''}
                  onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                  required
                />
              </div>
              <div style={formRow}>
                <label>Área (m²)</label>
                <input
                  type="number"
                  min={0.01}
                  step={0.01}
                  style={inputStyle}
                  value={form.areaConstruccionM2 || ''}
                  onChange={(e) => setForm({ ...form, areaConstruccionM2: Number(e.target.value) })}
                  required
                />
              </div>
              <div style={formRow}>
                <label>Habitaciones</label>
                <input
                  type="number"
                  min={0}
                  style={inputStyle}
                  value={form.habitaciones}
                  onChange={(e) => setForm({ ...form, habitaciones: Number(e.target.value) })}
                  required
                />
              </div>
              <div style={formRow}>
                <label>Baños</label>
                <input
                  type="number"
                  min={0}
                  style={inputStyle}
                  value={form.banos}
                  onChange={(e) => setForm({ ...form, banos: Number(e.target.value) })}
                  required
                />
              </div>
              <div style={formRow}>
                <label>Parqueos</label>
                <input
                  type="number"
                  min={0}
                  style={inputStyle}
                  value={form.parqueos}
                  onChange={(e) => setForm({ ...form, parqueos: Number(e.target.value) })}
                  required
                />
              </div>
              <div style={formRow}>
                <label>Acabado piso</label>
                <select
                  style={inputStyle}
                  value={form.acabadoPisoId}
                  onChange={(e) => setForm({ ...form, acabadoPisoId: Number(e.target.value) })}
                  required
                >
                  {finishesPiso.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
              <div style={formRow}>
                <label>Acabado cocina</label>
                <select
                  style={inputStyle}
                  value={form.acabadoCocinaId}
                  onChange={(e) => setForm({ ...form, acabadoCocinaId: Number(e.target.value) })}
                  required
                >
                  {finishesCocina.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
              <div style={formRow}>
                <label>Acabado baño</label>
                <select
                  style={inputStyle}
                  value={form.acabadoBanoId}
                  onChange={(e) => setForm({ ...form, acabadoBanoId: Number(e.target.value) })}
                  required
                >
                  {finishesBano.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
              {submitError && <p style={{ color: '#b91c1c' }}>{submitError}</p>}
              <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                  {editingId ? 'Guardar' : 'Crear'}
                </button>
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
