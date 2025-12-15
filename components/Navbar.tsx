"use client";
import Link from "next/link";
import Image from "next/image";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { VscAccount } from "react-icons/vsc";
import { LuSearch } from "react-icons/lu";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center px-8 py-4 bg-[#F6F7FB]/60 backdrop-blur-xl shadow-sm min-h-16">
      {/* Links: nav */}
      <ul className="flex items-center space-x-6 flex-1 justify-start">
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
    </nav>
  );
}
