"use client";

import React from "react";
import { Phone, Sparkles, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "@/data/content";

interface CtaBannerProps {
  onOpenQuote: () => void;
}

export default function CtaBanner({ onOpenQuote }: CtaBannerProps) {
  return (
    <section className="py-20 relative bg-[var(--bg-main)] overflow-hidden transition-colors duration-300">
      {/* Abstract Ink Bloom Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[var(--accent-cyan)]/15 via-[var(--accent-magenta)]/15 to-[var(--accent-yellow)]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-surface-1)] to-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-8 sm:p-14 text-center shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Top Registration Markings on Box */}
          <div className="absolute top-4 left-6 flex items-center gap-1 opacity-40 text-[10px] font-mono text-[var(--text-muted)]">
            <span>[+] MIRAJ MIDC INDUSTRIAL CORRIDOR</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-mono text-[var(--accent-cyan)] mb-6 font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>START YOUR PRINT PROJECT</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-heading)] tracking-tight mb-4 max-w-2xl mx-auto leading-tight">
            Have a Printing Project in Mind?
          </h2>

          {/* Verbatim Supporting Text */}
          <p className="text-base sm:text-lg text-[var(--text-main)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            “Tell us what you need to print. Our team can help you find the right printing solution for your project.”
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={onOpenQuote}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold shadow-xl hover:scale-105 transition-all"
              style={{
                background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                color: "var(--btn-text-color)",
              }}
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`tel:${COMPANY_INFO.phoneClean}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-sm font-bold text-[var(--text-heading)] bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-card)] hover:border-[var(--accent-cyan)] transition-all hover:scale-105 shadow-sm"
            >
              <Phone className="w-4 h-4 text-[var(--accent-cyan)]" />
              <span>Call {COMPANY_INFO.phone}</span>
            </a>
          </div>

          <div className="mt-8 text-xs font-mono text-[var(--text-muted)] font-medium">
            Fast B2B Estimates • Direct Factory Pricing • Sangli Miraj Kupwad
          </div>
        </div>
      </div>
    </section>
  );
}
