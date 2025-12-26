"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/providers/CartContext";
import AddToCartButton from "@/components/cart/AddToCartButton";

/* ------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------*/
interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductVariant {
  id: string;
  title: string; // XS | S | M | L | XL OR One Size
  quantityAvailable: number;
}

interface ProductNode {
  id: string;
  title: string;
  description: string | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: { node: ProductVariant }[];
  };
  images: {
    edges: { node: ProductImage }[];
  };
}

interface ProductDetailsProps {
  product: ProductNode;
}

/* ------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------*/
export default function ProductDetails({ product }: ProductDetailsProps) {
  const { cart } = useCart();

  const variants = product.variants.edges.map((e) => e.node);
  const images = product.images.edges.map((e) => e.node);
  const price = product.priceRange.minVariantPrice;

  const isOneSize = variants.length === 1;

  /* ----------------------------------------------------------------
   * Cart-aware stock
   * ---------------------------------------------------------------*/
  const quantitiesInCart = useMemo<Record<string, number>>(() => {
    if (!cart?.lines?.edges) return {};
    return cart.lines.edges.reduce((acc, line) => {
      const id = line.node.merchandise.id;
      acc[id] = (acc[id] || 0) + line.node.quantity;
      return acc;
    }, {} as Record<string, number>);
  }, [cart]);

  const getAvailableStock = (variant: ProductVariant) =>
    Math.max(
      0,
      variant.quantityAvailable - (quantitiesInCart[variant.id] || 0)
    );

  const isOutOfStock = variants.every(
    (variant) => variant.quantityAvailable === 0
  );

  /* ----------------------------------------------------------------
   * Selected variant
   * ---------------------------------------------------------------*/
  const firstAvailableVariantId =
    variants.find((v) => getAvailableStock(v) > 0)?.id ?? null;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    firstAvailableVariantId
  );

  const selectedVariantHasStock =
    selectedVariantId &&
    getAvailableStock(variants.find((v) => v.id === selectedVariantId)!) > 0;

  /* ----------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------*/
  return (
    <section className="max-w-[1600px] mx-auto px-12 py-16">
      <div className="grid grid-cols-12 gap-12">
        {/* LEFT — STICKY INFO */}
        <aside className="col-span-5">
          <div className="sticky top-24 flex flex-col justify-between">
            <div>
              {/* Breadcrumb */}
              <nav
                aria-label="Breadcrumb"
                className="text-xs text-neutral-500 mb-6"
              >
                <ol className="flex gap-1">
                  <li></li>
                  <li>
                    <Link
                      href="/shop"
                      className="transition hover:text-[hsl(var(--rk2-color-accent))]"
                    >
                      Products
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-[hsl(var(--rk2-color-accent))] cursor-default">
                    {product.title}
                  </li>
                </ol>
              </nav>

              {/* Meta */}
              <div className="text-sm text-neutral-600 space-y-1 mb-6">
                <p>No. {product.id.slice(-8)}</p>
                <p>Style {product.title}</p>
              </div>

              {/* Price */}
              <p className="text-xl mb-10">
                {price.currencyCode} {price.amount}
              </p>

              {/* Sizes */}
              <div className="mb-10">
                <p className="text-xs uppercase tracking-wide mb-3">Sizes</p>

                <div className="flex gap-4">
                  {isOneSize ? (
                    <button
                      disabled={getAvailableStock(variants[0]) === 0}
                      className={`
                        text-sm pb-1 border-b
                        border-[hsl(var(--rk2-color-accent))]
                        text-[hsl(var(--rk2-color-accent))]
                        ${
                          getAvailableStock(variants[0]) === 0 &&
                          "opacity-30 cursor-not-allowed"
                        }
                      `}
                    >
                      ONE SIZE
                    </button>
                  ) : (
                    variants.map((variant) => {
                      const available = getAvailableStock(variant) > 0;
                      const selected = selectedVariantId === variant.id;

                      const base = "text-sm pb-1 border-b transition-colors";
                      const state = selected
                        ? "border-[hsl(var(--rk2-color-accent))] text-[hsl(var(--rk2-color-accent))]"
                        : "border-transparent text-neutral-500";
                      const interaction = available
                        ? "hover:text-[hsl(var(--rk2-color-accent))] hover:border-[hsl(var(--rk2-color-accent))]"
                        : "opacity-30 cursor-not-allowed";

                      return (
                        <button
                          key={variant.id}
                          disabled={!available}
                          onClick={() =>
                            available && setSelectedVariantId(variant.id)
                          }
                          className={`${base} ${state} ${interaction}`}
                        >
                          {variant.title}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* CTA */}
              {isOutOfStock ? (
                <button
                  disabled
                  className="w-full border border-neutral-300 py-3 text-sm text-neutral-400 cursor-not-allowed"
                >
                  / Out of stock
                </button>
              ) : (
                <AddToCartButton
                  variantId={selectedVariantId}
                  disabled={!selectedVariantId || !selectedVariantHasStock}
                />
              )}
            </div>

            {/* Info */}
            <div className="mt-16 space-y-4 text-sm text-neutral-600">
              <details>
                <summary className="cursor-pointer">Overview</summary>
                <p className="mt-2 max-w-md">
                  {product.description || "No description available"}
                </p>
              </details>

              <details>
                <summary className="cursor-pointer">Details</summary>
                <p className="mt-2">Materials & construction.</p>
              </details>

              <details>
                <summary className="cursor-pointer">Shipping</summary>
                <p className="mt-2">Calculated at checkout.</p>
              </details>
            </div>
          </div>
        </aside>

        {/* RIGHT — SCROLLABLE IMAGES */}
        <div className="col-span-7 flex flex-col gap-24">
          {images.map((img, index) => (
            <Image
              key={img.url}
              src={img.url}
              alt={img.altText || product.title}
              width={1200}
              height={1600}
              priority={index === 0}
              className="w-full h-auto object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
