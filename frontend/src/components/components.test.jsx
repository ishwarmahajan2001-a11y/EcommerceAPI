import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { storeAuth } from '../api/client';
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';
import ProductCard from './ProductCard';
import Spinner from './Spinner';

const USER = { token: 't', tokenType: 'Bearer', username: 'alice', role: 'USER' };
const ADMIN = { token: 't', tokenType: 'Bearer', username: 'boss', role: 'ADMIN' };

function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>{ui}</CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  it('shows Sign in link when logged out', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
  });

  it('shows username, orders and logout when logged in', () => {
    storeAuth(USER);
    renderWithProviders(<Navbar />);
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /my orders/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('shows admin links only for ADMIN role', () => {
    storeAuth(ADMIN);
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });
});

describe('ProtectedRoute', () => {
  const routes = (
    <Routes>
      <Route path="/login" element={<div>login page</div>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/secret" element={<div>secret page</div>} />
      </Route>
    </Routes>
  );

  it('redirects anonymous users to /login', () => {
    renderWithProviders(routes, { route: '/secret' });
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('renders the child for authenticated users', () => {
    storeAuth(USER);
    renderWithProviders(routes, { route: '/secret' });
    expect(screen.getByText('secret page')).toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  const routes = (
    <Routes>
      <Route path="/" element={<div>home page</div>} />
      <Route path="/login" element={<div>login page</div>} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<div>admin page</div>} />
      </Route>
    </Routes>
  );

  it('sends non-admin users home', () => {
    storeAuth(USER);
    renderWithProviders(routes, { route: '/admin' });
    expect(screen.getByText('home page')).toBeInTheDocument();
  });

  it('renders for admins', () => {
    storeAuth(ADMIN);
    renderWithProviders(routes, { route: '/admin' });
    expect(screen.getByText('admin page')).toBeInTheDocument();
  });
});

describe('StatusBadge', () => {
  it.each(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])(
    'renders the %s status',
    (status) => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(status)).toBeInTheDocument();
    }
  );
});

describe('Pagination', () => {
  it('renders nothing with a single page', () => {
    const { container } = render(
      <Pagination page={0} totalPages={1} onPageChange={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('disables Previous on the first page and calls onPageChange', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={0} totalPages={3} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables Next on the last page', () => {
    render(<Pagination page={2} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});

describe('ProductCard', () => {
  const product = { id: 5, name: 'Mouse', description: 'Clicky', price: 25.5, stockQuantity: 4 };

  it('shows name, price and stock', () => {
    renderWithProviders(<ProductCard product={product} />);
    expect(screen.getByText('Mouse')).toBeInTheDocument();
    expect(screen.getByText(/\$25\.50/)).toBeInTheDocument();
    expect(screen.getByText(/4 in stock/i)).toBeInTheDocument();
  });

  it('marks out-of-stock products and disables add to cart', () => {
    renderWithProviders(<ProductCard product={{ ...product, stockQuantity: 0 }} />);
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });
});

describe('Spinner', () => {
  it('exposes a loading status for screen readers', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
