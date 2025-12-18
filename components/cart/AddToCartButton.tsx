"use client";
import { useRef } from "react";
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  async function handleAddToCart() {
    if (!product.variantId) return;

     // Kleine blauwe dot die naar de bag vliegt
    if (typeof window !== "undefined" && buttonRef.current) {
      const bagEl = document.getElementById("cart-bag-target");
      const sourceEl = buttonRef.current;

      if (bagEl) {
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = bagEl.getBoundingClientRect();

        const dot = document.createElement("div");
        dot.style.position = "fixed";
        dot.style.zIndex = "99999";
        dot.style.width = "12px";
        dot.style.height = "12px";
        dot.style.borderRadius = "9999px";
        dot.style.backgroundColor = "#1c2de7";
        dot.style.left = `${sourceRect.left + sourceRect.width / 2}px`;
        dot.style.top = `${sourceRect.top + sourceRect.height / 2}px`;
        dot.style.transform = "translate(-50%, -50%) scale(1)";
        dot.style.opacity = "1";

        document.body.appendChild(dot);

        // Start animatie in volgende frame
        window.requestAnimationFrame(() => {
          const translateX =
            targetRect.left +
            targetRect.width / 2 -
            (sourceRect.left + sourceRect.width / 2);
          const translateY =
            targetRect.top +
            targetRect.height / 2 -
            (sourceRect.top + sourceRect.height / 2);

          dot.style.transition =
            "transform 450ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 450ms";
          dot.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.3)`;
          dot.style.opacity = "0";
        });

        window.setTimeout(() => {
          dot.remove();
        }, 500);
      }
    }

    await addToCart(product.variantId, 1);
  }

  return (
    <button
      ref={buttonRef}
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
