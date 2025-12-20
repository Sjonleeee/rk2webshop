"use client";

import Image from "next/image";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { VscAccount } from "react-icons/vsc";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/providers/CartContext";

import FreeShippingBanner from "./FreeShippingBanner";
import NavLinks from "./NavLinks";
import CartButton from "./CartButton";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<{
    label: string;
    items: { label: string; href: string }[];
  } | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { cart } = useCart();

  // Reset dropdown when navigating to a new page
  useEffect(() => {
    // Clear timeout and reset dropdown state on navigation
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    // Use setTimeout to avoid cascading renders
    const timeoutId = setTimeout(() => {
      setDropdownOpen(null);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        dropdownOpen &&
        !target.closest("[data-dropdown-trigger]") &&
        !target.closest("[data-dropdown-content]")
      ) {
        setDropdownOpen(null);
        if (dropdownTimeoutRef.current) {
          clearTimeout(dropdownTimeoutRef.current);
          dropdownTimeoutRef.current = null;
        }
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

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

      <div className="sticky top-0 z-50">
        <nav
          ref={navbarRef}
          className="flex h-14 sm:h-14 md:h-16 items-center px-4 sm:px-8 bg-[#F6F7FB]/60 backdrop-blur-xl shadow-sm"
        >
          {/* LEFT */}
          <NavLinks
            menuOpen={menuOpen}
            onToggle={() => setMenuOpen((v) => !v)}
            onDropdownOpenChange={(isOpen, label, items) => {
              // Clear any existing timeout immediately
              if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current);
                dropdownTimeoutRef.current = null;
              }

              if (isOpen) {
                // Always open immediately when hovered - no delay
                setDropdownOpen({ label, items });
              } else {
                // Only start closing delay if not moving to dropdown content
                // The delay allows mouse to move from trigger to content
                dropdownTimeoutRef.current = setTimeout(() => {
                  // Double check before closing
                  const trigger = document.querySelector(
                    "[data-dropdown-trigger]:hover"
                  );
                  const content = document.querySelector(
                    "[data-dropdown-content]:hover"
                  );
                  if (!trigger && !content) {
                    setDropdownOpen(null);
                  }
                }, 200);
              }
            }}
          />

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
          <div className="flex items-center gap-8 flex-1 justify-end">
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

        {/* Dropdown overlay - part of navbar, goes over content */}
        {dropdownOpen && (
          <div
            className="absolute left-0 right-0 bg-[#F6F7FB]/60 backdrop-blur-xl shadow-xl border-t-[0.5px] border-foreground/10 z-40"
            data-dropdown-content
            onMouseEnter={() => {
              // Keep dropdown open when hovering over content
              // Clear any timeout that might close it
              if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current);
                dropdownTimeoutRef.current = null;
              }
            }}
            onMouseLeave={(e) => {
              // Check if mouse is moving to another dropdown trigger
              const relatedTarget = e.relatedTarget as HTMLElement;
              const isMovingToTrigger = relatedTarget?.closest(
                "[data-dropdown-trigger]"
              );

              if (!isMovingToTrigger) {
                // Add delay before closing to allow mouse to move back to trigger
                dropdownTimeoutRef.current = setTimeout(() => {
                  // Double check that mouse is not over trigger or content
                  const trigger = document.querySelector(
                    "[data-dropdown-trigger]:hover"
                  );
                  const content = document.querySelector(
                    "[data-dropdown-content]:hover"
                  );
                  if (!trigger && !content) {
                    setDropdownOpen(null);
                  }
                }, 200);
              } else {
                // Clear any existing timeout if moving to trigger
                if (dropdownTimeoutRef.current) {
                  clearTimeout(dropdownTimeoutRef.current);
                  dropdownTimeoutRef.current = null;
                }
              }
            }}
          >
            <div className="max-w-10xl mx-auto px-8 py-8">
              <div className="grid grid-cols-2">
                {/* Left column - Customer Support */}
                <div>
                  <ul className="space-y-0">
                    {dropdownOpen.label === "More" && (
                      <>
                        <li>
                          <div className="text-xs py-[2px] leading-tight font-medium text-foreground/60 uppercase mb-2">
                            Customer Support
                          </div>
                        </li>
                        <li>
                          <Link
                            href="/contact"
                            className="block text-xs py-[2px] leading-tight hover:text-[#1c2de7] transition-colors"
                            onClick={() => setDropdownOpen(null)}
                          >
                            Contact Us
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/shipping"
                            className="block text-xs py-[2px] leading-tight hover:text-[#1c2de7] transition-colors"
                            onClick={() => setDropdownOpen(null)}
                          >
                            Shipping
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/returns"
                            className="block text-xs py-[2px] leading-tight hover:text-[#1c2de7] transition-colors"
                            onClick={() => setDropdownOpen(null)}
                          >
                            Returns
                          </Link>
                        </li>
                      </>
                    )}
                    {dropdownOpen.label !== "More" &&
                      dropdownOpen.items.map((item, index) => (
                        <li key={index}>
                          <Link
                            href={item.href}
                            className="block text-xs py-[2px] leading-tight hover:text-[#1c2de7] transition-colors"
                            onClick={() => setDropdownOpen(null)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Right column - Links */}
                {dropdownOpen.label === "More" && (
                  <div>
                    <ul className="space-y-0">
                      <li>
                        <div className="text-xs py-[2px] leading-tight font-medium text-foreground/60 uppercase mb-2">
                          Links
                        </div>
                      </li>
                      <li>
                        <Link
                          href="https://www.instagram.com/rk2.archives/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs py-[2px] leading-tight hover:text-[#1c2de7] transition-colors"
                          onClick={() => setDropdownOpen(null)}
                        >
                          Instagram
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://youtube.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs py-[2px] leading-tight hover:text-[#1c2de7] transition-colors"
                          onClick={() => setDropdownOpen(null)}
                        >
                          YouTube
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://tiktok.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs py-[2px] leading-tight hover:text-[#1c2de7] transition-colors"
                          onClick={() => setDropdownOpen(null)}
                        >
                          TikTok
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        lines={lines}
        subtotal={subtotal}
      />
    </>
  );
}
