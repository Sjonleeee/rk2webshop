/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { storefront } from "@/lib/shopify";
import {
  CREATE_CART_MUTATION,
  GET_CART_QUERY,
  ADD_TO_CART_MUTATION,
} from "@/lib/shopifyCartMutations";
import { REMOVE_FROM_CART_MUTATION } from "@/lib/shopifyCartMutationsRemove";

/* =======================
   Types
======================= */

export interface ShopifyCartLine {
  node: {
    id: string;
    quantity: number;
    merchandise: {
      id: string;
      title: string;
      product: {
        title: string;
        featuredImage?: { url: string };
      };
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
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
  const [cartId, setCartId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cartId");
  });

  const [cart, setCart] = useState<ShopifyCart | null>(null);

  /* ---------- helpers ---------- */

  async function fetchCart(id: string) {
    const data = await storefront(GET_CART_QUERY, { cartId: id });
    setCart(data.cart);
  }

  async function createCart(variantId: string, quantity: number) {
    const data = await storefront(CREATE_CART_MUTATION, {
      lines: [{ merchandiseId: variantId, quantity }],
    });

    const newCart = data.cartCreate.cart;
    setCart(newCart);
    setCartId(newCart.id);
    localStorage.setItem("cartId", newCart.id);
  }

  /* ---------- public API ---------- */

  async function addToCart(variantId: string, quantity = 1) {
    if (!cartId) {
      await createCart(variantId, quantity);
      return;
    }

    const data = await storefront(ADD_TO_CART_MUTATION, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    });

    setCart(data.cartLinesAdd.cart);
  }

  async function removeFromCart(lineId: string) {
    if (!cartId) return;
    const data = await storefront(REMOVE_FROM_CART_MUTATION, {
      cartId,
      lineIds: [lineId],
    });
    setCart(data.cartLinesRemove.cart);
  }

  function clearCart() {
    setCart(null);
    setCartId(null);
    localStorage.removeItem("cartId");
  }

  // Haal cart op als cartId verandert en component is gemount
  React.useEffect(() => {
    if (!cartId || cart) return;
    let isMounted = true;
    fetchCart(cartId).then(() => {
      // alleen setState als component nog gemount is
    });
    return () => {
      isMounted = false;
    };
  }, [cartId, cart]);

  return (
    <CartContext.Provider
      value={{ cart, cartId, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
