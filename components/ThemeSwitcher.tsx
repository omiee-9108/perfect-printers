"use client";

import React, { useState } from "react";
import { useTheme, THEME_OPTIONS } from "@/context/ThemeContext";
import { Palette, Check, X, Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Theme Switcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-heading)] shadow-2xl backdrop-blur-xl hover:border-[var(--accent-cyan)] transition-all hover:scale-105 active:scale-95"
          title="Change Theme Palette"
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: "var(--accent-cyan)" }}
          >
            {currentTheme === "clean-white" ? (
              <Sun className="w-3 h-3 text-white" />
            ) : (
              <Palette className="w-3 h-3 text-black" />
            )}
          </div>
          <span className="text-xs font-semibold font-mono hidden sm:inline text-[var(--text-main)]">
            Theme
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Theme Selection Modal / Popover */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-6">
              <div className="flex items-center gap-2.5">
                <div
                  className="p-2 rounded-xl text-black"
                  style={{ backgroundColor: "var(--accent-cyan)" }}
                >
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-heading)]">
                    Select Visual Theme
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Switch between clean daytime light mode and curated dark palettes
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-[var(--bg-surface-1)] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 5 Theme Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
              {THEME_OPTIONS.map((theme) => {
                const isActive = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setTheme(theme.id);
                    }}
                    className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isActive
                        ? "bg-[var(--bg-surface-2)] border-[var(--accent-cyan)] shadow-lg ring-1 ring-[var(--accent-cyan)]"
                        : "bg-[var(--bg-surface-1)] border-[var(--border-color)] hover:border-[var(--accent-cyan)]/50"
                    }`}
                  >
                    {/* Swatch indicators */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: theme.secondaryColor }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: theme.bgPreview }}
                        />
                        {theme.isLight && (
                          <span className="text-[9px] font-mono font-bold bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded ml-1 border border-sky-200">
                            LIGHT
                          </span>
                        )}
                      </div>

                      {isActive && (
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{
                            backgroundColor: "var(--accent-cyan)",
                            color: "var(--btn-text-color)",
                          }}
                        >
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-[var(--text-heading)] mb-0.5">
                        {theme.name}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)] mb-1.5">
                        {theme.subtitle}
                      </div>
                      <p className="text-[11px] text-[var(--text-main)] line-clamp-2 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] text-xs">
              <span className="text-[var(--text-muted)] font-mono">
                Theme changes persist automatically
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold transition-opacity"
                style={{
                  background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                  color: "var(--btn-text-color)",
                }}
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
