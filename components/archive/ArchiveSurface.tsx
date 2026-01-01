"use client";

import { useRef, useEffect, useMemo } from "react";
import ArchiveCard from "./ArchiveCard";
import { ArchiveProduct } from "./types";

interface Props {
  items: ArchiveProduct[];
}

const EDGE_PADDING = 140;
const MIN_SCALE = 0.75;
const MAX_SCALE = 1.35;
const ZOOM_STEP = 0.18;

const SIZE_WIDTH = {
  md: 240,
  lg: 320,
};

const SIZES: ("md" | "lg")[] = ["lg", "md", "md", "lg", "md"];

export default function ArchiveSurface({ items }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const state = useRef({
    x: 0,
    y: 0,
    scale: 1,
  });

  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  /* --------------------------------------------
     Layout (immutable)
  --------------------------------------------- */
  const layout = useMemo(() => {
    return items.reduce(
      (acc, _, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);

        const size = SIZES[i % SIZES.length];
        const w = SIZE_WIDTH[size];
        const h = (w * 3) / 2;

        const x = col * 500 + (row % 2 ? 180 : 0);
        const y = row * 460 + (col % 2 ? 140 : 0);

        return {
          positions: [...acc.positions, { x, y, size }],
          bounds: {
            minX: Math.min(acc.bounds.minX, x),
            minY: Math.min(acc.bounds.minY, y),
            maxX: Math.max(acc.bounds.maxX, x + w),
            maxY: Math.max(acc.bounds.maxY, y + h),
          },
        };
      },
      {
        positions: [] as {
          x: number;
          y: number;
          size: "md" | "lg";
        }[],
        bounds: {
          minX: Infinity,
          minY: Infinity,
          maxX: -Infinity,
          maxY: -Infinity,
        },
      }
    );
  }, [items]);

  const bounds = useMemo(
    () => ({
      minX: layout.bounds.minX - EDGE_PADDING,
      minY: layout.bounds.minY - EDGE_PADDING,
      maxX: layout.bounds.maxX + EDGE_PADDING,
      maxY: layout.bounds.maxY + EDGE_PADDING,
    }),
    [layout]
  );

  /* --------------------------------------------
     Apply transform (CSS does smoothing)
  --------------------------------------------- */
  function applyTransform(smooth = true) {
    if (!surfaceRef.current) return;

    surfaceRef.current.style.transition = smooth
      ? "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";

    surfaceRef.current.style.transform = `
      translate3d(${state.current.x}px, ${state.current.y}px, 0)
      scale(${state.current.scale})
    `;
  }

  /* --------------------------------------------
     Center on mount
  --------------------------------------------- */
  useEffect(() => {
    if (!viewportRef.current) return;

    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;

    const bw = bounds.maxX - bounds.minX;
    const bh = bounds.maxY - bounds.minY;

    state.current.x = -bounds.minX - bw / 2 + vw / 2;
    state.current.y = -bounds.minY - bh / 2 + vh / 2;

    applyTransform(false);
  }, [bounds]);

  /* --------------------------------------------
     Drag (no transition)
  --------------------------------------------- */
  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !viewportRef.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;

    const minX = vw - bounds.maxX * state.current.scale;
    const maxX = -bounds.minX * state.current.scale;
    const minY = vh - bounds.maxY * state.current.scale;
    const maxY = -bounds.minY * state.current.scale;

    state.current.x = Math.min(Math.max(state.current.x + dx, minX), maxX);
    state.current.y = Math.min(Math.max(state.current.y + dy, minY), maxY);

    applyTransform(false);
    last.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseUp() {
    isDragging.current = false;
  }

  /* --------------------------------------------
     Zoom (clean, no jitter)
  --------------------------------------------- */
  function zoom(dir: "in" | "out") {
    if (!viewportRef.current) return;

    const prev = state.current.scale;
    const next =
      dir === "in"
        ? Math.min(prev + ZOOM_STEP, MAX_SCALE)
        : Math.max(prev - ZOOM_STEP, MIN_SCALE);

    if (prev === next) return;

    const { width, height } = viewportRef.current.getBoundingClientRect();

    const cx = width / 2;
    const cy = height / 2;

    state.current.x = cx - ((cx - state.current.x) * next) / prev;
    state.current.y = cy - ((cy - state.current.y) * next) / prev;
    state.current.scale = next;

    applyTransform(true);
  }

  /* --------------------------------------------
     Render
  --------------------------------------------- */
  return (
    <div
      ref={viewportRef}
      className="relative w-full h-full overflow-hidden cursor-grab"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div
        ref={surfaceRef}
        className="absolute top-0 left-0"
        style={{ transformOrigin: "0 0", willChange: "transform" }}
      >
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

      {/* Controls  */}
      <div className="fixed bottom-8 right-8 flex items-center gap-4 z-50">
        {/* Drag hint */}
        <div
          className="
      flex items-center gap-2
      px-4 h-12
      rounded-full
      bg-[#F6F7FB]/60
      backdrop-blur-xl
      border border-black/10
      text-sm
      text-black/70
      shadow-sm
      select-none
      pointer-events-none
    "
        >
          <span className="text-base">⤧</span>
          <span>Drag to explore</span>
        </div>

        {/* Zoom buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => zoom("out")}
            aria-label="Zoom out"
            className="
        w-12 h-12 rounded-full
        flex items-center justify-center
        bg-[#F6F7FB]/60
        backdrop-blur-xl
        border border-black/10
        text-lg
        shadow-sm
        transition
        hover:bg-[#F6F7FB]/80
        active:scale-95
      "
          >
            −
          </button>

          <button
            onClick={() => zoom("in")}
            aria-label="Zoom in"
            className="
        w-12 h-12 rounded-full
        flex items-center justify-center
        bg-[#F6F7FB]/60
        backdrop-blur-xl
        border border-black/10
        text-lg
        shadow-sm
        transition
        hover:bg-[#F6F7FB]/80
        active:scale-95
      "
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
