"use client";

import Link from "next/link";
import Image from "next/image";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { useCart } from "./CartContext";
import { VscAccount } from "react-icons/vsc";
import { LuSearch } from "react-icons/lu";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

// Banner boven navbar
function FreeShippingBanner() {
  return (
    <div className="w-full bg-[#262963] text-white text-center py-2 text-[10px] tracking-wide">
      ABOVE 100 EURO FREE SHIPPING
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();
  // Blokkeer scrollen als menu open is
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Mobile menu overlay: altijd bovenaan in de DOM */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-'9999' bg-[#F6F7FB] flex flex-col sm:hidden transition-all"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="flex-1 flex flex-col p-8 gap-8 justify-center items-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-3xl"
              aria-label="Sluit menu"
              onClick={() => setMenuOpen(false)}
            >
              <HiX />
            </button>
            <Link
              href="/shop"
              className="text-gray-700 text-2xl"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-gray-700 text-2xl "
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 text-2xl "
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
      <FreeShippingBanner />
      <nav className="sticky top-0 z-50 flex items-center px-4 sm:px-8 py-4 bg-[#F6F7FB]/60 backdrop-blur-xl shadow-sm min-h-16">
        {/* Hamburger menu button (mobile) */}
        <button
          className="sm:hidden text-2xl text-gray-700 mr-2"
          aria-label={menuOpen ? "Sluit menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
        {/* Links: nav (desktop) */}
        <ul className="hidden sm:flex items-center space-x-6 flex-1 justify-start">
          <li>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Contact
            </Link>
          </li>
        </ul>
        {/* Center logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/">
            <Image
              src="/rk2.png"
              alt="R/K2 Logo"
              width={800}
              height={100}
              className="h-45 w-auto select-none"
              priority
            />
          </Link>
        </div>
        {/* Rechts: icons */}
        <div className="flex items-center space-x-6 flex-1 justify-end relative">
          <button aria-label="Zoeken" className="text-xl text-gray-700">
            <LuSearch />
          </button>
          <div className="relative">
            <button
              aria-label="Winkelmandje"
              className="text-xl text-gray-700 transition-colors relative"
              onClick={() => setCartOpen((v) => !v)}
            >
              <LiaShoppingBagSolid />
              {cart && cart.lines && cart.lines.edges.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {cart.lines.edges.reduce(
                    (sum: number, edge: { node: { quantity: number } }) =>
                      sum + edge.node.quantity,
                    0
                  )}
                </span>
              )}
            </button>
            {/* Cart dropdown */}
            {cartOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50 p-4 border">
                <h3 className="font-bold mb-2">Winkelmandje</h3>
                {!cart || !cart.lines || cart.lines.edges.length === 0 ? (
                  <p className="text-gray-500 text-sm">Je mandje is leeg.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {cart.lines.edges.map(
                      (edge: import("./CartContext").ShopifyCartLine) => {
                        const variant = edge.node.merchandise;
                        const product = variant.product;
                        return (
                          <li
                            key={edge.node.id}
                            className="py-2 flex items-center gap-2"
                          >
                            {product.featuredImage?.url && (
                              <Image
                                src={product.featuredImage.url}
                                alt={product.title}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {product.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {variant.title} &times; {edge.node.quantity}
                              </div>
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
          <button aria-label="Account" className="text-xl text-gray-700 ">
            <VscAccount />
          </button>
        </div>
        {/* Mobile menu overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-50 bg-[#F6F7FB] flex flex-col sm:hidden transition-all"
            style={{ backgroundColor: "#F6F7FB" }}
            onClick={() => setMenuOpen(false)}
          >
            <div
              className="flex-1 flex flex-col p-8 gap-8 justify-center items-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-3xl"
                aria-label="Sluit menu"
                onClick={() => setMenuOpen(false)}
              >
                <HiX />
              </button>
              <Link
                href="/shop"
                className="text-gray-700 text-2xl font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="text-gray-700 text-2xl font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 text-2xl font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
