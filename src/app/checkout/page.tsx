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
import { useCMS } from "@/hooks/useCMS";

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
    street2: "",
    city: "",
    postalCode: "",
    country: "India",
    phone: ""
  });

  const [packagingDetails, setPackagingDetails] = useState("Heritage Box");
  const [deliveryType, setDeliveryType] = useState("Express Heritage Delivery");

  // Fetch shipping config from CMS
  const { content: shippingConfig, loading: loadingCMS } = useCMS("config");
  const shippingRules = shippingConfig.find(c => c.section === "shipping")?.content || {
    baseCharge: 500,
    freeAbove: 25000,
    perItemSurcharge: 50
  };
  const categoryModifiers = shippingConfig.find(c => c.section === "shipping-categories")?.content?.categories || [];

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

    // Pre-populate address if available in session/user profile
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const profile = await res.json();
          if (profile.addresses && profile.addresses.length > 0) {
            const addr = profile.addresses[0];
            setAddress({
              firstName: profile.name?.split(" ")[0] || "",
              lastName: profile.name?.split(" ").slice(1).join(" ") || "",
              street: addr.street || "",
              street2: addr.street2 || "",
              city: addr.city || "",
              postalCode: addr.zipCode || "",
              country: addr.country || "India",
              phone: profile.phone || ""
            });
          } else if (profile.phone) {
            setAddress(prev => ({ ...prev, phone: profile.phone }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile for checkout", err);
      }
    };
    fetchUserData();

    setLoading(false);
  }, [status, router]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Dynamic Shipping Calculation based on CMS rules
  const calculateShipping = () => {
    if (subtotal >= (Number(shippingRules.freeAbove) || 25000)) return 0;
    
    let totalShipping = Number(shippingRules.baseCharge) || 0;
    
    // per item surcharge
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    totalShipping += totalItems * (Number(shippingRules.perItemSurcharge) || 0);
    
    // category premiums
    cart.forEach(item => {
      const modifier = categoryModifiers.find((m: any) => m.id === item.categoryId || m.name === item.category);
      if (modifier && modifier.premium) {
        totalShipping += Number(modifier.premium) * item.quantity;
      }
    });
    
    return totalShipping;
  };

  const shipping = calculateShipping();
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

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Apartment, suite, etc. (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="Apartment number, floor, etc."
                      value={address.street2}
                      onChange={(e) => setAddress({...address, street2: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-950/20 py-3 focus:outline-none focus:border-amber-950 transition-colors text-amber-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Street Address</label>
                    <input 
                      type="text" 
                      placeholder="Street name and house number"
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-950/20 py-3 focus:outline-none focus:border-amber-950 transition-colors text-amber-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Mobile Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 9876543210"
                      value={address.phone}
                      onChange={(e) => setAddress({...address, phone: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-950/20 py-3 focus:outline-none focus:border-amber-950 transition-colors text-amber-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                <button 
                  onClick={() => {
                    if (!address.firstName || !address.lastName || !address.street || !address.city || !address.postalCode || !address.phone) {
                      toast.error("Please fill in all shipping details and mobile number");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all shadow-lg"
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
                  <h3 className="font-serif text-2xl text-amber-950">Delivery Method</h3>
                  <div className="space-y-4">
                    <div 
                      className="w-full p-8 border-2 border-amber-950 bg-white flex justify-between items-center"
                    >
                      <div className="flex gap-6 items-center">
                        <div className="w-6 h-6 flex items-center justify-center text-amber-950">
                          <ShoppingBag size={24} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold uppercase tracking-widest text-amber-950">Express Heritage Delivery</p>
                          <p className="text-[10px] text-amber-900/40">Estimated delivery: 10-15 business days</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-amber-950">₹{shipping.toLocaleString()}</span>
                    </div>
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
