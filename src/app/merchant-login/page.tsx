"use client";

import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MerchantLoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "merchant") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Verifying Access...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success("Welcome back, Merchant!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-amber-50/30 p-12 border border-amber-900/10"
      >
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-amber-950 text-white rounded-full flex items-center justify-center mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="font-serif text-4xl text-amber-950 mb-2">Merchant Access</h1>
          <p className="text-xs text-amber-900/40 tracking-widest uppercase">Secure portal for heritage partners</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 flex items-center gap-2">
              <Mail size={12} />
              Merchant Email
            </label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
              placeholder="merchant@craftedbysru.com"
              autoComplete="off"
              name="merchant-email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 flex items-center gap-2">
              <Lock size={12} />
              Security Password
            </label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
              placeholder="••••••••"
              autoComplete="new-password"
              name="merchant-password"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3"
          >
            {loading ? "Authenticating..." : "Enter Portal"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-widest text-amber-900/30 leading-relaxed">
            Unauthorized access is strictly prohibited.<br />
            Please contact support for merchant registration.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
