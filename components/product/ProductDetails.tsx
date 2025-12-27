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

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCarouselRef = useRef<HTMLDivElement | null>(null);

  /* 🔹 mobile carousel progress */
  const [activeIndex, setActiveIndex] = useState(0);

  /* Cart-aware stock */
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

  const isOutOfStock = variants.every((v) => getAvailableStock(v) === 0);

  const firstAvailableVariantId =
    variants.find((v) => getAvailableStock(v) > 0)?.id ?? null;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    firstAvailableVariantId
  );

  /* ------------------------------------------------------------------
   * Handlers
   * -----------------------------------------------------------------*/
  const handleMobileScroll = () => {
    if (!mobileCarouselRef.current) return;
    const { scrollLeft, clientWidth } = mobileCarouselRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(index);
  };

  /* ------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------*/
  return (
    <section className="relative w-full">
      {/* MOBILE NAV */}
      <nav className="md:hidden px-6 pt-4 text-[10px] tracking-wide text-neutral-400">
        <Link href="/shop">Products</Link>
        <span className="mx-1">/</span>
        <span className="text-[hsl(var(--rk2-color-accent))]">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 px-6 md:px-10">
        {/* LEFT COLUMN — DESKTOP ONLY */}
        <aside className="hidden md:block col-span-3 relative pr-10">
          <nav className="fixed top-30 left-10 z-40 text-[10px] tracking-wide text-neutral-400">
            <Link href="/shop">Products</Link>
            <span className="mx-1">/</span>
            <span className="text-[hsl(var(--rk2-color-accent))]">
              {product.title}
            </span>
          </nav>

          <div className="fixed top-24 h-[calc(100vh-6rem)] flex items-end pb-20 text-[11px] text-neutral-500">
            <div className="space-y-8 max-w-[300px]">
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
        </aside>

        {/* CENTER — IMAGES */}
        <div className="md:col-span-6">
          {/* MOBILE CAROUSEL */}
          <div
            ref={mobileCarouselRef}
            onScroll={handleMobileScroll}
            className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
          >
            {images.map((img) => (
              <div
                key={img.url}
                className="relative min-w-full aspect-3/4 snap-center"
              >
                <Image
                  src={img.url}
                  alt={img.altText || product.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ))}
          </div>

          {/* 🔹 MOBILE PROGRESS BAR */}
          <div className="md:hidden mt-2 px-6">
            <div className="relative h-px bg-neutral-300">
              <div
                className="absolute top-0 left-0 h-px bg-[hsl(var(--rk2-color-primary))] transition-all duration-300"
                style={{
                  width: `${((activeIndex + 1) / images.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* DESKTOP IMAGES — UNCHANGED */}
          <div className="hidden md:block">
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
        </div>

        {/* RIGHT COLUMN */}
        <aside className="md:col-span-3 relative">
          <div className="md:fixed md:top-24 md:h-[calc(100vh-6rem)] flex flex-col gap-8 md:justify-between py-10 md:py-15 md:pl-9">
            {/* THUMBNAILS — DESKTOP ONLY */}
            <div className="hidden md:flex flex-col gap-3">
              {images.map((img, index) => (
                <button
                  key={img.url}
                  onClick={() =>
                    imageRefs.current[index]?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    })
                  }
                  className="w-8 aspect-3/4"
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
            <div className="text-sm w-full max-w-none md:max-w-[260px] space-y-3">
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
                            : "border-transparent text-neutral-400"
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
                  disabled={
                    !selectedVariantId ||
                    !variants.find(
                      (v) =>
                        v.id === selectedVariantId && getAvailableStock(v) > 0
                    )
                  }
                />
              )}

              <p className="text-[10px] text-neutral-400">
                Delivery, exchanges and returns
              </p>

              {/* MOBILE DETAILS */}
              <div className="md:hidden border-t border-neutral-200 text-[11px] text-neutral-500">
                <details className="group border-b border-neutral-200">
                  <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
                    <span className="uppercase">Details</span>

                    <span className="relative w-3 h-3 flex items-center justify-center text-xs">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline text-[hsl(var(--rk2-color-accent))] opacity-70">
                        /
                      </span>
                    </span>
                  </summary>

                  <div className="pb-4 pr-6">
                    <p>{product.description || "—"}</p>
                  </div>
                </details>

                <details className="group border-b border-neutral-200">
                  <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
                    <span className="uppercase">Care</span>
                    <span className="relative w-3 h-3 flex items-center justify-center text-xs">
                      {/* plus (default) */}
                      <span className="group-open:hidden">+</span>

                      {/* slash (open state) */}
                      <span className="hidden group-open:inline text-[hsl(var(--rk2-color-accent))] opacity-70">
                        /
                      </span>
                    </span>
                  </summary>
                  <div className="pb-4 pr-6">
                    <p>Wash cold. Do not tumble dry.</p>
                  </div>
                </details>

                <details className="group border-b border-neutral-200">
                  <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
                    <span className="uppercase">Origin</span>
                    <span className="relative w-3 h-3 flex items-center justify-center text-xs">
                      {/* plus (default) */}
                      <span className="group-open:hidden">+</span>

                      {/* slash (open state) */}
                      <span className="hidden group-open:inline text-[hsl(var(--rk2-color-accent))] opacity-70">
                        /
                      </span>
                    </span>
                  </summary>
                  <div className="pb-4 pr-6">
                    <p>Designed in Belgium.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* DIVIDER — DESKTOP ONLY */}
          <div className="hidden md:block absolute left-[-10px] top-0 h-full w-px bg-neutral-300" />
        </aside>
      </div>
    </section>
  );
}
