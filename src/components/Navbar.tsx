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
    if (searchQuery.length > 1) {
      fetch("/api/inventory")
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter((p: any) => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(filtered);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  const handleLogout = () => {
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between",
        isScrolled ? "bg-white shadow-md border-b border-amber-900/10 py-3" : "bg-transparent"
      )}>
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif italic text-2xl tracking-tighter text-amber-950">Crafted by Sru</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {userRole === "merchant" ? (
            <Link href="/dashboard" className="text-[10px] uppercase tracking-widest font-bold text-amber-900 border-b border-amber-900 pb-1">Dashboard</Link>
          ) : (
            <>
              <Link href="/" prefetch={true} className="text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity text-amber-900">Home</Link>
              <Link href="/catalog" prefetch={true} className="text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity text-amber-900">Catalog</Link>
              <Link href="/about" prefetch={true} className="text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity text-amber-900">Our Story</Link>
              <Link href="/contact" prefetch={true} className="text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity text-amber-900">Reach Out</Link>
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
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="px-6 py-8 flex justify-between items-center border-b border-amber-900/5">
              <span className="font-serif italic text-2xl tracking-tighter text-amber-950">Search</span>
              <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-amber-900/10 rounded-full transition-colors text-amber-900">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-12">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-4xl md:text-6xl font-serif text-amber-950 placeholder:text-amber-950/10 border-none focus:ring-0 bg-transparent outline-none"
                  />
                  <button className="px-8 py-4 bg-amber-900 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-800 transition-all">
                    Search
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {searchResults.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} className="flex gap-4 group">
                      <div className="w-20 h-24 overflow-hidden bg-amber-50">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-50 text-amber-900">{product.category}</p>
                        <h4 className="text-sm font-medium text-amber-950 group-hover:underline">{product.name}</h4>
                        <p className="text-sm text-amber-900/70 mt-1">₹{product.price}</p>
                      </div>
                    </Link>
                  ))}
                  {searchQuery.length > 1 && searchResults.length === 0 && (
                    <p className="text-sm text-amber-900/40 italic">No results found for "{searchQuery}"</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
