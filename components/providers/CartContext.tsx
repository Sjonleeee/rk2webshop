"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { storefront } from "@/lib/shopify/client";
import {
  GET_CART_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
} from "@/lib/shopify/cart/mutations";
import { REMOVE_FROM_CART_MUTATION } from "@/lib/shopify/cart/mutations-remove";

/* =======================
   Types (MATCH Shopify)
======================= */

export interface ShopifyCartLine {
  node: {
    id: string;
    quantity: number;
    cost?: {
      amountPerQuantity: {
        amount: string;
        currencyCode: string;
      };
      totalAmount: {
        amount: string;
        currencyCode: string;
      };
    };
    merchandise: {
      id: string;
      title: string;
      product: {
        title: string;
        featuredImage?: { url: string };
      };
      selectedOptions?: { name: string; value: string }[];
      priceV2?: { amount: string; currencyCode: string };
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  cost?: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: ShopifyCartLine[];
  };
}

interface CartContextType {
  cart: ShopifyCart | null;
  cartId: string | null;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  clearCart: () => void;
}

/* =======================
   Context
======================= */

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

/* =======================
   Provider
======================= */

export function CartProvider({ children }: { children: ReactNode }) {
  // SSR-safe init
  const [cartId, setCartId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cartId");
  });

  const [cart, setCart] = useState<ShopifyCart | null>(null);

  /* -----------------------
     Helpers
  ------------------------ */

  const persistCartId = useCallback((id: string | null) => {
    if (typeof window === "undefined") return;
    if (id) localStorage.setItem("cartId", id);
    else localStorage.removeItem("cartId");
  }, []);

  /* -----------------------
     Create EMPTY cart
     (used for recovery)
  ------------------------ */
  const createEmptyCart = useCallback(async () => {
    const data = await storefront(CREATE_CART_MUTATION, { lines: [] });

    const newCart: ShopifyCart | undefined = data?.cartCreate?.cart;
    if (!newCart?.id) {
      throw new Error("Failed to create empty cart");
    }

    setCart(newCart);
    setCartId(newCart.id);
    persistCartId(newCart.id);

    return newCart;
  }, [persistCartId]);

  /* -----------------------
     Fetch cart (SAFE)
  ------------------------ */
  const fetchCart = useCallback(
    async (id: string) => {
      try {
        const data = await storefront(GET_CART_QUERY, { cartId: id });

        // Shopify returns null if cart expired / checkout completed
        if (!data?.cart?.id) {
          throw new Error("Cart expired or not found");
        }

        setCart(data.cart);
      } catch (error) {
        console.warn("[Cart] stale cart → resetting", error);

        setCart(null);
        setCartId(null);
        persistCartId(null);

        await createEmptyCart();
      }
    },
    [createEmptyCart, persistCartId]
  );

  /* -----------------------
     Create cart with first line
  ------------------------ */
  const createCart = useCallback(
    async (variantId: string, quantity: number) => {
      const data = await storefront(CREATE_CART_MUTATION, {
        lines: [{ merchandiseId: variantId, quantity }],
      });

      const newCart: ShopifyCart | undefined = data?.cartCreate?.cart;
      if (!newCart?.id) {
        throw new Error("Failed to create cart");
      }

      setCart(newCart);
      setCartId(newCart.id);
      persistCartId(newCart.id);
    },
    [persistCartId]
  );

  /* -----------------------
     Add to cart (SAFE)
  ------------------------ */
  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      try {
        if (!cartId) {
          await createCart(variantId, quantity);
          return;
        }

        const data = await storefront(ADD_TO_CART_MUTATION, {
          cartId,
          lines: [{ merchandiseId: variantId, quantity }],
        });

        const updatedCart: ShopifyCart | undefined =
          data?.cartLinesAdd?.cart;

        if (!updatedCart?.id) {
          throw new Error("cartLinesAdd failed (stale cart?)");
        }

        setCart(updatedCart);
      } catch (error) {
        console.error("[Cart] addToCart failed → recovering", error);

        await createEmptyCart();

        const freshId =
          typeof window !== "undefined"
            ? localStorage.getItem("cartId")
            : null;

        if (!freshId) throw error;

        const retry = await storefront(ADD_TO_CART_MUTATION, {
          cartId: freshId,
          lines: [{ merchandiseId: variantId, quantity }],
        });

        if (retry?.cartLinesAdd?.cart?.id) {
          setCart(retry.cartLinesAdd.cart);
          setCartId(retry.cartLinesAdd.cart.id);
          persistCartId(retry.cartLinesAdd.cart.id);
          return;
        }

        throw error;
      }
    },
    [cartId, createCart, createEmptyCart, persistCartId]
  );

  /* -----------------------
     Remove from cart (SAFE)
  ------------------------ */
  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (!cartId) return;

      try {
        const data = await storefront(REMOVE_FROM_CART_MUTATION, {
          cartId,
          lineIds: [lineId],
        });

        if (data?.cartLinesRemove?.cart?.id) {
          setCart(data.cartLinesRemove.cart);
        } else {
          throw new Error("Remove failed (stale cart?)");
        }
      } catch {
        await createEmptyCart();
      }
    },
    [cartId, createEmptyCart]
  );

  const clearCart = useCallback(() => {
    setCart(null);
    setCartId(null);
    persistCartId(null);
  }, [persistCartId]);

  /* -----------------------
     Hydration on mount
  ------------------------ */
  useEffect(() => {
    if (cartId && !cart) {
      fetchCart(cartId);
    }
  }, [cartId, cart, fetchCart]);

  return (
    <CartContext.Provider
      value={{ cart, cartId, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
