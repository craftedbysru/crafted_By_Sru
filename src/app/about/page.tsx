"use client";

import React from "react";
import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40 mb-6 font-bold">The Artisan Legacy</p>
          <h1 className="font-serif text-5xl md:text-7xl text-amber-950 mb-12">Our Story</h1>
          <div className="space-y-8 text-amber-900/80 leading-relaxed text-lg">
            <p>
              Curated Heritage was born out of a deep appreciation for Indian artisanal craftsmanship and the timeless beauty of handmade objects. Our journey began with a simple mission: to bridge the gap between traditional craft clusters and the modern home.
            </p>
            <p>
              We believe that the objects we surround ourselves with should tell a story. They should be more than just functional; they should be a reflection of the hands that made them and the heritage they represent.
            </p>
            <p>
              Every item in our catalog is meticulously crafted using traditional techniques passed down through generations, blended with a modern aesthetic that fits seamlessly into contemporary life.
            </p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-[4/5] bg-amber-50 overflow-hidden shadow-2xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1590739293931-694800366668?auto=format&fit=crop&q=80" 
            alt="Artisan Craftsmanship" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
        <div className="space-y-6">
          <div className="h-80 bg-amber-100 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80" 
              alt="Workshop" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <h3 className="font-serif text-2xl text-amber-950">Ethical Sourcing</h3>
          <p className="text-sm text-amber-900/60 leading-relaxed">We ensure fair wages and safe working conditions for all our artisan partners across India.</p>
        </div>
        <div className="space-y-6 pt-12">
          <div className="h-80 bg-amber-100 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80" 
              alt="Detail" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <h3 className="font-serif text-2xl text-amber-950">Preserving Heritage</h3>
          <p className="text-sm text-amber-900/60 leading-relaxed">By bringing these crafts to a global audience, we help keep ancient traditions alive for future generations.</p>
        </div>
        <div className="space-y-6 pt-24">
          <div className="h-80 bg-amber-100 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80" 
              alt="Artisan" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <h3 className="font-serif text-2xl text-amber-950">Modern Design</h3>
          <p className="text-sm text-amber-900/60 leading-relaxed">We collaborate with designers to adapt traditional crafts for the modern aesthetic without losing their soul.</p>
        </div>
      </div>
    </div>
  );
}
