"use client";

import { HiX } from "react-icons/hi";
import CartItem from "./CartItem";
import CartEmptyState from "./CartEmptyState";
import { ShopifyCartLine } from "@/components/providers/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
  lines: ShopifyCartLine[];
  subtotal: string;
}

export default function CartDrawer({ open, onClose, lines, subtotal }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-drawer-backdrop ${open ? "" : "hidden"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer ${open ? "open" : "hidden"}`}
      >
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">
            Your selection ({lines.length})
          </h2>
          <button onClick={onClose} className="cart-drawer-close">
            <HiX className="cart-drawer-close-icon" />
          </button>
        </div>

        <div className="cart-drawer-content">
          {lines.length === 0 ? (
            <CartEmptyState />
          ) : (
            lines.map((line) => (
              <CartItem key={line.node.id} line={line} />
            ))
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-drawer-subtotal">
            <span>Subtotal</span>
            <span>€ {subtotal}</span>
          </div>

          <button
            className="cart-drawer-checkout-button"
            disabled={lines.length === 0}
          >
            CHECK OUT
          </button>
        </div>
      </aside>
    </>
  );
}
