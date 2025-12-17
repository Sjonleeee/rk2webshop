"use client";

interface Props {
  quantity: number;
  onClick: () => void;
}

export default function CartButton({ quantity, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="relative  tracking-wide"
    >
      bag
      {quantity > 0 && (
        <span className="absolute -top-1 -right-2 text-[10px] text-[#1c2de7]">
          {quantity}
        </span>
      )}
    </button>
  );
}
