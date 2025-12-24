"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import NavDropdown from "./NavDropdown";

interface Props {
  menuOpen: boolean;
  onToggle: () => void;
  onDropdownOpenChange?: (isOpen: boolean, label: string, items: { label: string; href: string }[]) => void;
}

export default function NavLinks({ menuOpen, onToggle, onDropdownOpenChange }: Props) {
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
            className={`nav-link nav-link-hover text-xs transition-opacity ${isActive("/shop") ? "nav-link-active" : ""}`}
          >
            Shop all
          </Link>
        </li>
        <li>
          <Link 
            href="/about" 
            className={`nav-link nav-link-hover text-xs transition-opacity ${isActive("/about") ? "nav-link-active" : ""}`}
          >
            About us
          </Link>
        </li>
        <li>
          <Link 
            href="/collaborations" 
            className={`nav-link nav-link-hover text-xs transition-opacity ${isActive("/collaborations") ? "nav-link-active" : ""}`}
          >
            Collaborations
          </Link>
        </li>
        <li>
          <NavDropdown
            label="More"
            items={[
              { label: "Customer Support", href: "/" },
              { label: "Contact Us", href: "/contact" },
              { label: "Shipping", href: "/shipping" },
              { label: "Returns", href: "/returns" },
              { label: "Links", href: "/" },
              { label: "About", href: "/about" },
              { label: "Instagram", href: "https://instagram.com" },
              { label: "YouTube", href: "https://youtube.com" },
              { label: "TikTok", href: "https://tiktok.com" },
            ]}
            onOpenChange={(isOpen) => onDropdownOpenChange?.(isOpen, "More", [
              { label: "Customer Support", href: "/" },
              { label: "Contact Us", href: "/contact" },
              { label: "Shipping", href: "/shipping" },
              { label: "Returns", href: "/returns" },
              { label: "Links", href: "/" },
              { label: "About", href: "/about" },
              { label: "Instagram", href: "https://instagram.com" },
              { label: "YouTube", href: "https://youtube.com" },
              { label: "TikTok", href: "https://tiktok.com" },
            ])}
          />
        </li>
      </ul>
    </>
  );
}
