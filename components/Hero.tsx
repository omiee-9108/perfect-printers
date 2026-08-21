"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, ChevronRight, Layers } from "lucide-react";
import InteractivePrintSimulator from "./InteractivePrintSimulator";

interface HeroProps {
  onOpenQuote: () => void;
}

export default function Hero({ onOpenQuote }: HeroProps) {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[var(--bg-main)] bg-cmyk-grid transition-colors duration-300">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[var(--accent-cyan)]/10 via-[var(--accent-magenta)]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--accent-cyan)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Precision Ruler Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] pb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-cyan)]" />
            </span>
            <span className="text-[var(--text-main)] font-bold tracking-wider">COMMERCIAL OFFSET PRESS & PACKAGING MES</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 font-medium">
            <span>LOCATION: MIRAJ MIDC INDUSTRIAL AREA</span>
            <Link
              href="/erp"
              className="text-cyan-400 hover:text-white font-bold flex items-center gap-1 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>LIVE ERP CONNECTED</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[var(--accent-cyan)]" />
            <span className="w-2 h-2 bg-[var(--accent-magenta)]" />
            <span className="w-2 h-2 bg-[var(--accent-yellow)]" />
            <span className="w-2 h-2 bg-[var(--bg-card)] border border-[var(--border-card)]" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Trust Indicator Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] shadow-lg mb-6 backdrop-blur-md">
              <Award className="w-4 h-4 text-[var(--accent-yellow)]" />
              <span className="text-xs font-bold text-[var(--text-heading)] tracking-wide">
                20+ Years of Printing Experience
              </span>
              <span className="h-3 w-px bg-[var(--border-card)]" />
              <span className="text-xs text-[var(--accent-cyan)] font-mono font-bold">
                Miraj, Sangli
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text-heading)] leading-[1.08] tracking-tight mb-6">
              Precision Printing.{" "}
              <span className="block mt-1 text-[var(--accent-cyan)] font-black">
                Perfect Results.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[var(--text-main)] leading-relaxed max-w-2xl mb-8 font-medium">
              High-quality offset printing solutions built around precision, consistency, and your business needs. With over 20 years of experience, Perfect Printers helps businesses turn ideas into outstanding printed materials.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
              <button
                onClick={onOpenQuote}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{
                  background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                  color: "var(--btn-text-color)",
                }}
              >
                <span>Get a Printing Quote</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <Link
                href="/erp"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-cyan-500/50 hover:border-cyan-400 transition-all backdrop-blur-md shadow-lg shadow-cyan-500/10 hover:scale-[1.02]"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Launch ERP Portal</span>
              </Link>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-[var(--text-heading)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] hover:border-[var(--accent-cyan)] transition-all backdrop-blur-md shadow-sm"
              >
                <span>Services</span>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </a>
            </div>

            {/* Key Assurance Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[var(--border-color)] w-full">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-cyan)] flex-shrink-0" />
                <span>Thermal CTP Accuracy</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-magenta)] flex-shrink-0" />
                <span>Met-Pet & UV Drip-Off</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-yellow)] flex-shrink-0" />
                <span>B2B Commercial Volume</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Printing Simulator Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <InteractivePrintSimulator />
          </div>
        </div>
      </div>
    </section>
  );
}
