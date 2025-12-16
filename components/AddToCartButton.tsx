"use client";
import React from "react";
import { useCart } from "./CartContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: string;
    currency: string;
    image: string | null;
    variantId: string | null;
  };
}


export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  async function handleAddToCart() {
    if (!product.variantId) return;
    await addToCart(product.variantId, 1);
  }

  return (
    <button
      className="w-full bg-black text-white font-bold py-3 rounded-lg mt-8 hover:bg-gray-800 transition"
      type="button"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
}
