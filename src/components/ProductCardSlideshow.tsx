"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getPlaceholderImage } from "@/lib/images";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ProductCardSlideshow({ product, className }: { product: any, className?: string }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.imageUrl || product.image || getPlaceholderImage(product.category)];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      setCurrentIdx(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <div 
      className={cn("w-full h-full relative group", className)}
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img 
          key={currentIdx}
          src={images[currentIdx]} 
          alt={product.name} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {images.map((_: any, i: number) => (
            <div 
              key={i} 
              className={cn(
                "h-0.5 transition-all duration-300 rounded-full bg-white shadow-sm",
                i === currentIdx ? "w-4 opacity-100" : "w-1 opacity-40"
              )} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
