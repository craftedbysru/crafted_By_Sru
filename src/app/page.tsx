"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch("/api/inventory");
        if (response.ok) {
          const products = await response.json();
          setFeaturedProducts(products.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="mb-20 min-h-[60vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-amber-700 mb-4">Handpicked with Love</p>
          <h1 className="font-serif text-7xl md:text-9xl tracking-tighter leading-[0.85] mb-8 text-amber-950">
            Artistry in <br /> Every Detail.
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/catalog" className="px-8 py-4 bg-amber-900 text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-amber-800 transition-all duration-300">
              Explore Catalog
            </Link>
            <Link href="/about" className="px-8 py-4 border border-amber-900/20 text-amber-900 text-[10px] uppercase tracking-widest hover:bg-amber-50 transition-all duration-300">
              Our Story
            </Link>
          </div>
        </motion.div>
      </header>

      <section className="mb-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-4xl text-amber-950">New Arrivals</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 text-amber-900">The Latest Creations</p>
          </div>
          <Link href="/catalog" className="text-[10px] uppercase tracking-widest text-amber-700 font-bold hover:underline">View All</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-amber-50 mb-4"></div>
                <div className="h-4 w-2/3 bg-amber-50 mb-2"></div>
                <div className="h-4 w-1/3 bg-amber-50"></div>
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
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-[3/4] overflow-hidden bg-amber-50 mb-4 relative">
                    <img 
                      src={product.image || "https://picsum.photos/seed/product/800/1200"} 
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-6 py-3 bg-amber-900 text-white text-[10px] uppercase tracking-widest font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        View Details
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1 text-amber-900">{product.category}</p>
                      <h3 className="text-sm font-medium tracking-tight text-amber-950">{product.name}</h3>
                    </div>
                    <p className="text-sm font-light text-amber-950">${product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
             <div className="col-span-full py-20 text-center text-[10px] uppercase tracking-widest opacity-30 text-amber-900">
              No products found. Start by adding some in the merchant portal.
            </div>
          )}
        </div>
      </section>

      {/* Featured Heritage Section */}
      <section className="py-32 px-6 section-secondary mb-32 -mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="font-serif text-5xl text-amber-950 leading-tight">Preserving the Art of Indian Gifting</h2>
              <p className="text-amber-900/70 leading-relaxed text-lg">
                Every piece in our catalog is a testament to centuries-old traditions. We work directly with master artisans to bring you return gifts that are not just objects, but stories of heritage.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <p className="text-3xl font-serif text-amber-950">100+</p>
                  <p className="text-[10px] uppercase tracking-widest text-amber-900/40 font-bold">Master Artisans</p>
                </div>
                <div>
                  <p className="text-3xl font-serif text-amber-950">25</p>
                  <p className="text-[10px] uppercase tracking-widest text-amber-900/40 font-bold">Craft Clusters</p>
                </div>
              </div>
              <Link href="/catalog" className="inline-block px-10 py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all">
                Explore The Catalog
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="h-80 bg-amber-100 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80" 
                    alt="Artisan Craft" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="h-48 bg-amber-100 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1590739293931-694800366668?auto=format&fit=crop&q=80" 
                    alt="Textile Detail" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-48 bg-amber-100 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80" 
                    alt="Pottery" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="h-80 bg-amber-100 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80" 
                    alt="Workshop" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
        <div className="aspect-video relative overflow-hidden group">
           <img 
            src="https://picsum.photos/seed/craft/1200/800" 
            alt="Craftsmanship"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-12">
            <h3 className="font-serif text-4xl text-white mb-4">The Craft</h3>
            <p className="text-white/70 text-sm max-w-sm mb-6">Discover the traditional techniques behind our modern designs.</p>
            <Link href="/about" className="text-[10px] uppercase tracking-widest text-white font-bold hover:underline">Read More</Link>
          </div>
        </div>
        <div className="aspect-video relative overflow-hidden group">
           <img 
            src="https://picsum.photos/seed/curated/1201/801" 
            alt="Curated Service"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-amber-950/40 flex flex-col justify-end p-12">
            <h3 className="font-serif text-4xl text-white mb-4">Custom Pieces</h3>
            <p className="text-white/70 text-sm max-w-sm mb-6">Unique designs tailored to your vision and space.</p>
            <Link href="/contact" className="text-[10px] uppercase tracking-widest text-white font-bold hover:underline">Inquire Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
