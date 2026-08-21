"use client";

import React, { useState } from "react";
import { Navigation, ExternalLink, MapPin, Copy, Check } from "lucide-react";
import { COMPANY_INFO } from "@/data/content";

export default function MapSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(COMPANY_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="location" className="py-16 relative bg-[var(--bg-main)] overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Container */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          
          {/* Top Bar with Address & Directions Button */}
          <div className="p-6 sm:p-8 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 flex-shrink-0 mt-0.5 shadow-sm">
                <MapPin className="w-6 h-6 fill-red-500 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-red-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Pinned Factory Location
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-1)] px-2 py-0.5 rounded border border-[var(--border-color)]">
                    16.8325° N, 74.6391° E
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-heading)] mt-1">
                  Perfect Printers — Miraj MIDC Press Plant
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-main)] mt-1 font-medium max-w-2xl">
                  {COMPANY_INFO.address}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-[var(--text-heading)] bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-color)] transition-all shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[var(--accent-cyan)]" />}
                <span>{copied ? "Address Copied!" : "Copy Address"}</span>
              </button>

              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold shadow-lg hover:scale-105 transition-all flex-shrink-0"
                style={{
                  background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                  color: "var(--btn-text-color)",
                }}
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Embedded Interactive Map Frame with Explicit Pin */}
          <div className="relative w-full h-[450px] sm:h-[500px] bg-[var(--bg-main)]">
            <iframe
              title="Perfect Printers Pinned Location Map Miraj MIDC"
              src="https://maps.google.com/maps?q=Perfect+Printers,+MIDC+Industrial+Area,+Miraj,+Maharashtra+416410&t=&z=16&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: "invert(90%) hue-rotate(180deg) contrast(1.1) brightness(0.9)",
              }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />

            {/* Prominent Overlay Marker Card */}
            <div className="absolute top-4 left-4 bg-[var(--bg-card)]/95 border border-[var(--border-card)] rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-sm hidden sm:block">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-500 flex-shrink-0">
                  <MapPin className="w-5 h-5 fill-red-500 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-heading)]">
                    <span>Perfect Printers</span>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                      Open
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-main)] mt-0.5 leading-snug font-medium">
                    Miraj, MIDC Industrial Area, Sangli Miraj Kupwad, MH 416410
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
                    <span className="text-amber-500 font-bold">★ 4.8 / 5 Rating</span>
                    <span>33 Google Reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Directions Floating Pill at Bottom-Right */}
            <div className="absolute bottom-4 right-4 hidden sm:block">
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900/90 hover:bg-slate-900 border border-slate-700 shadow-xl backdrop-blur-md transition-all hover:scale-105"
              >
                <Navigation className="w-3.5 h-3.5 text-red-400" />
                <span>Navigate to Facility</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
