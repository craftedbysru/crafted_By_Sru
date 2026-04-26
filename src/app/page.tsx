"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ASSETS, getPlaceholderImage } from "@/lib/images";
import { ProductCardSlideshow } from "@/components/ProductCardSlideshow";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cmsContent, setCmsContent] = useState<any[]>([]);

  const [categories, setCategories] = useState<any[]>([]);

  // Robust fetch with automatic retry for unstable connections
  const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 5, backoff = 500): Promise<Response> => {
    let lastError: any;
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        // Only retry on network errors or 5xx server errors
        if (response.ok || response.status < 500) return response;
        throw new Error(`Server responded with ${response.status}`);
      } catch (err) {
        lastError = err;
        if (i === retries - 1) break;
        
        const delay = backoff * Math.pow(2, i);
        // Using console for background retries to not annoy user too much unless it fails
        console.warn(`Connection fluctuation. Retrying ${url} (${i + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  };

  useEffect(() => {
    const cacheKey_content = "sru_cms_cache_home";
    const cacheKey_products = "sru_inventory_cache_featured";
    const cacheKey_categories = "sru_categories_cache";

    // Load from cache initially
    const cachedContent = localStorage.getItem(cacheKey_content);
    if (cachedContent) setCmsContent(JSON.parse(cachedContent));
    
    const cachedProducts = localStorage.getItem(cacheKey_products);
    if (cachedProducts) setFeaturedProducts(JSON.parse(cachedProducts));

    const cachedCats = localStorage.getItem(cacheKey_categories);
    if (cachedCats) setCategories(JSON.parse(cachedCats));

    const fetchData = async () => {
      try {
        const [productsRes, contentRes, categoriesRes] = await Promise.all([
          fetchWithRetry("/api/inventory?bestSeller=true"),
          fetchWithRetry("/api/content?page=home"),
          fetchWithRetry("/api/categories")
        ]);

        if (productsRes.ok) {
          let products = await productsRes.json();
          if (products.length === 0) {
            const fallbackRes = await fetch("/api/inventory");
            if (fallbackRes.ok) {
              const allProducts = await fallbackRes.json();
              products = allProducts.slice(0, 6);
            }
          }
          setFeaturedProducts(products);
          localStorage.setItem(cacheKey_products, JSON.stringify(products));
        }

        if (contentRes.ok) {
          const content = await contentRes.json();
          setCmsContent(content);
          localStorage.setItem(cacheKey_content, JSON.stringify(content));
        }

        if (categoriesRes.ok) {
          const cats = await categoriesRes.json();
          setCategories(cats);
          localStorage.setItem(cacheKey_categories, JSON.stringify(cats));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const loadCart = () => {
      // Logic for Task 3: Reset cart on first access to clean up defaults, but keep for sessions
      const cartInitialized = localStorage.getItem("sru_cart_init_v2");
      if (!cartInitialized) {
        localStorage.setItem("sru_cart", "[]");
        localStorage.setItem("sru_cart_init_v2", "true");
        setCartItems([]);
        window.dispatchEvent(new Event("sru_cart_change"));
        return;
      }
      
      const savedCart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
      setCartItems(savedCart);
    };
    loadCart();
    window.addEventListener("sru_cart_change", loadCart);
    return () => window.removeEventListener("sru_cart_change", loadCart);
  }, []);

  const getContent = (section: string, defaults: any) => {
    const item = cmsContent.find(c => c.section === section);
    return item ? { ...defaults, ...item.content } : defaults;
  };

  const heroContent = getContent("hero", {
    title: "Artistry in Every Unveiling.",
    subtitle: "The 2024 Winter Edit",
    description: "Elevating the art of the return gift. Hand-selected treasures from India's heartlands, encased in heirloom-quality packaging."
  });

  const soulContent = getContent("soul-of-sru", {
    title: "The Soul of Sru",
    quote: "Honoring heritage, one knot at a time.",
    description1: "We believe a gift should be a bridge between the giver's intent and the heritage legacy. 'Sru' — meaning 'to flow' or 'to create' — reflects our commitment to the fluid continuity of Indian craft.",
    description2: "Every piece in our collection is sourced directly from clusters across Rajasthan, Bengal, and Tamil Nadu, ensuring that the luxury you experience supports the hands that built it."
  });

  const curatedContent = getContent("curated-ledger", {
    title: "The Curated Ledger",
    description: "Browse our seasonal edits, categorized by craft and occasion. Each collection is a limited run to ensure exclusivity."
  });

  const recentContent = getContent("recent-curations", {
    title: "Recent Curations"
  });

  const getProductCartCount = (productId: string) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  // Extract products for Recent Curations (Latest 8)
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetchWithRetry("/api/inventory?limit=8&sort=desc");
        if (res.ok) {
          const data = await res.json();
          setRecentProducts(data);
        }
      } catch (err) {
        console.error("Recent items fetch failed:", err);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="bg-[#f9f7f2] min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-16 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl text-center lg:text-left mx-auto lg:mx-0"
          >
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] text-amber-900/60 mb-6 lg:mb-8 font-medium">{heroContent.subtitle}</p>
            <h1 className="font-serif-alt text-5xl md:text-7xl lg:text-[80px] leading-[1] md:leading-[0.9] text-amber-950 mb-8 lg:mb-10 tracking-tight">
              {heroContent.title.includes('Every') ? (
                <>
                  {heroContent.title.split('Every')[0]}
                  <br />
                  <span className="italic font-light">Every <br className="hidden md:block" /> {heroContent.title.split('Every')[1].trim()}</span>
                </>
              ) : (
                heroContent.title
              )}
            </h1>
            <p className="text-amber-900/70 text-base md:text-lg leading-relaxed mb-10 lg:mb-12 max-w-md mx-auto lg:mx-0">
              {heroContent.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-10">
              <Link href="/catalog" className="w-full sm:w-auto px-10 py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all text-center">
                Explore the Collection
              </Link>
              <Link href="/about" className="text-[10px] uppercase tracking-[0.3em] text-amber-950 font-bold border-b border-amber-950/20 pb-1 hover:border-amber-950 transition-all">
                Our Process
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] relative z-10 overflow-hidden shadow-[40px_40px_80px_rgba(0,0,0,0.05)] bg-amber-50">
              <img 
                src={ASSETS.hero} 
                alt="Luxury Gift Box" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, x: -50, y: 50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -bottom-16 -left-16 w-56 h-72 z-20 shadow-2xl overflow-hidden border-[12px] border-white bg-amber-50"
            >
              <img 
                src={ASSETS.heroSecondary} 
                alt="Heritage Detail" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Soul of Sru Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#D1E1D9] opacity-80" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-20" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square overflow-hidden shadow-2xl bg-amber-50">
                <img 
                  src={ASSETS.artisan} 
                  alt="Heritage Curation" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-8 -right-8 bg-[#FFD98E] p-8 max-w-[220px] shadow-xl">
                <p className="font-serif-alt text-xl text-amber-950 leading-tight italic">
                  "{soulContent.quote}"
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="font-serif-alt text-6xl text-amber-950">{soulContent.title}</h2>
              <div className="space-y-6 text-amber-900/80 leading-relaxed text-lg">
                <p>
                  {soulContent.description1}
                </p>
                <p>
                  {soulContent.description2}
                </p>
              </div>
              <Link href="/about" className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-amber-950 font-bold group">
                Read Our Full Story <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Curated Ledger Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-serif-alt text-6xl text-amber-950 mb-4">{curatedContent.title}</h2>
            <p className="text-amber-900/50 max-w-md">{curatedContent.description}</p>
          </div>
          <Link href="/catalog" className="text-[10px] uppercase tracking-widest text-amber-950 font-bold border-b border-amber-950/20 pb-1 hover:border-amber-950 transition-all">
            View All Tiers
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.slice(0, 6).map((cat, idx) => (
            <Link 
              key={cat.id}
              href={`/catalog?category=${encodeURIComponent(cat.name)}`}
              className="group relative aspect-[4/5] bg-white overflow-hidden border border-amber-900/5"
            >
              <img 
                src={cat.image || getPlaceholderImage(cat.name)} 
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-amber-950/0 group-hover:bg-amber-950/20 transition-all duration-700" />
              <div className="absolute bottom-10 left-10">
                <h3 className="font-serif-alt text-3xl text-white">{cat.name}</h3>
              </div>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full py-20 text-center bg-amber-50/30 border border-dashed border-amber-900/10">
              <p className="text-[10px] uppercase tracking-widest text-amber-900/40">No collections found. Add categories to see them here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Best Selling Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40 mb-4 font-bold">Most Coveted</p>
              <h2 className="font-serif-alt text-6xl text-amber-950">Best Selling</h2>
            </div>
            <Link href="/catalog" className="text-[10px] uppercase tracking-widest text-amber-950 font-bold border-b border-amber-950/20 pb-1 hover:border-amber-950 transition-all">
              View Entire Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-amber-50/50 mb-6" />
                  <div className="h-4 w-24 bg-amber-50/50 mb-4" />
                  <div className="h-6 w-48 bg-amber-50/50" />
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/product/${product.id}`} className="block h-full group">
                    <div className="aspect-[3/4] overflow-hidden bg-[#FDF8F3] mb-8 relative">
                      <ProductCardSlideshow product={product} />
                      <div className="absolute inset-0 bg-amber-950/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-amber-900/40 font-bold">{product.category}</p>
                        {getProductCartCount(product.id) > 0 && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                            {getProductCartCount(product.id)} in cart
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif-alt text-2xl text-amber-950 group-hover:text-amber-800 transition-colors font-medium">{product.name}</h3>
                      <p className="text-amber-950 font-medium italic">₹{product.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-amber-900/10">
                <p className="text-[10px] uppercase tracking-widest text-amber-900/30">No products curated yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic CMS Sections in order */}
      {cmsContent.filter(c => !["hero", "soul-of-sru", "curated-ledger", "recent-curations"].includes(c.section)).map((section, idx) => (
        <section key={section.id} className={`py-24 px-6 ${idx % 2 === 0 ? 'bg-amber-50/30' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto">
            {section.content.title && (
              <h2 className="font-serif-alt text-5xl text-amber-950 mb-10 text-center">{section.content.title}</h2>
            )}
            {section.content.description && (
              <p className="text-amber-900/60 text-center max-w-2xl mx-auto mb-12 leading-relaxed">{section.content.description}</p>
            )}
            
            {section.content.items && Array.isArray(section.content.items) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {section.content.items.map((item: any, i: number) => (
                  <div key={i} className="space-y-6 group">
                    {item.image && (
                      <div className="aspect-[4/5] overflow-hidden bg-amber-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl text-amber-950">{item.title}</h3>
                      <p className="text-amber-900/60 text-sm leading-relaxed">{item.content}</p>
                      {item.link && (
                        <Link href={item.link} className="inline-block text-[10px] uppercase tracking-widest font-bold text-amber-900 border-b border-amber-900/20 pb-1 mt-4 hover:border-amber-900 transition-all">
                          Discover More
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.content.image && (
              <div className="aspect-video w-full overflow-hidden bg-amber-100 mt-12">
                <img src={section.content.image} alt={section.content.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Recent Curations Section - Redesigned to a sophisticated Bento Gallery */}
      <section className="py-32 bg-amber-50/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.5em] text-amber-900/40 mb-4 font-bold">Chronicles of Craft</p>
              <h2 className="font-serif-alt text-6xl text-amber-950 italic">{recentContent.title}</h2>
              <p className="text-amber-900/60 mt-6 text-lg">Our latest curations, freshly gathered from India's most talented heritage clusters.</p>
            </div>
            <Link href="/catalog?sort=desc" className="group flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-amber-950 border-b border-amber-950/20 pb-1">
              Explore the Archive <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentProducts.length > 0 ? (
              <>
                 {recentProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group flex flex-col"
                    >
                      <Link href={`/product/${product.id}`} className="block h-full flex flex-col">
                        <div className="aspect-[4/5] overflow-hidden bg-white border border-amber-900/5 relative flex-shrink-0">
                           <ProductCardSlideshow product={product} />
                           <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                             <ArrowRight size={14} className="text-amber-950" />
                           </div>
                        </div>
                        <div className="mt-6 p-4 bg-white flex-1 border-t-0 border border-amber-900/5 hover:bg-amber-50/30 transition-colors">
                          <h4 className="font-serif text-xl text-amber-950 group-hover:text-amber-700 transition-colors">{product.name}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-[9px] uppercase tracking-widest text-amber-900/40 font-bold">Heritage Collection</p>
                            <p className="text-sm font-semibold text-amber-950">₹{product.price}</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                 ))}
              </>
            ) : (
              <div className="col-span-12 py-32 text-center border border-dashed border-amber-900/10 rounded-2xl">
                <p className="text-[10px] uppercase tracking-widest text-amber-900/40">Preparing our latest handcrafted chronicles...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
