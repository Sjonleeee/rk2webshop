import Image from "next/image";
import { storefront } from "../lib/shopify";
import { GET_PRODUCTS_QUERY } from "../lib/queries";

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
  const data = await storefront(GET_PRODUCTS_QUERY);
  return data.products.edges;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-6 p-8 max-w-7xl mx-auto">
        Test showcasing products
      </h1>
      <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(({ node }: ProductEdge) => {
          const image = node.images.edges[0]?.node;
          const variant = node.variants.edges[0]?.node;

          // Extract unique sizes from all variants
          const sizes = Array.from(
            new Set(
              node.variants.edges
                .map(
                  ({ node: v }: { node: ProductVariant }) =>
                    v.selectedOptions?.find(
                      (opt) => opt.name.toLowerCase() === "size"
                    )?.value
                )
                .filter(Boolean)
            )
          );

          return (
            <div
              key={node.id}
              className=" overflow-hidden  hover:-translate-y-1 transition-transform duration-200 cursor-pointer flex flex-col bg-background"
            >
              {image && (
                <Image
                  src={image.url}
                  alt={image.altText || node.title}
                  width={500}
                  height={500}
                  className="w-full h-64 object-cover"
                  priority={true}
                  quality={80}
                />
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold">{node.title}</h2>
                  {variant && (
                    <p className="mt-1 font-semibold">
                      {variant.priceV2.amount} {variant.priceV2.currencyCode}
                    </p>
                  )}
                  {sizes.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Sizes:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {sizes.map((size) => (
                          <span
                            key={size}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                  {node.description || "No description"}
                </p>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
