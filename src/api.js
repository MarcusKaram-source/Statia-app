// API Base URL - automatically detects environment
const BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000');

let _onUnauthorized = null;
export function setUnauthorizedHandler(fn) { _onUnauthorized = fn; }

export async function apiFetch(path, { body, ...options } = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    if (_onUnauthorized) _onUnauthorized();
    throw new Error('Session expired. Please sign in again.');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Create an API client with common methods
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