import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import AdminProductsPage from './AdminProductsPage';
import AdminOrdersPage from './AdminOrdersPage';
import * as productsApi from '../../api/products';
import * as ordersApi from '../../api/orders';

vi.mock('../../api/products');
vi.mock('../../api/orders');

const PAGE = {
  content: [{ id: 1, name: 'Laptop', description: 'Fast', price: 999, stockQuantity: 3 }],
  number: 0,
  totalPages: 1,
};
const ORDER = {
  id: 11,
  username: 'alice',
  items: [{ productId: 1, productName: 'Laptop', quantity: 2, unitPrice: 999, lineTotal: 1998 }],
  totalAmount: 1998,
  status: 'PENDING',
  createdAt: '2026-07-25T10:00:00Z',
};

beforeEach(() => vi.clearAllMocks());

describe('AdminProductsPage', () => {
  it('lists products in a table', async () => {
    productsApi.getProducts.mockResolvedValue(PAGE);
    renderWithProviders(<AdminProductsPage />);
    expect(await screen.findByRole('cell', { name: 'Laptop' })).toBeInTheDocument();
  });

  it('creates a product through the form', async () => {
    productsApi.getProducts.mockResolvedValue(PAGE);
    productsApi.createProduct.mockResolvedValue({ id: 2 });
    renderWithProviders(<AdminProductsPage />);
    await screen.findByRole('cell', { name: 'Laptop' });

    await userEvent.click(screen.getByRole('button', { name: /new product/i }));
    const dialog = screen.getByRole('dialog');
    await userEvent.type(within(dialog).getByLabelText(/name/i), 'Keyboard');
    await userEvent.type(within(dialog).getByLabelText(/description/i), 'Mechanical');
    await userEvent.type(within(dialog).getByLabelText(/price/i), '49.99');
    await userEvent.type(within(dialog).getByLabelText(/stock/i), '10');
    await userEvent.click(within(dialog).getByRole('button', { name: /save/i }));

    await waitFor(() =>
      expect(productsApi.createProduct).toHaveBeenCalledWith({
        name: 'Keyboard',
        description: 'Mechanical',
        price: 49.99,
        stockQuantity: 10,
      })
    );
  });

  it('edits an existing product', async () => {
    productsApi.getProducts.mockResolvedValue(PAGE);
    productsApi.updateProduct.mockResolvedValue({ id: 1 });
    renderWithProviders(<AdminProductsPage />);
    await screen.findByRole('cell', { name: 'Laptop' });

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    const dialog = screen.getByRole('dialog');
    const nameInput = within(dialog).getByLabelText(/name/i);
    expect(nameInput).toHaveValue('Laptop');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Laptop Pro');
    await userEvent.click(within(dialog).getByRole('button', { name: /save/i }));

    await waitFor(() =>
      expect(productsApi.updateProduct).toHaveBeenCalledWith(1, {
        name: 'Laptop Pro',
        description: 'Fast',
        price: 999,
        stockQuantity: 3,
      })
    );
  });

  it('deletes a product after confirmation', async () => {
    productsApi.getProducts.mockResolvedValue(PAGE);
    productsApi.deleteProduct.mockResolvedValue();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderWithProviders(<AdminProductsPage />);
    await screen.findByRole('cell', { name: 'Laptop' });

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(productsApi.deleteProduct).toHaveBeenCalledWith(1));
  });
});

describe('AdminOrdersPage', () => {
  it('lists orders and updates status', async () => {
    ordersApi.getMyOrders.mockResolvedValue([ORDER]);
    ordersApi.updateOrderStatus.mockResolvedValue({ ...ORDER, status: 'SHIPPED' });
    renderWithProviders(<AdminOrdersPage />);
    expect(await screen.findByText('#11')).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/status for order 11/i), 'SHIPPED');
    await waitFor(() => expect(ordersApi.updateOrderStatus).toHaveBeenCalledWith(11, 'SHIPPED'));
  });
});
