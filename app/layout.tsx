import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "RupeeMate — Savings and investing built for irregular income",
  description:
    "RupeeMate reads your real earning pattern as a gig or independent worker and adapts micro-savings, investing, and tax prep to match — week to week.",
  keywords: [
    "gig worker finance",
    "micro savings",
    "irregular income planning",
    "AI investment planner",
    "freelance taxes India",
  ],
  authors: [{ name: "RupeeMate Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className={`${inter.className} bg-white`}>
        <Navbar />
        <main className="">{children}</main>
        <Footer />
      </body>
    </html>
  );
}