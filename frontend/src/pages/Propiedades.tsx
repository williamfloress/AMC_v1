import { useState, useEffect } from 'react';
import { useSectors, useFinishes } from '../hooks/useCatalog';
import * as propertiesApi from '../api/properties';
import type { Propiedad, CreatePropertyBody, EstadoPropiedad } from '../api/properties';
import { Loading, ApiErrorMessage } from '../components/ApiStatus';
import MapPicker from '../components/MapPicker';
import PropiedadesMap from '../components/PropiedadesMap';
import type { ApiError } from '../api/client';

const ESTADOS: { value: EstadoPropiedad; label: string }[] = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'reservada', label: 'Reservada' },
  { value: 'alquilada', label: 'Alquilada' },
  { value: 'vendida', label: 'Vendida' },
];

function estadoLabel(estado: EstadoPropiedad): string {
  return ESTADOS.find((e) => e.value === estado)?.label ?? estado;
}

function Propiedades() {
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
    anioConstruccion: undefined,
    estado: 'disponible',
    latitud: undefined,
    longitud: undefined,
    acabadoPisoId: 0,
    acabadoCocinaId: 0,
    acabadoBanoId: 0,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);

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
      anioConstruccion: undefined,
      estado: 'disponible',
      latitud: undefined,
      longitud: undefined,
      acabadoPisoId: finishesPiso[0]?.id ?? 0,
      acabadoCocinaId: finishesCocina[0]?.id ?? 0,
      acabadoBanoId: finishesBano[0]?.id ?? 0,
    });
    setSubmitError(null);
    setShowMapPicker(true);
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
      anioConstruccion: p.anioConstruccion ?? undefined,
      estado: p.estado ?? 'disponible',
      latitud: p.latitud ?? undefined,
      longitud: p.longitud ?? undefined,
      acabadoPisoId: p.acabadoPiso.id,
      acabadoCocinaId: p.acabadoCocina.id,
      acabadoBanoId: p.acabadoBano.id,
    });
    setSubmitError(null);
    setShowMapPicker(true);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h1 className="acm-page-title" style={{ marginBottom: '0.25rem' }}>Mis propiedades</h1>
          <p className="acm-muted" style={{ marginBottom: 0, fontSize: '0.9375rem' }}>
            Gestiona las propiedades comparables para tus reportes ACM.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="acm-btn-primary">
          + Agregar inmueble
        </button>
      </div>
      {error && <ApiErrorMessage error={error} />}
      {!loading && list.length > 0 && (
        <div className="acm-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="acm-card-title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Mapa de propiedades</h2>
          <PropiedadesMap propiedades={list} height="360px" />
        </div>
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="acm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="acm-table">
            <thead>
              <tr>
                <th>Sector</th>
                <th>m²</th>
                <th>Hab</th>
                <th>Baños</th>
                <th>Parq.</th>
                <th>Año</th>
                <th>Estado</th>
                <th>Acabados</th>
                <th>Precio</th>
                <th>Valor/m²</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{p.sector.nombre}</td>
                  <td>{p.areaConstruccionM2}</td>
                  <td>{p.habitaciones}</td>
                  <td>{p.banos}</td>
                  <td>{p.parqueos}</td>
                  <td>{p.anioConstruccion ?? '-'}</td>
                  <td>
                    <span className={`acm-badge acm-badge-${p.estado}`}>
                      {estadoLabel(p.estado)}
                    </span>
                  </td>
                  <td>
                    {p.acabadoPiso.nombre} / {p.acabadoCocina.nombre} / {p.acabadoBano.nombre}
                  </td>
                  <td>{p.precio.toLocaleString()}</td>
                  <td>
                    {p.areaConstruccionM2 > 0
                      ? (p.precio / p.areaConstruccionM2).toFixed(2)
                      : '-'}
                  </td>
                  <td>
                    {p.latitud != null && p.longitud != null && (
                      <a
                        href={`https://www.google.com/maps?q=${p.latitud},${p.longitud}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="acm-btn-secondary"
                        style={{ marginRight: 8, textDecoration: 'none', display: 'inline-block' }}
                      >
                        Ver mapa
                      </a>
                    )}
                    <button type="button" className="acm-btn-secondary" style={{ marginRight: 8 }} onClick={() => openEdit(p)}>
                      Editar
                    </button>
                    <button type="button" className="acm-btn-secondary" onClick={() => handleDelete(p.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {list.length === 0 && !loading && <p className="acm-muted">No hay propiedades. Agregue al menos una.</p>}

      {modalOpen && (
        <div className="acm-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="acm-card" style={{ maxWidth: 640, width: '95%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', isolation: 'isolate' }}>
            <h2 className="acm-card-title" style={{ fontSize: '1.125rem' }}>{editingId ? 'Editar propiedad' : 'Agregar propiedad'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="acm-property-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem 0.875rem' }}>
                <div className="acm-form-row">
                  <label className="acm-label">Sector</label>
                  <select
                    className="acm-select"
                    style={{ maxWidth: 'none' }}
                    value={form.sectorId}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      sectorId: Number(e.target.value),
                      latitud: undefined,
                      longitud: undefined,
                    })
                  }
                    required
                  >
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="acm-form-row">
                  <label className="acm-label">Precio</label>
                  <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    className="acm-input"
                    style={{ maxWidth: 'none' }}
                    value={form.precio || ''}
                    onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="acm-form-row">
                  <label className="acm-label">Área (m²)</label>
                  <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    className="acm-input"
                    style={{ maxWidth: 'none' }}
                    value={form.areaConstruccionM2 || ''}
                    onChange={(e) => setForm({ ...form, areaConstruccionM2: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="acm-form-row">
                  <label className="acm-label">Habitaciones</label>
                  <input
                    type="number"
                    min={0}
                    className="acm-input"
                    style={{ maxWidth: 'none' }}
                    value={form.habitaciones}
                    onChange={(e) => setForm({ ...form, habitaciones: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="acm-form-row">
                  <label className="acm-label">Baños</label>
                  <input
                    type="number"
                    min={0}
                    className="acm-input"
                    style={{ maxWidth: 'none' }}
                    value={form.banos}
                    onChange={(e) => setForm({ ...form, banos: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="acm-form-row">
                  <label className="acm-label">Parqueos</label>
                  <input
                    type="number"
                    min={0}
                    className="acm-input"
                    style={{ maxWidth: 'none' }}
                    value={form.parqueos}
                    onChange={(e) => setForm({ ...form, parqueos: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="acm-form-row">
                  <label className="acm-label">Año (construcción)</label>
                  <input
                    type="number"
                    min={1900}
                    max={2100}
                    placeholder="Opcional"
                    className="acm-input"
                    style={{ maxWidth: 'none' }}
                    value={form.anioConstruccion ?? ''}
                    onChange={(e) => setForm({ ...form, anioConstruccion: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
                <div className="acm-form-row">
                  <label className="acm-label">Estado</label>
                  <select
                    className="acm-select"
                    style={{ maxWidth: 'none' }}
                    value={form.estado ?? 'disponible'}
                    onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoPropiedad })}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
                <div className="acm-form-row">
                  <label className="acm-label">Acabado piso</label>
                  <select
                    className="acm-select"
                    style={{ maxWidth: 'none' }}
                    value={form.acabadoPisoId}
                    onChange={(e) => setForm({ ...form, acabadoPisoId: Number(e.target.value) })}
                    required
                  >
                    {finishesPiso.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="acm-form-row">
                  <label className="acm-label">Acabado cocina</label>
                  <select
                    className="acm-select"
                    style={{ maxWidth: 'none' }}
                    value={form.acabadoCocinaId}
                    onChange={(e) => setForm({ ...form, acabadoCocinaId: Number(e.target.value) })}
                    required
                  >
                    {finishesCocina.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="acm-form-row" style={{ gridColumn: '1 / -1' }}>
                  <label className="acm-label">Acabado baño</label>
                  <select
                    className="acm-select"
                    style={{ maxWidth: 260 }}
                    value={form.acabadoBanoId}
                    onChange={(e) => setForm({ ...form, acabadoBanoId: Number(e.target.value) })}
                    required
                  >
                    {finishesBano.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="acm-form-row acm-property-form-map-cell" style={{ gridColumn: '1 / -1' }}>
                  <label className="acm-label">Ubicación en el mapa (opcional)</label>
                  {showMapPicker ? (
                    <>
                      <div style={{ position: 'relative', overflow: 'hidden', maxHeight: 300, marginBottom: '0.5rem' }}>
                        <MapPicker
                          height="260px"
                          sectorNombre={sectors.find((s) => s.id === form.sectorId)?.nombre}
                          value={
                            form.latitud != null && form.longitud != null
                              ? { lat: form.latitud, lng: form.longitud }
                              : null
                          }
                          onChange={(v) =>
                            setForm({
                              ...form,
                              latitud: v?.lat,
                              longitud: v?.lng,
                            })
                          }
                        />
                      </div>
                      <button
                        type="button"
                        className="acm-btn-secondary"
                        style={{ fontSize: '0.8125rem' }}
                        onClick={() => setShowMapPicker(false)}
                      >
                        Ocultar mapa
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="acm-btn-secondary"
                      onClick={() => setShowMapPicker(true)}
                    >
                      Elegir ubicación en el mapa
                    </button>
                  )}
                </div>
              </div>
              {submitError && <p className="acm-error-msg">{submitError}</p>}
              <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                <button type="submit" className="acm-btn-primary">
                  {editingId ? 'Guardar' : 'Crear'}
                </button>
                <button type="button" className="acm-btn-secondary" onClick={() => setModalOpen(false)}>
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

export default Propiedades;
