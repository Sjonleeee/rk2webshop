export const metadata = {
  title: "Product | R/K2 Webshop",
  description:
    "Bekijk productdetails, afbeeldingen, prijs en voorraad van dit R/K2 Webshop product.",
};
import Image from "next/image";
import { storefront } from "@/lib/shopify";
import { PRODUCT_QUERY } from "@/lib/queries";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductVariant {
  id: string;
  title: string;
  quantityAvailable: number;
  price: {
    amount: string;
    currencyCode: string;
  };
}

interface ProductNode {
  id: string;
  title: string;
  description: string | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: { node: ProductVariant }[];
  };
  images: {
    edges: { node: ProductImage }[];
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  if (!handle) {
    return <div className="p-10 text-red-600">Product not found</div>;
  }

  const data = await storefront(PRODUCT_QUERY, { handle }, { revalidate: 60 });
  const product = data.productByHandle as ProductNode | null;

  if (!product) {
    return <div className="p-10 text-red-600">Product not found</div>;
  }

  const image = product.images.edges[0]?.node;
  const variants = product.variants.edges.map((edge) => edge.node);
  const price = product.priceRange.minVariantPrice;

  // Stap 2: Productgegevens klaarzetten voor Add to Cart
  const productForCart = {
    id: product.id,
    title: product.title,
    price: price.amount,
    currency: price.currencyCode,
    image: image?.url || null,
    variantId: variants[0]?.id || null, // default eerste variant
  };



  return (
    <div className="max-w-7xl mx-auto p-10">
      <div className="flex gap-12">
        {/* Left: Title and Description */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 leading-relaxed mb-8">
            {product.description || "No description available"}
          </p>
        </div>

        {/* Middle: Product image */}
        <div className="flex-1">
          <div className="w-full aspect-square relative mb-6 flex items-center justify-center rounded-lg">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <span>No image</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Price and Sizing (3 columns) */}
        <div className="flex-1">
          <div className="p-8 rounded-lg">
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-2">Price</p>
              <p className="text-3xl font-bold">
                {price.currencyCode} {price.amount}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-4">Available Sizes</p>
              {variants.every((v) => v.quantityAvailable === 0) ? (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      disabled={variant.quantityAvailable === 0}
                      className={`border-2 rounded-lg py-0.5 px-1 text-center transition ${
                        variant.quantityAvailable === 0
                          ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      <p className="text-xs font-medium">{variant.title}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stap 1: Add to Cart knop */}
            <AddToCartButton product={productForCart} />
          </div>
        </div>
      </div>
    </div>
  );
}
