import type { ApiError } from '../api/client';

export function Loading() {
  return <p style={{ color: '#64748b' }}>Cargando…</p>;
}

export function ApiErrorMessage({ error }: { error: ApiError }) {
  return (
    <p style={{ color: '#b91c1c' }}>
      Error: {error.status ? `(${error.status}) ` : ''}{error.message}
    </p>
  );
}
