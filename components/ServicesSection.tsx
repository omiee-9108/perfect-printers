"use client";

import React, { useState } from "react";
import { SERVICES, ServiceItem } from "@/data/content";
import { ArrowRight, Layers, Cpu } from "lucide-react";
import ServiceDetailModal from "./ServiceDetailModal";

interface ServicesSectionProps {
  onOpenQuote: (serviceName?: string) => void;
}

export default function ServicesSection({ onOpenQuote }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section id="services" className="py-24 relative bg-[var(--bg-section)] overflow-hidden transition-colors duration-300">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[var(--accent-cyan)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[var(--accent-magenta)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-mono text-[var(--accent-cyan)] mb-4 font-bold shadow-sm">
            <Layers className="w-3.5 h-3.5" />
            <span>COMMERCIAL CAPABILITIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-heading)] tracking-tight mb-4">
            Our Printing Capabilities
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-main)] font-medium">
            Professional printing solutions designed to deliver quality, consistency and exceptional finishes.
          </p>
        </div>

        {/* 4 Primary Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group relative bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent-cyan)] rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with overlay & badge */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/40 to-transparent" />

                {/* Top Corner Badge & Number */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="font-mono text-xl font-black text-[var(--text-heading)]/40 tracking-wider">
                    {service.num}
                  </span>
                  <span
                    className="text-xs font-mono font-bold px-3 py-1 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)]/90 text-[var(--accent-cyan)] backdrop-blur-md shadow-sm"
                  >
                    {service.badge}
                  </span>
                </div>

                {/* Bottom title overlay on image */}
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-heading)] group-hover:text-[var(--accent-cyan)] transition-colors">
                    {service.name}
                  </h3>
                </div>
              </div>

              {/* Card Content Description & Action */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-sm sm:text-base text-[var(--text-main)] leading-relaxed mb-6 font-medium">
                  {service.description}
                </p>

                {/* Micro-Features Preview */}
                <div className="space-y-2 mb-6 pt-4 border-t border-[var(--border-color)]">
                  {service.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text-heading)] transition-colors font-bold">
                    Explore Technical Specs
                  </span>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent-cyan)] group-hover:translate-x-1 transition-transform">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Capabilities Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-[var(--accent-cyan)]/15 rounded-xl text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[var(--text-heading)]">Need a Specialized Substrate or Custom Die-Cut?</h4>
              <p className="text-xs text-[var(--text-muted)] font-medium">Our pre-press and printing engineers support complex corporate specifications.</p>
            </div>
          </div>

          <button
            onClick={() => onOpenQuote()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex-shrink-0 hover:scale-105"
            style={{
              background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
              color: "var(--btn-text-color)",
            }}
          >
            Inquire Custom Job
          </button>
        </div>
      </div>

      {/* Modal for Service Details */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onOpenQuote={onOpenQuote}
      />
    </section>
  );
}
