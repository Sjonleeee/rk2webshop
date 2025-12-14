"use client";
import { useEffect, useState } from "react";
import { storefront } from "../../lib/shopify";
import { GET_PRODUCTS_QUERY } from "../../lib/queries";
import ProductGrid from "../../components/ProductGrid";
import CategorySidebar from "../../components/CategorySidebar";

// Types voor Shopify products
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

async function getProducts(): Promise<ProductEdge[]> {
  const data = await storefront(GET_PRODUCTS_QUERY, {}, { revalidate: 60 });
  return data.products.edges;
}

export default function ShopPage() {
  const [products, setProducts] = useState<ProductEdge[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  const categories = Array.from(
    new Set(
      products
        .map(({ node }) => node.productType)
        .filter(
          (title: string) =>
            title &&
            !["Home page", "Automated Collection", "Hydrogen"].includes(title)
        )
    )
  );

  // Mobiel: click = filter, Desktop: hover = preview
  const handleCategory = (cat: string | null) => {
    if (window.innerWidth < 640) {
      setActiveCategory(cat);
    } else {
      setHoveredCategory(cat);
    }
  };

  // Filtering: mobile = activeCategory, desktop = hoveredCategory
  const filteredProducts =
    typeof window !== "undefined" && window.innerWidth < 640
      ? activeCategory
        ? products.filter(({ node }) => node.productType === activeCategory)
        : products
      : hoveredCategory
      ? products.filter(({ node }) => node.productType === hoveredCategory)
      : products;

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobiel: categories boven producten, Desktop: sidebar naast producten */}
        <div className="block sm:hidden mb-6">
          <CategorySidebar
            categories={categories}
            setHoveredCategory={handleCategory}
          />
        </div>
        <div className="flex">
          <div className="hidden sm:block">
            <CategorySidebar
              categories={categories}
              setHoveredCategory={handleCategory}
            />
          </div>
          <main className="flex-1">
            <ProductGrid
              products={filteredProducts}
              allProducts={products}
              hoveredCategory={hoveredCategory}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
