"use client";

import { HiX } from "react-icons/hi";
import { useState } from "react";
import CartItem from "./CartItem";
import CartEmptyState from "./CartEmptyState";
import { ShopifyCartLine } from "@/components/providers/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
  lines: ShopifyCartLine[];
  subtotal: string;
  checkoutUrl?: string;
}

export default function CartDrawer({
  open,
  onClose,
  lines,
  subtotal,
  checkoutUrl,
}: Props) {
  const [redirecting, setRedirecting] = useState(false);

  const handleCheckout = () => {
    if (!checkoutUrl) return;

    setRedirecting(true);
    onClose();

    // 🔥 Shopify OFFICIAL checkout redirect
    window.location.href = checkoutUrl;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-drawer-backdrop ${open ? "" : "hidden"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`cart-drawer ${open ? "open" : "hidden"}`}>
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Your selection ({lines.length})</h2>
          <button onClick={onClose} className="cart-drawer-close">
            <HiX className="cart-drawer-close-icon" />
          </button>
        </div>

        <div className="cart-drawer-content">
          {lines.length === 0 ? (
            <CartEmptyState />
          ) : (
            lines.map((line) => <CartItem key={line.node.id} line={line} />)
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-drawer-subtotal">
            <span>Subtotal</span>
            <span>€ {subtotal}</span>
          </div>

          <button
            className="cart-drawer-checkout-button"
            disabled={lines.length === 0 || !checkoutUrl || redirecting}
            onClick={handleCheckout}
          >
            {redirecting ? "REDIRECTING..." : "CHECK OUT"}
          </button>
        </div>
      </aside>
    </>
  );
}
