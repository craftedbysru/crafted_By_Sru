"use client";

import React from "react";
import { motion } from "motion/react";

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-serif text-5xl text-amber-950 mb-12">Terms of Service</h1>
        
        <div className="prose prose-amber max-w-none space-y-8 text-amber-900/80 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Acceptance of Terms</h2>
            <p>
              By accessing or using the Crafted by Sru website, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, 
              you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) 
              on Crafted by Sru's website for personal, non-commercial transitory viewing only.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may not modify or copy the materials.</li>
              <li>You may not use the materials for any commercial purpose.</li>
              <li>You may not attempt to decompile or reverse engineer any software contained on the website.</li>
              <li>You may not remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Disclaimer</h2>
            <p>
              The materials on Crafted by Sru's website are provided on an 'as is' basis. Crafted by Sru 
              makes no warranties, expressed or implied, and hereby disclaims and negates all other 
              warranties including, without limitation, implied warranties or conditions of 
              merchantability, fitness for a particular purpose, or non-infringement of intellectual 
              property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Limitations</h2>
            <p>
              In no event shall Crafted by Sru or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use the materials on Crafted by Sru's website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of 
              India, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Changes to Terms</h2>
            <p>
              Crafted by Sru may revise these terms of service for its website at any time without notice. 
              By using this website you are agreeing to be bound by the then current version of these 
              terms of service.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
