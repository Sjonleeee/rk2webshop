import { storefront } from "../lib/shopify";
import { GET_PRODUCTS_QUERY } from "../lib/queries";
import ProductCard from "../components/ProductCard";
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

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-12 text-center">
          Test showcasing products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(({ node }: ProductEdge) => (
            <ProductCard key={node.id} product={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
