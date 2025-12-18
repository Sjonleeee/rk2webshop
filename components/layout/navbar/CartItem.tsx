"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/providers/CartContext";
import { ShopifyCartLine } from "@/components/providers/CartContext";

interface Props {
  line: ShopifyCartLine;
}

export default function CartItem({ line }: Props) {
  const { removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const product = line.node.merchandise.product;
  const options = line.node.merchandise.selectedOptions ?? [];
  const size = options.find((o) => o.name === "Size")?.value;

  const price = parseFloat(
    line.node.merchandise.priceV2?.amount ?? "0"
  );
  const lineTotal = (price * line.node.quantity).toFixed(2);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart(line.node.id);
    }, 300); // Match transition duration
  };

  return (
    <div
      className={`flex gap-4 transition-opacity duration-300 ${
        isRemoving ? "opacity-0" : "opacity-100"
      }`}
    >
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
          <div className="text-[11px] text-gray-500 mt-1">
            Size: {size}
          </div>
        )}

        <div className="text-[11px] mt-1">
          Qty: {line.node.quantity}
        </div>

        <button
          onClick={handleRemove}
          className="mt-2 text-[11px] underline text-gray-500"
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
