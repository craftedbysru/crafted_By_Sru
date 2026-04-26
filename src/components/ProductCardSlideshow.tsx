"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getPlaceholderImage } from "@/lib/images";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { ChevronLeft, ChevronRight } from "lucide-react";

import Image from "next/image";

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
      }, 3000); // Slower for manual control
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
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full relative"
        >
          <Image 
            src={images[currentIdx]} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>
      
      {images.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
              }}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center text-amber-950 pointer-events-auto hover:bg-amber-950 hover:text-white transition-all shadow-lg rounded-full"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIdx((prev) => (prev + 1) % images.length);
              }}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center text-amber-950 pointer-events-auto hover:bg-amber-950 hover:text-white transition-all shadow-lg rounded-full"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_: any, i: number) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 transition-all duration-300 rounded-full bg-white shadow-sm",
                  i === currentIdx ? "w-6 opacity-100" : "w-1 opacity-40"
                )} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
