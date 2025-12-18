"use client";

import { useState, useRef } from "react";
import { useCart } from "@/components/providers/CartContext";

interface AddToCartButtonProps {
  variantId: string | null;
  disabled?: boolean;
  className?: string;
}

export default function AddToCartButton({
  variantId,
  disabled = false,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleAddToCart = async () => {
    if (!variantId || disabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await addToCart(variantId, 1);

      // Visual feedback: animate dot to cart
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
    } catch (err) {
      setError("Failed to add item to cart. Please try again.");
      console.error("Add to cart error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !variantId || disabled || isLoading;

  return (
    <div className="w-full">
      <button
        ref={buttonRef}
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`w-full font-bold py-3 rounded-lg mt-8 transition ${
          isDisabled
            ? "bg-white/40 text-gray-400 cursor-not-allowed border border-gray-200 backdrop-blur-md shadow-inner"
            : "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
        } ${className}`}
        type="button"
        style={
          isDisabled && !isLoading
            ? { WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }
            : {}
        }
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding...
          </span>
        ) : (
          "Add to Cart"
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}

