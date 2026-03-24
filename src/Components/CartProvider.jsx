import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addCartItem, clearCart, deleteCartItem, getCart, updateCartItem } from "../services/api";
import { useAuth } from "./AuthProvider";

const CartContext = createContext(null);

function loadLocalCart() {
  const raw = localStorage.getItem("cart");
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
}

export const CartProvider = ({ children }) => {
  const { user, token, isReady } = useAuth();
  const [serverCart, setServerCart] = useState(null);
  const [localItems, setLocalItems] = useState(() => loadLocalCart());
  const [loading, setLoading] = useState(false);

  const isAuthed = Boolean(token && user);

  const refresh = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    try {
      const cart = await getCart();
      setServerCart(cart);
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  useEffect(() => {
    saveLocalCart(localItems);
  }, [localItems]);

  useEffect(() => {
    if (!isReady) return;
    if (isAuthed) refresh();
    else setServerCart(null);
  }, [isReady, isAuthed, user?.id, refresh]);

  // Merge local cart into server cart after login
  useEffect(() => {
    if (!isReady || !isAuthed) return;
    if (!localItems.length) return;

    (async () => {
      setLoading(true);
      try {
        for (const it of localItems) {
          await addCartItem(it.productId, it.quantity);
        }
        setLocalItems([]);
        await refresh();
      } finally {
        setLoading(false);
      }
    })();
  }, [isReady, isAuthed, localItems, refresh]);

  const items = useMemo(() => {
    if (isAuthed) return serverCart?.items || [];
    return localItems;
  }, [isAuthed, serverCart, localItems]);

  const count = useMemo(() => items.reduce((sum, it) => sum + Number(it.quantity || 0), 0), [items]);

  const add = useCallback(async (product, quantity = 1) => {
    const qty = Number(quantity || 1);
    if (!product?.id || qty < 1) return;

    if (isAuthed) {
      await addCartItem(product.id, qty);
      await refresh();
      return;
    }

    setLocalItems((prev) => {
      const next = [...prev];
      const idx = next.findIndex((x) => x.productId === product.id);
      if (idx >= 0) next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
      else {
        next.push({
          productId: product.id,
          quantity: qty,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            imageSmall: product.imageSmall || product.imageLarge || null,
          },
        });
      }
      return next;
    });
  }, [isAuthed, refresh]);

  const setQty = useCallback(async (item, quantity) => {
    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty < 0) return;

    if (isAuthed) {
      if (!item?.id) return;
      if (qty === 0) await deleteCartItem(item.id);
      else await updateCartItem(item.id, qty);
      await refresh();
      return;
    }

    setLocalItems((prev) => {
      const next = prev
        .map((it) => (it.productId === item.productId ? { ...it, quantity: qty } : it))
        .filter((it) => it.quantity > 0);
      return next;
    });
  }, [isAuthed, refresh]);

  const remove = useCallback(async (item) => setQty(item, 0), [setQty]);

  const clear = useCallback(async () => {
    if (isAuthed) {
      await clearCart();
      await refresh();
      return;
    }
    setLocalItems([]);
  }, [isAuthed, refresh]);

  const value = useMemo(
    () => ({ items, count, add, setQty, remove, clear, refresh, loading, isAuthed }),
    [items, count, add, setQty, remove, clear, refresh, loading, isAuthed]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
