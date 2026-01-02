"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { ArchiveImage } from "./types";

interface ArchiveCardProps {
  title: string;
  handle: string;
  image?: ArchiveImage;
  size?: "sm" | "md" | "lg";
  isManualHover?: boolean;
  globalMousePos?: { x: number; y: number };
}

const SIZE_MAP = {
  sm: "w-[180px]",
  md: "w-[240px]",
  lg: "w-[320px]",
};

export default function ArchiveCard({
  title,
  handle,
  image,
  size = "md",
  isManualHover = false,
  globalMousePos,
}: ArchiveCardProps) {
  const labelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLAnchorElement>(null);

  /* --------------------------------------------
     Helpers
  --------------------------------------------- */
  function updateLabelPosition(x: number, y: number) {
    if (!labelRef.current) return;
    labelRef.current.style.transform = `
      translate3d(${x}px, ${y + 14}px, 0) translateX(-50%)
    `;
  }

  function showLabel() {
    if (!labelRef.current) return;
    labelRef.current.style.opacity = "1";
  }

  function hideLabel() {
    if (!labelRef.current) return;
    labelRef.current.style.opacity = "0";
  }

  /* --------------------------------------------
     Manual hover (from ArchiveSurface)
  --------------------------------------------- */
  useEffect(() => {
    if (isManualHover && globalMousePos && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = globalMousePos.x - rect.left;
      const y = globalMousePos.y - rect.top;

      updateLabelPosition(x, y);
      showLabel();
    } else {
      hideLabel();
    }
  }, [isManualHover, globalMousePos]);

  /* --------------------------------------------
     Native hover (only when not manual)
  --------------------------------------------- */
  function onMouseMove(e: React.MouseEvent) {
    if (isManualHover || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    updateLabelPosition(e.clientX - rect.left, e.clientY - rect.top);
  }

  return (
    <Link
      ref={containerRef}
      href={`/product/${handle}?from=archive`}
      className="group relative block"
      onMouseMove={onMouseMove}
      onMouseEnter={() => {
        if (!isManualHover) showLabel();
      }}
      onMouseLeave={() => {
        if (!isManualHover) hideLabel();
      }}
    >
      {/* Image */}
      <div className={`${SIZE_MAP[size]} relative`}>
        {image?.url && (
          <Image
            src={image.url}
            alt={image.altText ?? title}
            width={600}
            height={900}
            className="w-full h-auto object-contain pointer-events-none"
            priority={size === "lg"}
          />
        )}
      </div>

      {/* Cursor-follow label */}
      <div
        ref={labelRef}
        className="
          pointer-events-none
          absolute top-0 left-0
          z-100
          opacity-0
          transition-opacity duration-150 ease-out
        "
        style={{ transform: "translate3d(0,0,0) translateX(-50%)" }}
      >
        <div
          className="
          px-4 py-2
          text-[9px] font-medium
          text-[hsl(var(--rk2-color-accent))]
          shadow-lg
          backdrop-blur-md
          whitespace-nowrap
        "
        >
          ／ {title}
        </div>
      </div>
    </Link>
  );
}
