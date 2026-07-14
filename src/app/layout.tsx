import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conversation Intelligence Studio | Optimize & Debug AI Agents",
  description: "Understand, debug, and improve human-to-AI agent conversations. Detect user frustration, resolve conversational loops, and optimize system prompts.",
  keywords: ["AI Agents", "Conversation Intelligence", "AI Analytics", "Prompt Optimization", "LLM Debugging"],
  authors: [{ name: "Conversation Intelligence Studio Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary selection:bg-brand-purple/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
