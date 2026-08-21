"use client";

import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import OmTechLogo from "./OmTechLogo";
import { COMPANY_INFO, SERVICES } from "@/data/content";
import { MapPin, Layers } from "lucide-react";

interface FooterProps {
  onOpenQuote: () => void;
}

export default function Footer({ onOpenQuote }: FooterProps) {
  const quickLinks = [
    { name: "Home", href: "#hero", isInternal: false },
    { name: "About Us", href: "#about", isInternal: false },
    { name: "Services", href: "#services", isInternal: false },
    { name: "Why Perfect Printers", href: "#why-choose-us", isInternal: false },
    { name: "Printing Process", href: "#process", isInternal: false },
    { name: "Our Work", href: "#work", isInternal: false },
    { name: "Quality Assurance", href: "#quality", isInternal: false },
    { name: "Enterprise ERP Portal", href: "/erp", isInternal: true },
    { name: "Contact & Location", href: "#contact", isInternal: false },
  ];

  return (
    <footer className="bg-[var(--bg-main)] border-t border-[var(--border-color)] pt-16 pb-10 relative overflow-hidden transition-colors duration-300">
      {/* Background CMYK grid */}
      <div className="absolute inset-0 bg-cmyk-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[var(--border-color)]">
          
          {/* Col 1: Brand & Tagline & Narrative */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-4">
            <Logo size="md" showTagline={true} />

            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed mt-2 font-medium">
              “Professional offset printing solutions focused on quality, precision and dependable service.”
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[var(--accent-cyan)] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>20+ Years Industry Heritage • Miraj MIDC</span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenQuote}
                className="px-4 py-2 text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-colors"
                style={{
                  background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                  color: "var(--btn-text-color)",
                }}
              >
                Get a Quote
              </button>
              
              <Link
                href="/erp"
                className="px-4 py-2 text-xs font-bold text-cyan-300 bg-slate-900 border border-slate-700 hover:border-cyan-500/60 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>ERP Portal</span>
              </Link>

              <a
                href={`tel:${COMPANY_INFO.phoneClean}`}
                className="px-4 py-2 text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-card)] border border-[var(--border-card)] rounded-lg hover:border-[var(--accent-cyan)] transition-colors shadow-sm"
              >
                Call: {COMPANY_INFO.phone}
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono uppercase text-[var(--text-heading)] font-bold tracking-wider mb-4 border-b border-[var(--border-color)] pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.isInternal ? (
                    <Link
                      href={link.href}
                      className="text-xs text-cyan-400 hover:text-white transition-colors flex items-center gap-1.5 font-bold"
                    >
                      <span className="text-cyan-500">⚡</span> {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-xs text-[var(--text-main)] hover:text-[var(--accent-cyan)] transition-colors flex items-center gap-1.5 font-medium"
                    >
                      <span className="text-[var(--text-muted)]">›</span> {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Core Printing Capabilities */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-mono uppercase text-[var(--text-heading)] font-bold tracking-wider mb-4 border-b border-[var(--border-color)] pb-2">
              Printing Capabilities
            </h4>
            
            <ul className="space-y-2.5">
              {SERVICES.map((svc) => (
                <li key={svc.id}>
                  <a
                    href="#services"
                    className="text-xs text-[var(--text-main)] hover:text-[var(--accent-cyan)] transition-colors flex items-center justify-between group font-medium"
                  >
                    <span>{svc.name}</span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] font-bold">
                      {svc.badge}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] mt-4 shadow-sm">
              <div className="flex items-start gap-2.5 text-xs text-[var(--text-main)]">
                <MapPin className="w-4 h-4 text-[var(--accent-cyan)] flex-shrink-0 mt-0.5" />
                <span className="font-mono text-[11px] leading-relaxed font-medium">
                  {COMPANY_INFO.address}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Developer Attribution & Bottom Legal Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Copyright & Region Info */}
          <div className="text-xs font-mono text-[var(--text-muted)] text-center md:text-left space-y-1 font-medium">
            <div>
              © 2026 Perfect Printers. All Rights Reserved.
            </div>
            <div className="text-[11px]">
              Miraj, MIDC Industrial Area, Sangli Miraj Kupwad, Maharashtra 416410
            </div>
          </div>

          {/* Developer Branding: OM TECH */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl px-4 py-2.5 shadow-md backdrop-blur-md">
            <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5 font-bold">
              <span>Crafted & Developed by</span>
            </span>
            <div className="h-4 w-px bg-[var(--border-card)] hidden sm:block" />
            <OmTechLogo size="sm" />
          </div>

        </div>

      </div>
    </footer>
  );
}
