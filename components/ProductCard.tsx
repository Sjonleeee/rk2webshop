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
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl!}
            alt={image.altText || product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain transition-transform duration-200 group-hover:-translate-y-1"
          />
        </div>
      )}
    </Link>
  );
}
