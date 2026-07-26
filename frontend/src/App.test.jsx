import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function renderApp(route = '/') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('App', () => {
  it('renders the navbar brand', () => {
    renderApp();
    expect(screen.getByRole('link', { name: /shop\s?stack/i })).toBeInTheDocument();
  });

  it('renders the login page on /login', () => {
    renderApp('/login');
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });
});
