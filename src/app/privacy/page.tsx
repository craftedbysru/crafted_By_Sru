"use client";

import React from "react";
import { motion } from "motion/react";
import { useCMS } from "@/hooks/useCMS";

export default function PrivacyPage() {
  const { getSection, loading } = useCMS("privacy");

  const mainContent = getSection("main", {
    title: "Privacy Policy",
    intro: "At Crafted by Sru, we value the trust you place in us when sharing your personal information. This Privacy Policy explains how we collect, use, and protect your data when you visit our website or interact with our services.",
    sections: [
      {
        title: "Information We Collect",
        content: "We collect information that you provide directly to us, including contact information, order details, and account information."
      },
      {
        title: "How We Use Your Data",
        content: "Your information is used to provide and improve our services, process orders, and communicate with you."
      }
    ]
  });

  if (loading) return <div className="pt-32 px-6 text-center">Loading...</div>;

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto bg-bg-primary min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-serif text-5xl text-amber-950 mb-12">{mainContent.title}</h1>
        
        <div className="prose prose-amber max-w-none space-y-12 text-amber-900/80 leading-relaxed font-sans">
          <section>
            <p className="text-lg text-amber-950/70">{mainContent.intro}</p>
          </section>

          {Array.isArray(mainContent.sections) && mainContent.sections.map((s: any, i: number) => {
            if (!s.content && !s.list && (!s.sections || s.sections.length === 0)) return null;
            const hasRealTitle = s.title && s.title !== "New Item" && s.title !== "New Section" && s.title !== "New Points";
            
            return (
              <section key={i} className="space-y-6">
                {hasRealTitle && (
                  <h2 className="font-serif text-3xl text-amber-950 mt-12 mb-6 border-b border-amber-900/10 pb-4">{s.title}</h2>
                )}
                <div className="space-y-6">
                  {(s.list || s.content || "").split(/\n|(?=\s*(?:[•\-*]|\d+\.))\s*/).filter((p: string) => p.trim()).map((point: string, j: number) => {
                    const cleanedPoint = point.replace(/^\s*(?:[•\-*]|\d+\.)\s*/, '').trim();
                    if (!cleanedPoint) return null;
                    return (
                      <div key={j} className="flex gap-6 items-start group">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-900/20 mt-[0.65rem] shrink-0 group-hover:bg-amber-950 transition-all duration-300" />
                        <p className="m-0 text-amber-950/80 leading-relaxed text-base tracking-wide">{cleanedPoint}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
