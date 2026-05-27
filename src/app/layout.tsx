import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeHub | Premium Coding Practice & Gamified DSA Platform",
  description: "Accelerate your algorithm mastering. Compete in weekly challenges, solve beginner-to-advanced DSA problems, compile in 9+ languages, and level up your software engineering career.",
  keywords: ["leetcode clone", "dsa practice", "coding compiler", "competitive programming", "algorithms", "data structures", "interview prep"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col relative`}>
        <AuthProvider>
          <Starfield />
          <Navbar />
          <main className="flex-1 flex flex-col relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
