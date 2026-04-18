"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle2, Package, Truck, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?orderId=${id}`);
        if (res.ok) {
          const data = await res.json();
          // Find the specific order in the list (or update API to fetch single order)
          const foundOrder = Array.isArray(data) ? data.find((o: any) => o.id === id) : data;
          setOrder(foundOrder);
        } else {
          toast.error("Failed to load order details");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Confirming your order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h1 className="font-serif text-4xl text-amber-950 mb-4">Order Not Found</h1>
        <p className="text-amber-900/60 mb-8">We couldn't find the order you're looking for.</p>
        <Link href="/catalog" className="px-8 py-4 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-amber-50/30">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-16 border border-amber-900/10 shadow-sm space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-600 rounded-full mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-amber-950">Thank you for your order</h1>
            <p className="text-amber-900/60 max-w-md mx-auto">
              Your order <span className="font-bold text-amber-950">#{order.id.slice(-8).toUpperCase()}</span> has been placed successfully and is being processed by our artisans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-amber-900/5">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-amber-950">
                <Package size={18} className="text-amber-900/40" />
                <h3 className="text-[10px] uppercase tracking-widest font-bold">Order Summary</h3>
              </div>
              <div className="space-y-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 overflow-hidden">
                        <img src={item.imageUrl || item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-950">{item.name}</p>
                        <p className="text-[10px] text-amber-900/40">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-amber-950">₹{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
                <div className="pt-4 border-t border-amber-900/5 flex justify-between items-center">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Total Paid</p>
                  <p className="text-xl font-serif text-amber-950">₹{order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-amber-950">
                <Truck size={18} className="text-amber-900/40" />
                <h3 className="text-[10px] uppercase tracking-widest font-bold">Shipping Details</h3>
              </div>
              <div className="space-y-4">
                <div className="text-xs text-amber-900/60 leading-relaxed">
                  <p className="font-medium text-amber-950 mb-1">{order.customer?.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-amber-900/40 mb-1">Estimated Delivery</p>
                  <p className="text-xs text-amber-950 font-medium">7-10 Business Days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-amber-900/5 flex flex-col md:flex-row gap-4">
            <Link 
              href="/catalog"
              className="flex-1 py-5 border border-amber-900/20 text-amber-950 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-50 transition-all text-center flex items-center justify-center gap-3"
            >
              <ShoppingBag size={14} />
              Continue Shopping
            </Link>
            <Link 
              href="/dashboard"
              className="flex-1 py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all text-center flex items-center justify-center gap-3"
            >
              <ArrowLeft size={14} />
              My Account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
