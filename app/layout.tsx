import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SlapBack — Make your Mac scream.",
  description: "Choose a sound. Pick a trigger. Make your Mac scream.",
  applicationName: "SlapBack",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SlapBack",
  },
  openGraph: {
    title: "SlapBack — Make your Mac scream.",
    description: "Choose a sound. Pick a trigger. Make your Mac scream.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SlapBack — Make your Mac scream.",
    description: "Choose a sound. Pick a trigger. Make your Mac scream.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-[#0a0a0a] text-white min-h-screen">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
