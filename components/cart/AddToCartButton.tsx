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
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleAddToCart = async () => {
    if (!variantId || disabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    let dotElement: HTMLDivElement | null = null;

    /* --- animation (unchanged) --- */
    if (typeof window !== "undefined" && buttonRef.current) {
      const bagEl = document.getElementById("cart-bag-target");
      if (bagEl) {
        const sourceRect = buttonRef.current.getBoundingClientRect();
        const targetRect = bagEl.getBoundingClientRect();

        const startX = sourceRect.left + sourceRect.width / 2;
        const startY = sourceRect.top + sourceRect.height / 2;
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top + targetRect.height / 2;

        const dot = document.createElement("div");
        dot.style.position = "fixed";
        dot.style.zIndex = "99999";
        dot.style.width = "12px";
        dot.style.height = "12px";
        dot.style.borderRadius = "50%";
        dot.style.backgroundColor = "#1c2de7";
        dot.style.left = `${startX}px`;
        dot.style.top = `${startY}px`;
        dot.style.transform = "translate(-50%, -50%) scale(1)";
        dot.style.opacity = "1";
        dot.style.pointerEvents = "none";

        document.body.appendChild(dot);
        dotElement = dot;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const translateX = endX - startX;
            const translateY = endY - startY;
            dot.style.transition =
              "transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)";
            dot.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(0.2)`;
            dot.style.opacity = "0";
          });
        });

        setTimeout(() => dot.remove(), 650);
      }
    }

    try {
      await addToCart(variantId, 1);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 900);
    } catch (err: unknown) {
      if (dotElement) dotElement.remove();

      if (err instanceof Error) {
        if (err.message === "OUT_OF_STOCK") {
          setError("This size is no longer available.");
        } else {
          setError("Failed to add item to cart. Please try again.");
        }
        console.error("Add to cart error:", err.message);
      } else {
        setError("Unexpected error occurred.");
        console.error("Unknown add to cart error");
      }
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
        type="button"
        className={`w-full font-bold py-3   transition ${
          isDisabled
            ? "bg-white/40 text-gray-400 cursor-not-allowed border border-gray-200"
            : "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
        } ${className}`}
      >
        {isLoading
          ? "Adding..."
          : showSuccess
          ? "Added"
          : "Add to Cart"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
