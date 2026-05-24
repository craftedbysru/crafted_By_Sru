"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to send reset link");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-amber-50/30 p-12 border border-amber-900/10 shadow-sm"
      >
        <Link href="/auth/signin" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-900/40 hover:text-amber-950 transition-colors mb-8 group">
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <h1 className="font-serif text-4xl text-amber-950 mb-4">Reset Password</h1>
        
        {submitted ? (
          <div className="space-y-6">
            <p className="text-sm text-amber-900/60 leading-relaxed">
              If an account is associated with <strong>{email}</strong>, we have sent a secure link to reset your password. Please check your inbox.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-amber-900/40 uppercase tracking-widest mb-10">We'll email you a secure link to reset your password.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 flex items-center gap-2">
                  <Mail size={12} />
                  Email Address
                </label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                  placeholder="you@example.com"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
