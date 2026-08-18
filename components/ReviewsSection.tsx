"use client";

import React from "react";
import { Star, ArrowUpRight, CheckSquare, MapPin } from "lucide-react";
import { COMPANY_INFO } from "@/data/content";

export default function ReviewsSection() {
  return (
    <section className="py-20 relative bg-[var(--bg-main)] overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Subtle Google colors indicator dots */}
          <div className="absolute top-6 right-8 flex items-center gap-1.5 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & Google Score */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--bg-surface-1)] border border-[var(--border-color)] text-xs font-mono text-[var(--accent-yellow)] mb-4">
                <Star className="w-3.5 h-3.5 fill-[var(--accent-yellow)]" />
                <span>GOOGLE BUSINESS REPUTATION</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-heading)] tracking-tight mb-4">
                Trusted by Businesses in the Region
              </h2>

              <p className="text-base text-[var(--text-main)] leading-relaxed mb-6">
                With a proven track record spanning over two decades in the Sangli–Miraj industrial corridor, Perfect Printers is recognized for consistent print quality, dependable turnaround times, and professional commercial execution.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={COMPANY_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-md transition-all hover:scale-105"
                >
                  <span>View Google Reviews</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <a
                  href={COMPANY_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[var(--text-heading)] bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-color)] transition-all"
                >
                  <CheckSquare className="w-4 h-4 text-[var(--accent-cyan)]" />
                  <span>Review Us on Google</span>
                </a>
              </div>
            </div>

            {/* Right Column: Verified Scorecard Container */}
            <div className="lg:col-span-5">
              <div className="bg-[var(--bg-surface-1)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-inner text-center flex flex-col items-center justify-center">
                
                {/* Large Rating */}
                <div className="text-5xl sm:text-6xl font-black font-display text-[var(--text-heading)] tracking-tight mb-2">
                  {COMPANY_INFO.googleRating}
                  <span className="text-2xl text-[var(--text-muted)] font-normal"> / 5</span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1.5 mb-3 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-amber-400" />
                  ))}
                </div>

                {/* Reviews Count */}
                <div className="text-lg font-bold text-[var(--text-heading)]">
                  {COMPANY_INFO.reviewCount} Google Reviews
                </div>
                
                <div className="text-xs text-[var(--text-muted)] mt-1 mb-4 font-medium">
                  Verified Local Business Listing
                </div>

                {/* Industrial Belt Badge */}
                <div className="w-full pt-4 border-t border-[var(--border-color)] flex items-center justify-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                  <span>Miraj MIDC, Sangli Miraj Kupwad</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
