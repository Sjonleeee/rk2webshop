"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

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
      window.location.href = "/shop";
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-8">
      <div className="flex flex-col items-center gap-10">
        {/* LOGO + TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
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
        </motion.div>

        {/* PASSWORD */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-3"
        >
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
            <span className="text-[7px] text-red-600">Incorrect password</span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
