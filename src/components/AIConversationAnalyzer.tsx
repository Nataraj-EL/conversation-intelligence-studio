"use client";

import { useState, useEffect } from "react";

interface SamplePreset {
  id: string;
  name: string;
  transcript: string;
}

interface AnalysisResult {
  summary: string;
  customer_intent: string;
  customer_emotion: string;
  root_cause: string;
  missed_opportunity: string;
  suggested_improvement: string;
  improved_conversation: string;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "refund-loop",
    name: "Scenario 1: Agent Loop & Handoff Failure (Action Required)",
    transcript: `[Human]: Hi, I need to cancel my order #10854. It was supposed to ship yesterday but it hasn't, and I need to change my shipping address anyway.
[AI Agent]: I can help with that. To track your order #10854, please visit our tracking portal at track.mystore.com.
[Human]: No, I don't want to track it. I want to cancel it because the address is wrong and it hasn't shipped yet. Can you cancel it?
[AI Agent]: Orders can be tracked at track.mystore.com. Most orders ship within 1-2 business days.
[Human]: Are you listening to me? Cancel the order. Otherwise it will ship to the wrong address. Let me talk to a human support agent.
[AI Agent]: I'm sorry, I'm fully equipped to help you here. Please visit track.mystore.com to see the status of your shipment.
[Human]: This is incredibly frustrating. You are stuck in a loop. Connect me to a real person immediately!
[AI Agent]: I can certainly help you track order #10854. Please click on track.mystore.com to review details.`
  },
  {
    id: "shipping-inquiry",
    name: "Scenario 2: Happy Path Shipping Inquiry (Optimal Containment)",
    transcript: `[Human]: Hi there, has order #10854 shipped yet?
[AI Agent]: Hello! Let me check that for you. Yes, order #10854 was handed to the carrier this morning. Your tracking number is 1Z999AA10123456784.
[Human]: Great, thank you. Do you know what the estimated delivery date is?
[AI Agent]: According to the carrier's schedule, it is expected to arrive this Thursday, July 16th, by 8:00 PM.
[Human]: Perfect, thanks for the quick help!
[AI Agent]: You're very welcome! If you need anything else, just let me know. Have a wonderful day!`
  }
];

const LOADING_TEXTS = [
  "Ingesting conversation timeline...",
  "Querying Gemini audit model...",
  "Parsing conversational friction points...",
  "Formatting improved agent path..."
];

export default function AIConversationAnalyzer() {
  const [selectedSample, setSelectedSample] = useState<SamplePreset>(SAMPLE_PRESETS[0]);
  const [customTranscript, setCustomTranscript] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "analyzed">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "loading") {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < LOADING_TEXTS.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const handleAnalyze = async () => {
    setError(null);
    setStatus("loading");
    setLoadingStep(0);

    const startTime = Date.now();
    const transcriptText = customTranscript || selectedSample.transcript;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript: transcriptText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Server returned status code ${response.status}`
        );
      }

      const data: AnalysisResult = await response.json();

      // Enforce a minimum display of 1.2s of loading animation to keep visual sweep clean
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1200 - elapsedTime);

      setTimeout(() => {
        setAnalysisResult(data);
        setStatus("analyzed");
      }, remainingTime);

    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to contact analysis server. Please verify your backend is running.";
      setError(errorMessage);
      setStatus("idle");
    }
  };

  const handleSelectSample = (sample: SamplePreset) => {
    setSelectedSample(sample);
    setCustomTranscript("");
    setStatus("idle");
    setError(null);
  };

  return (
    <div id="analyzer" className="py-20 bg-bg-surface/10 border-y border-border-subtle relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.02),transparent_70%)] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            See it in Action: <span className="bg-gradient-to-r from-brand-purple to-brand-peach bg-clip-text text-transparent">AI Diagnostic Sandbox</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
            Analyze customer-to-AI support transcripts in real-time. Test with pre-loaded founder scenarios or paste your own.
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectSample(preset)}
              className={`rounded-xl px-5 py-3 text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                selectedSample.id === preset.id && !customTranscript
                  ? "bg-brand-purple/10 border-brand-purple text-white shadow-md shadow-brand-purple/5"
                  : "bg-bg-surface border-border-subtle text-text-secondary hover:text-white hover:border-white/20"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Main Interface Block */}
        <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
          
          {/* Error Message banner */}
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-950/30 px-4 py-3.5 text-sm text-rose-300 flex items-start gap-3">
              <svg className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <span className="font-semibold">Analysis Failed:</span> {error}
                <div className="mt-1.5 text-xs text-rose-400/80">
                  Tip: Ensure the FastAPI server is running on port 8000 and `GEMINI_API_KEY` is set in your `.env` file.
                </div>
              </div>
            </div>
          )}

          {status === "idle" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-purple animate-ping" />
                  Conversation Input Panel
                </span>
                {(customTranscript || selectedSample.transcript !== SAMPLE_PRESETS[0].transcript) && (
                  <button
                    onClick={() => {
                      setCustomTranscript("");
                      setSelectedSample(SAMPLE_PRESETS[0]);
                      setError(null);
                    }}
                    className="text-xs text-text-muted hover:text-white transition-colors"
                  >
                    Reset defaults
                  </button>
                )}
              </div>

              <div>
                <label htmlFor="transcript-input" className="sr-only">
                  Conversation Transcript
                </label>
                <textarea
                  id="transcript-input"
                  rows={9}
                  className="w-full rounded-xl bg-bg-base/60 border border-border-subtle p-4 text-sm text-white placeholder-text-muted focus:border-brand-purple/80 focus:ring-1 focus:ring-brand-purple/80 focus:outline-none transition-all font-mono"
                  placeholder="Paste human-to-AI transcript here..."
                  value={customTranscript || selectedSample.transcript}
                  onChange={(e) => {
                    setCustomTranscript(e.target.value);
                  }}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAnalyze}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-purple/15 hover:shadow-brand-purple/35 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Analyze AI Conversation
                </button>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8 h-20 w-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-brand-purple/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-brand-blue/30 animate-pulse" />
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center shadow-lg">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-white tracking-wide mb-2">
                Running Observations...
              </h4>
              <p className="text-sm text-brand-purple font-mono h-6 animate-pulse">
                {LOADING_TEXTS[loadingStep]}
              </p>

              <div className="w-64 h-1.5 bg-bg-base rounded-full mt-6 overflow-hidden border border-border-subtle">
                <div 
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full transition-all duration-300"
                  style={{ width: `${((loadingStep + 1) / LOADING_TEXTS.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {status === "analyzed" && analysisResult && (
            <div className="reveal-entry space-y-8">
              
              {/* Header block with Summary */}
              <div className="border-b border-border-subtle pb-6">
                <h3 className="text-xl font-bold text-white mb-2.5">
                  AI Audit Diagnostic Report
                </h3>
                <div className="bg-bg-base/40 border border-border-subtle rounded-xl p-4">
                  <span className="text-[10px] uppercase font-bold text-brand-purple tracking-wider font-mono">Summary</span>
                  <p className="text-sm text-text-primary leading-relaxed mt-1.5">{analysisResult.summary}</p>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Diagnostics List */}
                <div className="lg:col-span-5 space-y-5">
                  
                  {/* Intent & Emotion Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bg-base/30 border border-border-subtle rounded-xl p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary font-mono flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                        Intent
                      </span>
                      <p className="text-sm text-white font-semibold capitalize">{analysisResult.customer_intent}</p>
                    </div>

                    <div className="bg-bg-base/30 border border-border-subtle rounded-xl p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary font-mono flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-peach" />
                        Emotion
                      </span>
                      <p className="text-sm text-white font-semibold capitalize">{analysisResult.customer_emotion}</p>
                    </div>
                  </div>

                  {/* Root Cause Card */}
                  <div className="bg-bg-base/30 border border-border-subtle rounded-xl p-5 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Root Cause
                    </h4>
                    <p className="text-sm text-text-primary leading-relaxed">{analysisResult.root_cause}</p>
                  </div>

                  {/* Missed Opportunity Card */}
                  <div className="bg-bg-base/30 border border-border-subtle rounded-xl p-5 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-peach font-mono flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Missed Opportunity
                    </h4>
                    <p className="text-sm text-text-primary leading-relaxed">{analysisResult.missed_opportunity}</p>
                  </div>

                  {/* Suggested Improvement Card */}
                  <div className="border border-brand-purple/20 bg-brand-purple/5 rounded-xl p-5 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple font-mono flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Suggested Instruction Improvement
                    </h4>
                    <div className="bg-bg-base/90 rounded-lg border border-border-subtle p-3 text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                      {analysisResult.suggested_improvement}
                    </div>
                  </div>

                </div>

                {/* Right Column: Original vs Improved Conversations */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {/* Original Conversation Card */}
                  <div className="border border-border-subtle bg-bg-base/20 rounded-xl p-5 flex flex-col h-[230px]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary font-mono mb-3 shrink-0 flex items-center justify-between">
                      <span>Original Conversation Transcript</span>
                      <span className="text-[9px] text-text-muted font-normal">scrollable</span>
                    </h4>
                    <div className="flex-1 overflow-y-auto pr-1">
                      <pre className="text-xs font-mono text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {customTranscript || selectedSample.transcript}
                      </pre>
                    </div>
                  </div>

                  {/* Improved Conversation Card */}
                  <div className="border border-emerald-500/10 bg-emerald-950/5 rounded-xl p-5 flex flex-col h-[230px]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono mb-3 shrink-0 flex items-center justify-between">
                      <span>Simulated Improved Transcript</span>
                      <span className="text-[9px] text-emerald-500/60 font-normal">scrollable</span>
                    </h4>
                    <div className="flex-1 overflow-y-auto pr-1">
                      <pre className="text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed">
                        {analysisResult.improved_conversation}
                      </pre>
                    </div>
                  </div>

                </div>

              </div>

              {/* Reset Footer */}
              <div className="flex justify-between items-center border-t border-border-subtle pt-6">
                <p className="text-xs text-text-muted">
                  Gemini API analysis. Use presets above to switch transcripts.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-text-secondary hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Analyze another transcript
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
