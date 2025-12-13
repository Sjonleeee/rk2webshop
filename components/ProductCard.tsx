import Image from "next/image";
import Link from "next/link";

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

interface ProductCardProps {
  product: ProductNode;
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images.edges[0]?.node;

  // Extract unique sizes that are in stock
  const sizes = Array.from(
    new Set(
      product.variants.edges
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
    <Link href={`/product/${product.handle}`}>
      {image && (
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            priority={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-center">
          {product.title}
        </h2>

        {isOutOfStock ? (
          <p className="text-sm font-medium text-red-600 text-center">Out of stock</p>
        ) : (
          <p className="text-sm text-gray-600 text-center">Sizes: {sizes.join(", ")}</p>
        )}
      </div>
    </Link>
  );
}
