"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Suspense } from "react";

function SignInForm() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

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
        toast.success("Welcome back!");
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Verifying Session...</div>
      </div>
    );
  }

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
            <User size={32} />
          </div>
          <h1 className="font-serif text-4xl text-amber-950 mb-2">Welcome Back</h1>
          <p className="text-xs text-amber-900/40 tracking-widest uppercase">Sign in to your account</p>
        </div>

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
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 flex items-center gap-2">
              <Lock size={12} />
              Password
            </label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3"
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-widest text-amber-900/30 leading-relaxed">
            New to Crafted by Sru?<br />
            <Link href="/auth/signup" className="text-amber-900/60 hover:text-amber-950 transition-colors font-bold">Create an Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Loading...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
