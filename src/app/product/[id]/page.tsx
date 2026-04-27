"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getPlaceholderImage } from "@/lib/images";

import { useCMS } from "@/hooks/useCMS";

import Image from "next/image";

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
    phone: "+91 93426 46579"
  });

  const productImages = product ? (
    Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : [product.imageUrl || product.image || getPlaceholderImage(product.category)]
  ) : [];

  useEffect(() => {
    const fetchProduct = async (retries = 5) => {
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
          setLoading(false);
          return;
        } 
        
        if (retries > 0) {
          const delay = 500 * Math.pow(2, 5 - retries);
          setTimeout(() => fetchProduct(retries - 1), delay);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (retries > 0) {
          const delay = 500 * Math.pow(2, 5 - retries);
          setTimeout(() => fetchProduct(retries - 1), delay);
        } else {
          setLoading(false);
        }
      }
    };
    if (params.id) {
      setLoading(true);
      fetchProduct();
    }
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
      toast.error(`Requested quantity exceeds available stock.`);
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

  const decrementQty = () => setQuantity(prev => (prev > 25 ? prev - 25 : 25));
  const incrementQty = () => {
    if (quantity + 25 <= product.stock) {
      setQuantity(prev => prev + 25);
    } else {
      toast.warning(`Maximum available stock reached`);
    }
  };

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
                <motion.div
                  key={activeImageIdx}
                  className="w-full h-full relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image 
                    src={productImages[activeImageIdx]} 
                    alt={product.name} 
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>
              
              {productImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
                    <Image 
                      src={img} 
                      alt="" 
                      fill
                      sizes="80px"
                      className="object-cover" 
                      referrerPolicy="no-referrer" 
                    />
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.4em] text-amber-700">{product.category}</p>
              <h1 className="font-serif text-5xl md:text-7xl text-amber-950 leading-tight">{product.name}</h1>
            </div>
            <div className="text-left md:text-right">
              <p className="text-4xl font-light text-amber-950">₹{product.price.toLocaleString()}</p>
              <p className="text-[10px] text-amber-900/50 mt-1 uppercase tracking-widest">Taxes included. Shipping calculated at checkout</p>
            </div>
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
              
              <a 
                href={`https://wa.me/919342646579?text=Hi, I'm interested in the ${product.name}. Can you provide more details?`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 border border-green-600/20 bg-green-50/30 text-green-800 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.129 1.417 4.77 1.417 5.4 0 9.791-4.39 9.791-9.79.002-5.402-4.386-9.79-9.788-9.79-5.402 0-9.791 4.39-9.791 9.79 0 1.767.487 3.393 1.411 4.793l-1.032 3.766 3.86-1.011zm11.758-7.306c-.32-.16-1.89-.932-2.181-1.038-.29-.107-.502-.16-.712.16-.21.32-.811 1.038-.992 1.24-.182.201-.363.227-.683.067-.32-.16-1.353-.499-2.577-1.59-.953-.848-1.596-1.895-1.784-2.215-.188-.32-.02-.492.14-.652.144-.143.32-.373.48-.56.16-.188.214-.32.32-.534.107-.213.053-.4-.027-.56-.08-.16-.712-1.713-.976-2.353-.257-.622-.518-.538-.712-.548-.182-.008-.39-.011-.598-.011-.208 0-.547.077-.833.395-.286.318-1.092 1.068-1.092 2.606 0 1.538 1.118 3.023 1.272 3.235.154.212 2.2 3.359 5.33 4.716.745.322 1.327.515 1.78.658.748.236 1.428.203 1.967.122.6-.091 1.89-.773 2.156-1.48.267-.707.267-1.313.187-1.44-.08-.127-.291-.203-.611-.363z"/>
                </svg>
                Chat with us
              </a>

              <div className="bg-amber-50 p-6 border border-amber-900/5">
                <p className="text-[10px] uppercase tracking-widest text-center text-amber-900 font-bold mb-2">Bulk Orders</p>
                <p className="text-xs text-center text-amber-900/60 leading-relaxed">
                  For bulk orders and personalized gifting, please reach out to us at <span className="text-amber-950 font-bold">{contactInfo.phone}</span> or email us at <span className="text-amber-950 font-bold">{contactInfo.email}</span>
                </p>
              </div>
            </div>

          <div className="mt-12">
            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-amber-900">Product Data</h4>
            <div className="text-xs space-y-2 opacity-60 text-amber-900 whitespace-pre-wrap">
              {product.productData || "Best for Gifts"}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
