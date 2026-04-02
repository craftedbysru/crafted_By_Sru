"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Thank you for your message. We'll get back to you soon!");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl text-amber-950 mb-12">Get in Touch</h1>
          <p className="text-amber-900/60 mb-16 max-w-md leading-relaxed">
            Whether you have a question about our catalog, a custom request, or just want to say hello, we'd love to hear from you.
          </p>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-900 flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900 mb-2">Email Us</h3>
                <p className="text-amber-950 font-medium">hello@craftedbysru.com</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-900 flex-shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900 mb-2">Call Us</h3>
                <p className="text-amber-950 font-medium">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-900 flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900 mb-2">Visit Us</h3>
                <p className="text-amber-950 font-medium max-w-[200px]">123 Artisan Lane, Creative District, Mumbai, India</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-amber-50/50 p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Message</label>
              <textarea 
                required
                rows={4}
                className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950 resize-none"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3"
            >
              {loading ? "Sending..." : "Send Message"}
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
