"use client";

import Image from "next/image";
import { LuSearch } from "react-icons/lu";
import { VscAccount } from "react-icons/vsc";
import { useState, useEffect } from "react";
import { useCart } from "../CartContext";

import FreeShippingBanner from "./FreeShippingBanner";
import NavLinks from "./NavLinks";
import CartButton from "./CartButton";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  const lines = cart?.lines?.edges ?? [];

  const totalQty = lines.reduce(
    (sum, edge) => sum + edge.node.quantity,
    0
  );

  const subtotal = lines
    .reduce((sum, edge) => {
      const price = parseFloat(
        edge.node.merchandise.priceV2?.amount ?? "0"
      );
      return sum + price * edge.node.quantity;
    }, 0)
    .toFixed(2);

  return (
    <>
      <FreeShippingBanner />

      <nav className="sticky top-0 z-50 flex items-center px-4 sm:px-8 py-4 bg-[#F6F7FB]/60 backdrop-blur-xl shadow-sm">
        <NavLinks
          menuOpen={menuOpen}
          onToggle={() => setMenuOpen((v) => !v)}
        />

        <div className="absolute left-1/2 -translate-x-1/2">
          <Image
            src="/rk2.png"
            alt="R/K2"
            width={800}
            height={100}
            className="h-40 w-auto"
          />
        </div>

        <div className="flex items-center gap-6 flex-1 justify-end">
          <LuSearch className="text-xl" />
          <CartButton
            quantity={totalQty}
            onClick={() => setCartOpen(true)}
          />
          <VscAccount className="text-xl" />
        </div>
      </nav>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        lines={lines}
        subtotal={subtotal}
      />
    </>
  );
}
