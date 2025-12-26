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

    // Start smooth animation immediately for better UX
    let dotElement: HTMLDivElement | null = null;
    if (typeof window !== "undefined" && buttonRef.current) {
      const bagEl = document.getElementById("cart-bag-target");
      const sourceEl = buttonRef.current;

      if (bagEl) {
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = bagEl.getBoundingClientRect();

        // Calculate positions
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
        dot.style.boxShadow = "0 2px 8px rgba(28, 45, 231, 0.4)";
        dot.style.left = `${startX}px`;
        dot.style.top = `${startY}px`;
        dot.style.transform = "translate(-50%, -50%) scale(1)";
        dot.style.opacity = "1";
        dot.style.pointerEvents = "none";
        dot.style.willChange = "transform, opacity";
        dot.style.backfaceVisibility = "hidden";
        dot.style.transformOrigin = "center center";

        document.body.appendChild(dot);
        dotElement = dot;

        // Use double RAF for smoother animation start
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            const translateX = endX - startX;
            const translateY = endY - startY;

            // Ultra-smooth easing: refined ease-out curve for cleaner movement
            dot.style.transition =
              "transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)";
            dot.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(0.2)`;
            dot.style.opacity = "0";
          });
        });

        // Clean up after animation completes
        window.setTimeout(() => {
          if (dotElement && dotElement.parentNode) {
            dotElement.remove();
          }
        }, 650);
      }
    }

    try {
      await addToCart(variantId, 1);
      // Show success feedback with brand mark
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    } catch (err) {
      // Remove dot if error occurs
      if (dotElement && dotElement.parentNode) {
        dotElement.remove();
      }
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
            <span className="brand-mark-loading">/</span>
            <span>/ Adding...</span>
          </span>
        ) : showSuccess ? (
          <span className="flex items-center justify-center gap-2">
            <span className="brand-mark-success">/</span>
            <span>/ Added</span>
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
