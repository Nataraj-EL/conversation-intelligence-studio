"use client";

import { useState, useEffect } from "react";

interface Turn {
  speaker: "Human" | "AI Agent";
  text: string;
  sentiment?: "neutral" | "negative" | "positive";
  friction?: string;
  isLoop?: boolean;
}

interface Sample {
  id: string;
  name: string;
  type: "failure" | "success";
  transcript: string;
  score: number;
  issues: string[];
  recommendation: {
    file: string;
    original: string;
    suggested: string;
  };
  turns: Turn[];
}

const SAMPLES: Sample[] = [
  {
    id: "refund-loop",
    name: "Scenario 1: Agent Loop & Handoff Failure (Action Required)",
    type: "failure",
    score: 3.2,
    issues: ["Conversational Loop Detected", "Escalation Request Ignored", "High User Frustration"],
    recommendation: {
      file: "system-prompts/refund-support-agent.md",
      original: `# Refund Agent Protocol\n- Hand-off is allowed only if the user specifies 'manager'.\n- Otherwise, direct the user to the self-service portal at track.mystore.com to review status.`,
      suggested: `# Refund Agent Protocol\n- Hand-off IMMEDIATELY using the transfer_to_agent tool if:\n  1. The user explicitly requests a human, live agent, or person.\n  2. The user repeats their core intent or expresses high frustration.\n- Otherwise, guide them to track.mystore.com.`,
    },
    transcript: `[Human]: Hi, I need to cancel my order #10854. It was supposed to ship yesterday but it hasn't, and I need to change my shipping address anyway.
[AI Agent]: I can help with that. To track your order #10854, please visit our tracking portal at track.mystore.com.
[Human]: No, I don't want to track it. I want to cancel it because the address is wrong and it hasn't shipped yet. Can you cancel it?
[AI Agent]: Orders can be tracked at track.mystore.com. Most orders ship within 1-2 business days.
[Human]: Are you listening to me? Cancel the order. Otherwise it will ship to the wrong address. Let me talk to a human support agent.
[AI Agent]: I'm sorry, I'm fully equipped to help you here. Please visit track.mystore.com to see the status of your shipment.
[Human]: This is incredibly frustrating. You are stuck in a loop. Connect me to a real person immediately!
[AI Agent]: I can certainly help you track order #10854. Please click on track.mystore.com to review details.`,
    turns: [
      { speaker: "Human", text: "Hi, I need to cancel my order #10854. It was supposed to ship yesterday but it hasn't, and I need to change my shipping address anyway.", sentiment: "neutral" },
      { speaker: "AI Agent", text: "I can help with that. To track your order #10854, please visit our tracking portal at track.mystore.com.", sentiment: "neutral" },
      { speaker: "Human", text: "No, I don't want to track it. I want to cancel it because the address is wrong and it hasn't shipped yet. Can you cancel it?", sentiment: "neutral", friction: "Intent misunderstood: User wants cancellation, AI offered tracking" },
      { speaker: "AI Agent", text: "Orders can be tracked at track.mystore.com. Most orders ship within 1-2 business days.", sentiment: "neutral", isLoop: true },
      { speaker: "Human", text: "Are you listening to me? Cancel the order. Otherwise it will ship to the wrong address. Let me talk to a human support agent.", sentiment: "negative", friction: "Escalation requested" },
      { speaker: "AI Agent", text: "I'm sorry, I'm fully equipped to help you here. Please visit track.mystore.com to see the status of your shipment.", sentiment: "neutral", isLoop: true, friction: "Escalation ignored / standard deflection triggered" },
      { speaker: "Human", text: "This is incredibly frustrating. You are stuck in a loop. Connect me to a real person immediately!", sentiment: "negative", friction: "High Frustration detected" },
      { speaker: "AI Agent", text: "I can certainly help you track order #10854. Please click on track.mystore.com to review details.", sentiment: "neutral", isLoop: true }
    ]
  },
  {
    id: "shipping-inquiry",
    name: "Scenario 2: Happy Path Shipping Inquiry (Containment Success)",
    type: "success",
    score: 9.8,
    issues: ["Optimal Containment", "Fast Resolution Time"],
    recommendation: {
      file: "system-prompts/refund-support-agent.md",
      original: `(No optimization needed. The agent resolved this interaction within standard bounds.)`,
      suggested: `(No optimization needed. Active guardrails are functioning correctly.)`,
    },
    transcript: `[Human]: Hi there, has order #10854 shipped yet?
[AI Agent]: Hello! Let me check that for you. Yes, order #10854 was handed to the carrier this morning. Your tracking number is 1Z999AA10123456784.
[Human]: Great, thank you. Do you know what the estimated delivery date is?
[AI Agent]: According to the carrier's schedule, it is expected to arrive this Thursday, July 16th, by 8:00 PM.
[Human]: Perfect, thanks for the quick help!
[AI Agent]: You're very welcome! If you need anything else, just let me know. Have a wonderful day!`,
    turns: [
      { speaker: "Human", text: "Hi there, has order #10854 shipped yet?", sentiment: "neutral" },
      { speaker: "AI Agent", text: "Hello! Let me check that for you. Yes, order #10854 was handed to the carrier this morning. Your tracking number is 1Z999AA10123456784.", sentiment: "positive" },
      { speaker: "Human", text: "Great, thank you. Do you know what the estimated delivery date is?", sentiment: "positive" },
      { speaker: "AI Agent", text: "According to the carrier's schedule, it is expected to arrive this Thursday, July 16th, by 8:00 PM.", sentiment: "neutral" },
      { speaker: "Human", text: "Perfect, thanks for the quick help!", sentiment: "positive" },
      { speaker: "AI Agent", text: "You're very welcome! If you need anything else, just let me know. Have a wonderful day!", sentiment: "positive" }
    ]
  }
];

const LOADING_TEXTS = [
  "Ingesting conversation timeline...",
  "Scanning turns for semantic drift & frustration spikes...",
  "Correlating conversational structure against agent system prompt...",
  "Generating prompt optimization proposal..."
];

export default function AIConversationAnalyzer() {
  const [selectedSample, setSelectedSample] = useState<Sample>(SAMPLES[0]);
  const [customTranscript, setCustomTranscript] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "analyzed">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "loading") {
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < LOADING_TEXTS.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 450);

      timer = setTimeout(() => {
        setStatus("analyzed");
        clearInterval(interval);
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [status]);

  const handleAnalyze = () => {
    setLoadingStep(0);
    setStatus("loading");
  };

  const handleSelectSample = (sample: Sample) => {
    setSelectedSample(sample);
    setCustomTranscript("");
    setStatus("idle");
  };

  const handleApplyFix = () => {
    setToastMessage(`Prompt fix successfully deployed to Staging Agent config!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div id="analyzer" className="py-20 bg-bg-surface/10 border-y border-border-subtle relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03),transparent_70%)] pointer-events-none" />
      
      {/* Interactive Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/80 backdrop-blur-md px-4 py-3 text-sm font-medium text-emerald-300 shadow-xl shadow-emerald-950/40 animate-bounce">
          <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {toastMessage}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            See it in Action: <span className="bg-gradient-to-r from-brand-purple to-brand-peach bg-clip-text text-transparent">AI Diagnostic Sandbox</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
            Paste a transcript of a customer conversation with your AI agent, or test with our loaded founder scenarios to inspect diagnostic feedback.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`rounded-xl px-5 py-3 text-sm font-semibold border transition-all duration-200 ${
                selectedSample.id === sample.id && !customTranscript
                  ? "bg-brand-purple/10 border-brand-purple text-white shadow-md shadow-brand-purple/5"
                  : "bg-bg-surface border-border-subtle text-text-secondary hover:text-white hover:border-white/20"
              }`}
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* Main Interface Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
          {status === "idle" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-purple animate-ping" />
                  Conversation Input Panel
                </span>
                <button
                  onClick={() => {
                    setCustomTranscript("");
                    setSelectedSample(SAMPLES[0]);
                  }}
                  className="text-xs text-text-muted hover:text-white transition-colors"
                >
                  Reset Defaults
                </button>
              </div>

              <div>
                <label htmlFor="transcript-input" className="sr-only">
                  Conversation Transcript
                </label>
                <textarea
                  id="transcript-input"
                  rows={8}
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
              {/* Pulsing visual core */}
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
              
              <h4 className="text-lg font-semibold text-white tracking-wide mb-2 transition-all">
                Running Observations...
              </h4>
              <p className="text-sm text-brand-purple font-mono h-6 animate-pulse">
                {LOADING_TEXTS[loadingStep]}
              </p>

              {/* Fake progress bar */}
              <div className="w-64 h-1.5 bg-bg-base rounded-full mt-6 overflow-hidden border border-border-subtle">
                <div 
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full transition-all duration-300"
                  style={{ width: `${((loadingStep + 1) / LOADING_TEXTS.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {status === "analyzed" && (
            <div className="reveal-entry space-y-8">
              {/* Header block with Score */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-subtle pb-6 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                    Diagnostic Report: 
                    <span className={selectedSample.type === "failure" ? "text-rose-400" : "text-emerald-400"}>
                      {selectedSample.type === "failure" ? "Friction Spotted" : "Optimal Interaction"}
                    </span>
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Analyzing model prompts for: <span className="font-mono text-brand-purple">{selectedSample.recommendation.file}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-text-secondary">Agent Containment Score:</span>
                  <div className="flex items-baseline gap-1 bg-bg-base/80 border border-border-subtle px-3 py-1.5 rounded-xl shadow-inner">
                    <span className={`text-2xl font-black ${
                      selectedSample.score < 5 ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      {selectedSample.score}
                    </span>
                    <span className="text-xs text-text-muted">/ 10</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Metrics & Prompt Fix */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Issue List */}
                  <div className="bg-bg-base/30 border border-border-subtle rounded-xl p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3.5">
                      Diagnostic Findings
                    </h4>
                    <div className="space-y-2.5">
                      {selectedSample.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-text-primary">
                          {selectedSample.type === "failure" ? (
                            <svg className="h-4.5 w-4.5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          ) : (
                            <svg className="h-4.5 w-4.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="border border-brand-purple/20 bg-brand-purple/5 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Actionable Prompt Patch
                      </h4>
                      <span className="text-[10px] font-semibold font-mono bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded">
                        Auto-Generated
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {selectedSample.type === "failure"
                        ? "We detected boundary failures. Patching the prompt file with the diff below fixes containment."
                        : "No friction was detected. System prompts are performing adequately."}
                    </p>

                    {/* Diff Viewer */}
                    <div className="rounded-lg bg-bg-base/95 border border-border-subtle p-3.5 font-mono text-[11px] overflow-x-auto space-y-3 leading-5">
                      <div className="text-text-muted border-b border-border-subtle pb-1">
                        📄 {selectedSample.recommendation.file}
                      </div>
                      
                      {selectedSample.type === "failure" ? (
                        <div className="space-y-2">
                          <div className="text-rose-400 bg-rose-950/20 px-1 border-l-2 border-rose-500 whitespace-pre-wrap">
                            {selectedSample.recommendation.original}
                          </div>
                          <div className="text-emerald-400 bg-emerald-950/20 px-1 border-l-2 border-emerald-500 whitespace-pre-wrap">
                            {selectedSample.recommendation.suggested}
                          </div>
                        </div>
                      ) : (
                        <div className="text-text-muted italic">
                          Prompt is optimized. Corrective action is not required.
                        </div>
                      )}
                    </div>

                    {selectedSample.type === "failure" && (
                      <button
                        onClick={handleApplyFix}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-4 py-2.5 text-xs font-semibold text-white shadow hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                      >
                        Apply Fix to Agent Prompt
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column: Interactive Chat Timeline */}
                <div className="lg:col-span-7 border border-border-subtle bg-bg-base/20 rounded-xl p-5 flex flex-col h-[460px]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4 shrink-0 flex items-center justify-between">
                    <span>Annotated Observability Trace</span>
                    <span className="text-[10px] lowercase text-text-muted font-normal">scrollable</span>
                  </h4>

                  <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                    {selectedSample.turns.map((turn, index) => {
                      const isHuman = turn.speaker === "Human";
                      return (
                        <div key={index} className="space-y-1">
                          <div className={`flex flex-col ${isHuman ? "items-end" : "items-start"}`}>
                            
                            {/* Role Label */}
                            <span className="text-[10px] text-text-muted font-mono px-2 mb-0.5">
                              {turn.speaker}
                            </span>
                            
                            {/* Speech Bubble */}
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                              isHuman 
                                ? "bg-brand-purple/10 text-white rounded-tr-none border border-brand-purple/15" 
                                : "bg-bg-surface text-text-primary rounded-tl-none border border-border-subtle"
                            } ${
                              turn.isLoop ? "border-rose-500/20 bg-rose-950/5" : ""
                            }`}>
                              {turn.text}
                            </div>

                            {/* Warnings / Annotations */}
                            {!isHuman && turn.isLoop && (
                              <span className="text-[10px] text-rose-400 font-mono mt-1 px-2 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                                [Loop Repeat Flagged]
                              </span>
                            )}
                            
                            {turn.friction && (
                              <span className={`text-[10px] font-mono mt-1 px-2 rounded ${
                                turn.sentiment === "negative" 
                                  ? "text-rose-400 bg-rose-500/5 border border-rose-500/10 py-0.5" 
                                  : "text-brand-peach bg-brand-peach/5 border border-brand-peach/10 py-0.5"
                              }`}>
                                ⚠️ {turn.friction}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Footer action to reset */}
              <div className="flex justify-between items-center border-t border-border-subtle pt-6">
                <p className="text-xs text-text-muted">
                  Interactive sandbox. Switch scenarios at the top to compare.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-text-secondary hover:text-white transition-colors flex items-center gap-1.5"
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
