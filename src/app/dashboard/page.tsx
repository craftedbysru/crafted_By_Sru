"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Edit2, Trash2, Package, Search, X, Save, 
  Image as ImageIcon, LayoutDashboard, ShoppingBag, 
  Users, Settings, LogOut, ChevronRight, Filter,
  TrendingUp, DollarSign, Clock, CheckCircle2, AlertCircle, Menu
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type Section = "dashboard" | "orders" | "inventory" | "artisans" | "settings";

export default function MerchantDashboard() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "10"
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (role !== "admin" && role !== "merchant") {
        router.push("/");
      } else {
        fetchData();
      }
    }
  }, [status, session, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/inventory"),
        fetch("/api/orders")
      ]);
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      setProducts(productsData);
      setOrders(ordersData);
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
        price: product.price.toString(),
        category: product.category,
        image: product.image,
        stock: product.stock?.toString() || "10"
      });
      setImagePreview(product.image);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "10"
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `/api/inventory/${editingProduct.id}` : "/api/inventory";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        }),
      });

      if (response.ok) {
        toast.success(editingProduct ? "Product updated" : "Product added");
        setIsModalOpen(false);
        fetchData();
      } else {
        toast.error("Failed to save product");
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
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalSales: orders.filter(o => o.paymentStatus === "paid").reduce((acc, o) => acc + o.total, 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    activeProducts: products.length
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Accessing Merchant Portal...</div>
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
            icon={<ShoppingBag size={18} />} 
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
            icon={<Users size={18} />} 
            label="Artisans" 
            active={activeSection === "artisans"} 
            onClick={() => { setActiveSection("artisans"); setIsSidebarOpen(false); }} 
          />
          <SidebarLink 
            icon={<Settings size={18} />} 
            label="Settings" 
            active={activeSection === "settings"} 
            onClick={() => { setActiveSection("settings"); setIsSidebarOpen(false); }} 
          />
        </nav>

        <div className="p-6 border-t border-amber-900/5">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<DollarSign className="text-green-600" />} label="Total Sales" value={`$${stats.totalSales.toFixed(2)}`} trend="+12.5%" />
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
                      <div key={order.id} className="flex items-center justify-between p-4 bg-amber-50/30 border border-amber-900/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white flex items-center justify-center border border-amber-900/5 rounded-full">
                            <ShoppingBag size={16} className="text-amber-900/40" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-amber-950">{order.customer?.name || "Guest User"}</p>
                            <p className="text-[10px] text-amber-900/40 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-amber-950">${order.total.toFixed(2)}</p>
                          <p className={`text-[8px] uppercase tracking-widest font-bold ${
                            order.status === 'completed' ? 'text-green-600' : 
                            order.status === 'pending' ? 'text-amber-600' : 'text-blue-600'
                          }`}>{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 border border-amber-900/5 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif text-xl text-amber-950">Inventory Status</h3>
                    <button onClick={() => setActiveSection("inventory")} className="text-[10px] uppercase tracking-widest font-bold text-amber-900 hover:opacity-70 transition-opacity flex items-center gap-2">
                      Manage <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {Array.isArray(products) && products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-amber-50/30 border border-amber-900/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-12 bg-white flex items-center justify-center border border-amber-900/5 overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-amber-950">{product.name}</p>
                            <p className="text-[10px] text-amber-900/40 uppercase tracking-widest">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-amber-950">{product.stock || 10} units</p>
                          <div className="w-24 h-1 bg-amber-100 mt-2 overflow-hidden">
                            <div 
                              className={`h-full ${product.stock < 5 ? 'bg-red-500' : 'bg-green-500'}`} 
                              style={{ width: `${Math.min(100, (product.stock || 10) * 10)}%` }} 
                            />
                          </div>
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
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-serif text-4xl text-amber-950 mb-2">Order Management</h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40">Manage and fulfill customer orders.</p>
                </div>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-white border border-amber-900/10 text-[10px] uppercase tracking-widest font-bold text-amber-900 flex items-center gap-2">
                    <Filter size={14} /> Filter
                  </button>
                  <button className="px-6 py-3 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-white border border-amber-900/5 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-amber-50/50 border-b border-amber-900/10">
                    <tr>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Order ID</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Customer</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Date</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Total</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Status</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-amber-900/40 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/5">
                    {Array.isArray(orders) && orders.map((order) => (
                      <tr key={order.id} className="hover:bg-amber-50/20 transition-colors group">
                        <td className="px-8 py-6 text-xs font-mono text-amber-900/60">#{order.id.slice(0, 8)}</td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-medium text-amber-950">{order.customer?.name || "Guest"}</p>
                          <p className="text-[10px] text-amber-900/40">{order.customer?.email}</p>
                        </td>
                        <td className="px-8 py-6 text-xs text-amber-900/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-8 py-6 text-sm font-bold text-amber-950">${order.total.toFixed(2)}</td>
                        <td className="px-8 py-6">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-[10px] uppercase tracking-widest font-bold bg-transparent border-none focus:ring-0 cursor-pointer ${
                              order.status === 'completed' ? 'text-green-600' : 
                              order.status === 'pending' ? 'text-amber-600' : 'text-blue-600'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 text-amber-900/40 hover:text-amber-950 transition-colors">
                            <ChevronRight size={18} />
                          </button>
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
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-serif text-4xl text-amber-950 mb-2">Inventory Management</h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-amber-900/40">Add and manage your product catalog.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal()}
                  className="px-8 py-4 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-all flex items-center gap-3"
                >
                  <Plus size={16} />
                  Add New Product
                </button>
              </div>

              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/20" size={18} />
                <input 
                  type="text" 
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-amber-900/10 py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-amber-900 transition-colors text-amber-950"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="hidden md:grid grid-cols-6 gap-4 px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-amber-900/40 border-b border-amber-900/10">
                  <div className="col-span-2">Product</div>
                  <div>Category</div>
                  <div>Price</div>
                  <div>Stock</div>
                  <div className="text-right">Actions</div>
                </div>

                {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
                  <motion.div 
                    key={product.id}
                    layout
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center bg-white border border-amber-900/5 p-6 md:px-8 hover:bg-amber-50/30 transition-colors group"
                  >
                    <div className="col-span-2 flex items-center gap-4">
                      <div className="w-12 h-16 bg-amber-50 overflow-hidden flex-shrink-0 border border-amber-900/5">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-amber-950">{product.name}</h3>
                        <p className="text-[10px] text-amber-900/40 uppercase tracking-widest truncate max-w-[200px]">{product.id}</p>
                      </div>
                    </div>
                    <div className="text-xs text-amber-900/60 uppercase tracking-widest">{product.category}</div>
                    <div className="text-sm font-medium text-amber-950">${product.price}</div>
                    <div className="text-sm text-amber-900/60">{product.stock || 10} units</div>
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-3 text-amber-900/40 hover:text-amber-950 hover:bg-amber-100 transition-all rounded-full"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-3 text-amber-900/40 hover:text-red-600 hover:bg-red-50 transition-all rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {(activeSection === "artisans" || activeSection === "settings") && (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center"
            >
              <h2 className="font-serif text-3xl text-amber-950 mb-4">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
              <p className="text-sm text-amber-900/40 italic">This section is coming soon to your merchant portal.</p>
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
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Category</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-transparent border-b border-amber-900/20 py-3 focus:outline-none focus:border-amber-900 transition-colors text-amber-950 appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option value="Home Decor">Home Decor</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Art">Art</option>
                      <option value="Textiles">Textiles</option>
                    </select>
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
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Price ($)</label>
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

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40 flex items-center gap-2">
                    <ImageIcon size={12} />
                    Product Image (Required)
                  </label>
                  
                  <div className="flex flex-col gap-6">
                    <div className="w-full h-64 bg-amber-50 border border-amber-900/10 flex items-center justify-center overflow-hidden rounded-sm relative group">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                            <p className="text-white text-[10px] uppercase tracking-widest font-bold">Change Image</p>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setFormData({...formData, image: ""});
                                setImagePreview(null);
                              }}
                              className="px-4 py-2 bg-red-600 text-white text-[8px] uppercase tracking-widest font-bold hover:bg-red-700 transition-all"
                            >
                              Remove
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <ImageIcon className="text-amber-900/10" size={48} />
                          <p className="text-[10px] text-amber-900/40 uppercase tracking-widest">No image selected</p>
                          <div className="px-6 py-3 bg-amber-950 text-white text-[10px] uppercase tracking-widest font-bold">
                            Attach Product Image
                          </div>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        id="image-upload"
                        required={!editingProduct}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={16} />
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
