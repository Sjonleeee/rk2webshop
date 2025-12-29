"use client";

import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // 🔓 access granted → redirect
      window.location.href = "/shop";
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-8">
      <div className="flex flex-col items-center gap-8">
        {/* LOGO + TAGLINE */}
        <div className="flex items-center gap-4">
          <Image
            src="/logos/rk2logo.png"
            alt="R/K2"
            width={100}
            height={40}
            className="h-8 w-auto"
            priority
          />

          <div className="text-foreground font-mono text-[9px] leading-tight">
            <div>Designed For Motion</div>
            <div className="-mt-0.5">Made To Last</div>
          </div>
        </div>

        {/* PASSWORD INPUT */}
        <div className="flex flex-col items-center gap-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="bg-transparent border-b border-foreground/40 text-center text-xs font-mono outline-none py-2 w-40 focus:border-foreground"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="text-[10px] font-mono tracking-wide hover:text-[hsl(var(--rk2-color-accent))]"
          >
            {loading ? "/ checking…" : "/ enter "}
          </button>

          {error && (
            <span className="text-[7px] text-red-600">
              Incorrect password
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
