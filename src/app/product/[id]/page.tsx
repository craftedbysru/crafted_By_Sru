"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
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
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const addToCart = () => {
    if (isAdded) return;
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
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

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
          className="aspect-[4/5] bg-amber-50 overflow-hidden"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-8"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-amber-700 mb-4">{product.category}</p>
            <h1 className="font-serif text-5xl md:text-7xl text-amber-950 mb-4">{product.name}</h1>
            <p className="text-2xl font-light text-amber-950">${product.price}</p>
          </div>

          <div className="h-px bg-amber-900/10 w-full"></div>

          <p className="text-sm leading-relaxed text-amber-900/70 max-w-md">
            {product.description}
          </p>

            <div className="flex flex-col gap-6 mt-4">
              {product.stock > 0 ? (
                <>
                  {!isAdded && (
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
                  )}

                  <button 
                    onClick={addToCart}
                    disabled={isAdded}
                    className={`w-full py-5 text-[10px] uppercase tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-3 ${
                      isAdded ? "bg-green-600/10 text-green-700 cursor-not-allowed border border-green-600/20" : "bg-amber-950 text-white hover:bg-amber-900"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} />
                        Added to Cart
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
              <p className="text-[10px] uppercase tracking-widest text-center opacity-30 text-amber-900">Free shipping on orders over $200</p>
            </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-amber-900">Details</h4>
              <ul className="text-xs space-y-2 opacity-50 text-amber-900">
                <li>Handpicked in our boutique studio</li>
                <li>Sustainable materials</li>
                <li>Limited edition release</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-amber-900">Shipping</h4>
              <p className="text-xs opacity-50 leading-relaxed text-amber-900">
                Ships within 3-5 business days. Worldwide delivery available.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
