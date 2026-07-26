import { api } from './client';

/** POST /orders with {items:[{productId, quantity}]} → OrderResponse */
export async function placeOrder(items) {
  const { data } = await api.post('/orders', { items });
  return data;
}

/** GET /orders → OrderResponse[] (current user's orders) */
export async function getMyOrders() {
  const { data } = await api.get('/orders');
  return data;
}

/** GET /orders/:id → OrderResponse */
export async function getOrder(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

/** PATCH /orders/:id/status (ADMIN) */
export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data;
}
