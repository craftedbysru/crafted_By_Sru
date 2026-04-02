"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Search, SlidersHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function CollectionPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load catalog");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);
    const currentInCart = existingItem ? existingItem.quantity : 0;

    if (currentInCart + 1 > product.stock) {
      toast.error(`Only ${product.stock} items available in stock. You already have ${currentInCart} in your cart.`);
      return;
    }

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("sru_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("sru_cart_change"));
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Loading Collection...</div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="font-serif text-5xl md:text-7xl text-amber-950 mb-4">The Curated Heritage Catalog</h1>
          <p className="text-amber-900/50 text-sm tracking-widest uppercase">Meticulously crafted return gifts that honor Indian traditions.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30 group-focus-within:text-amber-900 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-amber-900/10 rounded-none w-full sm:w-64 focus:ring-1 focus:ring-amber-900/20 outline-none text-sm text-amber-950 shadow-sm"
            />
          </div>
          <div className="relative group">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30 group-focus-within:text-amber-900 transition-colors" size={18} />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-10 py-4 bg-white border border-amber-900/10 rounded-none w-full sm:w-48 focus:ring-1 focus:ring-amber-900/20 outline-none text-sm text-amber-950 appearance-none cursor-pointer shadow-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-32 text-center">
          <p className="text-amber-900/40 text-[10px] uppercase tracking-[0.3em]">No items found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group"
              >
                <div className="relative aspect-[3/4] bg-amber-50 overflow-hidden mb-6">
                  <Link href={`/product/${product.id}`}>
                    <img 
                      src={product.image || `https://picsum.photos/seed/${product.id}/600/800`} 
                      alt={product.name} 
                      className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${product.stock === 0 ? "opacity-50" : ""}`}
                      referrerPolicy="no-referrer"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                        <span className="bg-white/90 px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-amber-950">Out of Stock</span>
                      </div>
                    )}
                  </Link>
                  {product.stock > 0 && (
                    <button 
                      onClick={() => addToCart(product)}
                      className="absolute bottom-6 right-6 w-12 h-12 bg-white text-amber-950 flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-amber-950 hover:text-white"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] uppercase tracking-widest text-amber-900/40">{product.category}</p>
                    <p className="text-sm font-medium text-amber-950">${product.price.toFixed(2)}</p>
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-base font-serif text-amber-950 group-hover:text-amber-700 transition-colors">{product.name}</h3>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
