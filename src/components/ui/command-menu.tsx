"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  description: string;
  href: string;
  color?: string;
}

interface CommandMenuProps {
  items: MenuItem[];
  className?: string;
}

export function CommandMenu({ items, className }: CommandMenuProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "relative bg-black/80 border-4 border-white p-6 rounded-lg font-pixel max-w-2xl mx-auto",
        className
      )}
    >
      {/* Decorative Header */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 border-2 border-black font-bold uppercase tracking-widest">
        COMMAND
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2">
        {items.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className="group relative flex items-center gap-4 py-3 px-2 transition-colors outline-none"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
          >
            {/* Cursor (▶) */}
            <div className="w-6 flex justify-center shrink-0">
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.span
                    layoutId="cursor"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="text-pixel-yellow text-xl"
                  >
                    ▶
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col">
              <span
                className={cn(
                  "text-xl font-bold tracking-wider transition-colors uppercase",
                  activeIndex === index ? "text-white text-shadow-glow" : "text-gray-400"
                )}
              >
                {item.label}
              </span>
              <span className="text-xs text-gray-500 font-mono uppercase">
                {item.description}
              </span>
            </div>
            
            {/* Background Hover Effect */}
            {activeIndex === index && (
              <motion.div
                layoutId="highlight"
                className="absolute inset-0 bg-white/10 -z-10 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
