"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Factory, History, Sparkles, Award } from "lucide-react";
import { COMPANY_INFO } from "@/data/content";

interface AboutSectionProps {
  onOpenQuote: () => void;
}

export default function AboutSection({ onOpenQuote }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[var(--bg-main)] transition-colors duration-300">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[var(--accent-cyan)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--accent-magenta)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Industrial Press Visual & Credential Badges */}
          <div className="lg:col-span-5 relative">
            {/* Main Imagery Container */}
            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-card)] shadow-2xl bg-[var(--bg-card)] group">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop"
                alt="Perfect Printers Offset Printing Facility & Heidelberg Press Room"
                className="w-full h-[450px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)]/90 via-[var(--bg-main)]/20 to-transparent" />
              
              {/* Bottom Image Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] backdrop-blur-md shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-[var(--accent-cyan)]" />
                    <span className="text-xs font-mono text-[var(--text-main)] font-semibold">MIDC Miraj Industrial Press Plant</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                    Active Facility
                  </span>
                </div>
              </div>
            </div>

            {/* Floating 20+ Years Heritage Badge */}
            <div className="absolute -top-6 -left-6 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3">
              <div className="p-3 bg-[var(--accent-cyan)]/15 rounded-xl text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30">
                <History className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-[var(--text-heading)] font-display">20+ Years</div>
                <div className="text-[11px] text-[var(--text-muted)] font-bold">Industry Heritage</div>
              </div>
            </div>

            {/* Floating Quality Badge */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-4 shadow-2xl backdrop-blur-xl items-center gap-3">
              <div className="p-3 bg-[var(--accent-yellow)]/15 rounded-xl text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-[var(--text-heading)] font-display">4.8 / 5 Rating</div>
                <div className="text-[11px] text-[var(--text-muted)] font-bold">33+ Google Reviews</div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--accent-cyan)] text-xs font-mono mb-4 font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT PERFECT PRINTERS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-heading)] tracking-tight leading-tight mb-6">
              Printing Experience You Can Trust
            </h2>

            {/* Verbatim Prompt Paragraph 1 */}
            <p className="text-base sm:text-lg text-[var(--text-main)] leading-relaxed mb-5 font-medium">
              “Welcome to Perfect Printers, where we are dedicated to providing high-quality printing solutions for all your business needs. With over 20 years of experience in the print industry, we work closely with our clients to deliver outstanding printed materials that meet their specific requirements.”
            </p>

            {/* Verbatim Prompt Paragraph 2 */}
            <p className="text-base text-[var(--text-muted)] leading-relaxed mb-8 font-medium">
              “From concept to finished print, our focus is on quality, precision and consistency. We combine experienced craftsmanship with modern printing technology to help businesses create printed materials that make an impact.”
            </p>

            {/* Capability Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8 pt-4 border-t border-[var(--border-color)]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-cyan)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-heading)]">Full-Spectrum Offset Press</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">High-volume multicolor runs with tight registration.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-magenta)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-heading)]">Advanced Finishing & Coatings</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">Met-Pet printing and UV drip-off tactile finishes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-yellow)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-heading)]">Thermal CTP Pre-Press</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">Computer-to-Plate laser imaging with zero distortion.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-heading)]">Regional B2B Partner</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">Serving Sangli, Miraj, Kupwad & western Maharashtra.</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-[var(--text-heading)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] hover:border-[var(--accent-cyan)] transition-all hover:scale-[1.02] shadow-sm"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 text-[var(--accent-cyan)]" />
              </a>

              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-[var(--accent-cyan)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--accent-cyan)]/60 transition-all shadow-sm"
              >
                <span>Discuss Your Next Project</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
