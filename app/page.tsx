import { storefront } from "../lib/shopify";
import { GET_PRODUCTS_QUERY } from "../lib/queries";
import Image from "next/image";
import Link from "next/link";

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
    <div className="min-h-screen bg-(--background)">
      <h1 className="text-3xl font-bold mb-6 p-8 max-w-7xl mx-auto">
        Test showcasing products
      </h1>

      <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(({ node }: ProductEdge) => {
          const image = node.images.edges[0]?.node;

          // Extract unique sizes that are in stock
          const sizes = Array.from(
            new Set(
              node.variants.edges
                .map(({ node: v }) => {
                  const sizeOption = v.selectedOptions?.find(
                    (opt) => opt.name.toLowerCase() === "size"
                  );
                  return sizeOption && v.quantityAvailable > 0
                    ? sizeOption.value
                    : null;
                })
                .filter(Boolean)
            )
          );

          const isOutOfStock = sizes.length === 0;

          return (
            <Link
              key={node.id}
              href={`/product/${node.handle}`}
              className="group overflow-hidden  "
            >
              {image && (
                <div className="relative w-full h-64">
                  <Image
                    src={image.url}
                    alt={image.altText || node.title}
                    fill
                    priority={false}
                    sizes="(max-width: 640px) 100vw,
                           (max-width: 1024px) 50vw,
                           33vw"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-bold mb-1">{node.title}</h2>

                {isOutOfStock ? (
                  <p className="text-sm text-red-600">Out of stock</p>
                ) : (
                  <p className="text-sm text-gray-600">{sizes.join(", ")}</p>
                )}
              </div>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
