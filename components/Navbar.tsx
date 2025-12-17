"use client";

import Link from "next/link";
import Image from "next/image";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { useCart } from "./CartContext";
import { VscAccount } from "react-icons/vsc";
import { LuSearch } from "react-icons/lu";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export function FreeShippingBanner() {
  return (
    <div className="w-full bg-[#262963] text-white text-center py-2 text-[10px] tracking-wide">
      ABOVE 100 EURO FREE SHIPPING
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, removeFromCart } = useCart();

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

      {/* ---------------- NAVBAR ---------------- */}
      <nav className="sticky top-0 z-50 flex items-center px-4 sm:px-8 py-4 bg-[#F6F7FB]/60 backdrop-blur-xl shadow-sm">
        <button
          className="sm:hidden text-2xl mr-2"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>

        <ul className="hidden sm:flex gap-6 flex-1">
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

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

          <button
            className="relative text-xl"
            onClick={() => setCartOpen(true)}
          >
            <LiaShoppingBagSolid />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1.5">
                {totalQty}
              </span>
            )}
          </button>

          <VscAccount className="text-xl" />
        </div>
      </nav>

      {/* ---------------- CART DRAWER ---------------- */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-9998"
            onClick={() => setCartOpen(false)}
          />

          <aside className="fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-white z-9999 flex flex-col">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-lg font-semibold">
                Your selection ({lines.length})
              </h2>
              <button onClick={() => setCartOpen(false)}>
                <HiX className="text-2xl" />
              </button>
            </div>

            {/* ---------- CONTENT ---------- */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                  <p className="text-base font-medium">Your cart is empty</p>
                  <p className="text-sm mt-1">Add items to get started.</p>
                </div>
              ) : (
                lines.map((edge) => {
                  const product = edge.node.merchandise.product;
                  const options = edge.node.merchandise.selectedOptions || [];
                  const size = options.find((o) => o.name === "Size")?.value;

                  const price = parseFloat(
                    edge.node.merchandise.priceV2?.amount ?? "0"
                  );
                  const lineTotal = (price * edge.node.quantity).toFixed(2);

                  return (
                    <div key={edge.node.id} className="flex gap-4">
                      {product.featuredImage?.url && (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.title}
                          width={120}
                          height={90}
                        />
                      )}

                      <div className="flex-1">
                        <div className="font-medium">{product.title}</div>

                        {size && (
                          <div className="text-sm text-gray-500 mt-1">
                            Size: {size}
                          </div>
                        )}

                        <div className="text-sm mt-1">
                          Qty: {edge.node.quantity}
                        </div>

                        <button
                          onClick={() => removeFromCart(edge.node.id)}
                          className="mt-3 text-sm underline text-gray-600"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="font-medium text-right">
                        € {lineTotal}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ---------- FOOTER ---------- */}
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
      )}
    </>
  );
}
