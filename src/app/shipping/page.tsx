"use client";

import React from "react";
import { motion } from "motion/react";

export default function ShippingPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-serif text-5xl text-amber-950 mb-12">Shipping & Delivery</h1>
        
        <div className="prose prose-amber max-w-none space-y-8 text-amber-900/80 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Our Commitment</h2>
            <p>
              At Crafted by Sru, we take immense pride in the safe and timely delivery of our curated artisan creations. 
              Each piece is meticulously packed to ensure it reaches you in perfect condition, preserving the artistry 
              and heritage it represents.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Processing Times</h2>
            <p>
              As many of our items are handcrafted or made-to-order by master artisans, processing times may vary:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>In-Stock Items:</strong> Dispatched within 2-3 business days.</li>
              <li><strong>Custom/Artisan Pieces:</strong> May require 7-14 business days for preparation.</li>
              <li><strong>Bulk/Return Gift Orders:</strong> Timeline will be discussed during the concierge consultation.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Delivery Estimates</h2>
            <p>
              We partner with premium courier services to ensure reliable delivery across India and internationally:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Domestic (India):</strong> 3-7 business days after dispatch.</li>
              <li><strong>International:</strong> 10-21 business days depending on the destination and customs processing.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Shipping Charges</h2>
            <p>
              Shipping costs are calculated at checkout based on the weight, dimensions, and destination of your order. 
              We offer complimentary domestic shipping on orders above ₹5,000.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Tracking Your Order</h2>
            <p>
              Once your order is dispatched, you will receive a confirmation email with a tracking number. 
              You can also track your order status through your account dashboard.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
