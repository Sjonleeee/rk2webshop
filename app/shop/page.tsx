import { storefront } from "../../lib/shopify";
import { GET_PRODUCTS_QUERY } from "../../lib/queries";
import ProductGrid from "../../components/ProductGrid";

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

// Collection types niet meer nodig

// getCollections niet meer nodig

// Fetch the first 12 products
async function getProducts(): Promise<ProductEdge[]> {
  const data = await storefront(GET_PRODUCTS_QUERY, {}, { revalidate: 60 });
  return data.products.edges;
}

export default async function ShopPage() {
  const products = await getProducts();
  console.log('products', products);

  // Haal categorieën uit products (productType)
  const categories = Array.from(
    new Set(
      products
        .map(({ node }: { node: ProductNode }) => node.productType)
        .filter((title: string) =>
          title && !['Home page', 'Automated Collection', 'Hydrogen'].includes(title)
        )
    )
  );
  console.log('categories', categories);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-4">
            {categories.map((category: string) => (
              <a
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className="bg-primary px-4 py-2 rounded hover:bg-secondary transition-colors"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-12 text-center">All Products</h1>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
