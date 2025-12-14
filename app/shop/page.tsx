"use client";
import { useEffect, useState } from "react";
import { storefront } from "../../lib/shopify";
import { GET_PRODUCTS_QUERY } from "../../lib/queries";
import ProductGrid from "../../components/ProductGrid";
import CategorySidebar from "../../components/CategorySidebar";
import { useSearchParams } from "next/navigation";

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

// Fetch the first 12 products
async function getProducts(): Promise<ProductEdge[]> {
  const data = await storefront(GET_PRODUCTS_QUERY, {}, { revalidate: 60 });
  return data.products.edges;
}

export default function ShopPage() {
  const [products, setProducts] = useState<ProductEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const categoryParam = searchParams.get("category") || "";
  const filteredProducts = categoryParam
    ? products.filter(({ node }) => node.productType === categoryParam)
    : products;

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

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex w-full px-4 sm:px-6 lg:px-8 py-8 ">
        {/* Sidebar */}
        <CategorySidebar
          categories={categories}
          hoveredCategory={hoveredCategory}
          setHoveredCategory={setHoveredCategory}
        />
        {/* Main content */}
        <main className="flex-1">
          <ProductGrid
            products={
              hoveredCategory
                ? products.filter(
                    ({ node }) => node.productType === hoveredCategory
                  )
                : filteredProducts
            }
            allProducts={products}
            hoveredCategory={hoveredCategory}
          />
        </main>
      </div>
    </div>
  );
}
