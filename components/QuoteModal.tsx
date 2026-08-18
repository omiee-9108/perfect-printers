"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { COMPANY_INFO } from "@/data/content";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export default function QuoteModal({ isOpen, onClose, defaultService }: QuoteModalProps) {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requirement, setRequirement] = useState(defaultService || "Multicolor Offset Printing");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!companyName.trim()) newErrors.companyName = "Company Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required";
    if (!quantity.trim()) newErrors.quantity = "Quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitted(true);
  };

  const handleWhatsAppInstant = () => {
    const text = `*Quick Quote Inquiry:*%0A%0A*Name:* ${encodeURIComponent(fullName || "B2B Client")}%0A*Company:* ${encodeURIComponent(companyName || "N/A")}%0A*Service:* ${encodeURIComponent(requirement)}%0A*Quantity:* ${encodeURIComponent(quantity || "Custom")}%0A*Details:* ${encodeURIComponent(message || "Please provide price estimate.")}`;
    window.open(`https://wa.me/919922449926?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[var(--accent-cyan)] font-bold uppercase tracking-wider">
              B2B Commercial Printing
            </div>
            <h3 className="text-xl font-bold text-[var(--text-heading)] mt-0.5">
              Request a Fast Print Quote
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[var(--bg-surface-1)] text-[var(--text-muted)] hover:text-[var(--text-heading)] border border-[var(--border-color)] hover:bg-[var(--bg-surface-2)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[var(--text-heading)]">
                Inquiry Received
              </h4>
              <p className="text-xs text-[var(--text-main)] max-w-sm mx-auto leading-relaxed font-medium">
                Thank you! Our estimation team at Perfect Printers Miraj will review your specifications and contact you shortly.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold shadow-md"
                  style={{
                    background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                    color: "var(--btn-text-color)",
                  }}
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] shadow-sm"
                  />
                  {errors.fullName && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company / Business Name"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] shadow-sm"
                  />
                  {errors.companyName && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.companyName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 Phone Number"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] shadow-sm"
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] shadow-sm"
                  />
                  {errors.email && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Requirement *
                  </label>
                  <select
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--accent-cyan)] shadow-sm"
                  >
                    <option value="Met-Pet Printing">Met-Pet Printing</option>
                    <option value="UV Drip-Off Coating">UV Drip-Off Coating</option>
                    <option value="Multicolor Printing">Multicolor Offset Printing</option>
                    <option value="Thermal CTP Pre-Press">Thermal CTP Pre-Press</option>
                    <option value="Packaging & Mono-cartons">Packaging & Mono-cartons</option>
                    <option value="Brochures & Catalogues">Brochures & Catalogues</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Quantity *
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 5,000 Units"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] shadow-sm"
                  />
                  {errors.quantity && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.quantity}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Specific Dimensions / Paper Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. 300 GSM Cyber XL, 4-color front + 1-color back, spot UV..."
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3 text-xs text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] shadow-sm"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl text-xs font-bold hover:opacity-95 shadow-md flex items-center justify-center gap-1.5"
                  style={{
                    background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                    color: "var(--btn-text-color)",
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Quote Request</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInstant}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send on WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
