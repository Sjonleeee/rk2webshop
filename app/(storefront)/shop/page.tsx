import { storefront } from "@/lib/shopify/client";
import { GET_PRODUCTS_QUERY } from "@/lib/shopify/queries/products";
import ShopClient from "@/components/product/ShopClient";

// Types
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

export default async function ShopPage() {
  const products = await getProducts();

  const categories = Array.from(
    new Set(
      products
        .map(({ node }) => node.productType)
        .filter(
          (title) =>
            title &&
            !["Home page", "Automated Collection", "Hydrogen"].includes(title)
        )
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <ShopClient products={products} categories={categories} />
      </div>
    </div>
  );
}
