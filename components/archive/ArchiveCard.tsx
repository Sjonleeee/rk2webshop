import Image from "next/image";
import Link from "next/link";
import { ArchiveImage } from "./types";

interface ArchiveCardProps {
  title: string;
  handle: string;
  image?: ArchiveImage;
  type?: string;
}

export default function ArchiveCard({
  title,
  handle,
  image,
}: ArchiveCardProps) {
  return (
    <Link href={`/product/${handle}`} className="absolute block">
      <div className="relative aspect-3/4 w-[220px] overflow-hidden">
        {image?.url && (
          <Image
            src={image.url}
            alt={image.altText ?? title}
            fill
            className="object-cover"
          />
        )}
      </div>
    </Link>
  );
}
