"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface CheckoutButtonProps {
  amount: number;
  orderData: {
    items: any[];
    total: number;
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
    try {
      // 1. Create Razorpay order
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "Crafted by Sru",
        description: "Heritage Curations Purchase",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment
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
            });

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
                router.push(`/orders/${result.orderId}`);
              }
            }
          } catch (error: any) {
            console.error("Verification error:", error);
            toast.error(error.message || "Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#78350f", // amber-900
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        // Optionally log failed attempt to server
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
