"use client";

import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-border-subtle bg-bg-base/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue shadow-lg shadow-brand-purple/25">
              {/* Central dot icon */}
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <div className="absolute inset-0 rounded-xl border border-white/20" />
            </div>
            <span className="font-sans text-lg font-semibold tracking-tight text-white sm:text-xl">
              Conversation Intelligence <span className="bg-gradient-to-r from-brand-purple to-brand-peach bg-clip-text text-transparent">Studio</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#analyzer" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
              Interactive Demo
            </a>
            <a href="#features" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#story" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
              The Story
            </a>
          </div>

          {/* Right Action Button */}
          <div className="hidden md:block">
            <a
              href="#analyzer"
              className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-purple/20 to-brand-indigo/20 px-4 py-2 text-sm font-medium text-white border border-brand-purple/35 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:border-brand-purple/80 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all duration-300"
            >
              Analyze Agent
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-bg-surface-hover hover:text-white focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Smooth Discrete Transition with CSS / JS toggles) */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden glass-panel border-b border-border-subtle bg-bg-base/95 px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col gap-4">
            <a
              href="#analyzer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-text-secondary hover:bg-bg-surface-hover hover:text-white transition-all"
            >
              Interactive Demo
            </a>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-text-secondary hover:bg-bg-surface-hover hover:text-white transition-all"
            >
              Capabilities
            </a>
            <a
              href="#story"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-text-secondary hover:bg-bg-surface-hover hover:text-white transition-all"
            >
              The Story
            </a>
            <a
              href="#analyzer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-4 py-2.5 text-base font-medium text-white shadow-lg shadow-brand-purple/20 transition-all"
            >
              Analyze Agent
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
