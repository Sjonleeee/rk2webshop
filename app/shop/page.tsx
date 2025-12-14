export const metadata = {
  title: "Shop | R/K2 Webshop",
  description:
    "Bekijk en filter alle producten van R/K2 Webshop per categorie zoals shirts, hoodies, beanies en meer.",
};
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

// Fetch the first 12 products
async function getProducts(): Promise<ProductEdge[]> {
  const data = await storefront(GET_PRODUCTS_QUERY, {}, { revalidate: 60 });
  return data.products.edges;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Haal de category uit de URL via searchParams prop (object, async)
  const params = await searchParams;
  const categoryParam =
    typeof params.category === "string" ? params.category : "";

  const products = await getProducts();
  // Filter producten op categoryParam indien aanwezig
  const filteredProducts = categoryParam
    ? products.filter(
        ({ node }: { node: ProductNode }) => node.productType === categoryParam
      )
    : products;

  // Haal categorieën uit products (productType)
  const categories = Array.from(
    new Set(
      products
        .map(({ node }: { node: ProductNode }) => node.productType)
        .filter(
          (title: string) =>
            title &&
            !["Home page", "Automated Collection", "Hydrogen"].includes(title)
        )
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-56 min-w-[180px] max-w-xs">
          <h2 className="text-lg font-semibold mb-6">Categories</h2>
          <nav className="flex flex-col">
            <a
              key="all"
              href="/shop"
              className="text-sm px-2 py-1 rounded hover:bg-secondary transition-colors font-medium text-left"
            >
              All
            </a>
            {categories.map((category: string) => (
              <a
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className="text-sm px-2 py-1 rounded hover:bg-secondary transition-colors font-medium text-left"
              >
                {category}
              </a>
            ))}
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-1">
          <ProductGrid products={filteredProducts} />
        </main>
      </div>
    </div>
  );
}
