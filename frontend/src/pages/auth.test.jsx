import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../test/utils';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import * as authApi from '../api/auth';

vi.mock('../api/auth');

const AUTH = { token: 't', tokenType: 'Bearer', username: 'alice', role: 'USER' };

beforeEach(() => vi.clearAllMocks());

function renderAuthRoutes(route) {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<div>home page</div>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>,
    { route }
  );
}

describe('LoginPage', () => {
  it('logs in and navigates home', async () => {
    authApi.login.mockResolvedValue(AUTH);
    renderAuthRoutes('/login');
    await userEvent.type(screen.getByLabelText(/username/i), 'alice');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret1');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() =>
      expect(authApi.login).toHaveBeenCalledWith({ username: 'alice', password: 'secret1' })
    );
    expect(await screen.findByText('home page')).toBeInTheDocument();
  });

  it('shows an error on failed login', async () => {
    authApi.login.mockRejectedValue({ response: { data: { message: 'Bad credentials' } } });
    renderAuthRoutes('/login');
    await userEvent.type(screen.getByLabelText(/username/i), 'alice');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/bad credentials/i)).toBeInTheDocument();
  });

  it('links to the register page', () => {
    renderAuthRoutes('/login');
    expect(screen.getByRole('link', { name: /create an account/i })).toHaveAttribute(
      'href',
      '/register'
    );
  });
});

describe('RegisterPage', () => {
  it('registers and navigates home', async () => {
    authApi.register.mockResolvedValue(AUTH);
    renderAuthRoutes('/register');
    await userEvent.type(screen.getByLabelText(/username/i), 'alice');
    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret1');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() =>
      expect(authApi.register).toHaveBeenCalledWith({
        username: 'alice',
        email: 'alice@example.com',
        password: 'secret1',
      })
    );
    expect(await screen.findByText('home page')).toBeInTheDocument();
  });

  it('shows an error when registration fails', async () => {
    authApi.register.mockRejectedValue({
      response: { data: { message: 'username already taken' } },
    });
    renderAuthRoutes('/register');
    await userEvent.type(screen.getByLabelText(/username/i), 'alice');
    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret1');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(await screen.findByText(/username already taken/i)).toBeInTheDocument();
  });
});
