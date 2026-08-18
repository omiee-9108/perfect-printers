"use client";

import React from "react";
import { WHY_CHOOSE_ITEMS } from "@/data/content";
import { ShieldCheck, Target, Cpu, Sliders, Clock, Building2, Check, Sparkles } from "lucide-react";

export default function WhyChooseUs() {
  const iconMap: { [key: string]: React.ReactNode } = {
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-[var(--accent-cyan)]" />,
    Target: <Target className="w-6 h-6 text-[var(--accent-magenta)]" />,
    Cpu: <Cpu className="w-6 h-6 text-[var(--accent-yellow)]" />,
    Sliders: <Sliders className="w-6 h-6 text-emerald-500" />,
    Clock: <Clock className="w-6 h-6 text-sky-500" />,
    Building2: <Building2 className="w-6 h-6 text-indigo-500" />,
  };

  return (
    <section id="why-choose-us" className="py-24 relative bg-[var(--bg-main)] overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-mono text-[var(--accent-magenta)] mb-4 font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE PERFECT ADVANTAGE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-heading)] tracking-tight mb-4">
            Why Businesses Choose Perfect Printers
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-main)] font-medium">
            Backed by over two decades of printing expertise and an unwavering commitment to quality.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_ITEMS.map((item) => (
            <div
              key={item.title}
              className="group relative bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] hover:border-[var(--accent-cyan)] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between shadow-sm"
            >
              {/* Top Row: Icon & Tag */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-xl bg-[var(--bg-surface-1)] border border-[var(--border-color)] group-hover:scale-110 transition-transform shadow-sm">
                    {iconMap[item.icon]}
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-1)] px-2.5 py-1 rounded-md border border-[var(--border-color)] font-bold">
                    {item.tag}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-xl font-bold text-[var(--text-heading)] mb-3 group-hover:text-[var(--accent-cyan)] transition-colors">
                  {item.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-[var(--text-main)] leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Bottom Assurance */}
              <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center gap-2 text-xs text-emerald-500 font-mono font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>Verified B2B Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
