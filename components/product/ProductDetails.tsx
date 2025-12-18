"use client";
import Image from "next/image";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { useState } from "react";

interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductVariant {
  id: string;
  title: string;
  quantityAvailable: number;
  price: {
    amount: string;
    currencyCode: string;
  };
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

export default function ProductDetails({ product }: ProductDetailsProps) {
  const variants = product.variants.edges.map((edge) => edge.node);
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id || null
  );
  const outOfStock = variants.every((v) => v.quantityAvailable === 0);

  const productForCart = {
    id: product.id,
    title: product.title,
    price: price.amount,
    currency: price.currencyCode,
    image: image?.url || null,
    variantId: selectedVariantId,
    outOfStock,
  };

  return (
    <div className="max-w-7xl mx-auto p-10">
      <div className="flex gap-12">
        {/* Left: Title and Description */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 leading-relaxed mb-8">
            {product.description || "No description available"}
          </p>
        </div>

        {/* Middle: Product image */}
        <div className="flex-1">
          <div className="w-full aspect-square relative mb-6 flex items-center justify-center rounded-lg">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <span>No image</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Price and Sizing (3 columns) */}
        <div className="flex-1">
          <div className="p-8 rounded-lg">
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-2">Price</p>
              <p className="text-3xl font-bold">
                {price.currencyCode} {price.amount}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-4">Available Sizes</p>
              {outOfStock ? (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      disabled={variant.quantityAvailable === 0}
                      className={`border-2 rounded-lg py-0.5 px-1 text-center transition ${
                        variant.quantityAvailable === 0
                          ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : selectedVariantId === variant.id
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }`}
                      onClick={() => setSelectedVariantId(variant.id)}
                    >
                      <p className="text-xs font-medium">{variant.title}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stap 1: Add to Cart knop */}
            {!outOfStock && <AddToCartButton product={productForCart} />}
          </div>
        </div>
      </div>
    </div>
  );
}
