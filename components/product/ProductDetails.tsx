"use client";
import Image from "next/image";
import { useState, useRef, useMemo } from "react";
import { useCart } from "@/components/providers/CartContext";
import AddToCartButton from "@/components/cart/AddToCartButton";

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
  const { cart } = useCart();
  const variants = product.variants.edges.map((edge) => edge.node);
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id || null
  );

  // Calculate how many items of each variant are already in cart
  const variantQuantitiesInCart = useMemo(() => {
    const quantities: Record<string, number> = {};
    if (cart?.lines?.edges) {
      cart.lines.edges.forEach((line) => {
        const variantId = line.node.merchandise.id;
        quantities[variantId] = (quantities[variantId] || 0) + line.node.quantity;
      });
    }
    return quantities;
  }, [cart]);

  // Calculate available stock for each variant (stock - items in cart)
  const getAvailableStock = (variantId: string) => {
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) return 0;
    const inCart = variantQuantitiesInCart[variantId] || 0;
    return Math.max(0, variant.quantityAvailable - inCart);
  };

  // Check if variant has available stock (considering cart)
  const hasAvailableStock = (variantId: string) => {
    return getAvailableStock(variantId) > 0;
  };

  // Check if product is REALLY out of stock (not just in cart)
  // Only show "Out of Stock" if all variants have 0 quantityAvailable
  const outOfStock = variants.every((v) => v.quantityAvailable === 0);
  
  // Check if selected variant has available stock (considering cart)
  const selectedVariantOutOfStock = selectedVariantId
    ? !hasAvailableStock(selectedVariantId)
    : true;

  // Ref voor eventuele animaties / scroll positioning van de productafbeelding
  const productImageRef = useRef<HTMLDivElement | null>(null);

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
          <div
            ref={productImageRef}
            className="w-full aspect-square relative mb-6 flex items-center justify-center rounded-lg"
          >
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

            <div className="mb-8">
              <p className="text-sm font-semibold mb-4">Available Sizes</p>
              {outOfStock ? (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {variants.map((variant) => {
                    // Disable if variant has no available stock (considering cart)
                    // But always show the button, even if disabled
                    const variantHasStock = hasAvailableStock(variant.id);
                    const isSelected = selectedVariantId === variant.id;
                    
                    return (
                      <button
                        key={variant.id}
                        disabled={!variantHasStock}
                        className={`border-2 rounded-lg py-0.5 px-1 text-center transition ${
                          !variantHasStock
                            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                        }`}
                        onClick={() => {
                          if (variantHasStock) {
                            setSelectedVariantId(variant.id);
                          }
                        }}
                      >
                        <p className="text-xs font-medium">{variant.title}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            {!outOfStock && (
              <AddToCartButton
                variantId={selectedVariantId}
                disabled={!selectedVariantId || selectedVariantOutOfStock}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
