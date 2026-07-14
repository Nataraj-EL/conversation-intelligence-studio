"use client";

import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-subtle bg-bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="font-sans text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
              Conversation Intelligence <span className="text-brand-primary">Studio</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#analyzer" className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors duration-150">
              Interactive Demo
            </a>
            <a href="#features" className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors duration-150">
              Capabilities
            </a>
          </div>

          {/* Right Action Button */}
          <div className="hidden md:block">
            <a
              href="#analyzer"
              className="inline-flex items-center justify-center rounded-xl bg-brand-primary border border-brand-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-primary-hover hover:border-brand-primary-hover transition-colors duration-150"
            >
              Analyze Agent
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary focus:outline-none transition-colors duration-150"
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-b border-border-subtle bg-bg-surface shadow-sm px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col gap-4">
            <a
              href="#analyzer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-text-secondary hover:bg-bg-surface-hover hover:text-brand-primary transition-all duration-150"
            >
              Interactive Demo
            </a>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-text-secondary hover:bg-bg-surface-hover hover:text-brand-primary transition-all duration-150"
            >
              Capabilities
            </a>
            <a
              href="#analyzer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center rounded-xl bg-brand-primary border border-brand-primary px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-brand-primary-hover hover:border-brand-primary-hover transition-colors duration-150"
            >
              Analyze Agent
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
