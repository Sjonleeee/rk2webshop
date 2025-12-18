"use client";

import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

interface Props {
  menuOpen: boolean;
  onToggle: () => void;
}

export default function NavLinks({ menuOpen, onToggle }: Props) {
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="sm:hidden text-2xl mr-2"
        onClick={onToggle}
        aria-label="Toggle menu"
      >
        {menuOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Desktop nav */}
      <ul className="hidden sm:flex gap-6 flex-1">
        <li><Link href="/shop">Shop</Link></li>
        <li><Link href="/about">About us</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </>
  );
}
