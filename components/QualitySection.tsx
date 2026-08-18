"use client";

import React from "react";
import { Target, CheckCircle2, Zap } from "lucide-react";

export default function QualitySection() {
  return (
    <section id="quality" className="py-28 relative bg-[var(--bg-main)] overflow-hidden transition-colors duration-300">
      {/* Dynamic ambient glow lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-cyan)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-magenta)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Industrial Grid Lines */}
      <div className="absolute inset-0 bg-cmyk-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl backdrop-blur-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Core Quality Statement */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface-1)] border border-[var(--border-color)] text-xs font-mono text-[var(--accent-cyan)] mb-6">
                <Target className="w-3.5 h-3.5" />
                <span>UNCOMPROMISING PRECISION STANDARDS</span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl font-black text-[var(--text-heading)] tracking-tight leading-tight mb-6">
                Precision in Every Sheet.
              </h2>

              {/* Verbatim Supporting Text */}
              <p className="text-lg sm:text-xl text-[var(--text-main)] leading-relaxed mb-8 font-light">
                “Great printing is more than putting ink on paper. It is about consistency, detail, color, finish and delivering exactly what your business needs.”
              </p>

              {/* Formula Highlight: Experience + Technology + Quality */}
              <div className="p-6 rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-color)] w-full mb-8">
                <div className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-widest mb-3">
                  The Perfect Printers Formula
                </div>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-base sm:text-xl font-black font-display text-[var(--text-heading)]">
                  <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40">
                    Experience
                  </span>
                  <span className="text-[var(--text-muted)]">+</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] text-[var(--accent-magenta)] border border-[var(--accent-magenta)]/40">
                    Technology
                  </span>
                  <span className="text-[var(--text-muted)]">+</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/40">
                    Quality
                  </span>
                </div>
              </div>

              {/* Quality Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="flex items-center gap-3 text-sm text-[var(--text-main)] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Sub-millimeter color registration</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--text-main)] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Thermal CTP digital calibration</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--text-main)] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Uniform ink density across volume</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--text-main)] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Defect-free sheet-by-sheet inspection</span>
                </div>
              </div>
            </div>

            {/* Right Column: Macro Halftone & Registration Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[var(--border-card)] bg-[var(--bg-surface-1)] shadow-2xl p-6">
                {/* Visual Macro Graphic */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-[var(--border-color)] flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop"
                    alt="Macro offset printing ink and color registration"
                    className="w-full h-full object-cover saturate-150 contrast-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-transparent" />

                  {/* Overlaid Crosshair & Densitometer Targets */}
                  <div className="absolute inset-6 border border-white/20 rounded-lg pointer-events-none flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-cyan-400/60 flex items-center justify-center animate-pulse">
                      <div className="w-8 h-8 rounded-full border border-pink-500/60 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-[var(--bg-card)]/95 border border-[var(--border-card)] text-[11px] font-mono text-[var(--text-main)] flex justify-between items-center shadow-md">
                    <span className="flex items-center gap-1.5 text-[var(--accent-cyan)] font-bold">
                      <Zap className="w-3.5 h-3.5" /> High Gamut Fidelity
                    </span>
                    <span className="text-[var(--text-muted)]">100% Offset Control</span>
                  </div>
                </div>

                {/* Rating Card underneath */}
                <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                  <span>FACILITY: MIRAJ MIDC</span>
                  <span className="text-emerald-500 font-bold">20+ YRS EXPERIENCE</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
