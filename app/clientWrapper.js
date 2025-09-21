// app/ClientWrapper.js (Client)
"use client"; // ✅ this file is client-only

import { Geist, Geist_Mono } from "next/font/google";
import { motion } from "framer-motion";
import ClickSpark from "@/components/ClickSpark";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
    >
      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        {children}
      </ClickSpark>
    </motion.div>
  );
}
