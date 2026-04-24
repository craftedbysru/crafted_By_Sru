"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getPlaceholderImage } from "@/lib/images";

import { useCMS } from "@/hooks/useCMS";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(25);
  const [isAdded, setIsAdded] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const { getSection: getContactCMS } = useCMS("contact");
  const contactInfo = getContactCMS("details", {
    email: "concierge@craftedbysru.com",
    phone: "+91 98765 43210"
  });

  const productImages = product ? (
    Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : [product.imageUrl || product.image || getPlaceholderImage(product.category)]
  ) : [];

  useEffect(() => {
    const fetchProduct = async (retries = 3) => {
      try {
        const response = await fetch(`/api/inventory/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          
          // Check if already in cart
          const cart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
          if (cart.some((item: any) => item.id === data.id)) {
            setIsAdded(true);
          }
        } else if (response.status === 500 && retries > 0) {
           setTimeout(() => fetchProduct(retries - 1), 1000);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (retries > 0) {
          setTimeout(() => fetchProduct(retries - 1), 1000);
        }
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const addToCart = () => {
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
    const existing = cart.find((item: any) => item.id === product.id);
    const currentInCart = existing ? existing.quantity : 0;
    
    if (currentInCart + quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock. You already have ${currentInCart} in your cart.`);
      return;
    }

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity: quantity });
    }
    
    localStorage.setItem("sru_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("sru_cart_change"));
    
    setIsAdded(true);
    toast.success(`${product.name} added to cart`);
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.warning(`Only ${product.stock} items available in stock`);
    }
  };
  const decrementQty = () => setQuantity(prev => (prev > 25 ? prev - 1 : 25));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-8">
        <p className="text-[10px] uppercase tracking-widest opacity-50 text-amber-900">Product not found</p>
        <Link href="/catalog" className="text-[10px] uppercase tracking-widest font-bold border-b border-amber-900 pb-1 text-amber-900">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Link href="/catalog" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity mb-12 text-amber-900">
        <ArrowLeft size={14} />
        Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <div className="aspect-[4/5] bg-amber-50 overflow-hidden relative group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImageIdx}
                  src={productImages[activeImageIdx]} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {productImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setActiveImageIdx(prev => (prev === 0 ? productImages.length - 1 : prev - 1))}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-amber-950 hover:bg-white transition-all shadow-sm"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveImageIdx(prev => (prev === productImages.length - 1 ? 0 : prev + 1))}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-amber-950 hover:bg-white transition-all shadow-sm"
                  >
                    <ArrowLeft size={20} className="rotate-180" />
                  </button>
                </div>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 aspect-square bg-amber-50 overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImageIdx === idx ? "border-amber-900 scale-95" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {product.videoUrl && (
            <div className="bg-amber-50/50 overflow-hidden border border-amber-900/10 rounded-sm w-full">
              <video 
                src={product.videoUrl} 
                controls 
                playsInline
                muted
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-8"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-amber-700 mb-4">{product.category}</p>
            <h1 className="font-serif text-5xl md:text-7xl text-amber-950 mb-4">{product.name}</h1>
            <p className="text-2xl font-light text-amber-950">₹{product.price}</p>
          </div>

          <div className="h-px bg-amber-900/10 w-full"></div>

          <p className="text-sm leading-relaxed text-amber-900/70 max-w-md">
            {product.description}
          </p>

            <div className="flex flex-col gap-6 mt-4">
              {product.stock > 0 ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-amber-900">Quantity</span>
                    <div className="flex items-center border border-amber-900/10">
                      <button 
                        onClick={decrementQty}
                        className="w-10 h-10 flex items-center justify-center hover:bg-amber-50 transition-colors text-amber-900"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-sm font-medium text-amber-950">{quantity}</span>
                      <button 
                        onClick={incrementQty}
                        className="w-10 h-10 flex items-center justify-center hover:bg-amber-50 transition-colors text-amber-900"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest opacity-40 text-amber-900">{product.stock} available</span>
                  </div>

                  <button 
                    onClick={addToCart}
                    className={`w-full py-5 text-[10px] uppercase tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-3 ${
                      isAdded ? "bg-amber-100 text-amber-900 border border-amber-900/20" : "bg-amber-950 text-white hover:bg-amber-900"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} />
                        Added to Cart - Add More?
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="w-full py-5 bg-amber-50 text-amber-900/40 text-[10px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-3 border border-amber-900/10 cursor-not-allowed">
                  Out of Stock
                </div>
              )}
              <div className="bg-amber-50 p-6 border border-amber-900/5">
                <p className="text-[10px] uppercase tracking-widest text-center text-amber-900 font-bold mb-2">Bulk Orders</p>
                <p className="text-xs text-center text-amber-900/60 leading-relaxed">
                  For bulk orders and personalized gifting, please reach out to us at <span className="text-amber-950 font-bold">{contactInfo.phone}</span> or email us at <span className="text-amber-950 font-bold">{contactInfo.email}</span>
                </p>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-center opacity-30 text-amber-900">Free shipping on orders over ₹15,000</p>
            </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-amber-900">Product Data</h4>
              <div className="text-xs space-y-2 opacity-50 text-amber-900 whitespace-pre-wrap">
                {product.productData || "Unique heritage piece from our boutique studio. Detailed specifications and artisan story available upon inquiry."}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-amber-900">Delivery</h4>
              <p className="text-xs opacity-50 leading-relaxed text-amber-900">
                Ships within 7-10 business days. Priority heritage packaging ensures your items arrive in pristine condition.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
