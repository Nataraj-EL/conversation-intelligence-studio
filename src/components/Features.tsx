export default function Features() {
  const items = [
    {
      title: "Conversational Friction Alerting",
      desc: "Automatically flag instances where customer-facing AI agents get stuck in repetitive loops, repeat policy scripts, or ignore customer requests for human assistance.",
      icon: (
        <svg className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      title: "Automated Prompt Optimizations",
      desc: "Turn agent failures into solutions. Our system correlates interaction friction against system prompts to generate draft edits and rules to resolve edge cases.",
      icon: (
        <svg className="h-6 w-6 text-brand-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: "Sentiment & Tone Drift Analytics",
      desc: "Trace customer sentiment markers turn-by-turn. Discover exactly where in the conversation customer trust dips to optimize containment rates.",
      icon: (
        <svg className="h-6 w-6 text-brand-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Guardrail Compliance Checks",
      desc: "Measure how well your custom LLM instructions are adhered to in production. Test against prompt injection, safety, and brand alignment compliance logs.",
      icon: (
        <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="py-20 bg-bg-base relative border-b border-border-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Everything you need to <span className="text-brand-primary">ship reliable AI agents</span>
          </h2>
          <p className="mt-4 text-base text-text-secondary">
            Move from passive logging to active prompt engineering. Understand exactly what makes your models fail and how to programmatically make them better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="border border-border-subtle bg-bg-surface shadow-sm hover:border-brand-primary hover:shadow-md rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-5 items-start transition-all duration-150"
            >
              {/* Icon container */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-surface-hover border border-border-subtle shrink-0 shadow-sm">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text-primary tracking-wide">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
