"use client";

import { useEffect, useState } from "react";
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
  useEffect(() => {
    if (!selectedCategory) return;

    const handle = window.requestAnimationFrame(() => {
      const slug = selectedCategory.toLowerCase().replace(/\s+/g, "-");
      const el = document.getElementById(`category-${slug}`);
      if (!el) return;

      // Bepaal een offset zodat het product net onder navbar + categorybar valt
      const isMobile = window.innerWidth < 640;
      const offset = isMobile ? 150 : 180; // px
      const rect = el.getBoundingClientRect();
      const targetY = rect.top + window.scrollY - offset;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(handle);
  }, [selectedCategory]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <CategorySidebar
        selectedCategory={selectedCategory}
        categories={categories}
        setHoveredCategory={setSelectedCategory}
      />

      <main className="flex-1">
        <ProductGrid products={products} selectedCategory={selectedCategory} />
      </main>
    </div>
  );
}
