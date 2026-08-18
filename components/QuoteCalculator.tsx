"use client";

import React, { useState } from "react";
import { Calculator, Sparkles, MessageSquare, ArrowRight } from "lucide-react";

interface QuoteCalculatorProps {
  onApplyToForm: (data: { requirement: string; quantity: string; notes: string }) => void;
}

export default function QuoteCalculator({ onApplyToForm }: QuoteCalculatorProps) {
  const [selectedService, setSelectedService] = useState("Multicolor Printing");
  const [selectedProduct, setSelectedProduct] = useState("Packaging / Mono-cartons");
  const [quantity, setQuantity] = useState("5000");
  const [selectedFinish, setSelectedFinish] = useState("UV Drip-Off Coating");
  const [customNotes, setCustomNotes] = useState("");

  const servicesList = [
    "Multicolor Printing",
    "Met-Pet Printing",
    "UV Drip-Off Coating",
    "Thermal CTP Plate Setting",
  ];

  const productTypes = [
    "Packaging / Mono-cartons",
    "Brochures & Catalogues",
    "Product Labels & Sleeves",
    "Corporate Stationery & Folders",
    "Marketing Collateral & Posters",
  ];

  const finishOptions = [
    "UV Drip-Off Coating",
    "Met-Pet Metallic Foil Luster",
    "Full Gloss / Matte UV",
    "Standard Offset Finish",
  ];

  const handleSendWhatsApp = () => {
    const message = `*Inquiry from Perfect Printers Website:*%0A%0A*Service:* ${encodeURIComponent(
      selectedService
    )}%0A*Product:* ${encodeURIComponent(selectedProduct)}%0A*Quantity:* ${encodeURIComponent(
      quantity
    )} Units%0A*Finish:* ${encodeURIComponent(selectedFinish)}%0A*Notes:* ${encodeURIComponent(
      customNotes || "Standard B2B inquiry"
    )}`;
    window.open(`https://wa.me/919922449926?text=${message}`, "_blank");
  };

  const handleTransferToForm = () => {
    onApplyToForm({
      requirement: `${selectedService} - ${selectedProduct} (${selectedFinish})`,
      quantity: `${quantity} Units`,
      notes: customNotes,
    });
    const formElement = document.getElementById("contact");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 relative bg-[var(--bg-section)] overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-mono text-[var(--accent-cyan)] mb-4 font-bold shadow-sm">
            <Calculator className="w-3.5 h-3.5" />
            <span>INSTANT PROJECT CONFIGURATOR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-heading)] tracking-tight mb-4">
            Configure Your Print Specifications
          </h2>

          <p className="text-base text-[var(--text-main)] font-medium">
            Select your parameters below to generate an exact requirement summary for our pre-press and estimation team.
          </p>
        </div>

        {/* Configurator Box */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Controls: Selectors */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Core Service */}
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-2.5 font-bold">
                  1. Select Capability / Process
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {servicesList.map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => setSelectedService(svc)}
                      className={`p-3 rounded-xl text-left text-xs font-semibold transition-all ${
                        selectedService === svc
                          ? "bg-[var(--bg-surface-2)] border border-[var(--accent-cyan)] text-[var(--accent-cyan)] shadow-md"
                          : "bg-[var(--bg-surface-1)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-heading)]"
                      }`}
                    >
                      {svc}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Product Category */}
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-2.5 font-bold">
                  2. Product Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {productTypes.map((prod) => (
                    <button
                      key={prod}
                      type="button"
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-3 rounded-xl text-left text-xs font-medium transition-all ${
                        selectedProduct === prod
                          ? "bg-[var(--bg-surface-2)] border border-[var(--accent-magenta)] text-[var(--accent-magenta)] shadow-md font-bold"
                          : "bg-[var(--bg-surface-1)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-heading)]"
                      }`}
                    >
                      {prod}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Finishing & Specialty */}
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-2.5 font-bold">
                  3. Specialty Coating / Finishing
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {finishOptions.map((finish) => (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => setSelectedFinish(finish)}
                      className={`p-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                        selectedFinish === finish
                          ? "bg-[var(--bg-surface-2)] border border-[var(--accent-yellow)] text-[var(--accent-yellow)] shadow-md font-bold"
                          : "bg-[var(--bg-surface-1)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-heading)]"
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Target Volume / Quantity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider font-bold">
                    4. Estimated Print Quantity
                  </label>
                  <span className="text-sm font-bold font-mono text-[var(--accent-cyan)]">
                    {Number(quantity).toLocaleString()} Units
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-2 bg-[var(--bg-surface-2)] rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: "var(--accent-cyan)" }}
                />
                <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] mt-1 font-medium">
                  <span>500 (Min Run)</span>
                  <span>10,000</span>
                  <span>50,000</span>
                  <span>100,000+ (High Volume)</span>
                </div>
              </div>

            </div>

            {/* Right Summary Card & Actions */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[var(--bg-surface-1)] border border-[var(--border-card)] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent-cyan)]" />
                    <span className="text-xs font-mono uppercase text-[var(--text-heading)] font-bold">
                      Specification Sheet
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                    Direct Factory Rate
                  </span>
                </div>

                {/* Summary Specs */}
                <div className="space-y-3.5 mb-6 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] font-medium">Process:</span>
                    <span className="font-bold text-[var(--text-heading)]">{selectedService}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] font-medium">Format:</span>
                    <span className="font-bold text-[var(--text-heading)]">{selectedProduct}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] font-medium">Finish:</span>
                    <span className="font-bold text-[var(--accent-yellow)]">{selectedFinish}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] font-medium">Volume:</span>
                    <span className="font-bold font-mono text-[var(--accent-cyan)] text-sm">
                      {Number(quantity).toLocaleString()} Sheets / Units
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-[var(--text-muted)] font-medium">Facility:</span>
                    <span className="font-mono text-[var(--text-main)] font-semibold">Miraj MIDC Plant</span>
                  </div>
                </div>

                {/* Optional additional notes */}
                <div className="mb-6">
                  <label className="block text-[11px] font-mono text-[var(--text-muted)] mb-1.5 font-bold">
                    Specific Size / Die-cut Requirements (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g., 350 GSM Art Board, 4-color front + 1-color back..."
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3 text-xs text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] shadow-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  onClick={handleTransferToForm}
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                    color: "var(--btn-text-color)",
                  }}
                >
                  <span>Apply Specifications to Quote Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleSendWhatsApp}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Spec Instantly to WhatsApp (+91 99224 49926)</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
