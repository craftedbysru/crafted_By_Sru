"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useSession, signOut } from "next-auth/react";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
      const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener("sru_cart_change", updateCartCount);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("sru_cart_change", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 1) {
        fetch(`/api/inventory?search=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setSearchResults(data.slice(0, 5));
            } else {
              setSearchResults([]);
            }
          })
          .catch(() => setSearchResults([]));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("sru_cart");
    window.dispatchEvent(new Event("sru_cart_change"));
    signOut({ callbackUrl: "/" });
  };

  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "authenticated" && userRole === "merchant" && !pathname.startsWith("/dashboard") && !pathname.startsWith("/api") && !pathname.startsWith("/merchant-login")) {
      router.push("/dashboard");
    }
  }, [status, userRole, pathname, router]);

  const isMerchantRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/merchant-login");

  // Hide navbar on dashboard and merchant login pages
  if (isMerchantRoute) {
    return null;
  }

  return (
    <>
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 py-4 flex items-center justify-between",
      isScrolled ? "bg-white shadow-md border-b border-amber-900/10 py-3" : "bg-transparent"
    )}>
      <Link href="/" className="flex items-center gap-2">
        <span className="font-serif italic text-xl md:text-2xl tracking-tighter text-amber-950">Crafted by Sru</span>
      </Link>
        <div className="hidden md:flex items-center gap-8">
          {userRole === "merchant" ? (
            <Link href="/dashboard" className="text-[10px] uppercase tracking-widest font-bold text-amber-900 border-b border-amber-900 pb-1">Dashboard</Link>
          ) : (
            <>
              <Link href="/" prefetch={true} className="text-[12px] uppercase tracking-widest hover:opacity-70 transition-opacity text-amber-900">Home</Link>
              <Link href="/catalog" prefetch={true} className="text-[12px] uppercase tracking-widest hover:opacity-70 transition-opacity text-amber-900">Catalog</Link>
              <Link href="/about" prefetch={true} className="text-[12px] uppercase tracking-widest hover:opacity-70 transition-opacity text-amber-900">Our Story</Link>
              <Link href="/contact" prefetch={true} className="text-[12px] uppercase tracking-widest hover:opacity-70 transition-opacity text-amber-900">Reach Out</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-amber-900/10 rounded-full transition-colors text-amber-900">
            <Search size={18} />
          </button>
          <Link href="/cart" className="p-2 hover:bg-amber-900/10 rounded-full transition-colors relative text-amber-900">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-700 text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <Link href="/account" className="flex items-center gap-2 p-2 hover:bg-amber-900/10 rounded-full transition-colors text-amber-900">
                <User size={18} />
                <span className="hidden sm:inline text-[10px] uppercase tracking-widest font-bold">
                  {session.user.name?.split(' ')[0]}
                </span>
              </Link>
              <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity text-amber-900">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/signin" className="text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity text-amber-900">Login</Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-amber-900 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-800 transition-all">Sign Up</Link>
            </div>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-amber-900/10 rounded-full transition-colors text-amber-900">
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-amber-900/10 p-6 md:hidden flex flex-col gap-4 overflow-hidden"
            >
              {userRole === "merchant" ? (
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-widest text-amber-900 font-bold">Dashboard</Link>
              ) : (
                <>
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-widest text-amber-900">Home</Link>
                  <Link href="/catalog" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-widest text-amber-900">Catalog</Link>
                  <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-widest text-amber-900">Our Story</Link>
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-widest text-amber-900">Reach Out</Link>
                </>
              )}
              {!session?.user && (
                <div className="flex flex-col gap-4 pt-4 border-t border-amber-900/5">
                  <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-widest text-amber-900">Login</Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-widest text-amber-900 font-bold">Sign Up</Link>
                  <Link href="/merchant-login" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-widest text-amber-700 font-bold">Merchant Portal</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-amber-950/20 backdrop-blur-md flex flex-col"
          >
            <motion.div 
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              className="bg-white px-6 py-8 shadow-2xl"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-950/40">Search Catalog</span>
                  <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-amber-900/10 rounded-full transition-colors text-amber-900">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30" size={18} />
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search for heritage gifts, artisan crafts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-sm font-medium text-amber-950 placeholder:text-amber-950/20 border border-amber-900/10 bg-amber-50/50 px-12 py-4 outline-none focus:border-amber-900/30 focus:bg-amber-50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[60vh] overflow-y-auto pr-2">
                  <AnimatePresence mode="popLayout">
                    {searchResults.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Link href={`/product/${product.id}`} className="flex flex-col gap-4 group bg-white border border-amber-900/5 p-4 hover:shadow-xl transition-all">
                          <div className="aspect-square overflow-hidden bg-amber-50 relative">
                            <img 
                              src={product.imageUrl || (Array.isArray(product.images) && product.images[0]) || product.image || "https://picsum.photos/seed/product/200/200"} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                              referrerPolicy="no-referrer" 
                            />
                          </div>
                          <div>
                            <p className="text-[8px] uppercase tracking-widest opacity-40 text-amber-900 font-bold">{product.category}</p>
                            <h4 className="text-sm font-serif text-amber-950 group-hover:text-amber-800 transition-colors truncate">{product.name}</h4>
                            <p className="text-sm text-amber-950 font-medium mt-1">₹{product.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {searchQuery.length > 1 && searchResults.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-amber-900/40 italic font-serif text-xl">No results found for "{searchQuery}"</p>
                      <p className="text-[10px] uppercase tracking-widest text-amber-900/20 mt-2">Try searching for keywords like 'Heritage', 'Gifts', or categories.</p>
                    </div>
                  )}
                  
                  {searchQuery.length > 1 && searchResults.length > 0 && (
                    <Link href={`/catalog?search=${encodeURIComponent(searchQuery)}`} className="col-span-full text-center py-6 text-[10px] uppercase tracking-widest font-black text-amber-950 border-t border-amber-900/5 hover:bg-amber-50 transition-colors mt-4">
                      Explore All {searchResults.length > 5 ? 'Matches' : 'Results'} in Full Catalog
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
            <div className="flex-1 cursor-pointer" onClick={() => setIsSearchOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
