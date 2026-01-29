"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClickParticle {
  id: number;
  x: number;
  y: number;
}

export function ClickSparkle() {
  const [particles, setParticles] = useState<ClickParticle[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setParticles((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

      // Remove particle after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <SparkleGroup key={p.id} x={p.x} y={p.y} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function SparkleGroup({ x, y }: { x: number; y: number }) {
  // Generate 4-8 small squares spreading out
  const count = 6;
  const angles = Array.from({ length: count }).map((_, i) => (360 / count) * i);

  return (
    <>
      {angles.map((angle, i) => (
        <motion.div
          key={i}
          initial={{ x, y, opacity: 1, scale: 1 }}
          animate={{
            x: x + Math.cos((angle * Math.PI) / 180) * 40,
            y: y + Math.sin((angle * Math.PI) / 180) * 40,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute h-2 w-2 bg-pixel-yellow shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        />
      ))}
      {/* Center flash */}
      <motion.div
        initial={{ x, y, opacity: 1, scale: 0 }}
        animate={{ opacity: 0, scale: 2 }}
        transition={{ duration: 0.3 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 h-4 w-4 border-2 border-white rounded-full"
      />
    </>
  );
}
