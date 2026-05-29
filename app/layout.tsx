import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SlapBack — Make your Mac scream.",
  description:
    "Choose a sound. Pick a trigger. Make your Mac scream. No install — runs entirely in your browser.",
  keywords: ["slapback", "sound board", "web app", "fun", "viral", "gadget"],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased bg-[#0a0a0a] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
