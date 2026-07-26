import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

/**
 * Client-side shopping cart. Items are {product, quantity}; quantity is
 * always capped at product.stockQuantity. Checkout converts the cart to
 * the backend's OrderRequest items shape via toOrderItems().
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const cap = product.stockQuantity ?? Infinity;
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, cap) }
            : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, cap) }];
    });
  }, []);

  const setQuantity = useCallback((productId, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.product.id !== productId)
        : prev.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(quantity, i.product.stockQuantity ?? Infinity) }
              : i
          )
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const totalAmount = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      items,
      totalAmount,
      totalCount,
      addItem,
      setQuantity,
      removeItem,
      clear,
      toOrderItems: () => items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
    };
  }, [items, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
