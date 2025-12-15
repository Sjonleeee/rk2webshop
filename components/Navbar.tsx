"use client";

import Link from "next/link";
import Image from "next/image";
import { LiaShoppingBagSolid } from "react-icons/lia";
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
          className="fixed inset-0 z-[9999] bg-[#F6F7FB] flex flex-col sm:hidden transition-all"
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
        <div className="flex items-center space-x-6 flex-1 justify-end">
          <button aria-label="Zoeken" className="text-xl text-gray-700">
            <LuSearch />
          </button>
          <button
            aria-label="Winkelmandje"
            className="text-xl text-gray-700 transition-colors"
          >
            <LiaShoppingBagSolid />
          </button>
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
