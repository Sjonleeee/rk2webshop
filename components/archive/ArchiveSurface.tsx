"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import ArchiveCard from "./ArchiveCard";
import { ArchiveProduct } from "./types";
import { TbArrowsMove } from "react-icons/tb";

interface Props {
  items: ArchiveProduct[];
}

/* ---------------- CONFIG ---------------- */
const EDGE_PADDING = 20;
const MIN_SCALE = 0.75;
const MAX_SCALE = 1.35;
const ZOOM_STEP = 0.18;

/* inertia tuning (Palmer-like) */
const FRICTION = 0.92;
const MIN_VELOCITY = 0.1;

const SIZE_WIDTH = {
  md: 240,
  lg: 320,
};

const SIZES: ("md" | "lg")[] = ["lg", "md", "md", "lg", "md"];
/* --------------------------------------- */

/* deterministic pseudo-random (PURE) */
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function ArchiveSurface({ items }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* unified transform state */
  const state = useRef({
    x: 0,
    y: 0,
    scale: 1,
  });

  /* drag + inertia */
  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  /* --------------------------------------------
     Detect mobile (safe)
  --------------------------------------------- */
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* --------------------------------------------
     Layout (PURE, responsive spacing)
  --------------------------------------------- */
  const layout = useMemo(() => {
    const COL_GAP = isMobile ? 300 : 420;
    const ROW_GAP = isMobile ? 400 : 400;
    const OFFSET = isMobile ? 100 : 100;

    return items.reduce(
      (acc, _, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);

        const size = SIZES[i % SIZES.length];
        const w = SIZE_WIDTH[size];
        const h = (w * 3) / 2;

        const x = col * COL_GAP + (row % 2 ? OFFSET : 0);
        const y = row * ROW_GAP + (col % 2 ? OFFSET : 0);

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
        positions: [] as { x: number; y: number; size: "md" | "lg" }[],
        bounds: {
          minX: Infinity,
          minY: Infinity,
          maxX: -Infinity,
          maxY: -Infinity,
        },
      }
    );
  }, [items, isMobile]);

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
     Random intro delays (PURE)
  --------------------------------------------- */
  const introDelays = useMemo(() => {
    const order = items.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(i) * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const delays: number[] = [];
    order.forEach((itemIndex, idx) => {
      delays[itemIndex] = idx * 80;
    });
    return delays;
  }, [items]);

  /* --------------------------------------------
     Apply transform
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
     Center + intro
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

    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [bounds]);

  /* --------------------------------------------
     Move helper (shared)
  --------------------------------------------- */
  function move(dx: number, dy: number) {
    if (!viewportRef.current) return;

    velocity.current.x = dx;
    velocity.current.y = dy;

    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;

    const minX = vw - bounds.maxX * state.current.scale;
    const maxX = -bounds.minX * state.current.scale;
    const minY = vh - bounds.maxY * state.current.scale;
    const maxY = -bounds.minY * state.current.scale;

    state.current.x = Math.min(Math.max(state.current.x + dx, minX), maxX);
    state.current.y = Math.min(Math.max(state.current.y + dy, minY), maxY);

    applyTransform(false);
  }

  /* --------------------------------------------
     Inertia (Palmer feel)
  --------------------------------------------- */
  function startInertia() {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const step = () => {
      velocity.current.x *= FRICTION;
      velocity.current.y *= FRICTION;

      if (
        Math.abs(velocity.current.x) < MIN_VELOCITY &&
        Math.abs(velocity.current.y) < MIN_VELOCITY
      ) {
        velocity.current.x = 0;
        velocity.current.y = 0;
        return;
      }

      move(velocity.current.x, velocity.current.y);
      rafId.current = requestAnimationFrame(step);
    };

    rafId.current = requestAnimationFrame(step);
  }

  /* --------------------------------------------
     Mouse drag
  --------------------------------------------- */
  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    move(e.clientX - last.current.x, e.clientY - last.current.y);
    last.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseUp() {
    isDragging.current = false;
    startInertia();
  }

  /* --------------------------------------------
     Touch drag (mobile)
  --------------------------------------------- */
  function onTouchStart(e: React.TouchEvent) {
    isDragging.current = true;
    const t = e.touches[0];
    last.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!isDragging.current) return;
    const t = e.touches[0];
    move(t.clientX - last.current.x, t.clientY - last.current.y);
    last.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd() {
    isDragging.current = false;
    startInertia();
  }

  /* --------------------------------------------
     Zoom
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
      className="relative w-full h-full overflow-hidden cursor-grab touch-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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
              className="absolute transition-[opacity,transform]"
              style={{
                transform: mounted
                  ? `translate(${pos.x}px, ${pos.y}px)`
                  : `translate(${pos.x}px, ${pos.y + 40}px) scale(0.96)`,
                opacity: mounted ? 1 : 0,
                transitionDuration: "950ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDelay: `${introDelays[i] ?? 0}ms`,
              }}
            >
              <ArchiveCard {...item} size={pos.size} />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="fixed bottom-8 right-8 flex items-center gap-4 z-50">
        <div className="flex items-center gap-2 px-4 h-12 rounded-full bg-[#F6F7FB]/60 backdrop-blur-xl border border-black/10 text-sm shadow-sm select-none pointer-events-none mix-blend-difference">
          <TbArrowsMove className="text-lg" />
          <span>Drag to explore</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => zoom("out")}
            className="w-12 h-12 rounded-full bg-[#F6F7FB]/60 backdrop-blur-xl border border-black/10 text-lg shadow-sm hover:bg-[#F6F7FB]/80 active:scale-95 transition"
          >
            −
          </button>
          <button
            onClick={() => zoom("in")}
            className="w-12 h-12 rounded-full bg-[#F6F7FB]/60 backdrop-blur-xl border border-black/10 text-lg shadow-sm hover:bg-[#F6F7FB]/80 active:scale-95 transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
