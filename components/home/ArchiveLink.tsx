"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function ArchiveLink() {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <Link
        href="/archive"
        className="text-xs font-medium hover:opacity-70 transition-opacity"
        style={{ color: "white", filter: "brightness(0) invert(1)" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        archive
      </Link>

      {isHovered && (
        <video
          ref={videoRef}
          className="fixed inset-0 w-full h-full object-cover z-5 pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/archive-video.mp4" type="video/mp4" />
          <source src="/archive-video.webm" type="video/webm" />
        </video>
      )}
    </>
  );
}
