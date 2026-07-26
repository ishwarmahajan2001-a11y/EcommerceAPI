import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../test/utils';
import { storeAuth } from '../api/client';
import CartPage from './CartPage';
import OrdersPage from './OrdersPage';
import OrderDetailPage from './OrderDetailPage';
import ProductCard from '../components/ProductCard';
import * as ordersApi from '../api/orders';

vi.mock('../api/orders');

const USER = { token: 't', tokenType: 'Bearer', username: 'alice', role: 'USER' };
const LAPTOP = { id: 1, name: 'Laptop', description: '', price: 999, stockQuantity: 3 };
const ORDER = {
  id: 11,
  username: 'alice',
  items: [{ productId: 1, productName: 'Laptop', quantity: 2, unitPrice: 999, lineTotal: 1998 }],
  totalAmount: 1998,
  status: 'PENDING',
  createdAt: '2026-07-25T10:00:00Z',
};

beforeEach(() => vi.clearAllMocks());

describe('CartPage', () => {
  it('shows an empty-cart message', () => {
    renderWithProviders(<CartPage />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('lists added items with total and places an order', async () => {
    storeAuth(USER);
    ordersApi.placeOrder.mockResolvedValue(ORDER);
    renderWithProviders(
      <Routes>
        <Route
          path="/cart"
          element={
            <>
              <ProductCard product={LAPTOP} />
              <CartPage />
            </>
          }
        />
        <Route path="/orders/:id" element={<div>order detail page</div>} />
      </Routes>,
      { route: '/cart' }
    );
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    const cart = screen.getByTestId('cart-page');
    expect(within(cart).getByText('Laptop')).toBeInTheDocument();
    expect(within(cart).getByText(/total: \$999\.00/i)).toBeInTheDocument();

    await userEvent.click(within(cart).getByRole('button', { name: /place order/i }));
    await waitFor(() =>
      expect(ordersApi.placeOrder).toHaveBeenCalledWith([{ productId: 1, quantity: 1 }])
    );
    expect(await screen.findByText('order detail page')).toBeInTheDocument();
  });

  it('sends anonymous users to login on checkout', async () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/cart"
          element={
            <>
              <ProductCard product={LAPTOP} />
              <CartPage />
            </>
          }
        />
        <Route path="/login" element={<div>login page</div>} />
      </Routes>,
      { route: '/cart' }
    );
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    await userEvent.click(screen.getByRole('button', { name: /place order/i }));
    expect(await screen.findByText('login page')).toBeInTheDocument();
    expect(ordersApi.placeOrder).not.toHaveBeenCalled();
  });
});

describe('OrdersPage', () => {
  it('lists my orders with status badges', async () => {
    ordersApi.getMyOrders.mockResolvedValue([ORDER]);
    renderWithProviders(<OrdersPage />);
    expect(await screen.findByText('#11')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText(/\$1998\.00/)).toBeInTheDocument();
  });

  it('shows an empty state when there are no orders', async () => {
    ordersApi.getMyOrders.mockResolvedValue([]);
    renderWithProviders(<OrdersPage />);
    expect(await screen.findByText(/no orders yet/i)).toBeInTheDocument();
  });
});

describe('OrderDetailPage', () => {
  it('shows order lines and total', async () => {
    ordersApi.getOrder.mockResolvedValue(ORDER);
    renderWithProviders(
      <Routes>
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Routes>,
      { route: '/orders/11' }
    );
    expect(await screen.findByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(ordersApi.getOrder).toHaveBeenCalledWith('11');
  });
});
