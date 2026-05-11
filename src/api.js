const _rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Strip trailing /api if present — all paths already include /api/ prefix
const BASE = _rawBase.replace(/\/api\/?$/, '');

let _onUnauthorized = null;
export function setUnauthorizedHandler(fn) { _onUnauthorized = fn; }

export async function apiFetch(path, { body, ...options } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const requestOptions = {
    ...options,
    headers,
    // Send the httpOnly auth cookie automatically on every request
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
    signal: controller.signal
  };

  try {
    const res = await fetch(`${BASE}${path}`, requestOptions);
    clearTimeout(timeoutId);

    if (res.status === 401) {
      if (_onUnauthorized) _onUnauthorized();
      throw new Error('Session expired. Please sign in again.');
    }

    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || 'Request failed');
      } else {
        throw new Error(`Request failed with status ${res.status}`);
      }
    }

    const data = await res.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

const api = {
  async get(path) {
    return apiFetch(path, { method: 'GET' });
  },

  async post(path, body) {
    return apiFetch(path, { method: 'POST', body });
  },

  async put(path, body) {
    return apiFetch(path, { method: 'PUT', body });
  },

  async patch(path, body) {
    return apiFetch(path, { method: 'PATCH', body });
  },

  async delete(path) {
    return apiFetch(path, { method: 'DELETE' });
  }
};

export default api;
