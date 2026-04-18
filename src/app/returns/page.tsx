"use client";

import React from "react";
import { motion } from "motion/react";
import { useCMS } from "@/hooks/useCMS";

export default function ReturnsPage() {
  const { getSection, loading } = useCMS("return-policy");

  const mainContent = getSection("main", {
    title: "Returns & Exchanges",
    intro: "At Crafted by Sru, we strive for perfection in every piece we curate. Due to the artisanal and handcrafted nature of our products, each item is unique and may exhibit slight variations.",
    sections: [
      {
        title: "Our Policy",
        content: "We only accept returns or exchanges if the product is received in a damaged condition."
      },
      {
        title: "Refund Timeline",
        content: "Refunds are processed within 7-10 business days after we receive and inspect the returned item."
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
