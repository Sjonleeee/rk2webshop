"use client";
import React from "react";

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
  function handleAddToCart() {
    if (typeof window === "undefined") return;
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...existingCart, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log("Cart:", updatedCart);
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
