"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { CartSync } from "./CartSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartSync />
      {children}
    </SessionProvider>
  );
}
