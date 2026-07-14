export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Soft Layout Frame behind Hero (No Glow) */}
      <div className="absolute inset-x-4 top-4 bottom-4 md:inset-x-8 md:top-6 md:bottom-6 border border-brand-primary/10 bg-brand-primary/5 rounded-[2rem] -z-10 opacity-60 pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Subtle tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3.5 py-1 text-xs font-semibold tracking-wide text-brand-primary uppercase shadow-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
          Next-Gen AI Agent Observability
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl md:text-6xl text-balance leading-[1.1] mb-6">
          Optimize Your AI Agents.{" "}
          <span className="text-brand-primary block mt-2 sm:inline sm:mt-0">
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
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-brand-primary border border-brand-primary px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-primary-hover hover:border-brand-primary-hover hover:scale-[1.005] active:scale-[0.995] transition-all duration-150 cursor-pointer"
          >
            Try the Demo Analyzer
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-border-subtle bg-bg-surface px-6 py-3.5 text-base font-semibold text-text-primary hover:bg-bg-surface-hover hover:border-border-subtle transition-all duration-150"
          >
            Explore Capabilities
          </a>
        </div>
      </div>
    </section>
  );
}
