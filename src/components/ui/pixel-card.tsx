import { cn } from "@/lib/utils";
import React from "react";

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "solid" | "outline";
}

export function PixelCard({
  className,
  variant = "default",
  children,
  ...props
}: PixelCardProps) {
  return (
    <div
      className={cn(
        "relative bg-background border-4 border-foreground p-6 pixel-shadow transition-transform",
        className
      )}
      {...props}
    >
      {/* Decorative corners could be added here for more 8-bit feel */}
      {children}
    </div>
  );
}
