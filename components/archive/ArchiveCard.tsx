"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArchiveImage } from "./types";

interface ArchiveCardProps {
  title: string;
  handle: string;
  image?: ArchiveImage;
  size?: "sm" | "md" | "lg";
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
}: ArchiveCardProps) {
  const labelRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent) {
    if (!labelRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // label follows cursor — centered UNDER mouse
    labelRef.current.style.transform = `
      translate3d(${x}px, ${y + 14}px, 0)
      translateX(-50%)
    `;
  }

  function onMouseEnter() {
    if (!labelRef.current) return;
    labelRef.current.style.opacity = "1";
  }

  function onMouseLeave() {
    if (!labelRef.current) return;
    labelRef.current.style.opacity = "0";
  }

  return (
    <Link
      href={`/product/${handle}`}
      className="group relative block"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Product image */}
      <div className={`${SIZE_MAP[size]} relative`}>
        {image?.url && (
          <Image
            src={image.url}
            alt={image.altText ?? title}
            width={600}
            height={900}
            className="w-full h-auto object-contain"
            priority={size === "lg"}
          />
        )}
      </div>

      {/* Cursor-follow label */}
      <div
        ref={labelRef}
        className="
          pointer-events-none
          fixed top-0 left-0
          z-50
          opacity-0
          transition-opacity duration-200 ease-out
        "
        style={{
          transform: "translate3d(0,0,0) translateX(-50%)",
        }}
      >
        <div
          className="
            px-4 py-2
            text-[hsl(var(--rk2-color-accent))]
            text-[9px] font-medium
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
