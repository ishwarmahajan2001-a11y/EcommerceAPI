import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const APPLE = { id: 1, name: 'Apple', price: 2.5, stockQuantity: 10 };
const BOOK = { id: 2, name: 'Book', price: 15, stockQuantity: 3 };

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalAmount).toBe(0);
    expect(result.current.totalCount).toBe(0);
  });

  it('adds items and computes totals', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(APPLE));
    act(() => result.current.addItem(BOOK, 2));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalCount).toBe(3);
    expect(result.current.totalAmount).toBeCloseTo(32.5);
  });

  it('merges quantity when the same product is added twice', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(APPLE));
    act(() => result.current.addItem(APPLE, 2));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('caps quantity at available stock', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(BOOK, 99));
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('updates quantity and removes the item when set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(APPLE, 2));
    act(() => result.current.setQuantity(1, 5));
    expect(result.current.items[0].quantity).toBe(5);
    act(() => result.current.setQuantity(1, 0));
    expect(result.current.items).toEqual([]);
  });

  it('removes an item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(APPLE));
    act(() => result.current.addItem(BOOK));
    act(() => result.current.removeItem(1));
    expect(result.current.items.map((i) => i.product.id)).toEqual([2]);
  });

  it('clears the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(APPLE));
    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);
  });

  it('exposes order payload items in backend shape', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(APPLE, 2));
    expect(result.current.toOrderItems()).toEqual([{ productId: 1, quantity: 2 }]);
  });
});
