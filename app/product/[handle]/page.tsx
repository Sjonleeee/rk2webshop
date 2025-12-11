import Image from "next/image";
import { storefront } from "@/lib/shopify";
import { PRODUCT_QUERY } from "@/lib/queries";

interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductNode {
  id: string;
  title: string;
  description: string | null;
  images: {
    edges: { node: ProductImage }[];
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  if (!handle) {
    return <div className="p-10 text-red-600">Product not found</div>;
  }

  // FETCH
  const data = await storefront(PRODUCT_QUERY, { handle }, { revalidate: 60 });
  const product = data.productByHandle as ProductNode | null;

  if (!product) {
    return <div className="p-10 text-red-600">Product not found</div>;
  }

  const image = product.images.edges[0]?.node;

  return (
    <div className="max-w-3xl mx-auto p-10">
      {/* Product image */}
      {image && (
        <div className="w-full h-96 relative mb-6 flex items-center justify-center">
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Product title */}
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      {/* Product description */}
      <p className="text-gray-700 leading-relaxed">
        {product.description || "No description available"}
      </p>
    </div>
  );
}
