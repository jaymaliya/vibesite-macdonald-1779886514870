"use client";
import React from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = React.createContext<CartContextValue>({
  items: [],
  addItem: (_i: CartItem) => {},
  removeItem: (_id: string) => {},
  updateQuantity: (_id: string, _q: number) => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

const SESSION_KEY = "cart_macdonald";

function loadFromSession(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveToSession(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from sessionStorage after mount
  React.useEffect(() => {
    const stored = loadFromSession();
    if (stored.length > 0) setItems(stored);
    setHydrated(true);
  }, []);

  // Persist whenever items change (after hydration)
  React.useEffect(() => {
    if (!hydrated) return;
    saveToSession(items);
  }, [items, hydrated]);

  const addItem = React.useCallback((incoming: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.id === incoming.id &&
          i.color === incoming.color &&
          i.size === incoming.size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === incoming.id &&
          i.color === incoming.color &&
          i.size === incoming.size
            ? { ...i, quantity: i.quantity + (incoming.quantity ?? 1) }
            : i
        );
      }
      return [...prev, { ...incoming, quantity: incoming.quantity ?? 1 }];
    });
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = React.useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = React.useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = React.useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  return React.useContext(CartContext);
}