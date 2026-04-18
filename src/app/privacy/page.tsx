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
