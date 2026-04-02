"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { Package, User, LogOut, ChevronRight, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses">("orders");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });
  const [isValidatingPincode, setIsValidatingPincode] = useState(false);

  useEffect(() => {
    const validatePincode = async () => {
      if (newAddress.zipCode.length === 6 && newAddress.country.toLowerCase() === "india") {
        setIsValidatingPincode(true);
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${newAddress.zipCode}`);
          const data = await response.json();
          if (data && data[0] && data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setNewAddress(prev => ({
              ...prev,
              city: postOffice.District,
              state: postOffice.State
            }));
            toast.success(`Location identified: ${postOffice.District}, ${postOffice.State}`);
          } else {
            toast.error("Invalid Pincode for India. Please check and try again.");
          }
        } catch (error) {
          console.error("Pincode validation error:", error);
          toast.error("Failed to validate pincode. Please enter manually.");
        } finally {
          setIsValidatingPincode(false);
        }
      }
    };

    const timer = setTimeout(() => {
      validatePincode();
    }, 500);

    return () => clearTimeout(timer);
  }, [newAddress.zipCode, newAddress.country]);

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchData();
    }
  }, [status, session, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, addressesRes] = await Promise.all([
        fetch(`/api/orders?customerUid=${session?.user?.id}`),
        fetch("/api/address")
      ]);
      const ordersData = await ordersRes.json();
      const addressesData = await addressesRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setAddresses(Array.isArray(addressesData) ? addressesData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load account information");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidatingPincode) {
      toast.error("Please wait for pincode validation to complete");
      return;
    }
    try {
      const response = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        toast.success("Address added successfully");
        setIsAddressModalOpen(false);
        setNewAddress({ street: "", city: "", state: "", zipCode: "", country: "India" });
        fetchData();
      } else {
        toast.error("Failed to add address");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const response = await fetch(`/api/address/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Address deleted");
        fetchData();
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Loading Account...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-1 space-y-12">
          <div className="flex items-center gap-4 p-6 bg-white border border-amber-900/10 shadow-sm">
            <div className="w-16 h-16 bg-amber-950 rounded-full flex items-center justify-center text-white border border-amber-900/10">
              <User size={32} />
            </div>
            <div>
              <h1 className="font-serif text-2xl text-amber-950">{session?.user?.name || "Member"}</h1>
              <p className="text-xs text-amber-900/40 tracking-widest uppercase">{session?.user?.email}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 bg-white border border-amber-900/10 shadow-sm overflow-hidden">
            <button 
              onClick={() => setActiveTab("orders")}
              className={`flex items-center justify-between p-6 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                activeTab === "orders" ? "bg-amber-950 text-white" : "text-amber-900/60 hover:bg-amber-50"
              }`}
            >
              Order History
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center justify-between p-6 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                activeTab === "addresses" ? "bg-amber-950 text-white" : "text-amber-900/60 hover:bg-amber-50"
              }`}
            >
              Addresses
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-3 p-6 text-amber-900/60 hover:text-red-600 transition-colors text-[10px] uppercase tracking-widest font-bold border-t border-amber-900/5"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </nav>
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === "orders" ? (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <h2 className="font-serif text-4xl text-amber-950 mb-12">Your Orders</h2>

                {(!Array.isArray(orders) || orders.length === 0) ? (
                  <div className="bg-amber-50/30 p-16 flex flex-col items-center justify-center text-center gap-6">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-900/20">
                      <Package size={28} />
                    </div>
                    <div>
                      <p className="text-amber-950 font-medium mb-1">No orders yet</p>
                      <p className="text-xs text-amber-900/40 tracking-widest uppercase">When you place an order, it will appear here.</p>
                    </div>
                    <Link href="/catalog" className="px-8 py-4 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Array.isArray(orders) && orders.map((order) => (
                      <motion.div 
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-amber-900/10 p-8 hover:bg-amber-50/30 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-amber-900/10">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900/40">Order Number</p>
                            <p className="text-sm font-medium text-amber-950">#{order.id.slice(-8).toUpperCase()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900/40">Date Placed</p>
                            <p className="text-sm font-medium text-amber-950">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900/40">Status</p>
                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-[10px] uppercase tracking-widest font-bold">
                              {order.status}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900/40">Total Amount</p>
                            <p className="text-sm font-medium text-amber-950">${order.total.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center bg-white p-3 border border-amber-900/5">
                              <div className="w-12 h-16 bg-amber-50 overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover grayscale"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-amber-950">{item.name}</p>
                                <p className="text-[10px] text-amber-900/40 uppercase tracking-widest">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="addresses"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="flex justify-between items-center mb-12">
                  <h2 className="font-serif text-4xl text-amber-950">Your Addresses</h2>
                  <button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="px-6 py-3 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all"
                  >
                    Add New Address
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="bg-amber-50/30 p-16 flex flex-col items-center justify-center text-center gap-6">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-900/20">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <p className="text-amber-950 font-medium mb-1">No addresses saved</p>
                      <p className="text-xs text-amber-900/40 tracking-widest uppercase">Add an address to speed up your checkout process.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-amber-900/10 p-8 bg-white relative group">
                        <button 
                          onClick={() => handleDeleteAddress(address.id)}
                          className="absolute top-4 right-4 text-amber-900/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <p className="text-sm text-amber-950 mb-1">{address.street}</p>
                        <p className="text-sm text-amber-950 mb-1">{address.city}, {address.state} {address.zipCode}</p>
                        <p className="text-sm text-amber-950">{address.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute inset-0 bg-amber-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white p-12 shadow-2xl"
            >
              <h3 className="font-serif text-2xl text-amber-950 mb-8">Add New Address</h3>
              <form onSubmit={handleAddAddress} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Street Address</label>
                  <input 
                    required
                    type="text" 
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                    className="w-full bg-transparent border-b border-amber-900/20 py-2 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">City / District</label>
                    <input 
                      required
                      readOnly={isValidatingPincode}
                      type="text" 
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-2 focus:outline-none focus:border-amber-900 transition-colors text-amber-950 disabled:opacity-50"
                      placeholder={isValidatingPincode ? "Validating..." : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">State</label>
                    <input 
                      required
                      readOnly={isValidatingPincode}
                      type="text" 
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-2 focus:outline-none focus:border-amber-900 transition-colors text-amber-950 disabled:opacity-50"
                      placeholder={isValidatingPincode ? "Validating..." : ""}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Zip Code</label>
                    <input 
                      required
                      type="text" 
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-2 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Country</label>
                    <input 
                      required
                      type="text" 
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-2 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all mt-4"
                >
                  Save Address
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
