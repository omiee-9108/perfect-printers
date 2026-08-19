"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { COMPANY_INFO } from "@/data/content";
import { Phone, Menu, X, ArrowUpRight, Sparkles, Palette } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  onOpenQuote: () => void;
}

export default function Navbar({ onOpenQuote }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const { currentTheme, setTheme, themes } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Why Us", href: "#why-choose-us" },
    { name: "Process", href: "#process" },
    { name: "Our Work", href: "#work" },
    { name: "Quality", href: "#quality" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--border-color)] py-2.5 shadow-xl"
          : "bg-[var(--nav-bg)]/80 backdrop-blur-sm py-4 border-b border-[var(--border-color)]/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#hero" className="flex items-center transition-transform hover:scale-[1.02]">
            <Logo size={isScrolled ? "sm" : "md"} showTagline={!isScrolled} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-full px-4 py-1.5 backdrop-blur-md shadow-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-[var(--text-main)] hover:text-[var(--accent-cyan)] px-3 py-1.5 rounded-full transition-colors hover:bg-[var(--bg-surface-2)]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-2 text-[var(--text-main)] hover:text-[var(--accent-cyan)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-lg transition-all shadow-sm"
                title="Change Theme Palette"
              >
                <Palette className="w-4 h-4" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl">
                  <div className="text-[10px] font-mono text-[var(--text-muted)] px-3 py-1.5 uppercase tracking-wider border-b border-[var(--border-color)]">
                    Select Theme Palette
                  </div>
                  <div className="space-y-1 mt-1">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                          currentTheme === t.id
                            ? "bg-[var(--bg-surface-2)] text-[var(--text-heading)] font-bold border border-[var(--accent-cyan)]/50"
                            : "text-[var(--text-main)] hover:bg-[var(--bg-surface-1)] hover:text-[var(--text-heading)]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: t.primaryColor }}
                          />
                          <span>{t.name}</span>
                        </div>
                        {currentTheme === t.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Phone Dial Button */}
            <a
              href={`tel:${COMPANY_INFO.phoneClean}`}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono text-[var(--text-main)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-lg transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
              <span className="font-semibold">{COMPANY_INFO.phone}</span>
            </a>

            {/* ERP Portal Link */}
            <Link
              href="/erp"
              data-testid="nav-erp-portal-link"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 rounded-lg shadow-sm transition-all hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ERP Portal</span>
            </Link>

            {/* Primary CTA - Get a Quote */}
            <button
              onClick={onOpenQuote}
              className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold shadow-md transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                color: "var(--btn-text-color)",
              }}
            >
              <span>Get a Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/erp"
              className="px-2.5 py-1.5 text-xs font-bold rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm"
            >
              ERP
            </Link>
            <button
              onClick={onOpenQuote}
              className="px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm"
              style={{
                background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                color: "var(--btn-text-color)",
              }}
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-main)] hover:text-[var(--text-heading)] bg-[var(--bg-card)] border border-[var(--border-card)] rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-[var(--bg-card)] border-b border-[var(--border-card)] backdrop-blur-xl px-6 py-6 shadow-2xl transition-all">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[var(--text-main)] hover:text-[var(--accent-cyan)] py-2 border-b border-[var(--border-color)]"
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Theme Selector */}
            <div className="pt-2">
              <div className="text-xs font-mono text-[var(--text-muted)] mb-2">Select Theme:</div>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-2 rounded-lg text-xs flex items-center gap-2 border ${
                      currentTheme === t.id
                        ? "bg-[var(--bg-surface-2)] border-[var(--accent-cyan)] text-[var(--text-heading)] font-bold"
                        : "bg-[var(--bg-surface-1)] border-[var(--border-color)] text-[var(--text-main)]"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: t.primaryColor }}
                    />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <a
                href={`tel:${COMPANY_INFO.phoneClean}`}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-[var(--text-heading)] bg-[var(--bg-surface-1)] border border-[var(--border-card)] rounded-xl"
              >
                <Phone className="w-4 h-4 text-[var(--accent-cyan)]" />
                <span>Call {COMPANY_INFO.phone}</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold rounded-xl shadow-lg"
                style={{
                  background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                  color: "var(--btn-text-color)",
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Custom Quote</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
