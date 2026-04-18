"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function CartSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      // Sync local cart to server on login
      const syncCart = async () => {
        const localCart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
        
        // Fetch server cart
        const res = await fetch("/api/user/cart");
        if (res.ok) {
          const serverCart = await res.json();
          
          // Merge logic: prefer server cart if local is empty, or merge by ID
          let mergedCart = [...serverCart];
          localCart.forEach((localItem: any) => {
            const existing = mergedCart.find(i => i.id === localItem.id);
            if (existing) {
              existing.quantity = Math.max(existing.quantity, localItem.quantity);
            } else {
              mergedCart.push(localItem);
            }
          });

          localStorage.setItem("sru_cart", JSON.stringify(mergedCart));
          window.dispatchEvent(new Event("sru_cart_change"));

          // Update server with merged cart
          await fetch("/api/user/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: mergedCart })
          });
        }
      };

      syncCart();
    }
  }, [status]);

  useEffect(() => {
    const handleCartChange = async () => {
      if (status === "authenticated") {
        const cart = JSON.parse(localStorage.getItem("sru_cart") || "[]");
        await fetch("/api/user/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart })
        });
      }
    };

    window.addEventListener("sru_cart_change", handleCartChange);
    return () => window.removeEventListener("sru_cart_change", handleCartChange);
  }, [status]);

  return null;
}
