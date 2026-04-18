"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function AboutPage() {
  const [cmsContent, setCmsContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content?page=about");
        if (res.ok) {
          const data = await res.json();
          setCmsContent(data);
        }
      } catch (error) {
        console.error("Error fetching about page content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getContent = (section: string, defaults: any) => {
    const item = cmsContent.find(c => c.section === section);
    return item ? { ...defaults, ...item.content } : defaults;
  };

  const headerContent = getContent("header", {
    title: "Our Story",
    subtitle: "The Artisan Legacy",
    description: "Curated Heritage was born out of a deep appreciation for Indian artisanal craftsmanship and the timeless beauty of handmade objects."
  });

  const missionContent = getContent("mission", {
    title: "Our Mission",
    items: [
      { title: "Ethical Sourcing", content: "We ensure fair wages and safe working conditions for all our artisan partners." },
      { title: "Preserving Heritage", content: "We help keep ancient traditions alive for future generations." },
      { title: "Modern Design", content: "We adapt traditional crafts for the modern aesthetic without losing their soul." }
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
            src={headerContent.image || "https://images.unsplash.com/photo-1590739293931-694800366668?auto=format&fit=crop&q=80"} 
            alt="Artisan Craftsmanship" 
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
                  src={item.image || `https://images.unsplash.com/photo-${idx === 0 ? '1513519245088-0e12902e5a38' : (idx === 1 ? '1582555172866-f73bb12a2ab3' : '1617103996702-96ff29b1c467')}?auto=format&fit=crop&q=80`} 
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
