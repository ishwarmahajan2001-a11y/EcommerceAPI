import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { storeAuth, getStoredAuth, AUTH_KEY } from '../api/client';
import * as authApi from '../api/auth';

vi.mock('../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

const AUTH = { token: 'jwt-1', tokenType: 'Bearer', username: 'alice', role: 'USER' };
const ADMIN = { ...AUTH, username: 'admin', role: 'ADMIN' };

const wrapper = ({ children }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

beforeEach(() => vi.clearAllMocks());

describe('AuthContext', () => {
  it('starts logged out when sessionStorage is empty', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it('restores the session from sessionStorage', () => {
    storeAuth(ADMIN);
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user.username).toBe('admin');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
  });

  it('login stores the auth response and updates state', async () => {
    authApi.login.mockResolvedValue(AUTH);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(() => result.current.login({ username: 'alice', password: 'pw' }));
    expect(result.current.user.username).toBe('alice');
    expect(getStoredAuth()).toEqual(AUTH);
  });

  it('register stores the auth response and updates state', async () => {
    authApi.register.mockResolvedValue(AUTH);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(() =>
      result.current.register({ username: 'alice', email: 'a@x.com', password: 'pw' })
    );
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout clears state and sessionStorage', async () => {
    storeAuth(AUTH);
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.logout());
    expect(result.current.user).toBeNull();
    expect(sessionStorage.getItem(AUTH_KEY)).toBeNull();
  });

  it('logs out when the api emits auth:logout (expired token)', async () => {
    storeAuth(AUTH);
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
    act(() => {
      window.dispatchEvent(new Event('auth:logout'));
    });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(false));
  });

  it('login propagates API errors and stays logged out', async () => {
    authApi.login.mockRejectedValue(new Error('bad credentials'));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await expect(
      act(() => result.current.login({ username: 'x', password: 'y' }))
    ).rejects.toThrow('bad credentials');
    expect(result.current.isAuthenticated).toBe(false);
  });
});
