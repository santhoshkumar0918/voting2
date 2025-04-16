import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Decentralized Voting System",
  description:
    "A simple decentralized voting system built with Next.js and Polygon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="border-t py-4">
              <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Decentralized Voting System
              </div>
            </footer>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
