"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorImage, setCursorImage] = useState<string | null>(null);

  // Load and process image (remove black background)
  useEffect(() => {
    const img = new Image();
    img.src = "/images/cursor-sword.png";
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Loop through pixels and make black transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // If pixel is black (or very close to black), make it transparent
        if (r < 10 && g < 10 && b < 10) {
          data[i + 3] = 0; // Alpha = 0
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setCursorImage(canvas.toDataURL());
    };
  }, []);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  if (!cursorImage) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[10000] pointer-events-none"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        // Default: -45deg (pointing top-left)
        // Click: -135deg (swing down)
        rotate: isClicking ? -135 : -45, 
      }}
      transition={{
        // Movement: spring
        x: { type: "spring", stiffness: 1000, damping: 50, mass: 0.1 },
        y: { type: "spring", stiffness: 1000, damping: 50, mass: 0.1 },
        // Rotation: quick snap
        rotate: { type: "spring", stiffness: 500, damping: 20 }
      }}
      style={{
        display: isVisible ? "block" : "none",
        // Adjust origin to be the handle (bottom-center of the sword image approx)
        transformOrigin: "50% 80%", 
      }}
    >
      {/* 
        Offset the image so the "tip" or "hitbox" feels right.
        If rotated -45deg, the top-left of the bounding box is the hotspot.
        We position the sword so its handle is at the cursor position?
        Usually cursor hotspot is top-left.
        If we want the sword tip to be at the hotspot:
        Image is vertical. Tip is at top-center.
        We want top-center to be at (0,0) relative to mouse.
      */}
      <div className="relative -top-2 -left-2 w-16 h-16">
        <img 
          src={cursorImage} 
          alt="cursor" 
          className="w-full h-full object-contain drop-shadow-md"
          style={{ imageRendering: "pixelated" }} 
        />
      </div>
    </motion.div>
  );
}
