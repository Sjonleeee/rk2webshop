import Image from "next/image";
import Link from "next/link";
import { ArchiveImage } from "./types";

interface ArchiveCardProps {
  title: string;
  handle: string;
  image?: ArchiveImage;
  size?: "sm" | "md" | "lg";
}

/* Palmer-style size ratios */
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
  return (
    <Link href={`/product/${handle}`} className="block">
      <div className={`relative ${SIZE_MAP[size]}`}>
        {image?.url && (
          <Image
            src={image.url}
            alt={image.altText ?? title}
            width={800}
            height={1200}
            priority={size === "lg"}
            className="
              w-full
              h-auto
              object-contain
              select-none
            "
          />
        )}
      </div>
    </Link>
  );
}
