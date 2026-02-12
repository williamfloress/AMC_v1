const BASE =
  typeof import.meta.env.VITE_API_BASE_URL === 'string'
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
    : '';

export type ApiError = { status: number; message: string };

async function request<T>(
  path: string,
  options?: RequestInit & { parseJson?: boolean },
): Promise<{ data?: T; error?: ApiError }> {
  const { parseJson = true, ...init } = options ?? {};
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...init.headers },
      ...init,
    });
    const text = await res.text();
    if (!res.ok) {
      let message = res.statusText;
      try {
        const j = JSON.parse(text);
        if (j.message) message = Array.isArray(j.message) ? j.message.join(', ') : j.message;
      } catch {
        if (text) message = text;
      }
      return { error: { status: res.status, message } };
    }
    const data = parseJson && text ? (JSON.parse(text) as T) : (text as T);
    return { data };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error de red';
    return { error: { status: 0, message } };
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};
