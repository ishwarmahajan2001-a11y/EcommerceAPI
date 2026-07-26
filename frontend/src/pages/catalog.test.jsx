import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../test/utils';
import HomePage from './HomePage';
import ProductDetailPage from './ProductDetailPage';
import * as productsApi from '../api/products';

vi.mock('../api/products');

const PAGE = {
  content: [
    { id: 1, name: 'Laptop', description: 'Fast', price: 999, stockQuantity: 3 },
    { id: 2, name: 'Mouse', description: 'Clicky', price: 25, stockQuantity: 0 },
  ],
  number: 0,
  totalPages: 2,
};

beforeEach(() => vi.clearAllMocks());

describe('HomePage', () => {
  it('renders the product grid from the API', async () => {
    productsApi.getProducts.mockResolvedValue(PAGE);
    renderWithProviders(<HomePage />);
    expect(await screen.findByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
  });

  it('requests the next page when Next is clicked', async () => {
    productsApi.getProducts.mockResolvedValue(PAGE);
    renderWithProviders(<HomePage />);
    await screen.findByText('Laptop');
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() =>
      expect(productsApi.getProducts).toHaveBeenCalledWith({ page: 1, size: 12 })
    );
  });

  it('shows an error message when the API fails', async () => {
    productsApi.getProducts.mockRejectedValue(new Error('boom'));
    renderWithProviders(<HomePage />);
    expect(await screen.findByText(/could not load products/i)).toBeInTheDocument();
  });

  it('shows an empty state when there are no products', async () => {
    productsApi.getProducts.mockResolvedValue({ content: [], number: 0, totalPages: 0 });
    renderWithProviders(<HomePage />);
    expect(await screen.findByText(/no products/i)).toBeInTheDocument();
  });
});

describe('ProductDetailPage', () => {
  const renderDetail = () =>
    renderWithProviders(
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>,
      { route: '/products/1' }
    );

  it('renders the product details', async () => {
    productsApi.getProduct.mockResolvedValue(PAGE.content[0]);
    renderDetail();
    expect(await screen.findByRole('heading', { name: 'Laptop' })).toBeInTheDocument();
    expect(screen.getByText(/\$999\.00/)).toBeInTheDocument();
    expect(productsApi.getProduct).toHaveBeenCalledWith('1');
  });

  it('shows not-found message on API error', async () => {
    productsApi.getProduct.mockRejectedValue(new Error('404'));
    renderDetail();
    expect(await screen.findByText(/product not found/i)).toBeInTheDocument();
  });
});
