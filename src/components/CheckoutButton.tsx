"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface CheckoutButtonProps {
  amount: number;
  currency?: string;
  exchangeRate?: number;
  orderData: {
    items: any[];
    total: number;
    currency?: string;
    shippingAddress: any;
    packagingDetails?: string;
    deliveryType?: string;
  };
  onSuccess?: (orderId: string) => void;
  className?: string;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutButton({
  amount,
  currency = "INR",
  exchangeRate = 1,
  orderData,
  onSuccess,
  className,
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleCheckout = async () => {
    if (!session) {
      toast.error("Please sign in to proceed with payment");
      router.push("/auth/signin?callbackUrl=/cart");
      return;
    }

    setLoading(true);
    let dbOrderId = "";
    try {
      // 1. Create Order in DB & Razorpay
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: amount * exchangeRate,
          currency: currency,
          orderData: orderData
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate order process");
      }

      const { razorpayOrder, dbOrderId: id } = await response.json();
      dbOrderId = id;

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Crafted by Sru",
        description: "Heritage Curations Purchase",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout (more generous for DB processing)

            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData,
              }),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!verifyRes.ok) {
              const errorText = await verifyRes.text();
              throw new Error(errorText || "Payment verification failed");
            }

            const result = await verifyRes.json();
            if (result.success) {
              toast.success("Order placed successfully!");
              if (onSuccess) {
                onSuccess(result.orderId);
              } else {
                router.push(`/checkout/status?id=${result.orderId}&status=success`);
              }
            }
          } catch (error: any) {
            console.error("Verification error:", error);
            const msg = error.name === 'AbortError' ? "Verification timed out. Please check your account section in a few minutes." : (error.message || "Unknown error");
            router.push(`/checkout/status?id=${dbOrderId}&status=failed&error=${encodeURIComponent(msg)}`);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            router.push(`/checkout/status?id=${dbOrderId}&status=dismissed`);
          },
          // Razorpay native timeout for the modal (in seconds)
          // 300 seconds = 5 minutes is a good production default
          timeout: 300,
        },
        prefill: {
          name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
          email: orderData.shippingAddress.email,
          contact: orderData.shippingAddress.phone,
        },
        theme: {
          color: "#78350f", // amber-900
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', async function (response: any) {
        console.warn("Payment failure handled elegantly:", JSON.stringify(response.error, null, 2));
        const err = response.error || {};
        const failedPaymentId = err.metadata?.payment_id || null;
        const failedOrderId = err.metadata?.order_id || null;
        
        // Don't close the modal if you want them to be able to try another method, 
        // but the user says "website still shows the razorpay pop-up ... what to do"
      // If we want to force them to the failure page:
      if (typeof rzp.close === 'function') rzp.close(); 
        
        try {
          // Record failure in DB
          await fetch("/api/payment/record-failure", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: dbOrderId,
              errorDetails: err,
              providerPaymentId: failedPaymentId,
              providerOrderId: failedOrderId
            })
          });
        } catch (e) {
          console.error("Sync error recording failure:", e);
        }

        const code = err.code || "PAYMENT_FAILED";
        const desc = err.description || "The transaction was declined by the provider.";
        
        toast.error(`Payment failed: ${desc}`);
        setLoading(false);
        router.push(`/checkout/status?id=${dbOrderId}&status=failed&code=${code}&desc=${encodeURIComponent(desc)}`);
      });

      rzp.open();
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Something went wrong during checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading ? "Processing..." : children || "Checkout"}
    </button>
  );
}
