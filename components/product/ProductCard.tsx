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
  // Shopify image optimalisatie: vraag kleinere afbeelding op
  const imageUrl = image
    ? `${image.url}${image.url.includes("?") ? "&" : "?"}width=600`
    : undefined;

  return (
    <Link
      href={`/product/${product.handle}`}
      aria-label={`Bekijk product ${product.title}`}
      className="group"
    >
      {image && (
        <div
          className="relative w-full aspect-square overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105 "
          style={{ minHeight: 0, minWidth: 0 }}
        >
          <Image
            src={imageUrl!}
            alt={image.altText || product.title}
            width={400}
            height={400}
            className="object-cover w-full h-full max-w-[230px] max-h-[210px] mx-auto transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2 "
            priority={false}
          />
        </div>
      )}
    </Link>
  );
}
