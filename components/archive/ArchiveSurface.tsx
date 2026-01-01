"use client";

import { useRef } from "react";
import ArchiveCard from "./ArchiveCard";
import { ArchiveProduct } from "./types";

interface Props {
  items: ArchiveProduct[];
}

const SIZES: ("sm" | "md" | "lg")[] = [
  "lg",
  "sm",
  "md",
  "sm",
  "md",
  "sm",
];

export default function ArchiveSurface({ items }: Props) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !surfaceRef.current) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    offset.current.x += dx;
    offset.current.y += dy;

    surfaceRef.current.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px)`;

    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseUp() {
    isDragging.current = false;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        ref={surfaceRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="absolute inset-0 w-[220vw] h-[220vh] cursor-grab"
      >
        {items.map((item, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);

          // asymmetry like Palmer
          const x = col * 420 + (row % 2 ? 120 : 0);
          const y = row * 380 + (col % 2 ? 80 : 0);

          const size = SIZES[i % SIZES.length];

          return (
            <div
              key={item.id}
              className="absolute"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <ArchiveCard
                title={item.title}
                handle={item.handle}
                image={item.image}
                size={size}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
