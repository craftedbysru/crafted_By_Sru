"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function ShippingPage() {
  const [cmsContent, setCmsContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content?page=shipping");
        if (res.ok) {
          const data = await res.json();
          setCmsContent(data);
        }
      } catch (error) {
        console.error("Error fetching shipping page content:", error);
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

  const mainContent = getContent("main", {
    title: "Shipping & Delivery",
    intro: "We deliver our artisanal treasures worldwide with the utmost care.",
    details: "Standard shipping takes 5-7 business days across India. International orders may vary."
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-serif text-5xl md:text-7xl text-amber-950 mb-12">{mainContent.title}</h1>
        
        <div className="prose prose-amber max-w-none space-y-12 text-amber-900/80 leading-relaxed text-lg">
          <section>
            <p>{mainContent.intro}</p>
            <p className="mt-6">{mainContent.details}</p>
          </section>

          {/* Dynamic CMS Sections for Shipping Page */}
          <div className="space-y-16">
            {cmsContent.filter(c => !["main"].includes(c.section)).map((section, idx) => (
              <section key={section.id} className="pt-12 border-t border-amber-950/5">
                {section.content.title && (
                  <h2 className="font-serif text-3xl text-amber-950 mb-6">{section.content.title}</h2>
                )}
                {section.content.description && (
                  <p className="whitespace-pre-line">{section.content.description}</p>
                )}
                {section.content.content && (
                  <p className="mt-4">{section.content.content}</p>
                )}
              </section>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
