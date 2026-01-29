"use client";

import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

export function PixelButton({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: PixelButtonProps) {
  const baseStyles = cn(
    "relative inline-flex items-center justify-center font-bold uppercase transition-none",
    "border-4 border-foreground pixel-shadow",
    "disabled:opacity-50 disabled:pointer-events-none",
    {
      "bg-pixel-blue text-white": variant === "primary",
      "bg-pixel-green text-black": variant === "secondary",
      "bg-pixel-red text-white": variant === "danger",
      "bg-background text-foreground hover:bg-foreground hover:text-background":
        variant === "outline",
      "px-3 py-1 text-sm": size === "sm",
      "px-6 py-2 text-base": size === "md",
      "px-8 py-4 text-lg": size === "lg",
    },
    className
  );

  const animationProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95, translateY: 4, translateX: 4, boxShadow: "none" },
  };

  if (href) {
    const MotionLink = motion.create(Link);
    return (
      <MotionLink
        href={href}
        className={baseStyles}
        {...animationProps}
        {...(props as any)}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      className={baseStyles}
      {...animationProps}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
