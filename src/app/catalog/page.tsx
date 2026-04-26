"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Search, SlidersHorizontal, Plus, ChevronRight } from "lucide-react";
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

import { searchProducts } from "@/lib/search";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSort = searchParams.get("sort") || "newest";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSort) {
      setSortBy(initialSort);
    }
  }, [initialSort]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async (retries = 3) => {
      try {
        const cachedProducts = localStorage.getItem("sru_catalog_products");
        const cachedCategories = localStorage.getItem("sru_catalog_categories");
        
        if (cachedProducts && cachedCategories) {
          setProducts(JSON.parse(cachedProducts));
          setCategories(JSON.parse(cachedCategories));
          // We don't set loading to false here so that the background refresh 
          // can complete and we ensure we have the latest data/state.
        }

        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/inventory"),
          fetch("/api/categories")
        ]);

        if (!productsRes.ok || !categoriesRes.ok) throw new Error("Connection failed");

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        const prodList = Array.isArray(productsData) ? productsData : [];
        const catList = Array.isArray(categoriesData) ? ["All", ...categoriesData.map((c: any) => c.name)] : ["All"];

        setProducts(prodList);
        setCategories(catList);
        
        localStorage.setItem("sru_catalog_products", JSON.stringify(prodList));
        localStorage.setItem("sru_catalog_categories", JSON.stringify(catList));
        setLoading(false);
      } catch (error: any) {
        if (retries > 0) {
          setTimeout(() => fetchData(retries - 1), 1000);
        } else {
          toast.error("Failed to load collection");
          setLoading(false);
        }
      }
    };

    fetchData();
    const loadCart = () => setCartItems(JSON.parse(localStorage.getItem("sru_cart") || "[]"));
    loadCart();
    window.addEventListener("sru_cart_change", loadCart);
    return () => window.removeEventListener("sru_cart_change", loadCart);
  }, []);

  const getProductCartCount = (productId: string) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  // Advanced Filtering & Sorting
  const processedProducts = React.useMemo(() => {
    let result = [...products];

    // Typo tolerant search
    if (searchQuery) {
      result = searchProducts(result, searchQuery);
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(p => (p.categoryRel?.name || p.category) === selectedCategory);
    }

    // Price range filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "popularity") return (b.salesCount || 0) - (a.salesCount || 0);
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return result;
  }, [products, searchQuery, selectedCategory, sortBy, priceRange]);

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
    const existingIdx = cart.findIndex((i: any) => i.id === product.id);
    if (existingIdx > -1) cart[existingIdx].quantity += 25;
    else cart.push({ ...product, quantity: 25 });
    localStorage.setItem("sru_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("sru_cart_change"));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-12 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-6xl md:text-7xl text-amber-950 mb-6 leading-[0.9]">
              Gifted <br />
              <span className="italic text-amber-800/80">Collection</span>
            </h1>
            <p className="text-amber-900/60 text-sm tracking-wide leading-relaxed max-w-md">
              Meticulously crafted return gifts that honor Indian traditions. Each piece tells a story of sustainable artistry and generational skill.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
             {/* Search input removed as global search is preferred */}
          </div>
        </div>
        
        <div className="flex flex-col gap-8 pb-8 border-b border-amber-900/5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2 mr-Auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[9px] uppercase tracking-widest font-black transition-all border",
                    selectedCategory === cat 
                      ? "bg-amber-950 text-white border-amber-950 shadow-lg shadow-amber-950/10" 
                      : "bg-white text-amber-900/40 border-amber-900/10 hover:border-amber-900/30"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
               <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold py-2.5 px-6 border transition-all",
                  showFilters ? "bg-amber-50 border-amber-900/30 text-amber-950" : "bg-white border-amber-900/10 text-amber-900/40"
                )}
               >
                 <SlidersHorizontal size={14} />
                 Filters {showFilters ? 'Hide' : 'Show'}
               </button>

               <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-amber-900/10 px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold text-amber-950 focus:outline-none hover:border-amber-900/30 cursor-pointer"
               >
                 <option value="newest">Sort: Newest First</option>
                 <option value="popularity">Sort: Most Popular</option>
                 <option value="price_asc">Price: Low to High</option>
                 <option value="price_desc">Price: High to Low</option>
               </select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8 px-8 bg-amber-50/30 border border-amber-900/5">
                  <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-amber-900/10 pb-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-amber-900 block">Price Range (₹)</label>
                      <span className="text-[10px] font-bold text-amber-950">₹{priceRange[0]} — ₹{priceRange[1]}</span>
                    </div>
                    <div className="flex flex-col gap-4 px-2">
                       <input 
                        type="range" 
                        min="0" 
                        max="5000" 
                        step="100"
                        value={priceRange[1]} 
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-amber-950" 
                      />
                      <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold text-amber-900/40">
                        <span>Min: ₹0</span>
                        <span>Max: ₹5,000+</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-end pb-1">
                    <button 
                      onClick={() => {
                        setPriceRange([0, 5000]);
                        setSelectedCategory("All");
                        setSearchQuery("");
                      }}
                      className="text-[10px] uppercase tracking-widest font-bold text-amber-950 bg-amber-100/50 hover:bg-amber-100 px-6 py-2.5 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {processedProducts.length === 0 ? (
        <div className="py-40 text-center">
          <p className="text-amber-900/30 text-[10px] uppercase tracking-[0.5em] font-bold">No items match your curation</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {processedProducts.map((product, idx) => {
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: Math.min(idx * 0.05, 0.5) }}
                  className="group bg-white border border-amber-900/5 flex flex-col hover:shadow-2xl hover:shadow-amber-950/5 transition-all duration-500 overflow-hidden"
                >
                  <Link href={`/product/${product.id}`} className="block flex-1 flex flex-col">
                    <div className="relative bg-amber-50/50 overflow-hidden aspect-[4/5] flex-shrink-0">
                      <ProductCardSlideshow product={product} />
                      {product.stock < 1 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-10">
                          <div className="bg-red-600 text-white px-8 py-3 text-[10px] uppercase tracking-[0.4em] font-bold shadow-2xl transform -rotate-2">
                            Awaiting Stock
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <p className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-900/40">
                               {product.categoryRel?.name || product.category || "General"}
                             </p>
                          </div>
                          <h3 className="font-serif text-amber-950 group-hover:text-amber-800 transition-colors leading-tight text-xl">
                            {product.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-medium text-amber-950 tracking-tight">₹{product.price.toLocaleString()}</p>
                          <p className="text-[8px] uppercase tracking-widest text-amber-900/40 font-bold">Inc. Taxes</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-amber-900/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
                           <span className="text-[9px] uppercase tracking-widest font-bold text-amber-900/50">In Stock</span>
                        </div>
                        
                        <div 
                          className="group/btn flex items-center gap-3 text-[10px] uppercase tracking-widest font-black text-amber-950 group-hover:translate-x-1 transition-all"
                        >
                          Add to Cart
                          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center text-amber-950 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0"
                  >
                    <Plus size={18} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Concierge Section */}
      <div className="mt-40 bg-amber-950/2 p-24 text-center border border-amber-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10">
          <h2 className="font-serif text-5xl text-amber-950 mb-6">Bespoke Gifted Gifting</h2>
          <p className="text-amber-900/60 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            For weddings and corporate events, our concierge team offers personalized storytelling and logistic orchestration.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-12 py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-amber-950 border border-amber-950 transition-all shadow-2xl"
          >
            Initiate Consultation
          </Link>
        </div>
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
