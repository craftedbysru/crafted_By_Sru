"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, User, UserPlus, Phone } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Suspense } from "react";
import { countryCodes } from "@/lib/countryCodes";

function SignUpForm() {
  const { data: session, status } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
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
      // 1. Initialise SignUp & send OTP
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: `${firstName} ${lastName}`, 
          firstName, 
          lastName, 
          phone: `${countryCode}${phone}`, 
          email, 
          password 
        }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        toast.error(signupData.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      if (signupData.otpRequired) {
        toast.success("A secure verification OTP has been sent to your email!");
        setOtpSent(true);
      } else {
        // Fallback for immediate creation configurations
        toast.success("Account created successfully!");
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          router.push("/auth/signin");
        } else {
          router.push(callbackUrl);
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }
    setOtpLoading(true);

    try {
      // 2. Verify OTP & complete account creation
      const verifyRes = await fetch("/api/auth/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        toast.error(verifyData.error || "Invalid OTP code. Please retry or sign up again.");
        return;
      }

      toast.success("Email verified and account created successfully!");

      // 3. Automatically sign in
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
      console.error("OTP verification error:", error);
      toast.error("Verification failed unexpectedly. Please try again.");
    } finally {
      setOtpLoading(false);
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
        {otpSent ? (
          <>
            <div className="flex flex-col items-center text-center mb-12">
              <div className="w-16 h-16 bg-amber-950 text-white rounded-full flex items-center justify-center mb-6">
                <Mail size={32} />
              </div>
              <h1 className="font-serif text-4xl text-amber-950 mb-2">Verify Your Email</h1>
              <p className="text-xs text-amber-900/40 tracking-widest mb-4">
                <span className="uppercase">Code sent to </span>
                <span className="lowercase font-semibold text-amber-950">{email}</span>
              </p>
              <p className="text-xs text-amber-900/60 leading-relaxed max-w-xs">
                To confirm the credibility of your account, please check your inbox and enter the 6-digit OTP code below.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 text-center block">
                  6-Digit OTP Code
                </label>
                <input 
                  required
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-transparent border-b border-amber-900/25 py-3 text-center focus:outline-none focus:border-amber-900 transition-colors text-amber-950 font-mono text-2xl tracking-[0.4em] placeholder:text-amber-900/10"
                  placeholder="000000"
                />
              </div>

              <button 
                type="submit"
                disabled={otpLoading}
                className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {otpLoading ? "Verifying..." : "Verify & Sign In"}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
                className="text-[10px] uppercase tracking-widest text-amber-900/60 hover:text-amber-950 transition-colors font-bold"
              >
                Back to Sign Up Details
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-12">
              <div className="w-16 h-16 bg-amber-950 text-white rounded-full flex items-center justify-center mb-6">
                <UserPlus size={32} />
              </div>
              <h1 className="font-serif text-4xl text-amber-950 mb-2">Join Our Community</h1>
              <p className="text-xs text-amber-900/40 tracking-widest uppercase">Create your heritage account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">First Name</label>
                  <input 
                    required
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Last Name</label>
                  <input 
                    required
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 flex items-center gap-2">
                  <Phone size={12} />
                  Mobile Number
                </label>
                <div className="flex gap-2 border-b border-amber-900/20 py-1 items-center focus-within:border-amber-900 transition-colors">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-transparent text-amber-950 font-bold py-2 focus:outline-none cursor-pointer border-r border-amber-900/10 pr-2 text-xs"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input 
                    required
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-transparent py-2 focus:outline-none text-amber-950 text-sm"
                    placeholder="Enter mobile number"
                  />
                </div>
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
                  autoComplete="off"
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
                  autoComplete="new-password"
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
          </>
        )}
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
