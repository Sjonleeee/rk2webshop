"use client";

import Image from "next/image";
import { useCart } from "@/components/providers/CartContext";
import { ShopifyCartLine } from "@/components/providers/CartContext";

interface Props {
  line: ShopifyCartLine;
}

export default function CartItem({ line }: Props) {
  const { removeFromCart } = useCart();

  const product = line.node.merchandise.product;
  const options = line.node.merchandise.selectedOptions ?? [];
  const size = options.find((o) => o.name === "Size")?.value;

  const price = parseFloat(
    line.node.merchandise.priceV2?.amount ?? "0"
  );
  const lineTotal = (price * line.node.quantity).toFixed(2);

  return (
    <div className="flex gap-4">
      {product.featuredImage?.url && (
        <Image
          src={product.featuredImage.url}
          alt={product.title}
          width={120}
          height={90}
        />
      )}

      <div className="flex-1">
        <div className="font-medium">{product.title}</div>

        {size && (
          <div className="text-sm text-gray-500 mt-1">
            Size: {size}
          </div>
        )}

        <div className="text-sm mt-1">
          Qty: {line.node.quantity}
        </div>

        <button
          onClick={() => removeFromCart(line.node.id)}
          className="mt-3 text-sm underline text-gray-600"
        >
          Remove
        </button>
      </div>

      <div className="font-medium text-right">
        € {lineTotal}
      </div>
    </div>
  );
}
