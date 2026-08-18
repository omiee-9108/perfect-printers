"use client";

import React from "react";
import { STATS } from "@/data/content";
import { Award, Star, ThumbsUp, CheckCircle } from "lucide-react";

export default function StatsStrip() {
  const icons = [
    <Award key="1" className="w-5 h-5 text-[var(--accent-cyan)]" />,
    <Star key="2" className="w-5 h-5 text-[var(--accent-yellow)] fill-[var(--accent-yellow)]/20" />,
    <ThumbsUp key="3" className="w-5 h-5 text-[var(--accent-magenta)]" />,
    <CheckCircle key="4" className="w-5 h-5 text-emerald-500" />,
  ];

  const accents = [
    "text-[var(--accent-cyan)]",
    "text-[var(--accent-yellow)]",
    "text-[var(--accent-magenta)]",
    "text-emerald-500",
  ];

  return (
    <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-color)]">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center ${
                index > 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""
              } group transition-all duration-300`}
            >
              <div className="p-2.5 rounded-xl bg-[var(--bg-surface-1)] border border-[var(--border-color)] mb-3 group-hover:scale-105 transition-all shadow-sm">
                {icons[index]}
              </div>

              <div className={`text-3xl sm:text-4xl font-black font-display tracking-tight mb-1 ${accents[index]}`}>
                {stat.value}
              </div>

              <div className="text-sm font-bold text-[var(--text-heading)] tracking-tight">
                {stat.label}
              </div>

              <div className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
