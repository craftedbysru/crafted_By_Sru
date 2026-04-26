"use client";

import React from "react";
import { motion } from "motion/react";
import { useCMS } from "@/hooks/useCMS";

export default function TermsPage() {
  const { getSection, loading } = useCMS("terms");

  const mainContent = getSection("main", {
    title: "Terms of Service",
    intro: "By accessing or using the Crafted by Sru website, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
    sections: [
      {
        title: "Acceptance of Terms",
        content: "By accessing or using the Crafted by Sru website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
      },
      {
        title: "Use License",
        content: "Permission is granted to temporarily download one copy of the materials (information or software) on Crafted by Sru's website for personal, non-commercial transitory viewing only."
      }
    ]
  });

  if (loading) return <div className="pt-32 px-6 text-center">Loading...</div>;

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-serif text-5xl text-amber-950 mb-12">{mainContent.title}</h1>
        
        <div className="prose prose-amber max-w-none space-y-8 text-amber-900/80 leading-relaxed">
          <section>
            <p>{mainContent.intro}</p>
          </section>

          {Array.isArray(mainContent.sections) && mainContent.sections.map((s: any, i: number) => (
            <section key={i}>
              <h2 className="font-serif text-2xl text-amber-950 mb-4">{s.title}</h2>
              <p>{s.content}</p>
            </section>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
