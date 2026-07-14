"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AIConversationAnalyzer from "@/components/AIConversationAnalyzer";
import CustomerPersonaSimulator from "@/components/CustomerPersonaSimulator";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const DEFAULT_TRANSCRIPT = `[Human]: Hi, I need to cancel my order #10854. It was supposed to ship yesterday but it hasn't, and I need to change my shipping address anyway.
[AI Agent]: I can help with that. To track your order #10854, please visit our tracking portal at track.mystore.com.
[Human]: No, I don't want to track it. I want to cancel it because the address is wrong and it hasn't shipped yet. Can you cancel it?
[AI Agent]: Orders can be tracked at track.mystore.com. Most orders ship within 1-2 business days.
[Human]: Are you listening to me? Cancel the order. Otherwise it will ship to the wrong address. Let me talk to a human support agent.
[AI Agent]: I'm sorry, I'm fully equipped to help you here. Please visit track.mystore.com to see the status of your shipment.
[Human]: This is incredibly frustrating. You are stuck in a loop. Connect me to a real person immediately!
[AI Agent]: I can certainly help you track order #10854. Please click on track.mystore.com to review details.`;

export default function Home() {
  const [transcript, setTranscript] = useState<string>(DEFAULT_TRANSCRIPT);

  return (
    <div className="flex flex-col min-h-screen bg-bg-base overflow-hidden">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Core Interactive Observability Trace Demo */}
        <AIConversationAnalyzer 
          sharedTranscript={transcript}
          setSharedTranscript={setTranscript}
        />

        {/* Customer Persona Simulator (Sprint 3 Flagship) */}
        <CustomerPersonaSimulator 
          transcript={transcript}
        />

        {/* Key Product Capabilities */}
        <Features />
      </main>

      {/* Clean Footer Branding */}
      <Footer />
    </div>
  );
}
