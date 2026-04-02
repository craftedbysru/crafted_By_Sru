"use client";

import React from "react";
import { motion } from "motion/react";

export default function ReturnsPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-serif text-5xl text-amber-950 mb-12">Returns & Exchanges</h1>
        
        <div className="prose prose-amber max-w-none space-y-8 text-amber-900/80 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Our Policy</h2>
            <p>
              At Crafted by Sru, we strive for perfection in every piece we curate. 
              Due to the artisanal and handcrafted nature of our products, each item is unique and may 
              exhibit slight variations in color, texture, and finish. These are not defects but 
              characteristics of the handmade process.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Returns for Damaged Goods</h2>
            <p>
              We only accept returns or exchanges if the product is received in a damaged condition. 
              Please follow these steps to initiate a return:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Notification:</strong> Contact our concierge within 48 hours of delivery.</li>
              <li><strong>Proof:</strong> Provide clear photographs of the damaged item and its packaging.</li>
              <li><strong>Unboxing Video:</strong> We strongly recommend recording an unboxing video for all high-value items.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Non-Returnable Items</h2>
            <p>
              The following items are not eligible for return or exchange:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Custom-made or personalized orders.</li>
              <li>Bulk return gift orders (unless damaged).</li>
              <li>Items purchased during a sale or promotional event.</li>
              <li>Items showing signs of use or damage after delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Exchange Process</h2>
            <p>
              If your return is approved, we will offer a replacement of the same item (subject to availability). 
              If the item is out of stock, we will provide a store credit or a full refund to your original 
              payment method.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Refund Timeline</h2>
            <p>
              Refunds are processed within 7-10 business days after we receive and inspect the returned item. 
              The credit will appear in your account depending on your bank's processing times.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
