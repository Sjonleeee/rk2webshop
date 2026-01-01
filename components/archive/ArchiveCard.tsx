import Image from "next/image";
import Link from "next/link";
import { ArchiveImage } from "./types";

interface ArchiveCardProps {
  title: string;
  handle: string;
  image?: ArchiveImage;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_MAP = {
  sm: "w-[180px]",
  md: "w-[240px]",
  lg: "w-[320px]",
  xl: "w-[420px]",
};

export default function ArchiveCard({
  title,
  handle,
  image,
  size = "md",
}: ArchiveCardProps) {
  return (
    <Link href={`/product/${handle}`} className="block select-none">
      <div className={`${SIZE_MAP[size]} relative`}>
        {image?.url && (
          <Image
            src={image.url}
            alt={image.altText ?? title}
            width={600}
            height={900}
            className="w-full h-auto object-contain"
            priority={size === "xl"}
            draggable={false}
          />
        )}
      </div>
    </Link>
  );
}
