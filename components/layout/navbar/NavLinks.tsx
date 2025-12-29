"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import NavDropdown from "./NavDropdown";

interface Props {
  menuOpen: boolean;
  onToggle: () => void;
  onDropdownOpenChange?: (
    isOpen: boolean,
    label: string,
    items: { label: string; href: string }[]
  ) => void;
}

export default function NavLinks({
  menuOpen,
  onToggle,
  onDropdownOpenChange,
}: Props) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/shop") {
      return pathname === "/shop" || pathname.startsWith("/product");
    }
    return pathname === path;
  };

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
      <ul className="hidden sm:flex gap-6 flex-1 items-center">
        <li>
          <Link
            href="/shop"
            className={`nav-link nav-link-hover text-xs ${
              isActive("/shop") ? "nav-link-active" : ""
            }`}
          >
            shop all
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className={`nav-link nav-link-hover text-xs ${
              isActive("/about") ? "nav-link-active" : ""
            }`}
          >
            about us
          </Link>
        </li>
        <li>
          <Link
            href="/archive"
            className={`nav-link nav-link-hover text-xs ${
              isActive("/archive") ? "nav-link-active" : ""
            }`}
          >
            archive
          </Link>
        </li>
        <li>
          <NavDropdown
            label="more"
            items={[
              { label: "Customer Support", href: "/" },
              { label: "Contact Us", href: "/contact" },
              { label: "Shipping & Returns", href: "/shipping" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Links", href: "/" },
              { label: "Instagram", href: "https://instagram.com" },
              { label: "YouTube", href: "https://youtube.com" },
              { label: "TikTok", href: "https://tiktok.com" },
            ]}
            onOpenChange={(isOpen) =>
              onDropdownOpenChange?.(isOpen, "More", [
                { label: "Customer Support", href: "/" },
                { label: "Contact Us", href: "/contact" },
                { label: "Shipping & Returns", href: "/shipping" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Links", href: "/" },
                { label: "Instagram", href: "https://instagram.com" },
                { label: "YouTube", href: "https://youtube.com" },
                { label: "TikTok", href: "https://tiktok.com" },
              ])
            }
          />
        </li>
      </ul>
    </>
  );
}
