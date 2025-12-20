"use client";

interface Props {
  quantity: number;
  onClick: () => void;
}

export default function CartButton({ quantity, onClick }: Props) {
  return (
    <button onClick={onClick} className="cart-button">
      <span id="cart-bag-target" className="relative inline-block">
        bag
        {quantity > 0 && (
          <span className="cart-button-badge">
            {quantity}
          </span>
        )}
      </span>
    </button>
  );
}
