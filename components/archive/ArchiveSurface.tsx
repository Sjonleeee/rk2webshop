"use client";

import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import ArchiveCard from "./ArchiveCard";
import { ArchiveProduct } from "./types";
import { TbArrowsMove } from "react-icons/tb";

/* ---------------- CONFIG ---------------- */
const EDGE_PADDING = 20;

/* zoom */
const MIN_SCALE = 0.75;
const MAX_SCALE = 1.35;
const ZOOM_STEP = 0.18;

/* inertia */
const FRICTION = 0.92;
const MIN_VELOCITY = 0.12;

/* sizes */
const SIZE_WIDTH = {
  md: 240,
  lg: 320,
};

const SIZES: ("md" | "lg")[] = ["lg", "md", "md", "lg", "md"];
/* --------------------------------------- */

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface Props {
  items: ArchiveProduct[];
}

export default function ArchiveSurface({ items }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  /* fade-in */
  const [visibleMap, setVisibleMap] = useState<Record<number, number>>({});
  const revealedRef = useRef<Set<number>>(new Set());

  /* responsive */
  const [isMobile, setIsMobile] = useState(false);

  /* hover */
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoverRaf = useRef<number | null>(null);

  /* transform */
  const state = useRef({ x: 0, y: 0, scale: 1 });

  /* drag + inertia */
  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const inertiaRaf = useRef<number | null>(null);

  /* --------------------------------------------
     Detect mobile
  --------------------------------------------- */
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* --------------------------------------------
     Layout (PURE)
  --------------------------------------------- */
  const layout = useMemo(() => {
    const COL_GAP = isMobile ? 280 : 420;
    const ROW_GAP = isMobile ? 340 : 400;
    const OFFSET = isMobile ? 80 : 100;

    return items.reduce(
      (acc, _, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const size = SIZES[i % SIZES.length];
        const w = SIZE_WIDTH[size];
        const h = (w * 3) / 2;

        const x = col * COL_GAP + (row % 2 ? OFFSET : 0);
        const y = row * ROW_GAP + (col % 2 ? OFFSET : 0);

        acc.positions.push({ x, y, w, h, size });
        acc.bounds.minX = Math.min(acc.bounds.minX, x);
        acc.bounds.minY = Math.min(acc.bounds.minY, y);
        acc.bounds.maxX = Math.max(acc.bounds.maxX, x + w);
        acc.bounds.maxY = Math.max(acc.bounds.maxY, y + h);

        return acc;
      },
      {
        positions: [] as {
          x: number;
          y: number;
          w: number;
          h: number;
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
     Apply transform
  --------------------------------------------- */
  const applyTransform = useCallback((smooth = false) => {
    if (!surfaceRef.current) return;

    surfaceRef.current.style.transition = smooth
      ? "transform 420ms cubic-bezier(0.22,1,0.36,1)"
      : "none";

    surfaceRef.current.style.transform = `
      translate3d(${state.current.x}px, ${state.current.y}px, 0)
      scale(${state.current.scale})
    `;
  }, []);

  /* --------------------------------------------
     Visibility
  --------------------------------------------- */
  const updateVisibility = useCallback(() => {
    if (!viewportRef.current) return;

    const rect = viewportRef.current.getBoundingClientRect();
    const next: Record<number, number> = {};

    layout.positions.forEach((pos, i) => {
      if (revealedRef.current.has(i)) return;

      const sx = pos.x * state.current.scale + state.current.x;
      const sy = pos.y * state.current.scale + state.current.y;
      const sw = pos.w * state.current.scale;
      const sh = pos.h * state.current.scale;

      const inView =
        sx + sw > rect.width * 0.1 &&
        sy + sh > rect.height * 0.1 &&
        sx < rect.width * 0.9 &&
        sy < rect.height * 0.9;

      if (inView) {
        revealedRef.current.add(i);
        next[i] = Math.floor(seededRandom(i + Date.now()) * 220);
      }
    });

    if (Object.keys(next).length) {
      setVisibleMap((prev) => ({ ...prev, ...next }));
    }
  }, [layout.positions]);

  /* --------------------------------------------
     Hover detection (RAF throttled)
  --------------------------------------------- */
  const checkHover = useCallback(() => {
    if (isMobile || !viewportRef.current) return;

    const rect = viewportRef.current.getBoundingClientRect();
    const worldX =
      (mouseRef.current.x - rect.left - state.current.x) / state.current.scale;
    const worldY =
      (mouseRef.current.y - rect.top - state.current.y) / state.current.scale;

    let found: number | null = null;

    for (let i = layout.positions.length - 1; i >= 0; i--) {
      const p = layout.positions[i];
      if (
        worldX >= p.x &&
        worldX <= p.x + p.w &&
        worldY >= p.y &&
        worldY <= p.y + p.h
      ) {
        found = i;
        break;
      }
    }

    setHoveredIndex(found);
    setMousePos({ ...mouseRef.current });
  }, [layout.positions, isMobile]);

  const requestHoverCheck = useCallback(() => {
    if (hoverRaf.current) return;
    hoverRaf.current = requestAnimationFrame(() => {
      checkHover();
      hoverRaf.current = null;
    });
  }, [checkHover]);

  /* --------------------------------------------
     Move helper
  --------------------------------------------- */
  const move = useCallback(
    (dx: number, dy: number) => {
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
      updateVisibility();
      requestHoverCheck();
    },
    [bounds, applyTransform, updateVisibility, requestHoverCheck]
  );

  /* --------------------------------------------
     ZOOM (RESTORED)
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
    updateVisibility();
    requestHoverCheck();
  }

  /* --------------------------------------------
     Wheel + mouse tracking
  --------------------------------------------- */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaMode === 1 ? 40 : 1;
      move(-e.deltaX * 0.8 * factor, -e.deltaY * 0.8 * factor);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      requestHoverCheck();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [move, requestHoverCheck]);

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
    requestAnimationFrame(updateVisibility);
  }, [bounds, applyTransform, updateVisibility]);

  /* --------------------------------------------
     Inertia
  --------------------------------------------- */
  function startInertia() {
    if (inertiaRaf.current) cancelAnimationFrame(inertiaRaf.current);

    const step = () => {
      velocity.current.x *= FRICTION;
      velocity.current.y *= FRICTION;

      if (
        Math.abs(velocity.current.x) < MIN_VELOCITY &&
        Math.abs(velocity.current.y) < MIN_VELOCITY
      )
        return;

      move(velocity.current.x, velocity.current.y);
      inertiaRaf.current = requestAnimationFrame(step);
    };

    inertiaRaf.current = requestAnimationFrame(step);
  }

  /* --------------------------------------------
     Render
  --------------------------------------------- */
  return (
    <div
      ref={viewportRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      onMouseDown={(e) => {
        isDragging.current = true;
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onMouseMove={(e) => {
        if (!isDragging.current) return;
        move(e.clientX - last.current.x, e.clientY - last.current.y);
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onMouseUp={() => {
        isDragging.current = false;
        startInertia();
      }}
      onMouseLeave={() => {
        isDragging.current = false;
      }}
      onTouchStart={(e) => {
        isDragging.current = true;
        last.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }}
      onTouchMove={(e) => {
        if (!isDragging.current) return;
        move(
          e.touches[0].clientX - last.current.x,
          e.touches[0].clientY - last.current.y
        );
        last.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }}
      onTouchEnd={() => {
        isDragging.current = false;
        startInertia();
      }}
    >
      <div
        ref={surfaceRef}
        className="absolute top-0 left-0"
        style={{ transformOrigin: "0 0", willChange: "transform" }}
      >
        {layout.positions.map((pos, i) => {
          const delay = visibleMap[i];
          return (
            <div
              key={items[i].id}
              className="absolute transition-[opacity,transform]"
              style={{
                transform:
                  delay !== undefined
                    ? `translate(${pos.x}px, ${pos.y}px)`
                    : `translate(${pos.x}px, ${pos.y + 40}px) scale(0.96)`,
                opacity: delay !== undefined ? 1 : 0,
                transitionDelay: `${delay ?? 0}ms`,
                transitionDuration: "900ms",
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                zIndex: hoveredIndex === i ? 50 : 1,
              }}
            >
              <ArchiveCard
                {...items[i]}
                size={pos.size}
                isManualHover={hoveredIndex === i}
                globalMousePos={mousePos}
              />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="fixed bottom-8 right-8 flex items-center gap-4 z-50 text-black/70">
        <div className="flex items-center gap-2 px-4 h-12 select-none pointer-events-none">
          <TbArrowsMove className="text-xs" />
          <span className="text-[9px]">Drag to explore</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => zoom("out")}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-xl border border-black/10 text-lg shadow-sm hover:bg-white active:scale-95 transition"
          >
            −
          </button>
          <button
            onClick={() => zoom("in")}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-xl border border-black/10 text-lg shadow-sm hover:bg-white active:scale-95 transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
