"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, User, UserPlus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Suspense } from "react";

function SignUpForm() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
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
      // 1. Create the user
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        toast.error(signupData.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Signing you in...");

      // 2. Automatically sign in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Account created, but automatic sign-in failed. Please sign in manually.");
        router.push("/auth/signin");
      } else {
        toast.success("Welcome to Crafted by Sru!");
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Signup error:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-amber-50/30 p-12 border border-amber-900/10"
      >
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-amber-950 text-white rounded-full flex items-center justify-center mb-6">
            <UserPlus size={32} />
          </div>
          <h1 className="font-serif text-4xl text-amber-950 mb-2">Join Our Community</h1>
          <p className="text-xs text-amber-900/40 tracking-widest uppercase">Create your artisan account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 flex items-center gap-2">
              <User size={12} />
              Full Name
            </label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
              placeholder="John Doe"
            />
          </div>
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
              minLength={6}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3"
          >
            {loading ? "Creating Account..." : "Create Account"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-widest text-amber-900/30 leading-relaxed">
            Already have an account?<br />
            <Link href="/auth/signin" className="text-amber-900/60 hover:text-amber-950 transition-colors font-bold">Sign In Instead</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Loading...</div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
