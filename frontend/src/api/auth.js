import { api } from './client';

/** POST /auth/login → AuthResponse {token, tokenType, username, role} */
export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  return data;
}

/** POST /auth/register → AuthResponse {token, tokenType, username, role} */
export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}
