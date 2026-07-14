export default function Footer() {
  return (
    <footer className="bg-bg-base border-t border-border-subtle py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Brand Logo & description */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-white">
                Conversation Intelligence Studio
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 text-center sm:text-left">
              Making customer-facing LLM agents reliable, compliant, and performant.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-text-muted">
            <a href="#analyzer" className="hover:text-white transition-colors">
              Interactive Demo
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="https://github.com/Nataraj-EL/conversation-intelligence-studio" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub Repository
            </a>
          </div>

        </div>

        <div className="border-t border-border-subtle mt-8 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Conversation Intelligence Studio. All rights reserved.
          </p>
          <p className="text-[10px] text-text-muted/60 tracking-wider uppercase font-mono">
            Sprint 1 Production Build
          </p>
        </div>
      </div>
    </footer>
  );
}
