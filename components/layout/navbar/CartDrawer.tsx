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
        className={`fixed inset-0 bg-black/40 z-9998 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-[#F6F7FB] z-9999 flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-lg font-semibold">
            Your selection ({lines.length})
          </h2>
          <button onClick={onClose}>
            <HiX className="text-2xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {lines.length === 0 ? (
            <CartEmptyState />
          ) : (
            lines.map((line) => (
              <CartItem key={line.node.id} line={line} />
            ))
          )}
        </div>

        <div className="px-6 py-6 shadow-[0_-1px_6px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between font-medium mb-4">
            <span>Subtotal</span>
            <span>€ {subtotal}</span>
          </div>

          <button
            className="w-full bg-black text-white py-4 disabled:opacity-40"
            disabled={lines.length === 0}
          >
            CHECK OUT
          </button>
        </div>
      </aside>
    </>
  );
}
