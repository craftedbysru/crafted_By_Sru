"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCcw, ArrowLeft, ShoppingBag, Package, Truck } from "lucide-react";
import Link from "next/link";

function CheckoutStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");
  const statusParam = searchParams.get("status");
  const errorCode = searchParams.get("code");
  const errorDesc = searchParams.get("desc");
  const errorMessage = searchParams.get("error");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/orders?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          console.error("Failed to load order details");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Determine actual status
  let displayStatus: "success" | "failed" | "dismissed" = "dismissed";
  if (statusParam === "success" || (order && (order.paymentStatus?.toLowerCase() === "paid" || order.paymentStatus?.toLowerCase() === "authorized"))) {
    displayStatus = "success";
  } else if (statusParam === "failed" || (order && order.paymentStatus?.toLowerCase() === "failed")) {
    displayStatus = "failed";
  } else if (statusParam === "dismissed") {
    displayStatus = "dismissed";
  } else if (!statusParam && order) {
    if (order.paymentStatus === "paid" || order.paymentStatus === "authorized") displayStatus = "success";
    else if (order.paymentStatus === "failed") displayStatus = "failed";
  }

  // Clear cart upon successful order
  useEffect(() => {
    if (displayStatus === "success") {
      localStorage.removeItem("sru_cart");
      window.dispatchEvent(new Event("sru_cart_change"));
    }
  }, [displayStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Verifying transaction details...</div>
      </div>
    );
  }

  // Extract failure message from search params or DB transactions
  let failureReason = errorDesc || errorMessage;
  if (!failureReason && order?.transactions) {
    const failedTx = order.transactions.find((t: any) => t.status === "failed" || t.errorDetails);
    if (failedTx && failedTx.errorDetails) {
      try {
        const errObj = JSON.parse(failedTx.errorDetails);
        failureReason = errObj.description || errObj.reason || errObj.message;
      } catch (e) {
        failureReason = failedTx.errorDetails;
      }
    }
  }
  if (!failureReason) {
    failureReason = "The transaction was declined or canceled by the security gateway.";
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-bg-primary">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-16 border border-amber-900/10 shadow-xl space-y-12"
        >
          {displayStatus === "success" && (
            <>
              {/* SUCCESS STATE */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-600 rounded-full mb-4">
                  <CheckCircle2 size={40} />
                </div>
                <h1 className="font-serif text-4xl md:text-5xl text-amber-950">Order Successful</h1>
                <p className="text-amber-900/60 max-w-md mx-auto text-sm leading-relaxed">
                  Your order <span className="font-bold text-amber-950 uppercase">#{id?.slice(-8) || "N/A"}</span> is confirmed! We are finalizing your return gifts with standard premium curation.
                </p>
              </div>

              {order && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-amber-900/5">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-amber-950">
                      <Package size={18} className="text-amber-900/40" />
                      <h3 className="text-[10px] uppercase tracking-widest font-bold">Return Gifts Summary</h3>
                    </div>
                    <div className="space-y-4">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50/50 border border-amber-900/5 overflow-hidden">
                              <img src={item.imageUrl || item.image || "https://picsum.photos/seed/vibrant/100/100"} alt="" className="w-full h-full object-cover animate-fade-in" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-amber-950">{item.name}</p>
                              <p className="text-[10px] text-amber-900/40 font-mono">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-xs font-medium text-amber-950">₹{(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-amber-900/5 flex justify-between items-center">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-amber-900/40">Amount Paid</p>
                        <p className="text-xl font-serif text-amber-950">₹{order.total?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-amber-950">
                      <Truck size={18} className="text-amber-900/40" />
                      <h3 className="text-[10px] uppercase tracking-widest font-bold">Shipping Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="text-xs text-amber-900/60 leading-relaxed font-sans">
                        <p className="font-bold text-amber-950 mb-1">
                          {order.shippingAddress?.firstName ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ""}`.trim() : (order.shippingAddress?.name || "Customer")}
                        </p>
                        <p>{order.shippingAddress?.street}</p>
                        {order.shippingAddress?.street2 && <p>{order.shippingAddress?.street2}</p>}
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode || order.shippingAddress?.zipCode}</p>
                        <p className="mt-2 font-bold text-amber-950">Mobile: {order.phone || order.shippingAddress?.phone}</p>
                      </div>

                      {(() => {
                        const activeTx = order.transactions?.find((t: any) => t.providerPaymentId) || order.transactions?.[0];
                        const providerOrderId = activeTx?.providerOrderId || order.transactions?.[0]?.providerOrderId || "N/A";
                        const providerPaymentId = activeTx?.providerPaymentId || "N/A";
                        return (
                          <div className="bg-amber-50/50 p-4 border border-amber-900/5 rounded-sm">
                            <p className="text-[9px] uppercase tracking-widest font-bold text-amber-900/40 mb-1">Transaction ID Reference</p>
                            <div className="space-y-1.5 mt-2">
                              <div>
                                <p className="text-[8px] uppercase text-amber-900/40">Razorpay Order ID</p>
                                <p className="text-[10px] font-mono text-amber-950 truncate max-w-[250px]">{providerOrderId}</p>
                              </div>
                              <div>
                                <p className="text-[8px] uppercase text-amber-900/40">Payment ID</p>
                                <p className="text-[10px] font-mono text-amber-950 truncate max-w-[250px]">{providerPaymentId}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-12 border-t border-amber-900/5 flex flex-col md:flex-row gap-4">
                <Link
                  href="/catalog"
                  className="flex-1 py-5 border border-amber-900/10 text-amber-950 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-50/50 transition-all text-center flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={14} />
                  Explore Catalog
                </Link>
                <Link
                  href="/account"
                  className="flex-1 py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all text-center flex items-center justify-center gap-3 shadow-lg shadow-amber-950/10"
                >
                  <ArrowLeft size={14} />
                  My Account
                </Link>
              </div>
            </>
          )}

          {displayStatus === "failed" && (
            <>
              {/* PAYMENT FAILED STATE */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-600 rounded-full mb-4">
                  <XCircle size={40} />
                </div>
                <h1 className="font-serif text-4xl text-amber-950">Order Unsuccessful</h1>
                <p className="text-amber-900/60 max-w-sm mx-auto text-sm leading-relaxed">
                  We couldn't process your payment/order for return gifts <span className="font-bold text-amber-950 uppercase">#{id?.slice(-8) || "N/A"}</span>.
                </p>
              </div>

              <div className="bg-red-50/50 p-6 border border-red-200/50 rounded-sm">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-red-900/50 mb-1">Error Reason Details</p>
                    <p className="text-sm font-medium text-red-900 leading-relaxed font-sans mt-1">
                      {failureReason}
                    </p>
                    {errorCode && (
                      <p className="text-[9px] bg-red-100/50 inline-block px-2.5 py-0.5 rounded font-mono text-red-700 mt-3">
                        Code: {errorCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-amber-900/60 leading-relaxed italic text-center max-w-md mx-auto">
                <p>Don't worry, your items are still safe in your cart. You can retry checkout or use a different card.</p>
              </div>

              <div className="pt-6 flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => router.push("/cart")}
                  className="flex-1 py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-950/10"
                >
                  <RefreshCcw size={14} />
                  Retry Checkout
                </button>
                <Link
                  href="/catalog"
                  className="flex-1 py-5 border border-amber-900/10 text-amber-950 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-50/50 transition-all flex items-center justify-center gap-3 text-center"
                >
                  <ArrowLeft size={14} />
                  Back to Catalog
                </Link>
              </div>
            </>
          )}

          {displayStatus === "dismissed" && (
            <>
              {/* DISMISSED/CANCELLED STATE */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 text-amber-600 rounded-full mb-4">
                  <AlertTriangle size={40} />
                </div>
                <h1 className="font-serif text-4xl text-amber-950">Payment Canceled</h1>
                <p className="text-amber-900/60 max-w-sm mx-auto text-sm leading-relaxed">
                  The payment window was closed before transaction authorization.
                </p>
              </div>

              <div className="bg-amber-50/30 p-6 border border-amber-900/10 rounded-sm">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="text-amber-700 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-amber-900/50 mb-1">Session Summary</p>
                    <p className="text-sm font-medium text-amber-950 leading-relaxed font-sans mt-1">
                      No payment attempt was captured. The checkout session has been suspended but your curation selection is preserved.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-amber-900/60 leading-relaxed italic text-center max-w-md mx-auto">
                <p>Your return gifts remain in your local cart. Head back to review details and try again anytime.</p>
              </div>

              <div className="pt-6 flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => router.push("/checkout")}
                  className="flex-1 py-5 bg-amber-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-950/10"
                >
                  <RefreshCcw size={14} />
                  Complete Checkout
                </button>
                <Link
                  href="/catalog"
                  className="flex-1 py-5 border border-amber-900/10 text-amber-950 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-50/50 transition-all flex items-center justify-center gap-3 text-center"
                >
                  <ArrowLeft size={14} />
                  Back to Catalog
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-amber-900">Processing transition details...</div>
        </div>
      }
    >
      <CheckoutStatusContent />
    </Suspense>
  );
}
