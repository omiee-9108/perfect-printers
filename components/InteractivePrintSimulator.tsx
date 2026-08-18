"use client";

import React, { useState } from "react";
import { Sparkles, Layers, ShieldCheck, RefreshCw, Eye } from "lucide-react";

export default function InteractivePrintSimulator() {
  const [activeLayer, setActiveLayer] = useState<"cmyk" | "cyan" | "magenta" | "yellow" | "black">("cmyk");
  const [enableMetPet, setEnableMetPet] = useState(true);
  const [enableUvDripOff, setEnableUvDripOff] = useState(true);

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Background glow halos */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-[var(--accent-cyan)]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[var(--accent-magenta)]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Industrial Frame */}
      <div className="relative bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl overflow-hidden transition-colors duration-300">
        {/* Top Control Bar with Registration Marks */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-[var(--text-main)] tracking-wider uppercase">
              Offset Press Simulation // 4-Color CTP
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[var(--accent-cyan)] border border-cyan-500/40 font-bold">C</span>
            <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-[var(--accent-magenta)] border border-pink-500/40 font-bold">M</span>
            <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-[var(--accent-yellow)] border border-yellow-500/40 font-bold">Y</span>
            <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-2)] text-[var(--text-main)] border border-[var(--border-color)] font-bold">K</span>
          </div>
        </div>

        {/* Live Visual Print Sheet Canvas */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-[var(--border-color)] flex items-center justify-center group shadow-inner">
          {/* Base Artwork Image */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
              activeLayer === "cyan"
                ? "hue-rotate-180 saturate-200 contrast-125"
                : activeLayer === "magenta"
                ? "hue-rotate-290 saturate-200 contrast-125"
                : activeLayer === "yellow"
                ? "hue-rotate-60 saturate-200 contrast-125"
                : activeLayer === "black"
                ? "grayscale contrast-150"
                : "saturate-110"
            }`}
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=900&auto=format&fit=crop')",
            }}
          />

          {/* Dark Overlay for industrial contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

          {/* Specialty Met-Pet Foil Simulation Overlay */}
          {enableMetPet && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/20 to-pink-500/20 mix-blend-overlay animate-sheen pointer-events-none" />
          )}

          {/* UV Drip-Off Texture Simulation Overlay */}
          {enableUvDripOff && (
            <div className="absolute inset-0 dripoff-preview opacity-40 mix-blend-screen pointer-events-none" />
          )}

          {/* Dynamic Registration Target Lines */}
          <div className="absolute inset-4 border border-white/20 rounded-lg pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between items-start text-[9px] font-mono text-white/70">
              <span>+ REG: 0.01mm</span>
              <span>175 LPI SCREEN</span>
            </div>
            <div className="flex justify-between items-end text-[9px] font-mono text-white/70">
              <span>MET-PET: {enableMetPet ? "ACTIVE" : "OFF"}</span>
              <span>DRIP-OFF: {enableUvDripOff ? "ENABLED" : "OFF"}</span>
            </div>
          </div>

          {/* Floating Live Badge inside visual */}
          <div className="absolute top-3 right-3 bg-[var(--bg-card)]/90 border border-[var(--border-card)] backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-cyan)] animate-spin-slow" />
            <span className="text-[11px] font-bold text-[var(--text-heading)]">
              {activeLayer === "cmyk" ? "Full 4-Color Spectrum" : `${activeLayer.toUpperCase()} Plate Separation`}
            </span>
          </div>

          {/* Center Brand Overlay on Sheet */}
          <div className="relative text-center p-6 max-w-xs bg-black/75 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl">
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest mb-1">
              Sangli & Miraj Industrial Belt
            </div>
            <div className="text-lg font-black uppercase text-white tracking-tight">
              PERFECT PRINTERS
            </div>
            <div className="text-xs text-slate-200 mt-1 italic font-medium">
              “Shape Your Ideas”
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-emerald-400 font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Micro-Dot Precision</span>
            </div>
          </div>
        </div>

        {/* Interactive Layer Switches */}
        <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
              <span>Plate Separation Channels:</span>
            </span>
            <button
              onClick={() => setActiveLayer("cmyk")}
              className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-heading)] flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" /> Reset Full
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            <button
              onClick={() => setActiveLayer("cmyk")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all ${
                activeLayer === "cmyk"
                  ? "bg-[var(--bg-surface-3)] text-[var(--text-heading)] border border-[var(--accent-cyan)] shadow-md"
                  : "bg-[var(--bg-surface-1)] text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-heading)] border border-[var(--border-color)]"
              }`}
            >
              CMYK
            </button>
            <button
              onClick={() => setActiveLayer("cyan")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all ${
                activeLayer === "cyan"
                  ? "bg-cyan-500/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)] shadow-sm"
                  : "bg-[var(--bg-surface-1)] text-[var(--accent-cyan)]/70 hover:bg-[var(--bg-surface-2)] hover:text-[var(--accent-cyan)] border border-[var(--border-color)]"
              }`}
            >
              Cyan
            </button>
            <button
              onClick={() => setActiveLayer("magenta")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all ${
                activeLayer === "magenta"
                  ? "bg-pink-500/20 text-[var(--accent-magenta)] border border-[var(--accent-magenta)] shadow-sm"
                  : "bg-[var(--bg-surface-1)] text-[var(--accent-magenta)]/70 hover:bg-[var(--bg-surface-2)] hover:text-[var(--accent-magenta)] border border-[var(--border-color)]"
              }`}
            >
              Magenta
            </button>
            <button
              onClick={() => setActiveLayer("yellow")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all ${
                activeLayer === "yellow"
                  ? "bg-yellow-500/20 text-[var(--accent-yellow)] border border-[var(--accent-yellow)] shadow-sm"
                  : "bg-[var(--bg-surface-1)] text-[var(--accent-yellow)]/70 hover:bg-[var(--bg-surface-2)] hover:text-[var(--accent-yellow)] border border-[var(--border-color)]"
              }`}
            >
              Yellow
            </button>
            <button
              onClick={() => setActiveLayer("black")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all ${
                activeLayer === "black"
                  ? "bg-[var(--bg-surface-3)] text-[var(--text-heading)] border border-[var(--border-card)] shadow-sm"
                  : "bg-[var(--bg-surface-1)] text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-heading)] border border-[var(--border-color)]"
              }`}
            >
              Black (K)
            </button>
          </div>

          {/* Interactive Finishing Toggles */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setEnableMetPet(!enableMetPet)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
                enableMetPet
                  ? "bg-[var(--bg-surface-2)] border-[var(--accent-cyan)] text-[var(--accent-cyan)] shadow-sm"
                  : "bg-[var(--bg-surface-1)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Met-Pet Metallic: {enableMetPet ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={() => setEnableUvDripOff(!enableUvDripOff)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
                enableUvDripOff
                  ? "bg-[var(--bg-surface-2)] border-[var(--accent-magenta)] text-[var(--accent-magenta)] shadow-sm"
                  : "bg-[var(--bg-surface-1)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>UV Drip-Off: {enableUvDripOff ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
