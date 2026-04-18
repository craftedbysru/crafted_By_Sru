"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();

  const isMerchantRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/merchant-login");

  // Hide footer on dashboard and merchant login pages
  if (isMerchantRoute) {
    return null;
  }

  return (
    <footer className="py-24 px-6 border-t border-amber-900/10 mt-32 bg-amber-950 text-amber-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span className="font-serif italic text-3xl tracking-tighter text-white">Crafted by Sru</span>
          </Link>
          <p className="text-sm opacity-60 max-w-sm leading-relaxed text-amber-50/80">
            Celebrating the beauty of handmade artistry. Each piece is uniquely crafted with passion and precision, preserving centuries-old Indian traditions for the modern home.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.4em] mb-8 text-amber-200 font-bold">Support</h4>
          <ul className="space-y-4 text-sm opacity-60 text-amber-50/80">
            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
            <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Reach Out</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.4em] mb-8 text-amber-200 font-bold">Social</h4>
          <ul className="space-y-4 text-sm opacity-60 text-amber-50/80">
            <li><Link href="#" className="hover:text-white transition-colors">Instagram</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Twitter</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Pinterest</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] opacity-40 text-amber-50/60">
        <p>© 2026 Crafted by Sru. All rights reserved.</p>
        <div className="flex gap-10">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/merchant-login" className="text-amber-200 font-bold opacity-100 hover:text-white transition-colors">Merchant Portal</Link>
        </div>
      </div>
    </footer>
  );
};
