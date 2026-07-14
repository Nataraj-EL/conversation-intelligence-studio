export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Decorative Warm & Purple Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-purple/20 blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-brand-peach/15 blur-[100px] pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-blue/15 blur-[120px] pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '6s' }} />

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-brand-purple uppercase shadow-sm shadow-brand-purple/5 mb-6 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-peach opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-peach"></span>
          </span>
          Next-Gen AI Agent Observability
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl text-balance leading-[1.1] mb-6">
          Optimize Your AI Agents.{" "}
          <span className="bg-gradient-to-r from-brand-purple via-brand-indigo to-brand-peach bg-clip-text text-transparent">
            Improve Human-to-AI Conversations.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-3xl text-base text-text-secondary sm:text-lg md:text-xl text-pretty leading-relaxed mb-10">
          Stop guessing why your customer-facing AI agents fail. Conversation Intelligence Studio automatically detects user frustration, isolates LLM conversational loops, and delivers actionable system prompt fixes to secure your guardrails.
        </p>

        {/* Buttons / Actions */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#analyzer"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Try the Demo Analyzer
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-border-subtle bg-bg-surface/50 px-6 py-3.5 text-base font-semibold text-text-primary hover:bg-bg-surface-hover hover:border-brand-purple/30 transition-all duration-200"
          >
            Explore Capabilities
          </a>
        </div>
      </div>
    </section>
  );
}
