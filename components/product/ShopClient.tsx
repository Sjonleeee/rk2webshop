"use client";

import { useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import CategorySidebar from "@/components/product/CategorySidebar";

// Types (gelijk aan page.tsx)
interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductVariant {
  priceV2: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: {
    name: string;
    value: string;
  }[];
  quantityAvailable: number;
}

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  productType: string;
  images: {
    edges: { node: ProductImage }[];
  };
  variants: {
    edges: { node: ProductVariant }[];
  };
}

interface ProductEdge {
  node: ProductNode;
}

interface ShopClientProps {
  products: ProductEdge[];
  categories: string[];
}

export default function ShopClient({
  products,
  categories,
}: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <>
      {/* Mobile */}
      <div className="block sm:hidden mb-6">
        <CategorySidebar
          categories={categories}
          setHoveredCategory={setSelectedCategory}
        />
      </div>

      <div className="flex">
        {/* Desktop */}
        <div className="hidden sm:block">
          <CategorySidebar
            categories={categories}
            setHoveredCategory={setSelectedCategory}
          />
        </div>

        <main className="flex-1">
          <ProductGrid
            products={products}
            selectedCategory={selectedCategory}
          />
        </main>
      </div>
    </>
  );
}
