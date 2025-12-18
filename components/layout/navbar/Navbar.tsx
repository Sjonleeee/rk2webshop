"use client";

import Image from "next/image";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { VscAccount } from "react-icons/vsc";
import { useState, useEffect } from "react";
import { useCart } from "@/components/providers/CartContext";

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

  const totalQty = lines.reduce((sum, edge) => sum + edge.node.quantity, 0);

  const subtotal = lines
    .reduce((sum, edge) => {
      const price = parseFloat(edge.node.merchandise.priceV2?.amount ?? "0");
      return sum + price * edge.node.quantity;
    }, 0)
    .toFixed(2);

  return (
    <>
      <FreeShippingBanner />

      <nav className="sticky top-0 z-50 flex h-14 sm:h-14 md:h-16 items-center px-4 sm:px-8 bg-[#F6F7FB]/60 backdrop-blur-xl shadow-sm">
        {/* LEFT */}
        <NavLinks menuOpen={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />

        {/* CENTER LOGO */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center">
          <Link href="/" aria-label="Go to homepage">
            <Image
              src="/logos/rk2logo.png"
              alt="R/K2"
              width={200}
              height={20}
              className="h-6 sm:h-5 md:h-6 w-auto"
              priority
            />
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6 flex-1 justify-end">
          <LuSearch className="text-[16px] opacity-70 hover:opacity-100 transition-opacity" />
          <CartButton quantity={totalQty} onClick={() => setCartOpen(true)} />
          <Link
            href="https://shopify.com/97401700734/account"
            aria-label="My account (Shopify)"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <VscAccount className="text-[16px]" />
          </Link>
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
