"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  handle: string;
  title: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const image = product.images.edges[0]?.node;

  return (
    <div
      onClick={() => router.push(`/product/${product.handle}`)}
      className="cursor-pointer border rounded-lg hover:shadow-lg transition"
    >
      {image && (
        <Image
          src={image.url}
          alt={image.altText || product.title}
          width={500}
          height={500}
          className="w-full h-64 object-cover"
        />
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold">{product.title}</h2>
      </div>
    </div>
  );
}
