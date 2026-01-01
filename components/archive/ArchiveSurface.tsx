"use client";

import { useRef, useEffect, useMemo } from "react";
import ArchiveCard from "./ArchiveCard";
import { ArchiveProduct } from "./types";

interface Props {
  items: ArchiveProduct[];
}

/* -----------------------------
   DESIGN SYSTEM
------------------------------ */

const EDGE_PADDING = 80;

/* MUST match ArchiveCard */
const SIZE_WIDTH = {
  md: 220,
  lg: 280,
};

type CardSize = "md" | "lg";

/* Grid is based on MAX size */
const GRID_X = 520; // >= lg width + margin
const GRID_Y = 520; // >= lg height + margin

/* Safe artistic offsets (never collide) */
const OFFSETS = [
  { dx: 0, dy: 0 },
  { dx: 30, dy: 20 },
  { dx: -30, dy: 40 },
  { dx: 40, dy: -20 },
  { dx: -40, dy: 30 },
];

export default function ArchiveSurface({ items }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });

  /* --------------------------------------------
     LAYOUT (NO OVERLAP GUARANTEED)
  --------------------------------------------- */
  const layout = useMemo(() => {
    const result = items.reduce(
      (acc, item, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);

        const baseX = col * GRID_X;
        const baseY = row * GRID_Y;

        const offsetPattern = OFFSETS[i % OFFSETS.length];

        const x = baseX + offsetPattern.dx;
        const y = baseY + offsetPattern.dy;

        /* Visual hierarchy: every 4th item is large */
        const size: CardSize = i % 4 === 0 ? "lg" : "md";

        const width = SIZE_WIDTH[size];
        const height = (width * 3) / 2;

        return {
          positions: [...acc.positions, { x, y, size }],
          minX: Math.min(acc.minX, x),
          minY: Math.min(acc.minY, y),
          maxX: Math.max(acc.maxX, x + width),
          maxY: Math.max(acc.maxY, y + height),
        };
      },
      {
        positions: [] as {
          x: number;
          y: number;
          size: CardSize;
        }[],
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
      }
    );

    return {
      positions: result.positions,
      bounds: {
        minX: result.minX - EDGE_PADDING,
        minY: result.minY - EDGE_PADDING,
        maxX: result.maxX + EDGE_PADDING,
        maxY: result.maxY + EDGE_PADDING,
      },
    };
  }, [items]);

  /* --------------------------------------------
     CENTER CONTENT
  --------------------------------------------- */
  useEffect(() => {
    if (!viewportRef.current || !surfaceRef.current) return;

    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;

    const contentWidth = layout.bounds.maxX - layout.bounds.minX;
    const contentHeight = layout.bounds.maxY - layout.bounds.minY;

    offset.current = {
      x: -layout.bounds.minX - contentWidth / 2 + vw / 2,
      y: -layout.bounds.minY - contentHeight / 2 + vh / 2,
    };

    surfaceRef.current.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px)`;
  }, [layout]);

  function clamp(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max);
  }

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !viewportRef.current || !surfaceRef.current)
      return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;

    const minX = vw - layout.bounds.maxX;
    const maxX = -layout.bounds.minX;
    const minY = vh - layout.bounds.maxY;
    const maxY = -layout.bounds.minY;

    offset.current.x = clamp(offset.current.x + dx, minX, maxX);
    offset.current.y = clamp(offset.current.y + dy, minY, maxY);

    surfaceRef.current.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px)`;

    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseUp() {
    isDragging.current = false;
  }

  return (
    <div
      ref={viewportRef}
      className="relative w-full h-full overflow-hidden cursor-grab"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div ref={surfaceRef} className="absolute top-0 left-0">
        {layout.positions.map((pos, i) => {
          const item = items[i];

          return (
            <div
              key={item.id}
              className="absolute"
              style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
            >
              <ArchiveCard
                title={item.title}
                handle={item.handle}
                image={item.image}
                size={pos.size}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
