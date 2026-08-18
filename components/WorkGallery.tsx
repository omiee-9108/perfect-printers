"use client";

import React, { useState } from "react";
import { GALLERY_ITEMS, GalleryItem } from "@/data/content";
import { Sparkles, ArrowRight, X, ZoomIn } from "lucide-react";

interface WorkGalleryProps {
  onOpenQuote: () => void;
}

export default function WorkGallery({ onOpenQuote }: WorkGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: "all", label: "All Works" },
    { id: "packaging", label: "Packaging & Boxes" },
    { id: "met-pet", label: "Met-Pet & Specialty" },
    { id: "brochures", label: "Brochures & Catalogues" },
    { id: "multicolor", label: "Multicolor Commercial" },
    { id: "stationery", label: "Business Stationery" },
  ];

  const filteredItems =
    activeCategory === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="work" className="py-24 relative bg-[var(--bg-main)] overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-mono text-[var(--accent-yellow)] mb-4 font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTFOLIO & FINISH SAMPLES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-heading)] tracking-tight mb-4">
            Print That Makes an Impression
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-main)] font-medium">
            A curated showcase of representative commercial packaging, specialty Met-Pet finishes, multicolor marketing collateral, and corporate publications.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? "shadow-lg scale-105"
                  : "bg-[var(--bg-card)] text-[var(--text-main)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)]"
              }`}
              style={{
                backgroundColor: activeCategory === cat.id ? "var(--accent-cyan)" : undefined,
                color: activeCategory === cat.id ? "var(--btn-text-color)" : undefined,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setPreviewItem(item)}
              className="group relative bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent-cyan)] rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-[var(--bg-card)]/90 text-[var(--accent-cyan)] border border-[var(--border-card)] backdrop-blur-md shadow-sm">
                    {item.finishTag}
                  </span>
                </div>

                {/* Hover Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-3 bg-[var(--bg-card)] border border-[var(--accent-cyan)]/60 rounded-full text-[var(--accent-cyan)] shadow-xl backdrop-blur-md">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block mb-1 font-bold">
                    {item.categoryLabel}
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-heading)] group-hover:text-[var(--accent-cyan)] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-main)] mt-1.5 line-clamp-2 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--accent-cyan)] font-bold">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={onOpenQuote}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold text-[var(--text-heading)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] hover:border-[var(--accent-cyan)] shadow-lg transition-all hover:scale-105"
          >
            <span>Discuss Your Next Project</span>
            <ArrowRight className="w-4 h-4 text-[var(--accent-cyan)]" />
          </button>
        </div>
      </div>

      {/* Image Preview Inspection Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80 sm:h-96 w-full bg-slate-900">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-card)]/80 text-[var(--text-heading)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[var(--accent-cyan)] bg-[var(--bg-surface-1)] border border-[var(--border-color)] px-2.5 py-0.5 rounded">
                  {previewItem.finishTag}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono font-medium">
                  Category: {previewItem.categoryLabel}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-heading)] mb-2">
                {previewItem.title}
              </h3>
              <p className="text-sm text-[var(--text-main)] leading-relaxed mb-6 font-medium">
                {previewItem.description}
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-[var(--text-heading)] bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-color)] rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setPreviewItem(null);
                    onOpenQuote();
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-lg shadow-md hover:opacity-90"
                  style={{
                    background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                    color: "var(--btn-text-color)",
                  }}
                >
                  Inquire Similar Print Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
