// Refreshed: 2026-04-18
import type { Metadata } from "next";
import { Inter, Libre_Baskerville, Ovo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/ScrollToTop";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const baskerville = Libre_Baskerville({ 
  subsets: ["latin"], 
  weight: ["400", "700"],
  variable: "--font-serif" 
});
const ovo = Ovo({ 
  subsets: ["latin"], 
  weight: ["400"],
  variable: "--font-serif-alt" 
});

export const metadata: Metadata = {
  title: "Crafted by Sru",
  description: "Curated heritage creations for your home and lifestyle.",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('app-theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${baskerville.variable} ${ovo.variable} antialiased font-serif`}>
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <Providers>
          <ScrollToTop />
          <Toaster position="top-center" richColors />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
