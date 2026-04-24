"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShoppingBag, ChevronRight, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import CheckoutButton from "@/components/CheckoutButton";
import { getPlaceholderImage } from "@/lib/images";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Delivery, 3: Payment
  
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "India",
    phone: ""
  });

  const [packagingDetails, setPackagingDetails] = useState("Heritage Box");
  const [deliveryType, setDeliveryType] = useState("Standard Artisan Shipping");

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to proceed");
      router.push("/auth/signin?callbackUrl=/checkout");
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
    if (savedCart.length === 0) {
      router.push("/cart");
      return;
    }
    setCart(savedCart);
    setLoading(false);
  }, [status, router]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 250;
  const total = subtotal + shipping;

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Preparing Checkout...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-12">
            <header>
              <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-900/40 hover:text-amber-950 transition-colors mb-8">
                <ArrowLeft size={14} /> Back to Catalog
              </Link>
              <h1 className="font-serif text-5xl md:text-7xl text-amber-950 mb-4">Finishing Your Selection</h1>
              <p className="text-amber-900/60 max-w-md">Each piece is handcrafted and packed with care. Please provide your details to ensure a seamless arrival of your heritage treasures.</p>
            </header>

            {/* Stepper */}
            <div className="flex items-center gap-8 border-b border-amber-950/10 pb-4">
              <div className={`flex items-center gap-3 ${step >= 1 ? 'text-amber-950' : 'text-amber-900/30'}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest">01 Shipping</span>
              </div>
              <div className="w-12 h-px bg-amber-950/10" />
              <div className={`flex items-center gap-3 ${step >= 2 ? 'text-amber-950' : 'text-amber-900/30'}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest">02 Delivery</span>
              </div>
              <div className="w-12 h-px bg-amber-950/10" />
              <div className={`flex items-center gap-3 ${step >= 3 ? 'text-amber-950' : 'text-amber-900/30'}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest">03 Payment</span>
              </div>
            </div>

            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Ananya"
                      value={address.firstName}
                      onChange={(e) => setAddress({...address, firstName: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-950/20 py-3 focus:outline-none focus:border-amber-950 transition-colors text-amber-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Iyer"
                      value={address.lastName}
                      onChange={(e) => setAddress({...address, lastName: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-950/20 py-3 focus:outline-none focus:border-amber-950 transition-colors text-amber-950"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Address</label>
                  <input 
                    type="text" 
                    placeholder="Street name and house number"
                    value={address.street}
                    onChange={(e) => setAddress({...address, street: e.target.value})}
                    className="w-full bg-transparent border-b border-amber-950/20 py-3 focus:outline-none focus:border-amber-950 transition-colors text-amber-950"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">City</label>
                    <input 
                      type="text" 
                      placeholder="Jaipur"
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-950/20 py-3 focus:outline-none focus:border-amber-950 transition-colors text-amber-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Postal Code</label>
                    <input 
                      type="text" 
                      placeholder="302001"
                      value={address.postalCode}
                      onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-950/20 py-3 focus:outline-none focus:border-amber-950 transition-colors text-amber-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Country</label>
                    <select 
                      value={address.country}
                      onChange={(e) => setAddress({...address, country: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-950/20 py-3 focus:outline-none focus:border-amber-950 transition-colors text-amber-950"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                  </div>
                </div>

                <div className="bg-amber-50 p-8 rounded-sm space-y-6">
                  <div className="flex gap-4">
                    <div className="p-3 bg-amber-900/10 rounded-full h-fit">
                      <ShieldCheck size={20} className="text-amber-900" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-amber-950 mb-1">Sustainability at Heart</h4>
                      <p className="text-xs text-amber-900/60 leading-relaxed">Our packaging is 100% plastic-free, using hand-pressed recycled paper and organic cotton ties.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPackagingDetails("Heritage Box")}
                      className={`p-6 border-2 text-left flex items-start gap-4 group ${packagingDetails === "Heritage Box" ? "border-amber-950 bg-white" : "border-amber-950/10 bg-white/50"}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-4 mt-1 ${packagingDetails === "Heritage Box" ? "border-amber-950" : "border-amber-950/20"}`} />
                      <div>
                        <p className="text-xs font-bold text-amber-950 uppercase tracking-widest">Heritage Box</p>
                        <p className="text-[10px] text-amber-900/40">Recycled fiberboard with gold foil</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setPackagingDetails("Minimalist Wrap")}
                      className={`p-6 border-2 text-left flex items-start gap-4 group ${packagingDetails === "Minimalist Wrap" ? "border-amber-950 bg-white" : "border-amber-950/10 bg-white/50"}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-4 mt-1 ${packagingDetails === "Minimalist Wrap" ? "border-amber-950" : "border-amber-950/20"}`} />
                      <div>
                        <p className="text-xs font-bold text-amber-950 uppercase tracking-widest">Minimalist Wrap</p>
                        <p className="text-[10px] text-amber-900/40">Zero-waste linen bundle</p>
                      </div>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!address.firstName || !address.lastName || !address.street || !address.city || !address.postalCode) {
                      toast.error("Please fill in all shipping details");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all"
                >
                  Continue to Delivery
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl text-amber-950">Select Delivery Method</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setDeliveryType("Standard Artisan Shipping")}
                      className={`w-full p-8 border-2 flex justify-between items-center ${deliveryType === "Standard Artisan Shipping" ? "border-amber-950 bg-white" : "border-amber-950/10 bg-white/50"}`}
                    >
                      <div className="flex gap-6 items-center">
                        <Truck size={24} className={deliveryType === "Standard Artisan Shipping" ? "text-amber-950" : "text-amber-900/40"} />
                        <div className="text-left">
                          <p className={`text-sm font-bold uppercase tracking-widest ${deliveryType === "Standard Artisan Shipping" ? "text-amber-950" : "text-amber-900/40"}`}>Standard Artisan Shipping</p>
                          <p className="text-[10px] text-amber-900/40">Estimated delivery: 10-15 business days</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-amber-950">₹250.00</span>
                    </button>
                    <button 
                      onClick={() => setDeliveryType("Express Heritage Delivery")}
                      className={`w-full p-8 border-2 flex justify-between items-center ${deliveryType === "Express Heritage Delivery" ? "border-amber-950 bg-white" : "border-amber-950/10 bg-white/50"}`}
                    >
                      <div className="flex gap-6 items-center">
                        <div className={`w-6 h-6 flex items-center justify-center ${deliveryType === "Express Heritage Delivery" ? "text-amber-950" : "text-amber-900/40"}`}>
                          <ShoppingBag size={24} />
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-bold uppercase tracking-widest ${deliveryType === "Express Heritage Delivery" ? "text-amber-950" : "text-amber-900/40"}`}>Express Heritage Delivery</p>
                          <p className="text-[10px] text-amber-900/40">Estimated delivery: 10-15 business days</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-amber-950">₹650.00</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(3)}
                  className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all"
                >
                  Continue to Payment
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="w-full py-3 text-[10px] uppercase tracking-widest text-amber-900/40 font-bold hover:text-amber-950 transition-colors"
                >
                  Back to Shipping
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                <div className="bg-white border border-amber-950/10 p-10 space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-2xl text-amber-950">Payment Details</h3>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-amber-50 rounded" />
                      <div className="w-10 h-6 bg-amber-50 rounded" />
                      <div className="w-10 h-6 bg-amber-50 rounded" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-amber-900/60 leading-relaxed">
                    You will be redirected to Razorpay's secure payment gateway to complete your transaction. We support all major cards, UPI, and Net Banking.
                  </p>

                  <CheckoutButton
                    amount={total}
                    orderData={{
                      items: cart,
                      total: total,
                      shippingAddress: address,
                      packagingDetails: packagingDetails,
                      deliveryType: deliveryType
                    }}
                    onSuccess={(orderId) => {
                      localStorage.removeItem("sru_cart");
                      window.dispatchEvent(new Event("sru_cart_change"));
                      router.push(`/orders/${orderId}`);
                    }}
                    className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all"
                  >
                    Proceed to Checkout
                  </CheckoutButton>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-3 text-[10px] uppercase tracking-widest text-amber-900/40 font-bold hover:text-amber-950 transition-colors"
                >
                  Back to Delivery
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-10 border border-amber-950/5 sticky top-32 space-y-10">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl text-amber-950">Your Selection</h2>
                <p className="text-[10px] italic text-amber-900/40">Honoring Heritage, One Gift at a Time</p>
              </div>

              <div className="space-y-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-6">
                    <div className="w-20 h-24 bg-amber-50 overflow-hidden flex-shrink-0">
                      <img 
                        src={item.imageUrl || item.image || getPlaceholderImage(item.category)} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-medium text-amber-950">{item.name}</h4>
                        <p className="text-[10px] text-amber-900/40 uppercase tracking-widest mt-1">Crafted by Artisan</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] text-amber-900/60 uppercase tracking-widest">QTY: {item.quantity.toString().padStart(2, '0')}</p>
                        <p className="text-sm font-medium text-amber-950">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-amber-950/10">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-900/60">Subtotal</span>
                  <span className="text-amber-950">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-900/60">Shipping & Handling</span>
                  <span className="text-amber-950">₹{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-900/60">Eco-Packaging Tax</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="h-px bg-amber-950/10 w-full my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-3xl text-amber-950">Total</span>
                  <span className="font-serif text-3xl text-amber-950">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold text-amber-900/40">
                  <ShieldCheck size={12} /> Secure Payment
                </div>
                <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold text-amber-900/40">
                  <Truck size={12} /> Artisan Shipped
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
