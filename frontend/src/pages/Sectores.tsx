import { useState, useEffect } from 'react';
import * as catalogApi from '../api/catalog';
import type { Sector } from '../api/catalog';
import { Loading, ApiErrorMessage } from '../components/ApiStatus';
import type { ApiError } from '../api/client';

export default function Sectores() {
  const [list, setList] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadList = () => {
    setLoading(true);
    catalogApi.fetchSectors().then((res) => {
      if (res.error) setError(res.error);
      else if (res.data) setList(res.data);
      setLoading(false);
    });
  };

  useEffect(() => loadList(), []);

  const openCreate = () => {
    setEditingId(null);
    setNombre('');
    setSubmitError(null);
    setModalOpen(true);
  };

  const openEdit = (s: Sector) => {
    setEditingId(s.id);
    setNombre(s.nombre);
    setSubmitError(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const trimmed = nombre.trim();
    if (!trimmed) {
      setSubmitError('El nombre del sector es obligatorio.');
      return;
    }
    if (editingId !== null) {
      catalogApi.updateSector(editingId, { nombre: trimmed }).then((res) => {
        if (res.error) setSubmitError(res.error.message);
        else {
          setModalOpen(false);
          loadList();
        }
      });
    } else {
      catalogApi.createSector({ nombre: trimmed }).then((res) => {
        if (res.error) setSubmitError(res.error.message);
        else {
          setModalOpen(false);
          loadList();
        }
      });
    }
  };

  const handleDelete = (id: number, nombreSector: string) => {
    if (!window.confirm(`¿Eliminar el sector "${nombreSector}"? No se puede si tiene propiedades asociadas.`)) return;
    catalogApi.deleteSector(id).then((res) => {
      if (!res.error) loadList();
      else if (res.error) alert(res.error.message);
    });
  };

  if (loading && list.length === 0) return <Loading />;
  if (error) return <ApiErrorMessage error={error} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h1 className="acm-page-title" style={{ marginBottom: '0.25rem' }}>Sectores</h1>
          <p className="acm-muted" style={{ marginBottom: 0, fontSize: '0.9375rem' }}>
            Crea y edita las zonas o barrios para organizar tus propiedades.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="acm-btn-primary">
          + Agregar sector
        </button>
      </div>
      <div className="acm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="acm-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.nombre}</td>
                <td>
                  <button type="button" className="acm-btn-secondary" style={{ marginRight: 8 }} onClick={() => openEdit(s)}>
                    Editar
                  </button>
                  <button type="button" className="acm-btn-secondary" onClick={() => handleDelete(s.id, s.nombre)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && !loading && (
        <p className="acm-muted">No hay sectores. Agregue sectores para usarlos al crear propiedades.</p>
      )}

      {modalOpen && (
        <div className="acm-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="acm-card" style={{ maxWidth: 400, width: '95%' }}>
            <h2 className="acm-card-title" style={{ fontSize: '1.125rem' }}>
              {editingId ? 'Editar sector' : 'Agregar sector'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="acm-form-row">
                <label className="acm-label">Nombre</label>
                <input
                  type="text"
                  className="acm-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Los Naranjos"
                  required
                />
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
