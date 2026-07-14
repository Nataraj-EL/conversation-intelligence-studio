"use client";

import { useState, useEffect } from "react";

interface Persona {
  id: string;
  name: string;
  description: string;
  trait: string;
  colorClass: string;
}

interface SimulationResult {
  persona: string;
  behavior_summary: string;
  simulated_conversation: string;
  coaching_tip: string;
}

const PERSONAS: Persona[] = [
  {
    id: "busy-customer",
    name: "Busy Customer",
    description: "Wants immediate, brief resolutions. Highly impatient and easily annoyed by generic system disclaimers or repetitive prompts.",
    trait: "Impatient & Direct",
    colorClass: "border-brand-info/30 text-brand-info"
  },
  {
    id: "price-sensitive",
    name: "Price Sensitive",
    description: "Deeply focused on order refunds, hidden fees, discount coupon matching, shipping costs, and maximizing cost savings.",
    trait: "Budget & Refund Focused",
    colorClass: "border-brand-warning/30 text-brand-warning"
  },
  {
    id: "angry-customer",
    name: "Angry Customer",
    description: "Extremely frustrated by delay. Hostile tone, repetitive complaints, and demands immediate handoff to human managers.",
    trait: "High Friction & Escales",
    colorClass: "border-error/30 text-error"
  },
  {
    id: "enterprise-buyer",
    name: "Enterprise Buyer",
    description: "Highly focused on SLAs, service agreements, invoice billing accounts, official receipts, and strict contract terms.",
    trait: "Process & Invoice Focused",
    colorClass: "border-success/30 text-success"
  }
];

const LOADING_STEPS = [
  "Setting up persona behavior weights...",
  "Running Gemini LLM simulation engine...",
  "Formatting simulated customer response turns...",
  "Compiling agent coaching advice..."
];

interface CustomerPersonaSimulatorProps {
  transcript: string;
}

export default function CustomerPersonaSimulator({ transcript }: CustomerPersonaSimulatorProps) {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "simulated">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "loading") {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < LOADING_STEPS.length - 1) {
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

  const handleSimulate = async (persona: Persona) => {
    setSelectedPersona(persona);
    setError(null);
    setStatus("loading");
    setLoadingStep(0);

    try {
      const response = await fetch("/api/simulate-persona", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: transcript || "",
          persona: persona.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Server returned status code ${response.status}`
        );
      }

      const data: SimulationResult = await response.json();
      setSimulationResult(data);
      setStatus("simulated");

    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to run simulation. Please ensure your backend is running.";
      setError(errorMessage);
      setStatus("idle");
    }
  };

  return (
    <div id="simulator" className="py-20 bg-bg-base border-b border-border-subtle relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Customer <span className="text-brand-primary">Persona Simulator</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
            Simulate how your AI agent behaves when confronted by different customer archetypes. Click a card to start the stress-test.
          </p>
        </div>

        {/* Persona Selectors (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {PERSONAS.map((persona) => {
            const isSelected = selectedPersona?.id === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => handleSimulate(persona)}
                disabled={status === "loading"}
                className={`border border-border-subtle bg-bg-surface shadow-sm rounded-2xl p-5 text-left flex flex-col justify-between h-[180px] hover:border-brand-primary hover:shadow-md transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "border-brand-primary ring-1 ring-brand-primary bg-brand-primary/5"
                    : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-text-primary tracking-wide">{persona.name}</span>
                    <span className={`text-[10px] font-semibold font-mono border px-2 py-0.5 rounded-full ${persona.colorClass}`}>
                      {persona.trait}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-4">
                    {persona.description}
                  </p>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <span className="text-[10px] uppercase font-bold text-brand-primary group-hover:text-brand-primary-hover transition-colors duration-150">
                    {isSelected && status === "loading" ? "Simulating..." : "Run Stress Test →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Display Banner / Output */}
        <div className="border border-border-subtle bg-bg-surface shadow-sm rounded-2xl p-6 md:p-8 relative overflow-hidden">
          
          {error && (
            <div className="rounded-xl border border-error/20 bg-error/5 px-4 py-3.5 text-sm text-error flex items-start gap-3">
              <svg className="h-5 w-5 text-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <span className="font-semibold">Simulation Failed:</span> {error}
              </div>
            </div>
          )}

          {status === "idle" && !error && (
            <div className="py-12 text-center text-text-secondary flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-bg-surface-hover border border-border-subtle flex items-center justify-center mb-4 text-text-muted">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm">Select a customer persona card above to run a live conversational stress test.</p>
            </div>
          )}

          {status === "loading" && (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8 h-20 w-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-brand-primary/10 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-brand-info/10 animate-pulse" />
                <div className="h-10 w-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-sm">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-text-primary tracking-wide mb-2">
                Running Persona Simulation...
              </h4>
              <p className="text-sm text-brand-primary font-mono h-6 animate-pulse">
                {LOADING_STEPS[loadingStep]}
              </p>

              <div className="w-64 h-1.5 bg-bg-base rounded-full mt-6 overflow-hidden border border-border-subtle">
                <div 
                  className="h-full bg-brand-primary rounded-full transition-all duration-300"
                  style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {status === "simulated" && simulationResult && (
            <div className="reveal-entry space-y-8">
              
              {/* Header block with Persona Title & Behavior Summary */}
              <div className="border-b border-border-subtle pb-6">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary font-mono">Simulated Target:</span>
                  <span className="text-sm font-bold text-brand-primary bg-brand-primary/5 border border-brand-primary/20 px-2.5 py-0.5 rounded-full">
                    {simulationResult.persona}
                  </span>
                </div>
                <div className="bg-bg-base/30 border border-border-subtle rounded-xl p-4">
                  <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">Behavior Analysis</span>
                  <p className="text-sm text-text-primary leading-relaxed mt-1.5">{simulationResult.behavior_summary}</p>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Coaching Tip */}
                <div className="lg:col-span-5">
                  <div className="border border-brand-warning/20 bg-brand-warning/5 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-warning font-mono flex items-center gap-2">
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Agent Coaching Tip
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Recommendations to refine your AI agent&apos;s system prompt instructions to correctly align behavior with this customer archetype.
                    </p>
                    <div className="bg-bg-base rounded-lg border border-border-subtle p-3.5 text-xs text-brand-warning whitespace-pre-wrap leading-relaxed">
                      {simulationResult.coaching_tip}
                    </div>
                  </div>
                </div>

                {/* Right Column: Simulated Dialogue Scroll */}
                <div className="lg:col-span-7 flex flex-col">
                  <div className="border border-border-subtle bg-bg-base/10 rounded-xl p-5 flex flex-col h-[340px]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary font-mono mb-3 shrink-0 flex items-center justify-between">
                      <span>Simulated Conversation Transcript (5-8 turns)</span>
                      <span className="text-[9px] text-text-muted font-normal">scrollable</span>
                    </h4>
                    <div className="flex-1 overflow-y-auto pr-1">
                      <pre className="text-xs font-mono text-text-primary whitespace-pre-wrap leading-relaxed">
                        {simulationResult.simulated_conversation}
                      </pre>
                    </div>
                  </div>
                </div>

              </div>

              {/* Reset Footer */}
              <div className="flex justify-between items-center border-t border-border-subtle pt-6">
                <p className="text-xs text-text-muted">
                  Gemini API simulation. Select another card to stress-test other personas.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setSelectedPersona(null);
                  }}
                  className="text-xs text-text-secondary hover:text-brand-primary transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25H12" />
                  </svg>
                  Reset simulator
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
