import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AIConversationAnalyzer from "@/components/AIConversationAnalyzer";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base overflow-hidden">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Core Interactive Observability Trace Demo */}
        <AIConversationAnalyzer />

        {/* Key Product Capabilities */}
        <Features />
      </main>

      {/* Clean Footer Branding */}
      <Footer />
    </div>
  );
}
