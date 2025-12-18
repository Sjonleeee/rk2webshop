"use client";
import { useCart } from "@/components/providers/CartContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: string;
    currency: string;
    image: string | null;
    variantId: string | null;
    outOfStock?: boolean;
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
      className={`w-full font-bold py-3 rounded-lg mt-8 transition ${
        product.outOfStock
          ? "bg-white/40 text-gray-400 cursor-not-allowed border border-gray-200 backdrop-blur-md shadow-inner"
          : "bg-black text-white hover:bg-gray-800"
      }`}
      type="button"
      onClick={handleAddToCart}
      disabled={product.outOfStock}
      style={
        product.outOfStock
          ? { WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }
          : {}
      }
    >
      Add to Cart
    </button>
  );
}
