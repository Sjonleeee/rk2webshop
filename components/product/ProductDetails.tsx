"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
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
  title: string;
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

  /* image refs */
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* cart-aware stock */
  const quantitiesInCart = useMemo<Record<string, number>>(() => {
    if (!cart?.lines?.edges) return {};
    return cart.lines.edges.reduce((acc, line) => {
      const id = line.node.merchandise.id;
      acc[id] = (acc[id] || 0) + line.node.quantity;
      return acc;
    }, {} as Record<string, number>);
  }, [cart]);

  const getAvailableStock = (v: ProductVariant) =>
    Math.max(0, v.quantityAvailable - (quantitiesInCart[v.id] || 0));

  const isOutOfStock = variants.every((v) => v.quantityAvailable === 0);

  const firstAvailableVariantId =
    variants.find((v) => getAvailableStock(v) > 0)?.id ?? null;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    firstAvailableVariantId
  );

  return (
    <section className="relative w-full">
      <div className="grid grid-cols-12 px-10">
        {/* LEFT — DETAILS */}
        <aside className="col-span-3 pr-10">
          <div className="sticky top-24 h-[calc(100vh-6rem)] flex items-end pb-20 text-[11px] text-neutral-500">
            <div className="relative max-w-[300px]">
              {/* BREADCRUMB — REFERENCE STYLE */}
              <nav className="absolute -top-70 left-0 text-[10px] tracking-wide text-neutral-400">
                <Link
                  href="/shop"
                  className="transition hover:text-[hsl(var(--rk2-color-accent))]"
                >
                  Products
                </Link>
                <span className="mx-1">/</span>
                <span className="text-[hsl(var(--rk2-color-accent))]">
                  {product.title}
                </span>
              </nav>

              {/* CONTENT */}
              <div className="space-y-9 pt-2">
                <div>
                  <p className="uppercase mb-1">Composition</p>
                  <p>{product.description || "—"}</p>
                </div>

                <div>
                  <p className="uppercase mb-1">Care</p>
                  <p>Wash cold. Do not tumble dry.</p>
                </div>

                <div>
                  <p className="uppercase mb-1">Origin</p>
                  <p>Designed in Belgium.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER — FULLSCREEN IMAGES */}
        <div className="col-span-6">
          {images.map((img, index) => (
            <div
              key={img.url}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className="h-screen flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt={img.altText || product.title}
                  fill
                  priority={index === 0}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — STICKY PRODUCT COLUMN */}
        <aside className="col-span-3 relative">
          <div className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col justify-between py-20">
            {/* THUMBNAILS */}
            <div className="flex flex-col gap-3">
              {images.map((img, index) => (
                <button
                  key={img.url}
                  onClick={() =>
                    imageRefs.current[index]?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    })
                  }
                  className="w-9 aspect-3/4"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* PRODUCT INFO */}
            <div className="text-sm max-w-[260px] space-y-4">
              <div className="space-y-1">
                <h1 className="font-medium">{product.title}</h1>
                <p className="text-xs text-neutral-500">
                  No. {product.id.slice(-8)}
                </p>
              </div>

              <div className="h-px bg-neutral-300" />

              <p>
                {price.currencyCode} {price.amount}
              </p>

              <div className="h-px bg-neutral-300" />

              <div className="flex gap-3">
                {variants.map((variant) => {
                  const available = getAvailableStock(variant) > 0;
                  const selected = selectedVariantId === variant.id;

                  return (
                    <button
                      key={variant.id}
                      disabled={!available}
                      onClick={() =>
                        available && setSelectedVariantId(variant.id)
                      }
                      className={`
                        text-xs pb-1 border-b transition
                        ${
                          selected
                            ? "border-[hsl(var(--rk2-color-accent))] text-[hsl(var(--rk2-color-accent))]"
                            : "border-transparent text-neutral-400 hover:text-[hsl(var(--rk2-color-accent))]"
                        }
                        ${!available && "opacity-30 cursor-not-allowed"}
                      `}
                    >
                      {variant.title}
                    </button>
                  );
                })}
              </div>

              <div className="h-px bg-neutral-300" />

              {isOutOfStock ? (
                <button
                  disabled
                  className="w-full border border-neutral-300 py-3 text-xs text-neutral-400"
                >
                  Out of stock
                </button>
              ) : (
                <AddToCartButton
                  variantId={selectedVariantId}
                  disabled={!selectedVariantId}
                />
              )}

              <p className="text-[10px] text-neutral-400">
                Delivery, exchanges and returns
              </p>
            </div>
          </div>

          {/* FULL HEIGHT DIVIDER */}
          <div className="absolute left-[-10px] top-0 h-full w-px bg-neutral-300" />
        </aside>
      </div>
    </section>
  );
}
