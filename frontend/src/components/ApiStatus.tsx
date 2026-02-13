import type { ApiError } from '../api/client';

export function Loading() {
  return <p className="acm-muted">Cargando…</p>;
}

export function ApiErrorMessage({ error }: { error: ApiError }) {
  return (
    <p className="acm-error-msg" style={{ margin: 0 }}>
      Error: {error.status ? `(${error.status}) ` : ''}{error.message}
    </p>
  );
}
