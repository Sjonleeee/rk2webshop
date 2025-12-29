// "use client";

// import { useRef, useState } from "react";

// export default function ArchiveCanvas({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isDown, setIsDown] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);

//   const onMouseDown = (e: React.MouseEvent) => {
//     setIsDown(true);
//     setStartX(e.pageX - (containerRef.current?.offsetLeft ?? 0));
//     setScrollLeft(containerRef.current?.scrollLeft ?? 0);
//   };

//   const onMouseLeave = () => setIsDown(false);
//   const onMouseUp = () => setIsDown(false);

//   const onMouseMove = (e: React.MouseEvent) => {
//     if (!isDown || !containerRef.current) return;
//     e.preventDefault();
//     const x = e.pageX - containerRef.current.offsetLeft;
//     const walk = (x - startX) * 1.2; // speed
//     containerRef.current.scrollLeft = scrollLeft - walk;
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="flex gap-24 overflow-x-scroll cursor-grab active:cursor-grabbing select-none"
//       style={{ scrollbarWidth: "none" }}
//       onMouseDown={onMouseDown}
//       onMouseLeave={onMouseLeave}
//       onMouseUp={onMouseUp}
//       onMouseMove={onMouseMove}
//     >
//       {children}
//     </div>
//   );
// }
