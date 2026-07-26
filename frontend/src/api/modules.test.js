import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./client', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

import { api } from './client';
import { login, register } from './auth';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from './products';
import { placeOrder, getMyOrders, getOrder, updateOrderStatus } from './orders';

beforeEach(() => vi.clearAllMocks());

describe('auth api', () => {
  it('login posts credentials and unwraps data', async () => {
    api.post.mockResolvedValue({ data: { token: 't', username: 'u', role: 'USER' } });
    const result = await login({ username: 'u', password: 'p' });
    expect(api.post).toHaveBeenCalledWith('/auth/login', { username: 'u', password: 'p' });
    expect(result.token).toBe('t');
  });

  it('register posts the payload', async () => {
    api.post.mockResolvedValue({ data: { token: 't' } });
    await register({ username: 'u', email: 'e@x.com', password: 'p' });
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      username: 'u',
      email: 'e@x.com',
      password: 'p',
    });
  });
});

describe('products api', () => {
  it('getProducts passes page/size params', async () => {
    api.get.mockResolvedValue({ data: { content: [], totalPages: 0 } });
    await getProducts({ page: 2, size: 12 });
    expect(api.get).toHaveBeenCalledWith('/products', { params: { page: 2, size: 12 } });
  });

  it('getProduct fetches by id', async () => {
    api.get.mockResolvedValue({ data: { id: 7 } });
    const p = await getProduct(7);
    expect(api.get).toHaveBeenCalledWith('/products/7');
    expect(p.id).toBe(7);
  });

  it('createProduct posts the product', async () => {
    api.post.mockResolvedValue({ data: { id: 1 } });
    await createProduct({ name: 'A', price: 9.99, stockQuantity: 5 });
    expect(api.post).toHaveBeenCalledWith('/products', {
      name: 'A',
      price: 9.99,
      stockQuantity: 5,
    });
  });

  it('updateProduct puts by id', async () => {
    api.put.mockResolvedValue({ data: { id: 1 } });
    await updateProduct(1, { name: 'B', price: 1, stockQuantity: 2 });
    expect(api.put).toHaveBeenCalledWith('/products/1', {
      name: 'B',
      price: 1,
      stockQuantity: 2,
    });
  });

  it('deleteProduct deletes by id', async () => {
    api.delete.mockResolvedValue({});
    await deleteProduct(3);
    expect(api.delete).toHaveBeenCalledWith('/products/3');
  });
});

describe('orders api', () => {
  it('placeOrder posts items', async () => {
    api.post.mockResolvedValue({ data: { id: 1 } });
    await placeOrder([{ productId: 1, quantity: 2 }]);
    expect(api.post).toHaveBeenCalledWith('/orders', {
      items: [{ productId: 1, quantity: 2 }],
    });
  });

  it('getMyOrders fetches the list', async () => {
    api.get.mockResolvedValue({ data: [] });
    await getMyOrders();
    expect(api.get).toHaveBeenCalledWith('/orders');
  });

  it('getOrder fetches by id', async () => {
    api.get.mockResolvedValue({ data: { id: 4 } });
    await getOrder(4);
    expect(api.get).toHaveBeenCalledWith('/orders/4');
  });

  it('updateOrderStatus patches the status', async () => {
    api.patch.mockResolvedValue({ data: { id: 4, status: 'SHIPPED' } });
    await updateOrderStatus(4, 'SHIPPED');
    expect(api.patch).toHaveBeenCalledWith('/orders/4/status', { status: 'SHIPPED' });
  });
});
