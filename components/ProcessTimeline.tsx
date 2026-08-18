"use client";

import React from "react";
import { PROCESS_STEPS } from "@/data/content";
import { MessageSquare, FileCheck, Layers, Printer, Sparkles, Truck, ArrowRight } from "lucide-react";

export default function ProcessTimeline() {
  const iconMap: { [key: string]: React.ReactNode } = {
    MessageSquare: <MessageSquare className="w-5 h-5 text-[var(--accent-cyan)]" />,
    FileCheck: <FileCheck className="w-5 h-5 text-[var(--accent-magenta)]" />,
    Layers: <Layers className="w-5 h-5 text-[var(--accent-yellow)]" />,
    Printer: <Printer className="w-5 h-5 text-emerald-500" />,
    Sparkles: <Sparkles className="w-5 h-5 text-sky-500" />,
    Truck: <Truck className="w-5 h-5 text-purple-500" />,
  };

  return (
    <section id="process" className="py-24 relative bg-[var(--bg-section)] overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-mono text-[var(--accent-cyan)] mb-4 font-bold shadow-sm">
            <Printer className="w-3.5 h-3.5" />
            <span>PRODUCTION WORKFLOW</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-heading)] tracking-tight mb-4">
            From Idea to Finished Print
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-main)] font-medium">
            A seamless, step-by-step manufacturing process engineered for speed, accuracy, and absolute consistency.
          </p>
        </div>

        {/* 6 Connected Steps Grid / Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {PROCESS_STEPS.map((step, index) => (
            <div
              key={step.step}
              className="relative group bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] hover:border-[var(--accent-cyan)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between shadow-sm"
            >
              {/* Step Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[var(--bg-surface-1)] border border-[var(--border-color)] group-hover:scale-110 transition-transform shadow-sm">
                      {iconMap[step.icon]}
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--accent-cyan)] tracking-wider">
                      PHASE {step.step}
                    </span>
                  </div>

                  <span className="text-2xl font-black font-mono text-[var(--text-muted)] opacity-60">
                    {step.step}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-bold text-[var(--text-heading)] mb-2.5 group-hover:text-[var(--accent-cyan)] transition-colors">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-[var(--text-main)] leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>

              {/* Step connector indicator */}
              <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] font-medium">
                <span>STAGE {index + 1} OF 6</span>
                {index < PROCESS_STEPS.length - 1 ? (
                  <span className="text-[var(--text-muted)] flex items-center gap-1 group-hover:text-[var(--accent-cyan)] font-bold">
                    Next Stage <ArrowRight className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="text-emerald-500 font-bold">Ready for Delivery</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
