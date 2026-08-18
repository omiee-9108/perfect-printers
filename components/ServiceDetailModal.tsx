"use client";

import React from "react";
import { ServiceItem, COMPANY_INFO } from "@/data/content";
import { X, CheckCircle2, Sparkles, ArrowRight, MessageSquare } from "lucide-react";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onOpenQuote: (serviceName?: string) => void;
}

export default function ServiceDetailModal({
  service,
  onClose,
  onOpenQuote,
}: ServiceDetailModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image & badge */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/60 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-card)]/80 hover:bg-[var(--bg-card)] text-[var(--text-main)] hover:text-[var(--text-heading)] border border-[var(--border-card)] backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Number and Badge */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="text-xs font-mono text-[var(--accent-cyan)] font-bold uppercase tracking-wider bg-[var(--bg-card)]/90 px-2.5 py-1 rounded-md border border-[var(--border-card)] shadow-sm">
                Service {service.num} // {service.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-heading)] mt-1.5">
                {service.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Headline & Description */}
          <div>
            <h4 className="text-sm font-bold text-[var(--accent-cyan)] mb-1.5 font-mono">
              {service.headline}
            </h4>
            <p className="text-sm sm:text-base text-[var(--text-main)] leading-relaxed font-medium">
              {service.description}
            </p>
          </div>

          {/* Key Advantages */}
          <div>
            <h5 className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-3 flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-yellow)]" />
              <span>Technical & Quality Advantages</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-[var(--text-main)] font-medium p-2.5 rounded-lg bg-[var(--bg-surface-1)] border border-[var(--border-color)]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Applications */}
          <div>
            <h5 className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-3 font-bold">
              Common B2B Applications
            </h5>
            <div className="flex flex-wrap gap-2">
              {service.applications.map((app, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 rounded-full bg-[var(--bg-surface-1)] text-[var(--text-main)] border border-[var(--border-color)] font-medium"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[var(--bg-card)] border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={`tel:${COMPANY_INFO.phoneClean}`}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-heading)] flex items-center gap-1.5 font-medium"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span>Questions? Call {COMPANY_INFO.phone}</span>
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-semibold text-[var(--text-heading)] bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-color)] rounded-xl"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenQuote(service.name);
              }}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
              style={{
                background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                color: "var(--btn-text-color)",
              }}
            >
              <span>Get Quote for {service.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
