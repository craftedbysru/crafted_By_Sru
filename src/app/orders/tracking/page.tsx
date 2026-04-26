"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Search, Package, MapPin, Calendar, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setOrderId(id);
      trackOrder(id);
    }
  }, [searchParams]);

  const trackOrder = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?id=${id}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch (error: any) {
      toast.error(error.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    trackOrder(orderId);
  };

  const getStatusStep = (status: string) => {
    const steps = ["pending", "processing", "shipped", "delivered"];
    return steps.indexOf(status.toLowerCase());
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-amber-950 mb-6">Track Your Curation</h1>
          <p className="text-amber-900/60 max-w-lg mx-auto">
            Experience the journey of your handcrafted heritage. Enter your order ID to see the current status of your preservation.
          </p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-4 mb-16 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30" size={18} />
            <input 
              type="text"
              placeholder="Order ID (e.g., ORD-12345)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-white border border-amber-900/10 pl-12 pr-6 py-4 text-[12px] uppercase tracking-widest font-bold text-amber-950 focus:outline-none focus:border-amber-950 transition-colors"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-amber-950 text-white px-8 py-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-amber-900 transition-colors disabled:opacity-50"
          >
            {loading ? "Locating..." : "Track"}
          </button>
        </form>

        {order ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Status Stepper */}
            <div className="bg-white border border-amber-900/5 p-12 text-center shadow-sm">
              <div className="flex justify-between max-w-2xl mx-auto relative">
                <div className="absolute top-5 left-0 w-full h-[1px] bg-amber-900/10 -z-0" />
                <div 
                  className="absolute top-5 left-0 h-[1px] bg-amber-950 transition-all duration-1000 -z-0" 
                  style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                />
                
                {["Confirmed", "Processing", "Shipped", "Delivered"].map((label, i) => {
                  const isActive = i <= getStatusStep(order.status);
                  const isCurrent = i === getStatusStep(order.status);
                  
                  return (
                    <div key={label} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                        isActive ? "bg-amber-950 text-white scale-110 shadow-lg shadow-amber-950/20" : "bg-stone-100 text-amber-950/20 border border-amber-900/5"
                      )}>
                        {isActive ? <CheckCircle2 size={18} /> : <span>{i + 1}</span>}
                      </div>
                      <span className={cn(
                        "text-[9px] uppercase tracking-widest font-black",
                        isActive ? "text-amber-950" : "text-amber-900/20"
                      )}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-amber-900/5 p-8 space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-amber-900 border-b border-amber-900/10 pb-4">Consignment Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Package className="text-amber-900/30" size={18} />
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-amber-900/40 font-bold">Status</p>
                      <p className="text-xs uppercase font-black text-amber-950 tracking-widest">{order.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="text-amber-900/30" size={18} />
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-amber-900/40 font-bold">Placed On</p>
                      <p className="text-xs font-bold text-amber-950">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="text-amber-900/30" size={18} />
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-amber-900/40 font-bold">Destination</p>
                      <p className="text-xs font-bold text-amber-950">
                        {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-amber-900/5 p-8 space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-amber-900 border-b border-amber-900/10 pb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-amber-900/60 font-medium">
                        <span className="text-amber-950 font-bold">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="font-bold text-amber-950">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-amber-900/5 flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest font-black text-amber-950">Grand Total</span>
                    <span className="text-lg font-black text-amber-950">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : !loading && orderId && (
          <div className="text-center py-20 bg-white border border-dashed border-amber-900/20">
            <Clock className="mx-auto mb-4 text-amber-900/20" size={32} />
            <p className="text-amber-900/40 text-[10px] uppercase tracking-widest font-bold">No consignment found with this identity</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Identifying Heritage...</div>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
