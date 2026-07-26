import { api } from './client';

/** GET /products?page&size → Spring Page<ProductResponse> */
export async function getProducts({ page = 0, size = 12 } = {}) {
  const { data } = await api.get('/products', { params: { page, size } });
  return data;
}

/** GET /products/:id → ProductResponse */
export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

/** POST /products (ADMIN) */
export async function createProduct(product) {
  const { data } = await api.post('/products', product);
  return data;
}

/** PUT /products/:id (ADMIN) */
export async function updateProduct(id, product) {
  const { data } = await api.put(`/products/${id}`, product);
  return data;
}

/** DELETE /products/:id (ADMIN) */
export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}
