"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Edit2, Trash2, Package, Search, X, Save, 
  Image as ImageIcon, LayoutDashboard, ShoppingBag, 
  Users, Settings, LogOut, ChevronRight, Filter,
  TrendingUp, DollarSign, Clock, CheckCircle2, AlertCircle, Menu, Eye, Truck, Mail
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { getPlaceholderImage } from "@/lib/images";
import { EMAIL_TEMPLATES } from "@/lib/email-templates";

type Section = "dashboard" | "orders" | "inventory" | "categories" | "cms" | "shipping" | "messages" | "emails" | "offers";

export default function MerchantDashboard() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [inventorySearch, setInventorySearch] = useState("");
  const [activeTheme, setActiveTheme] = useState("original");
  const [offers, setOffers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cmsContent, setCmsContent] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [selectedCmsPage, setSelectedCmsPage] = useState("home");
  const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [offerFormData, setOfferFormData] = useState({ name: "", description: "", discount: "" });
  const [cmsFormData, setCmsFormData] = useState({ 
    section: "", 
    displayOrder: 0, 
    fields: [{ key: "title", value: "", type: "text" as "text" | "textarea" | "image" | "product-list" | "category-list" }] 
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImageUrl, setCategoryImageUrl] = useState("");
  const [isCategoryUploading, setIsCategoryUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pin, setPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (activeSection === "emails") {
      const logs = JSON.parse(localStorage.getItem("sru_email_logs") || "[]");
      setEmailLogs(logs);
    }
  }, [activeSection]);
  
  // Robust fetch with automatic retry for unstable connections
  const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3, backoff = 500): Promise<Response> => {
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
        
        const delay = backoff * Math.pow(1.5, i); // Faster backoff for interactive dashboard
        toast.info(`Fluctuation detected. Retrying... (${i + 1}/${retries})`, {
          id: `retry-${url.substring(0, 20)}`, 
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productData: "",
    price: "",
    originalPrice: "",
    discount: "",
    sku: "",
    category: "",
    categoryId: "",
    offerId: "",
    imageUrl: "",
    images: [] as string[],
    videoUrl: "",
    stock: "10",
    isBestSeller: false
  });
  const [imageList, setImageList] = useState<{file?: File, preview: string, uploadStatus?: "pending" | "success" | "failed", publicUrl?: string}[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUploadStatus, setVideoUploadStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [uploading, setUploading] = useState(false);

  // Background upload helper
  const startBackgroundUpload = async (file: File, type: "image" | "video" | "category-image", index?: number) => {
    if (type === "video") setVideoUploadStatus("pending");
    else if (type === "category-image") setIsCategoryUploading(true);
    else if (index !== undefined) {
      setImageList(prev => {
        const next = [...prev];
        if (next[index]) next[index] = { ...next[index], uploadStatus: "pending" };
        return next;
      });
    }

    try {
      // Step 1: Get signed URL
      const signedUrlRes = await fetch(`/api/upload?file=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`, {
        method: "GET"
      });

      if (!signedUrlRes.ok) {
        const errorData = await signedUrlRes.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to get upload signature (${signedUrlRes.status})`);
      }

      const { uploadUrl, publicUrl } = await signedUrlRes.json();

      // Step 2: Upload directly to R2/S3
      let finalPublicUrl = publicUrl;
      try {
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
  
        if (!uploadRes.ok) {
          const errorText = await uploadRes.text().catch(() => "Storage error");
          throw new Error(`Cloud storage rejected upload (${uploadRes.status}): ${errorText}`);
        }
      } catch (putErr: any) {
        // Log more detail to console for debugging
        console.error("Direct R2 upload failed:", putErr);

        // If it's a large file, the fallback will likely hit 413 Payload Too Large on the server
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`Direct upload failed (${putErr.message}). Large files (>10MB) must be uploaded directly to Cloud Storage. Please ensure your R2 bucket CORS is configured to allow PUT requests from this domain.`);
        }

        console.warn("Direct R2 upload failed. Falling back to server-side POST...", putErr);
        
        // Fallback: Upload via our own server-side POST route
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
  
        const fbRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });
  
        if (!fbRes.ok) {
          const fbError = await fbRes.json().catch(() => ({}));
          throw new Error(fbError.error || `Server fallback failed (${fbRes.status})`);
        }
  
        const fbData = await fbRes.json();
        finalPublicUrl = fbData.url;
      }
  
      // Update state with public URL
      if (type === "video") {
        setVideoUploadStatus("success");
        setFormData(prev => ({ ...prev, videoUrl: finalPublicUrl }));
        toast.success("Video uploaded successfully");
      } else if (type === "category-image") {
        setCategoryImageUrl(finalPublicUrl);
        setIsCategoryUploading(false);
        toast.success("Category image uploaded");
      } else if (index !== undefined) {
        setImageList(prev => {
          const next = [...prev];
          if (next[index]) next[index] = { ...next[index], uploadStatus: "success", publicUrl: finalPublicUrl };
          return next;
        });
      }
      return finalPublicUrl;
    } catch (err: any) {
      console.error(`${type} upload failed:`, err);
      // Fallback to legacy POST if GET fails or for smaller files if necessary,
      // but usually signed URL is more robust for 10MB+
      if (type === "video") setVideoUploadStatus("failed");
      else if (type === "category-image") setIsCategoryUploading(false);
      else if (index !== undefined) {
        setImageList(prev => {
          const next = [...prev];
          if (next[index]) next[index] = { ...next[index], uploadStatus: "failed" };
          return next;
        });
      }
      toast.error(`Background ${type} upload failed (${err.message}).`);
      return null;
    }
  };

  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startBackgroundUpload(file, "category-image");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => {
        return new Promise<{file: File, preview: string}>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ file, preview: reader.result as string });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImages).then(results => {
        const startIdx = imageList.length;
        setImageList(prev => [...prev, ...results]);
        // Trigger background uploads for each new file
        results.forEach((item, i) => {
          startBackgroundUpload(item.file, "image", startIdx + i);
        });
      });
    }
  };

  const removeImage = (index: number) => {
    setImageList(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      startBackgroundUpload(file, "video");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (role !== "admin" && role !== "merchant") {
        router.push("/");
      } else {
        if (role === "merchant" && !isPinVerified) {
          setLoading(false);
        } else {
          fetchData();
        }
      }
    }
  }, [status, session, router, isPinVerified]);

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinLoading(true);
    try {
      const res = await fetch("/api/auth/merchant-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin })
      });
      if (res.ok) {
        setIsPinVerified(true);
        // fetchData is called by the useEffect dependency change
        toast.success("Security verified");
      } else {
        const error = await res.json();
        toast.error(error.error || "Invalid PIN");
      }
    } catch (err) {
      toast.error("Verification failed");
    } finally {
      setPinLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const role = (session?.user as any)?.role;
      
      const responses = await Promise.all([
        fetchWithRetry("/api/inventory"),
        fetchWithRetry("/api/orders"),
        fetchWithRetry("/api/categories"),
        fetchWithRetry("/api/offers"),
        (role === "admin" || role === "merchant") ? fetchWithRetry("/api/content") : Promise.resolve(null),
        (role === "admin" || role === "merchant") ? fetchWithRetry("/api/messages") : Promise.resolve(null)
      ]);
      
      const productsData = await responses[0].json();
      const ordersData = await responses[1].json();
      const categoriesData = await responses[2].json();
      const offersData = await responses[3].json();
      
      setProducts(Array.isArray(productsData) ? productsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setOffers(Array.isArray(offersData) ? offersData : []);
      
      if ((role === "admin" || role === "merchant") && responses[4]) {
        const cmsData = await responses[4].json();
        setCmsContent(Array.isArray(cmsData) ? cmsData : []);
      }

      if ((role === "admin" || role === "merchant") && responses[5]) {
        const msgData = await responses[5].json();
        setMessages(Array.isArray(msgData) ? msgData : []);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        productData: product.productData || "",
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || "",
        discount: product.discount?.toString() || "",
        sku: product.sku || "",
        category: product.category || "",
        categoryId: product.categoryId || "",
        offerId: product.offerId || "",
        imageUrl: product.imageUrl || "",
        images: Array.isArray(product.images) ? product.images : [],
        videoUrl: product.videoUrl || "",
        stock: product.stock.toString(),
        isBestSeller: product.isBestSeller || false
      });
      const initialImages = (Array.isArray(product.images) ? product.images : (product.imageUrl ? [product.imageUrl] : [])).map(url => ({ preview: url }));
      setImageList(initialImages);
      setVideoFile(null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        productData: "",
        price: "",
        originalPrice: "",
        discount: "",
        sku: "",
        category: "",
        categoryId: "",
        offerId: "",
        imageUrl: "",
        images: [],
        videoUrl: "",
        stock: "10",
        isBestSeller: false
      });
      setImageList([]);
      setVideoFile(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if any uploads are still pending
    const hasPendingImages = imageList.some(img => img.uploadStatus === "pending");
    if (hasPendingImages || videoUploadStatus === "pending") {
      toast.info("Please wait for assets to finish uploading...");
      return;
    }

    setUploading(true);
    
    try {
      // Finalize URLs (use pre-uploaded publicUrl if available, otherwise use preview/string)
      // This is fast because most uploads are already done in the background
      const finalImages = imageList
        .filter(img => img.publicUrl || img.preview.startsWith('http')) // Only keep successful uploads or already saved URLs
        .map(img => img.publicUrl || img.preview);
      
      const finalVideoUrl = formData.videoUrl;

      if (finalImages.length === 0) {
        toast.error("At least one product image is required.");
        setUploading(false);
        return;
      }
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `/api/inventory/${editingProduct.id}` : "/api/inventory";

      const payload = {
        ...formData,
        imageUrl: finalImages[0] || "",
        images: finalImages,
        videoUrl: finalVideoUrl,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        discount: formData.discount ? parseFloat(formData.discount) : null,
        stock: parseInt(formData.stock)
      };

      const response = await fetchWithRetry(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingProduct ? "Product updated" : "Product added");
        setIsModalOpen(false);
        fetchData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save product");
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "An error occurred during save");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingOffer ? "PATCH" : "POST";
    const url = editingOffer ? `/api/offers/${editingOffer.id}` : "/api/offers";

    try {
      const response = await fetchWithRetry(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerFormData),
      });

      if (response.ok) {
        toast.success(editingOffer ? "Offer updated" : "Offer created");
        setIsOfferModalOpen(false);
        fetchData();
      } else {
        const err = await response.json();
        toast.error(err.error || "Failed to save offer");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Product deleted");
        fetchData();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null);

  const handleSyncPayment = async (orderId: string) => {
    if (syncingOrderId) return;
    setSyncingOrderId(orderId);
    try {
      const res = await fetch("/api/payment/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        await fetchData();

        if (selectedOrder && selectedOrder.id === orderId) {
          const freshOrderRes = await fetch(`/api/orders?id=${orderId}`);
          if (freshOrderRes.ok) {
            const freshOrders = await freshOrderRes.json();
            const found = Array.isArray(freshOrders) ? freshOrders.find((o: any) => o.id === orderId) : freshOrders;
            if (found) setSelectedOrder(found);
          }
        }
      } else {
        toast.error("Failed to sync payment status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during payment sync.");
    } finally {
      setSyncingOrderId(null);
    }
  };

  const handleCapturePayment = async (orderId: string, paymentId: string, amount: number) => {
    if (syncingOrderId) return;
    setSyncingOrderId(orderId);
    try {
      const res = await fetch("/api/payment/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentId, amount }),
      });
      if (res.ok) {
        toast.success("Payment successfully captured!");
        await fetchData();

        if (selectedOrder && selectedOrder.id === orderId) {
          const freshOrderRes = await fetch(`/api/orders?id=${orderId}`);
          if (freshOrderRes.ok) {
            const freshOrders = await freshOrderRes.json();
            const found = Array.isArray(freshOrders) ? freshOrders.find((o: any) => o.id === orderId) : freshOrders;
            if (found) setSelectedOrder(found);
          }
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to capture payment.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during payment capture.");
    } finally {
      setSyncingOrderId(null);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      if (response.ok) {
        toast.success("Order status updated");
        fetchData();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCategory ? "PATCH" : "POST";
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";

    try {
      const response = await fetchWithRetry(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: categoryName,
          imageUrl: categoryImageUrl || null
        }),
      });

      if (response.ok) {
        toast.success(editingCategory ? "Category updated" : "Category added");
        setIsCategoryModalOpen(false);
        setCategoryName("");
        setCategoryImageUrl("");
        setEditingCategory(null);
        fetchData();
      } else {
        toast.error("Failed to save category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Products in this category will be marked as 'No Category'.")) return;

    try {
      const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Category deleted");
        fetchData();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const response = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Message deleted");
        fetchData();
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const stats = {
    totalSales: Array.isArray(orders) ? orders.reduce((acc, order) => acc + (order.paymentStatus === "paid" ? order.total : 0), 0) : 0,
    totalOrders: Array.isArray(orders) ? orders.length : 0,
    pendingOrders: Array.isArray(orders) ? orders.filter(order => order.status === "PENDING" || order.status === "PROCESSING").length : 0,
    activeProducts: Array.isArray(products) ? products.length : 0
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Loading Dashboard...</div>
      </div>
    );
  }

  const role = (session?.user as any)?.role;

  if (role === "merchant" && !isPinVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/50 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 border border-amber-900/10 shadow-xl text-center"
        >
          <div className="w-16 h-16 bg-amber-950 text-white rounded-full flex items-center justify-center mx-auto mb-8">
            <Settings size={32} />
          </div>
          <h2 className="font-serif text-3xl text-amber-950 mb-2">Merchant Verification</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-900/40 mb-8">Enter your security PIN to continue</p>
          
          <form onSubmit={handleVerifyPin} className="space-y-6">
            <input 
              type="password" 
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              className="w-full bg-amber-50 border border-amber-900/10 p-4 text-center text-3xl tracking-[0.5em] text-amber-950 focus:outline-none focus:border-amber-900/30"
              required
            />
            <button 
              type="submit"
              disabled={pinLoading}
              className="w-full bg-amber-950 text-white p-4 text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-colors disabled:opacity-50"
            >
              {pinLoading ? "Verifying..." : "Verify Identity"}
            </button>
          </form>

          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-8 text-[10px] uppercase tracking-widest text-amber-900/40 hover:text-amber-950 transition-colors"
          >
            Switch Account
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30 flex relative">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-amber-900/10 p-4 flex justify-between items-center z-[60]">
        <h2 className="font-serif text-xl text-amber-950">Merchant Portal</h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-amber-950"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-amber-950/40 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-amber-900/10 flex flex-col fixed h-full z-[56] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-amber-900/5">
          <h2 className="font-serif text-2xl text-amber-950 tracking-tight">Merchant Portal</h2>
          <p className="text-[8px] uppercase tracking-[0.3em] text-amber-900/40 mt-1">Curated Heritage</p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <SidebarLink 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={activeSection === "dashboard"} 
            onClick={() => { setActiveSection("dashboard"); setIsSidebarOpen(false); }} 
          />
          <SidebarLink 
            icon={
              <div className="relative">
                <ShoppingBag size={18} />
                {orders.some(o => o.status?.toUpperCase() === "PENDING") && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-white shadow-sm" />
                )}
              </div>
            }
            label="Orders" 
            active={activeSection === "orders"} 
            onClick={() => { setActiveSection("orders"); setIsSidebarOpen(false); }} 
          />
          <SidebarLink 
            icon={<Package size={18} />} 
            label="Inventory" 
            active={activeSection === "inventory"} 
            onClick={() => { setActiveSection("inventory"); setIsSidebarOpen(false); }} 
          />
          <SidebarLink 
            icon={<Filter size={18} />} 
            label="Categories" 
            active={activeSection === "categories"} 
            onClick={() => { setActiveSection("categories"); setIsSidebarOpen(false); }} 
          />
          <SidebarLink 
            icon={<TrendingUp size={18} />} 
            label="Offers & Promotions" 
            active={activeSection === "offers"} 
            onClick={() => { setActiveSection("offers"); setIsSidebarOpen(false); }} 
          />
          {((session?.user as any)?.role === "admin" || (session?.user as any)?.role === "merchant") && (
            <>
              <SidebarLink 
                icon={<Settings size={18} />} 
                label="Website Content" 
                active={activeSection === "cms"} 
                onClick={() => { setActiveSection("cms"); setIsSidebarOpen(false); }} 
              />
              <SidebarLink 
                icon={<Truck size={18} />} 
                label="Shipping Config" 
                active={activeSection === "shipping"} 
                onClick={() => { setActiveSection("shipping"); setIsSidebarOpen(false); }} 
              />
              <SidebarLink 
                icon={
                  <div className="relative">
                    <Clock size={18} />
                    {messages.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white shadow-sm animate-pulse" />
                    )}
                  </div>
                } 
                label={`Inquiries (${messages.length})`} 
                active={activeSection === "messages"} 
                onClick={() => { setActiveSection("messages"); setIsSidebarOpen(false); }} 
              />
              <SidebarLink 
                icon={<Mail size={18} />} 
                label="Email Logic" 
                active={activeSection === "emails"} 
                onClick={() => { setActiveSection("emails"); setIsSidebarOpen(false); }} 
              />
            </>
          )}
        </nav>

        <div className="p-6 border-t border-amber-900/5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[8px] uppercase tracking-widest font-bold text-amber-900/40">Heritage Mode</span>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem("sru_cart");
              window.dispatchEvent(new Event("sru_cart_change"));
              signOut({ callbackUrl: "/" });
            }}
            className="flex items-center gap-3 text-amber-900/40 hover:text-red-600 transition-colors text-[10px] uppercase tracking-widest font-bold w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-12 pt-24 lg:pt-12">
        <AnimatePresence mode="wait">
          {activeSection === "dashboard" && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="font-serif text-4xl text-amber-950 mb-2">Welcome back, {(session?.user as any)?.name || "Merchant"}</h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40">Here is what's happening with your store today.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 mb-1">Current Date</p>
                  <p className="text-sm font-medium text-amber-950">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </header>

              {messages.length > 0 && (
                <div className="bg-amber-50/50 border border-amber-950/10 p-5 flex items-center justify-between gap-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 font-bold"></span>
                    </span>
                    <div>
                      <p className="text-xs font-bold text-amber-950 uppercase tracking-widest">New Customer Inquiries Received</p>
                      <p className="text-[10px] text-amber-900/60 mt-0.5">You have {messages.length} customer inquiry message{messages.length > 1 ? 's' : ''} awaiting response in your inbox.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveSection("messages")}
                    className="text-[10px] uppercase tracking-widest font-bold text-amber-950 border-b border-amber-950 hover:opacity-75 transition-opacity py-0.5"
                  >
                    View Messages
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={<DollarSign className="text-green-600" />} label="Total Sales" value={`₹${stats.totalSales.toFixed(2)}`} trend="+12.5%" />
                  <StatCard icon={<ShoppingBag className="text-blue-600" />} label="Total Orders" value={stats.totalOrders.toString()} trend="+5.2%" />
                  <StatCard icon={<Clock className="text-amber-600" />} label="Pending Orders" value={stats.pendingOrders.toString()} trend="-2.1%" />
                  <StatCard icon={<Package className="text-purple-600" />} label="Active Products" value={stats.activeProducts.toString()} trend="0.0%" />
                </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white p-8 border border-amber-900/5 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif text-xl text-amber-950">Recent Orders</h3>
                    <button onClick={() => setActiveSection("orders")} className="text-[10px] uppercase tracking-widest font-bold text-amber-900 hover:opacity-70 transition-opacity flex items-center gap-2">
                      View All <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {Array.isArray(orders) && orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-amber-900/5 hover:bg-amber-50 transition-colors">
                        <div>
                          <p className="text-xs font-medium text-amber-950">Order #{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-[8px] text-amber-900/40 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-amber-950">₹{order.total.toFixed(2)}</p>
                          <span className="text-[8px] uppercase tracking-widest font-bold text-amber-600">{order.status}</span>
                        </div>
                      </div>
                    ))}
                    {(!Array.isArray(orders) || orders.length === 0) && (
                      <p className="text-[10px] text-amber-900/40 uppercase tracking-widest text-center py-8">No recent orders</p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-8 border border-amber-900/5 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif text-xl text-amber-950">Inventory Overview</h3>
                    <button onClick={() => setActiveSection("inventory")} className="text-[10px] uppercase tracking-widest font-bold text-amber-900 hover:opacity-70 transition-opacity flex items-center gap-2">
                      Manage <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {Array.isArray(products) && products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border border-amber-900/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-amber-50 overflow-hidden">
                            <img src={product.imageUrl || getPlaceholderImage(product.category)} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-amber-950">{product.name}</p>
                            <p className="text-[8px] text-amber-900/40 uppercase tracking-widest">{product.category || "No Category"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${product.stock < 5 ? 'text-red-500' : 'text-amber-950'}`}>
                            {product.stock} in stock
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "orders" && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <h1 className="font-serif text-4xl text-amber-950 mb-8">Order Management</h1>
              <div className="bg-white border border-amber-900/10 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-amber-50/50 border-b border-amber-900/10">
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-amber-900/60">Order ID</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-amber-900/60">Customer</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-amber-900/60">Contact</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-amber-900/60">Date</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-amber-900/60">Total</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-amber-900/60">Status</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-amber-900/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/5">
                    {Array.isArray(orders) && orders.map((order) => (
                      <tr key={order.id} className="hover:bg-amber-50 transition-colors">
                        <td className="p-6 text-xs font-medium text-amber-950">#{order.id.slice(-8).toUpperCase()}</td>
                        <td className="p-6">
                           <p className="text-xs font-medium text-amber-950">
                             {order.shippingAddress?.firstName ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ""}`.trim() : (order.customer?.name || order.shippingAddress?.name || "Customer")}
                           </p>
                           <p className="text-[10px] text-amber-900/40">{order.customer?.email || order.shippingAddress?.email}</p>
                        </td>
                        <td className="p-6 text-xs text-amber-900/60">
                          {order.phone || (order.shippingAddress as any)?.phone || "N/A"}
                        </td>
                        <td className="p-6 text-xs text-amber-900/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-6 text-xs font-medium text-amber-950">
                          {order.currency === "INR" ? "₹" : 
                           order.currency === "USD" ? "$" : 
                           order.currency === "EUR" ? "€" : 
                           order.currency === "GBP" ? "£" : ""}{order.total.toFixed(2)}
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full ${
                            order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' : 
                            order.paymentStatus === 'failed' || order.status === 'FAILED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {order.paymentStatus === 'failed' ? 'FAILED' : (order.status === "PENDING" ? "Received" : order.status)}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            {order.paymentStatus !== "failed" && order.status !== "FAILED" ? (
                              <select 
                                value={order.status.toUpperCase()}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="bg-transparent border border-amber-900/10 p-2 text-[10px] uppercase tracking-widest font-bold text-amber-950 focus:outline-none"
                              >
                                <option value="PENDING">Received</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                              </select>
                            ) : (
                              <span className="text-[10px] uppercase tracking-widest font-bold text-red-900/30">No Actions</span>
                            )}
                            <button 
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsOrderModalOpen(true);
                              }}
                              className="p-2 text-amber-900/40 hover:text-amber-950 transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeSection === "inventory" && (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h1 className="font-serif text-4xl text-amber-950 mb-2">Inventory</h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40">Manage your heritage collection.</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/40" size={14} />
                    <input 
                      type="text"
                      placeholder="Search items or SKU..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full bg-amber-50/50 border border-amber-900/10 pl-10 pr-4 py-3 text-[10px] uppercase tracking-widest focus:outline-none focus:border-amber-900/30 transition-all"
                    />
                  </div>
                  <button 
                    onClick={() => handleOpenModal()}
                    className="w-full md:w-auto px-8 py-4 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3"
                  >
                    <Plus size={16} />
                    Add Product
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {Array.isArray(products) && products
                  .filter(p => !inventorySearch || p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || p.sku?.toLowerCase().includes(inventorySearch.toLowerCase()))
                  .map((product) => (
                  <div key={product.id} className="bg-white border border-amber-900/10 group overflow-hidden flex flex-col">
                    <div className="aspect-[4/5] bg-amber-50 relative overflow-hidden">
                      <img 
                        src={product.imageUrl || getPlaceholderImage(product.category)} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-3 bg-white text-amber-950 hover:bg-amber-950 hover:text-white transition-all shadow-xl"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-3 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
      {product.stock < 25 && (
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-red-600 text-white text-[8px] uppercase tracking-widest font-bold">
          Low Stock: {product.stock}
        </div>
      )}
                    </div>
                    <div className="p-6 space-y-2 flex-1 flex flex-col">
                      <p className="text-[8px] uppercase tracking-widest text-amber-900/40 font-bold">{product.categoryRel?.name || product.category || "No Category"}</p>
                      <h3 className="font-serif text-lg text-amber-950">{product.name}</h3>
                      <p className="text-sm font-medium text-amber-950 mt-auto">₹{product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "categories" && (
            <motion.div 
              key="categories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-serif text-4xl text-amber-950 mb-2">Categories</h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40">Organize your products into collections.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryName("");
                    setIsCategoryModalOpen(true);
                  }}
                  className="px-8 py-4 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all flex items-center gap-3"
                >
                  <Plus size={16} />
                  Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(categories) && categories.map((cat) => (
                  <div key={cat.id} className="bg-white border border-amber-900/10 p-6 flex justify-between items-center group hover:bg-amber-50 transition-colors">
                    <div>
                      <h3 className="font-serif text-xl text-amber-950">{cat.name}</h3>
                      <p className="text-[8px] uppercase tracking-widest text-amber-900/40 font-bold">
                        {products.filter(p => p.categoryId === cat.id).length} Products
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryName(cat.name);
                          setCategoryImageUrl(cat.imageUrl || "");
                          setIsCategoryModalOpen(true);
                        }}
                        className="p-2 text-amber-900/20 hover:text-amber-950 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 text-amber-900/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "offers" && (
            <motion.div 
              key="offers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-serif text-4xl text-amber-950 mb-2">Offers & Promotions</h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40">Create and manage marketing promotions and product discounts.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingOffer(null);
                    setOfferFormData({ name: "", description: "", discount: "" });
                    setIsOfferModalOpen(true);
                  }}
                  className="px-8 py-4 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all flex items-center gap-3"
                >
                  <Plus size={16} />
                  New Offer Name
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(offers) && offers.map((offer) => {
                  const linkedProducts = products.filter(p => p.offerId === offer.id);
                  return (
                    <div key={offer.id} className="bg-white border border-amber-900/10 p-8 flex flex-col justify-between group hover:bg-amber-50 transition-colors">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                           <h3 className="font-serif text-2xl text-amber-950">{offer.name}</h3>
                        </div>
                        <p className="text-xs text-amber-900/60 leading-relaxed mb-6">
                          {offer.description || "No description provided."}
                        </p>
                        <div className="h-px bg-amber-950/10 w-full mb-6" />
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-950">
                                {linkedProducts.length} Products Linked
                              </span>
                           </div>
                           {linkedProducts.length > 0 && (
                             <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                               {linkedProducts.map(p => (
                                 <div key={p.id} className="flex items-center gap-3 py-2 border-b border-amber-950/5 last:border-0">
                                   <div className="w-8 h-8 bg-amber-50 flex-shrink-0">
                                     <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                                   </div>
                                   <span className="text-[10px] text-amber-900/60 truncate font-medium">{p.name}</span>
                                 </div>
                               ))}
                             </div>
                           )}
                        </div>
                      </div>
                      <div className="flex gap-4 mt-8 pt-8 border-t border-amber-950/5">
                        <button 
                           onClick={() => {
                             setEditingOffer(offer);
                             setOfferFormData({ 
                               name: offer.name, 
                               description: offer.description || "", 
                               discount: offer.discount?.toString() || "" 
                             });
                             setIsOfferModalOpen(true);
                           }}
                           className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-amber-900 hover:text-amber-950"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button 
                           onClick={async () => {
                             if (!confirm("Are you sure? This will remove the offer name from all linked products.")) return;
                             try {
                               const res = await fetch(`/api/offers/${offer.id}`, { method: "DELETE" });
                               if (res.ok) {
                                 toast.success("Offer deleted");
                                 fetchData();
                               }
                             } catch (err) {
                               toast.error("Failed to delete offer");
                             }
                           }}
                           className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white border border-amber-900/10 overflow-hidden mt-12">
                <div className="p-8 border-b border-amber-900/5">
                  <h3 className="font-serif text-xl text-amber-950 uppercase tracking-tight">Direct Product Discounts</h3>
                  <p className="text-[10px] text-amber-900/40 uppercase tracking-widest mt-1">Products with discounted pricing applied individually.</p>
                </div>
                <div className="divide-y divide-amber-900/5">
                  {products.filter(p => p.originalPrice || p.discount).map(product => (
                    <div key={product.id} className="p-6 flex items-center justify-between hover:bg-amber-50/50 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-50 overflow-hidden rounded-sm border border-amber-900/5">
                          <img src={product.imageUrl || getPlaceholderImage(product.category)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-950">{product.name}</p>
                          <p className="text-[10px] text-amber-900/40 uppercase tracking-widest">{product.categoryRel?.name || product.category || "No Category"}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-bold text-red-600">₹{product.price}</span>
                            {product.originalPrice && <span className="text-[10px] text-amber-900/40 line-through">₹{product.originalPrice}</span>}
                            <span className="text-[8px] px-2 py-0.5 bg-red-50 text-red-600 font-bold uppercase tracking-widest border border-red-100">
                              {product.discount ? `${product.discount}% OFF` : product.originalPrice ? `${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF` : 'ON SALE'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="px-4 py-2 border border-amber-900/10 text-[8px] uppercase tracking-widest font-bold text-amber-900 hover:bg-amber-950 hover:text-white transition-all"
                        >
                          Modify Discount
                        </button>
                        <button 
                          onClick={async () => {
                            if (!confirm("End this discount?")) return;
                            try {
                              const res = await fetch(`/api/inventory/${product.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ 
                                  ...product, 
                                  price: product.originalPrice || product.price, 
                                  originalPrice: null,
                                  discount: null
                                })
                              });
                              if (res.ok) {
                                toast.success("Discount removed");
                                fetchData();
                              }
                            } catch (e) { toast.error("Failed to remove discount"); }
                          }}
                          className="px-4 py-2 border border-red-100 text-[8px] uppercase tracking-widest font-bold text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {products.filter(p => p.originalPrice || p.discount).length === 0 && (
                    <div className="p-12 text-center text-[10px] uppercase tracking-widest text-amber-900/40">
                      No products currently have active discounts. Add them in the inventory section.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "cms" && (
            <motion.div 
              key="cms"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h1 className="font-serif text-4xl text-amber-950 mb-2">Website Content Management</h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40">Edit text and images across your website.</p>
                </div>
                <div className="flex gap-4">
                  <select 
                    value={selectedCmsPage}
                    onChange={(e) => setSelectedCmsPage(e.target.value)}
                    className="bg-white border border-amber-900/10 px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-amber-950 focus:outline-none"
                  >
                    <option value="home">Home Page</option>
                    <option value="about">About Page</option>
                    <option value="contact">Contact Page</option>
                    <option value="privacy">Privacy Policy</option>
                    <option value="terms">Terms of Service</option>
                    <option value="return-policy">Return Policy</option>
                    <option value="shipping">Shipping Policy</option>
                  </select>
                  {selectedCmsPage === "privacy" && (
                    <p className="mt-2 text-[10px] text-amber-900/40 italic">Note: Enter each point on a new line or start with "•" or "1." for bulleted display.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cmsContent.filter(c => c.page === selectedCmsPage).map((item) => (
                  <CMSSectionEditor 
                    key={item.id}
                    title={item.section} 
                    page={item.page} 
                    section={item.section} 
                    initialContent={item.content}
                    initialDisplayOrder={item.displayOrder}
                    onSave={fetchData}
                    products={products}
                    categories={categories}
                    onDelete={async () => {
                      if (confirm(`Delete section "${item.section}"?`)) {
                        const res = await fetch("/api/content", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ page: item.page, section: item.section })
                        });
                        if (res.ok) {
                          toast.success("Section deleted");
                          fetchData();
                        }
                      }
                    }}
                  />
                ))}
                {cmsContent.filter(c => c.page === selectedCmsPage).length === 0 && (
                  <div className="col-span-full py-20 text-center bg-amber-50/30 border border-dashed border-amber-900/10 space-y-4">
                    <p className="text-[10px] uppercase tracking-widest text-amber-900/40">No sections found for this page.</p>
                    <p className="text-xs text-amber-900/60 max-w-xs mx-auto">
                      Use the "Add Section" button to create content. 
                      {selectedCmsPage === "terms" && " (Suggested section ID: 'main' with keys: 'title', 'intro', 'sections' (as list))"}
                      {selectedCmsPage === "return-policy" && " (Suggested section ID: 'policy' with 'title' and 'content')"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === "shipping" && (
            <motion.div 
              key="shipping"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div>
                <h1 className="font-serif text-4xl text-amber-950 mb-2">Shipping Logic & Marketplace Rules</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40">Manage global costs and conditional shipping rules in one place.</p>
              </div>

              <div className="grid grid-cols-1 gap-12">
                <CMSSectionEditor 
                  title="Unified Shipping Manager" 
                  page="config" 
                  section="shipping-logic" 
                  initialContent={cmsContent.find(c => c.page === "config" && c.section === "shipping-logic")?.content || { baseCharge: 500, freeAbove: 25000, perItemSurcharge: 50, globalDisplayText: "", rules: [] }}
                  onSave={fetchData}
                  products={products}
                  categories={categories}
                />
              </div>
            </motion.div>
          )}

          {activeSection === "messages" && (
            <motion.div 
              key="messages"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <h1 className="font-serif text-4xl text-amber-950 mb-2">Customer Inquiries</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40">Messages from the 'Reach out' page.</p>
              </div>

              <div className="bg-white border border-amber-900/10 overflow-hidden">
                <div className="divide-y divide-amber-900/5">
                  {messages.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-amber-900/40">No messages yet.</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-8 hover:bg-amber-50 transition-colors group relative">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-serif text-xl text-amber-950">{msg.subject}</h4>
                          <div className="flex gap-4 mt-1">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-950">{msg.name}</span>
                            <span className="text-[10px] uppercase tracking-widest text-amber-900/40">{msg.email}</span>
                            {msg.phone && <span className="text-[10px] uppercase tracking-widest text-amber-900/40">{msg.phone}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[8px] uppercase tracking-widest text-amber-900/40">{new Date(msg.createdAt).toLocaleString()}</span>
                          <button 
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-amber-900/70 leading-relaxed max-w-2xl">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "emails" && (
            <motion.div 
              key="emails"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div>
                <h1 className="font-serif text-4xl text-amber-950 mb-2">Email Control Center</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40">Manage automated communications and view dispatch logs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-amber-950 uppercase tracking-tight">Active Templates</h3>
                  <div className="flex flex-col gap-8">
                    <EmailTemplateEditor 
                      type="welcome" 
                      title="Welcome Email"
                      initialSubject="Welcome to the Family"
                      initialBody={EMAIL_TEMPLATES.welcome("Guest").html}
                    />
                    <EmailTemplateEditor 
                      type="order-confirmation" 
                      title="Order Confirmation"
                      initialSubject="Your Heritage Selection is Confirmed"
                      initialBody={EMAIL_TEMPLATES.orderConfirmation("ORDER-123", 5000).html}
                    />
                    <EmailTemplateEditor 
                      type="forgot-password" 
                      title="Forgot Password"
                      initialSubject="Password Recovery"
                      initialBody={EMAIL_TEMPLATES.forgotPassword("TOKEN").html}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-amber-950 uppercase tracking-tight">Dispatch Logs</h3>
                  <div className="bg-white border border-amber-900/10 overflow-hidden">
                    <div className="divide-y divide-amber-900/5">
                      {emailLogs.length === 0 && (
                        <div className="p-12 text-center text-[10px] uppercase tracking-widest text-amber-900/40">
                          No emails dispatched yet.
                        </div>
                      )}
                      {emailLogs.map((log) => (
                        <div key={log.id} className="p-6 flex justify-between items-center hover:bg-amber-50 transition-colors">
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] uppercase tracking-widest font-bold text-amber-950">{log.type}</span>
                            <span className="text-sm font-medium text-amber-900">{log.to}</span>
                            <span className="text-[10px] text-amber-900/40">{log.subject}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] uppercase tracking-widest text-amber-900/40">{new Date(log.sentAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}                  
        </AnimatePresence>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-amber-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-amber-900/40 hover:text-amber-950"
              >
                <X size={24} />
              </button>

              <h2 className="font-serif text-3xl text-amber-950 mb-8">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Product Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">SKU</label>
                    <input 
                      type="text" 
                      placeholder="SRU-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    />
                  </div>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Category</label>
                      <select 
                        required
                        value={formData.categoryId}
                        onChange={(e) => {
                          const cat = categories.find(c => c.id === e.target.value);
                          setFormData({...formData, categoryId: e.target.value, category: cat?.name || ""});
                        }}
                        className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950 appearance-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Active Offer</label>
                       <select 
                         value={formData.offerId}
                         onChange={(e) => setFormData({...formData, offerId: e.target.value})}
                         className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                       >
                         <option value="">No Active Offer</option>
                         {offers.map((offer) => (
                           <option key={offer.id} value={offer.id}>{offer.name}</option>
                         ))}
                       </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Stock Quantity</label>
                      <input 
                        required
                        type="number" 
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                      />
                    </div>
                  </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950 resize-none"
                    placeholder="Brief description for catalog"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Product Data (Technical/Heritage Details)</label>
                  <textarea 
                    rows={6}
                    value={formData.productData}
                    onChange={(e) => setFormData({...formData, productData: e.target.value})}
                    className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950 resize-none"
                    placeholder="Detailed specifications, heritage info, artisan story, etc."
                  />
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Listing Price (₹)</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Applied Discount (%)</label>
                       <input 
                         type="number" 
                         step="0.1"
                         value={formData.discount}
                         onChange={(e) => setFormData({...formData, discount: e.target.value})}
                         className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                         placeholder="e.g. 10 for 10% off"
                       />
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      id="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({...formData, isBestSeller: e.target.checked})}
                      className="w-4 h-4 text-amber-950 border-amber-900/20 rounded focus:ring-amber-900"
                    />
                    <label htmlFor="isBestSeller" className="text-[10px] uppercase tracking-widest font-bold text-amber-900/60 cursor-pointer">
                      Mark as Best Selling Product
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Product Video</label>
                    <div className="flex flex-col gap-4">
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        id="video-upload"
                      />
                      <label 
                        htmlFor="video-upload"
                        className="w-full py-3 border-b border-amber-900/20 text-amber-950 text-sm cursor-pointer hover:border-amber-900 transition-colors flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          {videoUploadStatus === "pending" && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                          {videoUploadStatus === "success" && <div className="w-2 h-2 rounded-full bg-green-500" />}
                          {videoUploadStatus === "failed" && <div className="w-2 h-2 rounded-full bg-red-500" />}
                          {videoFile ? videoFile.name : (formData.videoUrl ? "Video Attached" : "Upload Video directly")}
                        </div>
                        <Plus size={14} className="text-amber-900/40" />
                      </label>
                      <p className="text-[8px] text-amber-900/40 uppercase tracking-widest">Or provide a URL below</p>
                      <input 
                        type="url" 
                        placeholder="https://example.com/video.mp4"
                        value={formData.videoUrl.startsWith('data:') ? '' : formData.videoUrl}
                        onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                        className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                      />
                    </div>
                  </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <ImageIcon size={12} />
                       Product Images (Required)
                    </div>
                    <button 
                      type="button"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="text-amber-700 hover:text-amber-950 transition-colors"
                    >
                      + Add Image
                    </button>
                  </label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageList.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-amber-50 border border-amber-900/10 flex items-center justify-center overflow-hidden rounded-sm relative group">
                        <img src={img.preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-all shadow-inner" />
                        
                        {/* Upload Status Overlay */}
                        {img.uploadStatus === "pending" && (
                          <div className="absolute inset-0 bg-amber-50/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-amber-950 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[7px] uppercase tracking-widest font-bold text-amber-950">Uploading</span>
                          </div>
                        )}
                        {img.uploadStatus === "failed" && (
                          <div className="absolute inset-0 bg-red-50/60 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
                            <AlertCircle size={14} className="text-red-600" />
                            <span className="text-[7px] uppercase tracking-widest font-bold text-red-600">Failed</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {idx === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-950 text-white text-[7px] uppercase tracking-widest font-bold">Main</div>
                        )}
                      </div>
                    ))}
                    
                    <button 
                      type="button"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="aspect-square bg-amber-50/50 border border-dashed border-amber-900/20 flex flex-col items-center justify-center gap-2 hover:bg-amber-100/50 transition-colors rounded-sm"
                    >
                      <Plus size={20} className="text-amber-950/20" />
                      <span className="text-[8px] uppercase tracking-widest font-bold text-amber-950/40">Upload New</span>
                    </button>

                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[8px] text-amber-900/40 uppercase tracking-widest">Add image by URL</p>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        placeholder="https://images.unsplash.com/..."
                        id="image-url-input"
                        className="flex-1 bg-transparent border-b border-amber-900/20 py-2 focus:outline-none focus:border-amber-900 transition-colors text-amber-950 text-xs"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('image-url-input') as HTMLInputElement;
                          if (input.value) {
                            setImageList(prev => [...prev, { preview: input.value }]);
                            input.value = "";
                          }
                        }}
                        className="px-4 py-2 bg-amber-950 text-white text-[8px] uppercase tracking-widest font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all disabled:opacity-50"
                >
                  {uploading ? "Uploading Assets..." : loading ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute inset-0 bg-amber-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-900/10"
            >
              <div className="p-8 border-b border-amber-900/5 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="font-serif text-2xl text-amber-950">Order Details</h2>
                  <p className="text-[10px] uppercase tracking-widest text-amber-900/40 mt-1">#{selectedOrder.id.toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setIsOrderModalOpen(false)}
                  className="p-2 hover:bg-amber-50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Customer Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-amber-900/40 mb-0.5">Full Name</p>
                        <p className="text-sm font-medium text-amber-950">
                          {selectedOrder.shippingAddress?.firstName ? `${selectedOrder.shippingAddress.firstName} ${selectedOrder.shippingAddress.lastName || ""}`.trim() : (selectedOrder.customer?.name || selectedOrder.shippingAddress?.name || "Customer")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-amber-900/40 mb-0.5">Email Address</p>
                        <p className="text-xs text-amber-900/60 font-medium">{selectedOrder.customer?.email || "No email provided"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-amber-900/40 mb-0.5">Contact Number</p>
                        <p className="text-sm font-bold text-amber-950">{selectedOrder.phone || selectedOrder.customer?.phone || "No phone provided"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-amber-900/40 mb-0.5">Customer Type</p>
                        <span className="px-2 py-0.5 bg-amber-50 text-[8px] uppercase tracking-widest font-bold text-amber-900 border border-amber-900/10">
                          {selectedOrder.customer?.role === "customer" ? "Registered Customer" : selectedOrder.customer?.role?.toUpperCase() || "GUEST"}
                        </span>
                      </div>
                      {selectedOrder.customer?.createdAt && (
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-amber-900/40 mb-0.5">Member Since</p>
                          <p className="text-[10px] text-amber-950">{new Date(selectedOrder.customer.createdAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Shipping Address</h3>
                    <div className="text-xs text-amber-900/60 leading-relaxed bg-amber-50/30 p-4 border border-amber-900/5">
                      {selectedOrder.shippingAddress ? (
                        <>
                          <p className="font-bold text-amber-950 mb-2">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                          <p>{selectedOrder.shippingAddress.street}</p>
                          {selectedOrder.shippingAddress.street2 && <p>{selectedOrder.shippingAddress.street2}</p>}
                          <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode || selectedOrder.shippingAddress.zipCode}</p>
                          <p>{selectedOrder.shippingAddress.country}</p>
                          <p className="mt-2 font-bold text-amber-900">{selectedOrder.phone || selectedOrder.shippingAddress.phone}</p>
                        </>
                      ) : (
                        <p>No address provided</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Order Items</h3>
                  <div className="border border-amber-900/5 divide-y divide-amber-900/5">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-amber-50 overflow-hidden">
                            <img src={item.imageUrl || item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-amber-950">{item.name}</p>
                            <p className="text-[10px] text-amber-900/40">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-amber-950">₹{(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Status */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-amber-900/5">
                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Payment Details</h3>
                    <div className="space-y-1">
                      <p className="text-xs text-amber-900/60">Status: <span className="font-bold text-amber-950 uppercase">{selectedOrder.paymentStatus}</span></p>
                      {(() => {
                        const activeTx = selectedOrder.transactions?.find((t: any) => t.providerPaymentId) || selectedOrder.transactions?.[0];
                        const providerOrderId = activeTx?.providerOrderId || selectedOrder.transactions?.[0]?.providerOrderId || "N/A";
                        const providerPaymentId = activeTx?.providerPaymentId || "N/A";
                        const isAuthorized = activeTx?.status?.toLowerCase() === "authorized";

                        return (
                          <>
                            <p className="text-dashed text-xs text-amber-900/60">Razorpay Order: <span className="text-amber-950 font-mono font-medium">{providerOrderId}</span></p>
                            <p className="text-dashed text-xs text-amber-900/60">Payment ID: <span className="text-amber-950 font-mono font-medium">{providerPaymentId}</span></p>
                            
                            {isAuthorized && (
                              <div className="mt-3 bg-amber-50/50 p-2 border border-amber-950/20 rounded-sm">
                                <p className="text-[10px] text-amber-950 font-medium font-sans">Payment Authorized (Requires capture)</p>
                                <button
                                  onClick={() => handleCapturePayment(selectedOrder.id, providerPaymentId, selectedOrder.total)}
                                  disabled={syncingOrderId !== null}
                                  className="mt-1.5 px-3 py-1 bg-amber-900 hover:bg-amber-950 disabled:opacity-50 text-white rounded text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 font-sans"
                                >
                                  {syncingOrderId === selectedOrder.id ? "Capturing..." : "Capture Payment"}
                                </button>
                              </div>
                            )}

                            {(selectedOrder.paymentStatus === "unpaid" || selectedOrder.paymentStatus === "failed") && (
                              <div className="mt-3">
                                <button
                                  onClick={() => handleSyncPayment(selectedOrder.id)}
                                  disabled={syncingOrderId !== null}
                                  className="px-3 py-1 border border-amber-900/20 hover:bg-amber-50 disabled:opacity-50 text-amber-900 rounded text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 font-sans"
                                >
                                  {syncingOrderId === selectedOrder.id ? "Syncing..." : "Sync Gateway Status"}
                                </button>
                              </div>
                            )}
                          </>
                        );
                      })()}
                      {(() => {
                        const failedTx = selectedOrder.transactions?.find((t: any) => t.status?.toLowerCase() === "failed" || t.errorDetails);
                        if (failedTx && failedTx.errorDetails) {
                          try {
                            const errObj = JSON.parse(failedTx.errorDetails);
                            const desc = errObj.description || errObj.reason || errObj.message || failedTx.errorDetails;
                            return (
                              <div className="mt-2 bg-red-50 p-2.5 border border-red-200/50 rounded text-red-900 text-left">
                                <p className="text-[8px] uppercase font-bold text-red-950/50">Failure Reason</p>
                                <p className="text-xs font-semibold leading-normal mt-0.5">{desc}</p>
                              </div>
                            );
                          } catch (e) {
                            return (
                              <div className="mt-2 bg-red-50 p-2.5 border border-red-200/50 rounded text-red-900 text-left">
                                <p className="text-[8px] uppercase font-bold text-red-950/50">Failure Reason</p>
                                <p className="text-xs font-semibold leading-normal mt-0.5">{failedTx.errorDetails}</p>
                              </div>
                            );
                          }
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                  <div className="space-y-4 text-right">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Order Summary</h3>
                    <div className="space-y-1">
                      <p className="text-2xl font-serif text-amber-950">₹{selectedOrder.total.toFixed(2)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-amber-900/40">Total Amount Paid</p>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4 pt-8 border-t border-amber-900/5">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Additional Information</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-amber-900/40 font-bold mb-1">Packaging Details</p>
                      <p className="text-xs text-amber-950">{selectedOrder.packagingDetails || "Standard Heritage Packaging"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-amber-900/40 font-bold mb-1">Delivery Type</p>
                      <p className="text-xs text-amber-950">{selectedOrder.deliveryType || "Standard Insured Shipping"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-amber-50/50 border-t border-amber-900/5">
                <button 
                  onClick={() => setIsOrderModalOpen(false)}
                  className="w-full py-4 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-amber-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white p-12 shadow-2xl"
            >
              <h2 className="font-serif text-3xl text-amber-950 mb-8">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <form onSubmit={handleSaveCategory} className="space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Category Name</label>
                    <input 
                      required
                      type="text" 
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                      placeholder="e.g. Handwoven Sarees"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Category Image</label>
                    <div className="flex flex-col gap-4">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleCategoryImageUpload}
                        className="hidden"
                        id="category-image-upload"
                      />
                      <label 
                        htmlFor="category-image-upload"
                        className="w-full py-4 border-2 border-dashed border-amber-900/10 flex flex-col items-center justify-center gap-2 hover:bg-amber-50 transition-colors cursor-pointer group"
                      >
                        {categoryImageUrl ? (
                          <img src={categoryImageUrl} alt="Preview" className="w-full h-32 object-cover" />
                        ) : (
                          <>
                            <ImageIcon className="text-amber-900/20 group-hover:text-amber-900/40 transition-colors" size={24} />
                            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-amber-900/40">
                              {isCategoryUploading ? "Uploading..." : "Click to upload image"}
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all"
                >
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Offer Modal */}
      <AnimatePresence>
        {isOfferModalOpen && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOfferModalOpen(false)}
              className="absolute inset-0 bg-amber-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white p-12 shadow-2xl"
            >
              <h2 className="font-serif text-3xl text-amber-950 mb-8">
                {editingOffer ? "Edit Offer" : "Create New Offer"}
              </h2>
              <form onSubmit={handleSaveOffer} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Offer Name</label>
                  <input 
                    required
                    type="text" 
                    value={offerFormData.name}
                    onChange={(e) => setOfferFormData({...offerFormData, name: e.target.value})}
                    className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    placeholder="e.g. Summer Sale"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Description</label>
                  <textarea 
                    value={offerFormData.description}
                    onChange={(e) => setOfferFormData({...offerFormData, description: e.target.value})}
                    className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950 resize-none"
                    rows={3}
                    placeholder="Describe the offer details..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all shadow-xl mt-4"
                >
                  {editingOffer ? "Update Offer" : "Create Offer"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CMS Section Modal */}
      <AnimatePresence>
        {isCmsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCmsModalOpen(false)}
              className="absolute inset-0 bg-amber-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="font-serif text-3xl text-amber-950 mb-8">Add New Section to {selectedCmsPage}</h2>
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Section ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. seasonal-edit"
                      value={cmsFormData.section}
                      onChange={(e) => setCmsFormData({...cmsFormData, section: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Display Order</label>
                    <input 
                      type="number" 
                      value={cmsFormData.displayOrder}
                      onChange={(e) => setCmsFormData({...cmsFormData, displayOrder: parseInt(e.target.value)})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Fields</label>
                    <button 
                      onClick={() => setCmsFormData({...cmsFormData, fields: [...cmsFormData.fields, { key: "", value: "", type: "text" }]})}
                      className="text-[10px] uppercase tracking-widest font-bold text-amber-700"
                    >
                      + Add Field
                    </button>
                  </div>
                  {cmsFormData.fields.map((field, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-4">
                        <input 
                          placeholder="Key (e.g. title)"
                          value={field.key}
                          onChange={(e) => {
                            const newFields = [...cmsFormData.fields];
                            newFields[idx].key = e.target.value;
                            setCmsFormData({...cmsFormData, fields: newFields});
                          }}
                          className="w-full bg-transparent border-b border-amber-900/20 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-5">
                        <select 
                          value={field.type}
                          onChange={(e) => {
                            const newFields = [...cmsFormData.fields];
                            newFields[idx].type = e.target.value as any;
                            setCmsFormData({...cmsFormData, fields: newFields});
                          }}
                          className="w-full bg-transparent border-b border-amber-900/20 py-2 text-xs focus:outline-none"
                        >
                          <option value="text">Short Text</option>
                          <option value="textarea">Long Text</option>
                          <option value="image">Image URL</option>
                          <option value="product-list">Product Selection</option>
                          <option value="category-list">Category Selection</option>
                          <option value="list">Generic List (e.g. Policies)</option>
                        </select>
                      </div>
                      <div className="col-span-3 flex justify-end">
                        <button 
                          onClick={() => setCmsFormData({...cmsFormData, fields: cmsFormData.fields.filter((_, i) => i !== idx)})}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={async () => {
                    if (!cmsFormData.section) return toast.error("Section ID is required");
                    if (cmsFormData.fields.some(f => !f.key)) return toast.error("All fields must have a key name");
                    
                    const content: any = {};
                    cmsFormData.fields.forEach(f => {
                      if (f.key) {
                        // Initialize value based on type
                        if (f.type === "product-list" || f.type === "category-list") {
                          content[f.key] = [];
                        } else {
                          content[f.key] = f.value || "";
                        }
                      }
                    });
                    
                    try {
                      const res = await fetch("/api/content", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                          page: selectedCmsPage, 
                          section: cmsFormData.section, 
                          content,
                          displayOrder: cmsFormData.displayOrder
                        })
                      });
                      if (res.ok) {
                        toast.success("Section added successfully");
                        setIsCmsModalOpen(false);
                        fetchData();
                      } else {
                        const err = await res.json();
                        toast.error(err.error || "Failed to add section");
                      }
                    } catch (error) {
                      toast.error("Network error while adding section");
                    }
                  }}
                  className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all"
                >
                  Create Section
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CMSSectionEditor({ title, page, section, initialContent, initialDisplayOrder, onSave, onDelete, products, categories }: { 
  title: string, 
  page: string, 
  section: string, 
  initialContent: any,
  initialDisplayOrder?: number,
  onSave: () => void,
  onDelete?: () => void,
  products: any[],
  categories: any[]
}) {
  const [content, setContent] = useState(initialContent);
  const [displayOrder, setDisplayOrder] = useState(initialDisplayOrder || 0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, section, content, displayOrder }),
      });
      if (response.ok) {
        toast.success(`${title} updated`);
        onSave();
      } else {
        toast.error(`Failed to update ${title}`);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-amber-900/10 p-8 space-y-6 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="font-serif text-xl text-amber-950 uppercase tracking-tight">{title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[8px] uppercase tracking-widest font-bold text-amber-900/40">Order:</span>
            <input 
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
              className="w-12 bg-transparent border-b border-amber-900/20 text-[10px] focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-4">
          {onDelete && (
            <button 
              onClick={onDelete}
              className="text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600"
            >
              Delete
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="text-[10px] uppercase tracking-widest font-bold text-amber-950 hover:text-amber-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      
      <div className="space-y-4 flex-1">
        {Object.keys(content).map((key) => {
          const isImage = key.toLowerCase().includes("image") || key.toLowerCase().includes("url") || key.toLowerCase().includes("pic");
          const isLongText = key.toLowerCase().includes("description") || key.toLowerCase().includes("quote") || key.toLowerCase().includes("text") || key.toLowerCase().includes("content") || key.toLowerCase().includes("intro");
          const isArray = Array.isArray(content[key]);

          if (isArray) {
            const isProductList = key.toLowerCase().includes("product");
            const isCategoryList = key.toLowerCase().includes("category");
            
            const listLabel = (page === "privacy" || page === "terms" || page === "return-policy") && key === "sections" 
              ? "Policy Clauses/Sections" 
              : key;

            return (
              <div key={key} className="space-y-4 p-4 bg-amber-50/20 border border-amber-900/5">
                <div className="flex justify-between items-center">
                  <label className="text-[8px] uppercase tracking-widest font-bold text-amber-900/40">{listLabel} ({isProductList ? "Products" : isCategoryList ? "Categories" : "List"})</label>
                  <button 
                    onClick={() => {
                      const newItem = isProductList ? { id: "", name: "", image: "", price: 0 } : isCategoryList ? { id: "", name: "", image: "" } : { title: "", content: "" };
                      const newArray = [...(content[key] || []), newItem];
                      setContent({...content, [key]: newArray});
                    }}
                    className="text-[8px] uppercase tracking-widest font-bold text-amber-700"
                  >
                    + Add Item
                  </button>
                </div>
                {(content[key] || []).map((item: any, idx: number) => (
                  <div key={idx} className="space-y-2 border-l-2 border-amber-900/10 pl-4 py-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-amber-900/30">Item {idx + 1}</span>
                      <button 
                        onClick={() => {
                          const newArray = content[key].filter((_: any, i: number) => i !== idx);
                          setContent({...content, [key]: newArray});
                        }}
                        className="text-[8px] text-red-400 hover:text-red-600 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                    {isProductList ? (
                      <select 
                        value={item.id}
                        onChange={(e) => {
                          const prod = products.find(p => p.id === e.target.value);
                          if (prod) {
                            const newArray = [...content[key]];
                            newArray[idx] = { id: prod.id, name: prod.name, image: prod.image, price: prod.price };
                            setContent({...content, [key]: newArray});
                          }
                        }}
                        className="w-full bg-white border border-amber-900/5 p-2 text-xs text-amber-950 focus:outline-none"
                      >
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    ) : isCategoryList ? (
                      <select 
                        value={item.id}
                        onChange={(e) => {
                          const cat = categories.find(c => c.id === e.target.value);
                          if (cat) {
                            const newArray = [...content[key]];
                            newArray[idx] = { id: cat.id, name: cat.name };
                            setContent({...content, [key]: newArray});
                          }
                        }}
                        className="w-full bg-white border border-amber-900/5 p-2 text-xs text-amber-950 focus:outline-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    ) : (
                      Object.keys(item).map(subKey => {
                        const isNumberField = subKey.toLowerCase().includes("premium") || 
                                           subKey.toLowerCase().includes("charge") || 
                                           subKey.toLowerCase().includes("multiplier") || 
                                           subKey.toLowerCase().includes("price") ||
                                           subKey.toLowerCase().includes("cost") ||
                                           subKey.toLowerCase().includes("min") ||
                                           subKey.toLowerCase().includes("above");
                        const isCategoryId = subKey.toLowerCase().includes("categoryid");

                        const label = subKey === "minItems" ? "Min Items Required" :
                                      subKey === "minPrice" ? "Min Price Required (₹)" :
                                      subKey === "cost" ? "Shipping Cost (₹)" :
                                      subKey === "displayText" ? "Display Text (Overrides Cost)" :
                                      subKey === "title" && (page === "privacy" || page === "terms" || page === "return-policy") ? null :
                                      subKey.charAt(0).toUpperCase() + subKey.slice(1);

                        if (!label) return null;

                        if (isCategoryId) {
                          return (
                            <div key={subKey} className="space-y-1">
                              <label className="text-[7px] uppercase tracking-widest font-bold text-amber-900/30">{label}</label>
                              <select 
                                value={item[subKey]}
                                onChange={(e) => {
                                  const cat = categories.find(c => c.id === e.target.value);
                                  const newArray = [...content[key]];
                                  newArray[idx] = { ...newArray[idx], [subKey]: e.target.value, name: cat?.name || "" };
                                  setContent({...content, [key]: newArray});
                                }}
                                className="w-full bg-white border border-amber-900/5 p-2 text-xs text-amber-950 focus:outline-none"
                              >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                            </div>
                          );
                        }

                        return (
                          <div key={subKey} className="space-y-1">
                            <label className="text-[7px] uppercase tracking-widest font-bold text-amber-900/30">{label}</label>
                            <input 
                              type={isNumberField ? "number" : "text"}
                              value={item[subKey]}
                              onChange={(e) => {
                                const newArray = [...content[key]];
                                newArray[idx] = { ...newArray[idx], [subKey]: isNumberField ? parseFloat(e.target.value) : e.target.value };
                                setContent({...content, [key]: newArray});
                              }}
                              className="w-full bg-white border border-amber-900/5 p-2 text-xs text-amber-950 focus:outline-none focus:border-amber-900/20"
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                ))}
              </div>
            );
          }
          
          const isNumberInput = key.toLowerCase().includes("charge") || 
                               key.toLowerCase().includes("above") || 
                               key.toLowerCase().includes("order") ||
                               key.toLowerCase().includes("surcharge") ||
                               key.toLowerCase().includes("price");

          const topLabel = (page === "privacy" || page === "terms" || page === "return-policy") 
            ? (key === "intro" ? "Policy Introduction / Summary" : key === "title" ? "Main Heading" : key) 
            : key;

          return (
            <div key={key} className="space-y-1">
              <label className="text-[8px] uppercase tracking-widest font-bold text-amber-900/40">{topLabel}</label>
              {isLongText ? (
                <textarea 
                  value={content[key]}
                  onChange={(e) => setContent({...content, [key]: e.target.value})}
                  className="w-full bg-amber-50/30 border border-amber-900/5 p-3 text-sm text-amber-950 focus:outline-none focus:border-amber-900/20 resize-none"
                  rows={4}
                />
              ) : (
                <div className="space-y-2">
                  <input 
                    type={isNumberInput ? "number" : "text"}
                    value={content[key]}
                    onChange={(e) => setContent({...content, [key]: isNumberInput ? parseFloat(e.target.value) : e.target.value})}
                    className="w-full bg-amber-50/30 border border-amber-900/5 p-3 text-sm text-amber-950 focus:outline-none focus:border-amber-900/20"
                  />
                  {isImage && content[key] && (
                    <div className="relative aspect-video w-full bg-amber-50 overflow-hidden border border-amber-900/5">
                      <img 
                        src={content[key]} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => (e.currentTarget.src = getPlaceholderImage("Art"))}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmailTemplateEditor({ type, title, initialSubject, initialBody }: { type: string, title: string, initialSubject: string, initialBody: string }) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, subject, body }),
      });
      if (response.ok) {
        toast.success(`${title} template updated`);
      } else {
        toast.error("Failed to update template");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-amber-900/10 p-8 space-y-6">
      <h3 className="font-serif text-xl text-amber-950 uppercase tracking-tight">{title}</h3>
      
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Subject Line</label>
        <input 
          type="text" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-transparent border-b border-amber-900/20 py-2 focus:outline-none focus:border-amber-900 transition-colors text-amber-950 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Template Content (HTML supported)</label>
        <textarea 
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-amber-50/50 border border-amber-900/5 p-4 text-xs font-mono text-amber-950 focus:outline-none focus:border-amber-900/20 resize-none h-48"
        />
      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all disabled:opacity-50"
      >
        {saving ? "Updating..." : "Update Template"}
      </button>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-all ${
        active 
          ? "bg-amber-950 text-white shadow-lg shadow-amber-950/20" 
          : "text-amber-900/40 hover:text-amber-950 hover:bg-amber-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white p-6 border border-amber-900/5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-amber-50 rounded-lg">
          {icon}
        </div>
        <span className={`text-[8px] font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend}
        </span>
      </div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 mb-1">{label}</p>
      <p className="text-2xl font-serif text-amber-950">{value}</p>
    </div>
  );
}
