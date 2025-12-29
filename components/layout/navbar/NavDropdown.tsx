"use client";

import { useState, useRef, useEffect } from "react";

interface NavDropdownProps {
  label: string;
  items: { label: string; href: string }[];
  onOpenChange?: (isOpen: boolean) => void;
}

export default function NavDropdown({
  label,
  items, 
  onOpenChange,
}: NavDropdownProps) {
  // Items are not used in this component - they're passed to parent via onOpenChange
  void items;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onOpenChange?.(isOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !target.closest("[data-dropdown-content]")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Check if mouse is moving to dropdown content
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest("[data-dropdown-content]")) {
      // Mouse is moving to dropdown content, keep it open
      // Clear any timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Don't close - let navbar handle it
      return;
    }

    // Mouse is leaving the trigger - notify parent to start closing delay
    // The parent will handle the actual closing with proper delay
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    // Always open on hover - clear any timeouts first
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Force open - always set to true, even if already open
    // This ensures the dropdown opens even if state was stuck
    setIsOpen(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      data-dropdown-trigger
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="text-xs hover:opacity-70 transition-opacity">
        {label}
      </button>

      {/* Dropdown content will be rendered in navbar */}
      {isOpen && <div ref={dropdownRef} className="hidden"></div>}
    </div>
  );
}
