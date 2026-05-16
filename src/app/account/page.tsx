"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { Package, User, LogOut, ChevronRight, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPlaceholderImage } from "@/lib/images";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: ""
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    street2: "",
    street3: "",
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
      fetchProfile();
    }
  }, [status, session, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile({
          firstName: data.firstName || data.name?.split(" ")[0] || "",
          lastName: data.lastName || data.name?.split(" ").slice(1).join(" ") || "",
          phone: data.phone || "",
          email: data.email || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

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
      const method = addressToEdit ? "PUT" : "POST";
      const url = addressToEdit ? `/api/address/${addressToEdit}` : "/api/address";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        toast.success(addressToEdit ? "Address updated successfully" : "Address added successfully");
        setIsAddressModalOpen(false);
        setAddressToEdit(null);
        setNewAddress({ name: "", phone: "", street: "", street2: "", street3: "", city: "", state: "", zipCode: "", country: "India" });
        fetchData();
      } else {
        toast.error("Failed to save address");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleEditAddress = (address: any) => {
    setAddressToEdit(address.id);
    setNewAddress({
      name: address.name || "",
      phone: address.phone || "",
      street: address.street || "",
      street2: address.street2 || "",
      street3: address.street3 || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "India"
    });
    setIsAddressModalOpen(true);
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        fetchProfile();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsUpdatingProfile(false);
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
          <div className="flex items-center gap-4 p-6 bg-bg-card border border-border-subtle shadow-sm">
            <div className="w-16 h-16 bg-amber-950 rounded-full flex items-center justify-center text-white border border-amber-900/10">
              <User size={32} />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-2xl text-amber-950 truncate">{session?.user?.name || "Guest"}</h1>
              <p className="text-xs text-amber-900/40 tracking-widest uppercase truncate">{session?.user?.email}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 bg-bg-card border border-border-subtle shadow-sm overflow-hidden">
            <button 
              onClick={() => setActiveTab("orders")}
              className={`flex items-center justify-between p-6 text-[10px] uppercase tracking-widest font-bold transition-colors relative ${
                activeTab === "orders" ? "bg-amber-950 text-white" : "text-amber-900/60 hover:bg-amber-50"
              }`}
            >
              <div className="flex items-center gap-2">
                Order History
                {orders.some(o => o.status?.toLowerCase() === "pending") && (
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                )}
              </div>
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
              onClick={() => setActiveTab("profile")}
              className={`flex items-center justify-between p-6 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                activeTab === "profile" ? "bg-amber-950 text-white" : "text-amber-900/60 hover:bg-amber-50"
              }`}
            >
              Your Profile
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
                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-border-subtle">
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
                            <div className="flex items-center gap-2">
                              <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${
                                order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' : 
                                order.status === 'CANCELLED' || order.paymentStatus === 'failed' || order.status === 'FAILED' ? 'bg-red-50 text-red-600' : 
                                'bg-amber-100 text-amber-900'
                              }`}>
                                {order.paymentStatus === 'failed' ? 'FAILED' : (order.status === 'PENDING' ? 'Received' : order.status)}
                              </span>
                              {order.status === 'PENDING' && order.paymentStatus !== 'failed' && (
                                <span className="text-[8px] text-amber-900/40 animate-pulse italic">Processing soon</span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900/40">Total Amount</p>
                            <p className="text-sm font-medium text-amber-950">₹{order.total.toFixed(2)}</p>
                          </div>
                          <div className="space-y-1">
                             <Link 
                               href={`/orders/${order.id}`}
                               className="text-[10px] uppercase tracking-widest font-bold text-amber-900 border-b border-amber-900/20 pb-0.5 hover:border-amber-950 transition-all block mt-2"
                             >
                               View Details
                             </Link>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="flex flex-wrap gap-4">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-4 items-center bg-white p-3 border border-amber-900/5">
                                <div className="w-12 h-16 bg-amber-50 overflow-hidden flex-shrink-0">
                                  <img 
                                    src={item.image || item.imageUrl || getPlaceholderImage(item.category)} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
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
                          <div className="space-y-2">
                             <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-900/40">Shipping To</p>
                             <div className="text-xs text-amber-900/60 leading-relaxed">
                               <p className="font-bold text-amber-950">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                               <p>{order.shippingAddress?.street}</p>
                               {order.shippingAddress?.street2 && <p>{order.shippingAddress?.street2}</p>}
                               <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode || order.shippingAddress?.zipCode}</p>
                               <p className="mt-1 font-bold">{order.phone || order.shippingAddress?.phone}</p>
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : activeTab === "addresses" ? (
              <motion.div 
                key="addresses"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="flex justify-between items-center mb-12">
                  <h2 className="font-serif text-4xl text-amber-950">Your Addresses</h2>
                  <button 
                    onClick={() => {
                      setAddressToEdit(null);
                      setNewAddress({ name: "", phone: "", street: "", street2: "", street3: "", city: "", state: "", zipCode: "", country: "India" });
                      setIsAddressModalOpen(true);
                    }}
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
                      <div key={address.id} className="border border-border-subtle p-8 bg-bg-card relative group">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button 
                            onClick={() => handleEditAddress(address)}
                            className="text-amber-900/20 hover:text-amber-600 transition-colors"
                          >
                            <User size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-amber-900/20 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-amber-950 mb-1 font-bold">{address.name} ({address.phone})</p>
                        <p className="text-sm text-amber-950 mb-1">{address.street}</p>
                        {address.street2 && <p className="text-sm text-amber-950 mb-1">{address.street2}</p>}
                        {address.street3 && <p className="text-sm text-amber-950 mb-1">{address.street3}</p>}
                        <p className="text-sm text-amber-950 mb-1">{address.city}, {address.state} {address.zipCode}</p>
                        <p className="text-sm text-amber-950">{address.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="max-w-2xl"
              >
                <h2 className="font-serif text-4xl text-amber-950 mb-12">Your Profile</h2>
                <div className="bg-bg-card border border-border-subtle p-10 shadow-sm">
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">First Name</label>
                        <input 
                          required
                          type="text" 
                          value={profile.firstName}
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                          className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Last Name</label>
                        <input 
                          required
                          type="text" 
                          value={profile.lastName}
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                          className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Email Address (Read-only)</label>
                      <input 
                        readOnly
                        type="email" 
                        value={profile.email}
                        className="w-full bg-transparent border-b border-amber-900/10 py-3 text-amber-900/40 cursor-not-allowed outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Mobile Number</label>
                      <input 
                        required
                        type="tel" 
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all disabled:opacity-50 mt-4"
                    >
                      {isUpdatingProfile ? "Saving Changes..." : "Update Profile"}
                    </button>
                  </form>
                </div>
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
              <h3 className="font-serif text-2xl text-amber-950 mb-8">{addressToEdit ? "Edit Address" : "Add New Address"}</h3>
              <form onSubmit={handleAddAddress} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Apartment, suite, etc. (Optional)</label>
                    <input 
                      type="text" 
                      value={newAddress.street2}
                      onChange={(e) => setNewAddress({...newAddress, street2: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-2 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    />
                  </div>
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
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Landmark / Extra Directions (Optional)</label>
                    <input 
                      type="text" 
                      value={newAddress.street3}
                      onChange={(e) => setNewAddress({...newAddress, street3: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-2 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    />
                  </div>
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
                      maxLength={6}
                      value={newAddress.zipCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setNewAddress({...newAddress, zipCode: val});
                      }}
                      className="w-full bg-transparent border-b border-amber-900/20 py-2 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                      placeholder="6 digits"
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
