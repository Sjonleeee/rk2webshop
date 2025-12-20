"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
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
  // Initialize cartId from localStorage (SSR-safe)
  const [cartId, setCartId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cartId");
  });

  const [cart, setCart] = useState<ShopifyCart | null>(null);

  async function fetchCart(id: string) {
    const data = await storefront(GET_CART_QUERY, { cartId: id });
    setCart(data.cart);
  }

  async function createCart(variantId: string, quantity: number) {
    const data = await storefront(CREATE_CART_MUTATION, {
      lines: [{ merchandiseId: variantId, quantity }],
    });

    if (data?.cartCreate?.cart) {
    const newCart = data.cartCreate.cart;
    setCart(newCart);
    setCartId(newCart.id);
      if (typeof window !== "undefined") {
    localStorage.setItem("cartId", newCart.id);
      }
    }
  }

  async function addToCart(variantId: string, quantity = 1) {
    try {
    if (!cartId) {
      await createCart(variantId, quantity);
      return;
    }

    const data = await storefront(ADD_TO_CART_MUTATION, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    });

      if (data?.cartLinesAdd?.cart) {
    setCart(data.cartLinesAdd.cart);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
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

  // Hydrate cart on mount if cartId exists
  React.useEffect(() => {
    if (cartId && !cart) {
    fetchCart(cartId);
    }
  }, [cartId, cart]);

  return (
    <CartContext.Provider
      value={{ cart, cartId, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
