import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "WedPlan | Wedding Planning Platform",
    template: "%s | WedPlan",
  },
  description:
    "Discover wedding venues, photographers, decorators, caterers, and more. Plan your perfect wedding with WedPlan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[#FCFAF9] text-[#2B2023] antialiased">
        <div className="flex min-h-screen flex-col">
          {/* Navbar reads the current URL, so Next.js 16 needs it inside Suspense */}
          <Suspense
            fallback={
              <div className="h-20 border-b border-[#eadfda] bg-[#fcfaf9]" />
            }
          >
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Toaster richColors position="top-right" />
          <Footer />
        </div>
      </body>
    </html>
  );
}
