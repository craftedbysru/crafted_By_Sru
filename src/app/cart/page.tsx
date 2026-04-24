"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CheckoutButton from "@/components/CheckoutButton";
import { getPlaceholderImage } from "@/lib/images";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
      setCart(savedCart);
      setLoading(false);
    };

    loadCart();
    window.addEventListener("sru_cart_change", loadCart);
    return () => window.removeEventListener("sru_cart_change", loadCart);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(25, item.quantity + delta);
        if (newQty > (item.stock || 999)) {
          toast.error(`Only ${item.stock} items available in stock.`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem("sru_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("sru_cart_change"));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("sru_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("sru_cart_change"));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Loading Cart...</div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center gap-8">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-900/30">
          <ShoppingBag size={32} />
        </div>
        <div className="text-center">
          <h1 className="font-serif text-4xl text-amber-950 mb-2">Your cart is empty</h1>
          <p className="text-sm text-amber-900/50">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link href="/catalog" className="px-8 py-4 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <h1 className="font-serif text-5xl md:text-7xl text-amber-950 mb-16">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-6 pb-8 border-b border-amber-900/10"
              >
                <Link href={`/product/${item.id}`} className="w-24 h-32 bg-amber-50 overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
                  <img 
                    src={item.imageUrl || item.image || getPlaceholderImage(item.category)} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1 text-amber-900">{item.category}</p>
                      <Link href={`/product/${item.id}`} className="text-base font-medium text-amber-950 hover:underline">{item.name}</Link>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-amber-900/30 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-amber-900/10">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-amber-50 transition-colors text-amber-900"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-xs font-medium text-amber-950">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-amber-50 transition-colors text-amber-900"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-amber-950">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="bg-amber-50/50 p-8 flex flex-col gap-8 sticky top-32">
          <h2 className="text-[11px] uppercase tracking-[0.4em] text-amber-900 font-bold">Order Summary</h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm">
              <span className="text-amber-900/60">Subtotal</span>
              <span className="text-amber-950">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-amber-900/60">Shipping</span>
              <span className="text-amber-950">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="h-px bg-amber-900/10 w-full my-2"></div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-amber-950">Total</span>
              <span className="text-amber-950">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3"
          >
            Proceed to Checkout
            <ArrowRight size={16} />
          </Link>

          <p className="text-[10px] uppercase tracking-widest text-center opacity-30 text-amber-900">
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
