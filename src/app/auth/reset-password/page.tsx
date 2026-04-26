"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      router.push("/auth/signin");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        toast.success("Password reset successfully");
        router.push("/auth/signin");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-amber-50/30 p-12 border border-amber-900/10 shadow-sm"
      >
        <h1 className="font-serif text-4xl text-amber-950 mb-4">New Password</h1>
        <p className="text-xs text-amber-900/40 uppercase tracking-widest mb-10">Set a secure password for your account.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 flex items-center gap-2">
                <Lock size={12} />
                New Password
              </label>
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-amber-900/40 hover:text-amber-950 transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <input 
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 flex items-center gap-2">
              <Lock size={12} />
              Confirm Password
            </label>
            <input 
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Loading...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
