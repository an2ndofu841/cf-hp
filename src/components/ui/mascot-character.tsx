"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface MascotCharacterProps {
  src: string;
  className?: string;
}

export function MascotCharacter({ src, className }: MascotCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Remove black background
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // If pixel is black (or close to black), make it transparent
        if (r < 20 && g < 20 && b < 20) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: isLoaded ? 1 : 0,
        y: [0, -10, 0], // Floating animation
      }}
      transition={{
        opacity: { duration: 0.5 },
        y: { 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
    </motion.div>
  );
}
