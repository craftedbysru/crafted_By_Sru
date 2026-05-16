"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { XCircle, RefreshCcw, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";

function OrderFailureContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const errorCode = searchParams.get("code");
  const errorDesc = searchParams.get("desc");
  const errorMessage = searchParams.get("error");

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-red-50/10">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 border border-red-900/10 shadow-xl space-y-10 text-center"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-600 rounded-full mb-4">
              <XCircle size={40} />
            </div>
            <h1 className="font-serif text-4xl text-amber-950">Payment Unsuccessful</h1>
            <p className="text-amber-900/60 max-w-sm mx-auto">
              We couldn't process your payment for order <span className="font-bold text-amber-950 uppercase">#{String(id).slice(-8)}</span>.
            </p>
          </div>

          <div className="bg-red-50 p-6 rounded-lg text-left border border-red-100">
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-red-600 mt-1" size={18} />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-red-900/40 mb-1">Error Details</p>
                <p className="text-sm font-medium text-red-900 leading-relaxed">
                  {errorDesc || errorMessage || "The transaction was declined by the provider or interrupted."}
                </p>
                {errorCode && (
                  <p className="text-[10px] bg-red-900/10 inline-block px-2 py-0.5 rounded mt-2 font-mono text-red-700">
                    Code: {errorCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-amber-900/60 italic">
            <p>Don't worry, your items are still in your cart. You can try the payment again or use a different payment method.</p>
          </div>

          <div className="pt-6 flex flex-col md:flex-row gap-4">
            <button 
              onClick={() => router.push('/cart')}
              className="flex-1 py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3"
            >
              <RefreshCcw size={14} />
              Retry Payment
            </button>
            <Link 
              href="/catalog"
              className="flex-1 py-5 border border-amber-900/20 text-amber-950 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-50 transition-all flex items-center justify-center gap-3"
            >
              <ArrowLeft size={14} />
              Back to Catalog
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderFailurePage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-red-50/10">
         <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Processing Error Details...</div>
       </div>
    }>
      <OrderFailureContent />
    </Suspense>
  );
}
