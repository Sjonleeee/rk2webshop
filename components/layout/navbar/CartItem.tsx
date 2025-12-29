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
  const size =
    options.find((o) => o.name.toLowerCase() === "size")?.value ||
    options.find((o) => o.name === "Size")?.value;

  const lineTotal = line.node.cost?.totalAmount?.amount
    ? parseFloat(line.node.cost.totalAmount.amount).toFixed(2)
    : (
        parseFloat(line.node.merchandise.priceV2?.amount ?? "0") *
        line.node.quantity
      ).toFixed(2);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart(line.node.id);
    }, 300);
  };

  return (
    <div
      className={`flex gap-4 transition-opacity duration-300 ${
        isRemoving ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* IMAGE */}
      {product.featuredImage?.url && (
        <div className="relative w-[80px] aspect-3/4 shrink-0">
          <Image
            src={product.featuredImage.url}
            alt={product.title}
            fill
            className="object-contain"
            sizes="80px"
          />
        </div>
      )}

      {/* INFO */}
      <div className="flex-1">
        <div className="font-medium text-sm">{product.title}</div>

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
          className="mt-2 text-[11px] underline text-gray-500 hover:text-[hsl(var(--rk2-color-accent))]"
        >
          Remove
        </button>
      </div>

      {/* PRICE */}
      <div className="font-medium text-right text-sm whitespace-nowrap">
        € {lineTotal}
      </div>
    </div>
  );
}
