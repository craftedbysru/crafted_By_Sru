"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Search, SlidersHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { getPlaceholderImage } from "@/lib/images";
import { ProductCardSlideshow } from "@/components/ProductCardSlideshow";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSort = searchParams.get("sort") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching catalog data with params:", { initialSort, initialCategory });
        
        // Use exponential backoff for resilience in sandbox
        const fetchResilient = async (url: string, retries = 3) => {
          for (let i = 0; i < retries; i++) {
            try {
              const res = await fetch(url);
              if (res.ok) return res;
            } catch (e) {}
            if (i < retries - 1) await new Promise(r => setTimeout(r, 500 * (i + 1)));
          }
          return fetch(url);
        };

        // Stagger parallel fetches to reduce connection pool surge
        const productsRes = await fetchResilient(`/api/inventory${initialSort ? "?sort=" + initialSort : ""}`);
        if (!productsRes.ok) throw new Error(`Inventory Error: ${productsRes.status}`);
        
        // Small delay to let pool breathe
        await new Promise(r => setTimeout(r, 100));
        
        const categoriesRes = await fetchResilient("/api/categories");
        if (!categoriesRes.ok) throw new Error(`Categories Error: ${categoriesRes.status}`);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        console.log("Products loaded:", productsData);
        console.log("Categories loaded:", categoriesData);

        setProducts(Array.isArray(productsData) ? productsData : []);
        if (Array.isArray(categoriesData)) {
          const catList = categoriesData.map((c: any) => ({ name: c.name, id: c.id }));
          setCategories(["All", ...catList.map(c => c.name)]);
          
          // If deep link category was a name/id, try to resolve it
          if (initialCategory !== "All") {
            const matched = catList.find(c => c.id === initialCategory || c.name === initialCategory);
            if (matched) setSelectedCategory(matched.name);
          }
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(`Failed to load catalog: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
      setCartItems(savedCart);
    };
    loadCart();
    window.addEventListener("sru_cart_change", loadCart);
    return () => window.removeEventListener("sru_cart_change", loadCart);
  }, [initialSort, initialCategory]);

  const getProductCartCount = (productId: string) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryName = product.categoryRel?.name || product.category || "No Category";
    const matchesCategory = selectedCategory === "All" || categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  const addToCart = (product: any) => {
    if (product.stock < 25) {
      toast.error("This product is currently out of stock");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);
    const currentInCart = existingItem ? existingItem.quantity : 0;

    // The user mentioned a default of 25 in a previous turn (line 128 in old view), 
    // but usually it should be 1. Let's stick to 1 per click for "Quick Add".
    if (currentInCart + 1 > product.stock) {
      toast.error(`Only ${product.stock} items available in total. You already have ${currentInCart} in your cart.`);
      return;
    }

    if (existingItem) {
      existingItem.quantity += 25;
    } else {
      cart.push({ ...product, quantity: 25 });
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
      <div className="flex flex-col gap-12 mb-20">
        <div className="max-w-3xl">
          <h1 className="font-serif text-6xl md:text-8xl text-amber-950 mb-8 leading-[0.9]">
            The Curated <br />
            <span className="italic">Heritage Collection</span>
          </h1>
          <p className="text-amber-900/60 text-lg leading-relaxed max-w-xl">
            Meticulously crafted return gifts that honor Indian traditions. Each piece tells a story of sustainable artistry and generational skill.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border",
                selectedCategory === cat 
                  ? "bg-amber-950 text-white border-amber-950" 
                  : "bg-white text-amber-900/40 border-amber-900/10 hover:border-amber-900/30"
              )}
            >
              {cat === "All" ? "All Gifts" : cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-32 text-center">
          <p className="text-amber-900/40 text-[10px] uppercase tracking-[0.3em]">No items found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => {
              // Create a bento-like grid pattern
              const isLarge = idx === 0;
              const isMedium = idx === 3;
              
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={cn(
                    "group bg-white border border-amber-900/5 overflow-hidden flex flex-col",
                    isLarge ? "md:col-span-8 md:row-span-2" : 
                    isMedium ? "md:col-span-6" : "md:col-span-4"
                  )}
                >
                  <div className={cn(
                    "relative bg-amber-50 overflow-hidden",
                    isLarge ? "flex-1" : "aspect-[4/3]"
                  )}>
                    <Link href={`/product/${product.id}`} className="block h-full w-full">
                      <ProductCardSlideshow product={product} />
                      {product.stock < 25 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
                          <div className="bg-red-600 text-white px-6 py-2 text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl transform -rotate-3">
                            Out of Stock
                          </div>
                        </div>
                      )}
                    </Link>
                  </div>
                  
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-amber-900/40 mb-1">
                          {isLarge ? "Featured Heritage" : (product.categoryRel?.name || product.category || "No Category")}
                        </p>
                        <h3 className={cn(
                          "font-serif text-amber-950 group-hover:text-amber-700 transition-colors",
                          isLarge ? "text-3xl md:text-4xl" : "text-xl"
                        )}>
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[10px] italic text-amber-900/40">Heritage of India</p>
                          {getProductCartCount(product.id) > 0 && (
                            <span className="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                              {getProductCartCount(product.id)} in cart
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-medium text-amber-950">₹{product.price}</p>
                        <p className="text-[8px] uppercase tracking-widest text-amber-900/40">Per Unit</p>
                      </div>
                    </div>

                    {isLarge && (
                      <p className="text-sm text-amber-900/60 leading-relaxed max-w-md line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="pt-4 border-t border-amber-900/5 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold text-amber-900/40">
                          <div className="w-1 h-1 bg-amber-900/20 rounded-full" />
                          100% Sustainable
                        </div>
                        <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold text-amber-900/40">
                          <div className="w-1 h-1 bg-amber-900/20 rounded-full" />
                          Fair Trade
                        </div>
                      </div>
                      
                      {product.stock >= 25 && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-amber-950 hover:text-amber-700 transition-colors"
                        >
                          <Plus size={12} />
                          Quick Add
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Concierge Section */}
      <div className="mt-32 bg-amber-50/50 p-12 md:p-24 text-center border border-amber-900/5 rounded-3xl">
        <h2 className="font-serif text-4xl md:text-6xl text-amber-950 mb-6">Planning a Grand Celebration?</h2>
        <p className="text-amber-900/60 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          Our concierge team assists with custom packaging, heritage storytelling cards, and bulk logistical coordination for weddings and corporate events.
        </p>
        <Link 
          href="/contact"
          className="inline-block px-12 py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all shadow-xl shadow-amber-950/20"
        >
          Speak with our Concierge
        </Link>
      </div>
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Initiating Collection...</div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
