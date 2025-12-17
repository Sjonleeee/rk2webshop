"use client";

import { LiaShoppingBagSolid } from "react-icons/lia";

interface Props {
  quantity: number;
  onClick: () => void;
}

export default function CartButton({ quantity, onClick }: Props) {
  return (
    <button className="relative text-xl" onClick={onClick}>
      <LiaShoppingBagSolid />
      {quantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1.5">
          {quantity}
        </span>
      )}
    </button>
  );
}
