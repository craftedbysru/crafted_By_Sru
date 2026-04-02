"use client";

import React from "react";
import { motion } from "motion/react";

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-serif text-5xl text-amber-950 mb-12">Privacy Policy</h1>
        
        <div className="prose prose-amber max-w-none space-y-8 text-amber-900/80 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Our Commitment</h2>
            <p>
              At Crafted by Sru, we value the trust you place in us when sharing your personal information. 
              This Privacy Policy explains how we collect, use, and protect your data when you visit our 
              website or interact with our services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address.</li>
              <li><strong>Order Details:</strong> Purchase history, billing address, and payment information (processed securely).</li>
              <li><strong>Account Information:</strong> Login credentials and preferences.</li>
              <li><strong>Concierge Consultation:</strong> Information shared during custom order discussions.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">How We Use Your Data</h2>
            <p>
              Your information is used to provide and improve our services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processing and fulfilling your orders.</li>
              <li>Communicating with you about your account or purchases.</li>
              <li>Personalizing your shopping experience.</li>
              <li>Sending marketing communications (with your consent).</li>
              <li>Improving our website and service offerings.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information 
              from unauthorized access, disclosure, or misuse. Your payment details are processed 
              through secure, PCI-compliant payment gateways.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Sharing Your Information</h2>
            <p>
              We do not sell your personal information to third parties. We only share data with 
              trusted service providers (e.g., shipping partners, payment processors) necessary 
              to fulfill our services to you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-amber-950 mb-4">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information at any time. 
              You can manage your preferences through your account settings or by contacting our 
              concierge service.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
