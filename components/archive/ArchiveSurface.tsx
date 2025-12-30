"use client";

import { useRef } from "react";
import ArchiveCard from "./ArchiveCard";
import { ArchiveProduct } from "./types";

interface Props {
  items: ArchiveProduct[];
}

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
        className="absolute inset-0 w-[200vw] h-[200vh] cursor-grab"
      >
        {items.map((item, i) => {
          const x = (i % 6) * 360;
          const y = Math.floor(i / 6) * 460;

          return (
            <div
              key={item.id}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <ArchiveCard
                title={item.title}
                handle={item.handle}
                image={item.image}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
