import axios from 'axios';

/** sessionStorage key for the authenticated session (token + user info). */
export const AUTH_KEY = 'ecommerce.auth';

export function storeAuth(auth) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function getStoredAuth() {
  const raw = sessionStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  sessionStorage.removeItem(AUTH_KEY);
}

/** Single Axios instance; the Vite dev proxy forwards /api to the backend. */
export const api = axios.create({ baseURL: '/api/v1' });

// Attach the JWT (if any) to every request.
api.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// On 401 the token is missing/expired: clear the session and tell the app.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearStoredAuth();
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);
