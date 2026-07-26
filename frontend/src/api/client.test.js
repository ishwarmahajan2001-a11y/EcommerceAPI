import { describe, it, expect, beforeEach } from 'vitest';
import { api, storeAuth, getStoredAuth, clearStoredAuth, AUTH_KEY } from './client';

const AUTH = { token: 'jwt-abc', tokenType: 'Bearer', username: 'alice', role: 'USER' };

describe('auth storage helpers', () => {
  it('stores and reads auth from sessionStorage', () => {
    storeAuth(AUTH);
    expect(getStoredAuth()).toEqual(AUTH);
    expect(JSON.parse(sessionStorage.getItem(AUTH_KEY))).toEqual(AUTH);
  });

  it('returns null when nothing is stored', () => {
    expect(getStoredAuth()).toBeNull();
  });

  it('returns null when stored value is corrupt', () => {
    sessionStorage.setItem(AUTH_KEY, '{not-json');
    expect(getStoredAuth()).toBeNull();
  });

  it('clears stored auth', () => {
    storeAuth(AUTH);
    clearStoredAuth();
    expect(getStoredAuth()).toBeNull();
  });
});

describe('request interceptor', () => {
  const runRequestInterceptor = (config) =>
    api.interceptors.request.handlers[0].fulfilled(config);

  it('attaches Authorization header when a token is stored', () => {
    storeAuth(AUTH);
    const config = runRequestInterceptor({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer jwt-abc');
  });

  it('leaves Authorization unset when no token is stored', () => {
    const config = runRequestInterceptor({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });
});

describe('response interceptor (401 handling)', () => {
  const runResponseError = (error) =>
    api.interceptors.response.handlers[0].rejected(error).catch((e) => e);

  beforeEach(() => storeAuth(AUTH));

  it('clears stored auth and emits auth:logout on 401', async () => {
    let emitted = false;
    window.addEventListener('auth:logout', () => (emitted = true), { once: true });
    await runResponseError({ response: { status: 401 } });
    expect(getStoredAuth()).toBeNull();
    expect(emitted).toBe(true);
  });

  it('keeps auth for non-401 errors', async () => {
    await runResponseError({ response: { status: 500 } });
    expect(getStoredAuth()).toEqual(AUTH);
  });

  it('keeps auth for network errors without a response', async () => {
    await runResponseError(new Error('network down'));
    expect(getStoredAuth()).toEqual(AUTH);
  });
});
