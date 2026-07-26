import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredAuth, storeAuth, clearStoredAuth } from '../api/client';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

/**
 * Holds the authenticated user {token, username, role}.
 * Session survives a page refresh via sessionStorage; the api client
 * emits `auth:logout` on 401 so expired tokens log the user out.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredAuth());
  const navigate = useNavigate();

  useEffect(() => {
    const onLogout = () => {
      setUser(null);
      navigate('/login');
    };
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [navigate]);

  const login = useCallback(async (credentials) => {
    const auth = await authApi.login(credentials);
    storeAuth(auth);
    setUser(auth);
    return auth;
  }, []);

  const register = useCallback(async (payload) => {
    const auth = await authApi.register(payload);
    storeAuth(auth);
    setUser(auth);
    return auth;
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user != null,
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
