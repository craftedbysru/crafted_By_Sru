"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

import { useCMS } from "@/hooks/useCMS";
import { ASSETS } from "@/lib/images";

export default function AboutPage() {
  const { content: cmsContent, loading, getSection } = useCMS("about");

  const headerContent = getSection("header", {
    title: "Our Story",
    subtitle: "The Heritage Legacy",
    description: "Curated Heritage was born out of a deep appreciation for Indian handcrafted heritage and the timeless beauty of handmade objects."
  });

  const missionContent = getSection("mission", {
    title: "Our Mission",
    items: [
      { title: "Original Heritage", content: "We meticulously source return gifts that are rooted in genuine Indian traditions, ensuring every piece is an original masterpiece of heritage." },
      { title: "Authentic Artistry", content: "By working directly with master artisans, we preserve the purity and authenticity of traditional techniques in every selection." },
      { title: "Distinctive Gifting", content: "Our curation focuses on originality, offering unique and meaningful gifts that leave a lasting impression of culture and care." }
    ]
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40 mb-6 font-bold">{headerContent.subtitle}</p>
          <h1 className="font-serif text-5xl md:text-7xl text-amber-950 mb-12">{headerContent.title}</h1>
          <div className="space-y-8 text-amber-900/80 leading-relaxed text-lg">
            <p>{headerContent.description}</p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-[4/5] bg-amber-50 overflow-hidden shadow-2xl"
        >
          <img 
            src={headerContent.image || ASSETS.sru} 
            alt="Handcrafted Heritage" 
            className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      <div>
        <h2 className="font-serif text-4xl text-amber-950 mb-16 text-center">{missionContent.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {missionContent.items.map((item: any, idx: number) => (
            <div key={idx} className={`space-y-6 ${idx > 0 ? (idx === 1 ? 'pt-12' : 'pt-24') : ''}`}>
              <div className="h-80 bg-amber-100 overflow-hidden">
                <img 
                  src={item.image || `/images/curation-${(idx % 4) + 1}.jpeg`} 
                  alt={item.title} 
                  className="w-full h-full object-cover hover:scale-110 transition-all duration-700"
                />
              </div>
              <h3 className="font-serif text-2xl text-amber-950">{item.title}</h3>
              <p className="text-sm text-amber-900/60 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic CMS Sections for About Page */}
      <div className="mt-32 space-y-32">
        {cmsContent.filter(c => !["header", "mission"].includes(c.section)).map((section, idx) => (
          <section key={section.id} className="py-20 border-t border-amber-950/5">
            {section.content.title && (
              <h2 className="font-serif text-4xl text-amber-950 mb-8">{section.content.title}</h2>
            )}
            {section.content.description && (
              <p className="text-amber-900/60 max-w-2xl leading-relaxed">{section.content.description}</p>
            )}
            {section.content.image && (
              <div className="mt-12 aspect-video overflow-hidden bg-amber-50">
                <img src={section.content.image} alt={section.content.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
