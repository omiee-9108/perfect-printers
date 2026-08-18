"use client";

import React, { useState, useEffect } from "react";
import { COMPANY_INFO } from "@/data/content";
import { MapPin, Phone, Building2, Star, Send, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";

interface ContactSectionProps {
  prefillData?: {
    requirement: string;
    quantity: string;
    notes: string;
  };
}

export default function ContactSection({ prefillData }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    requirement: "Met-Pet Printing & Packaging",
    quantity: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        requirement: prefillData.requirement || prev.requirement,
        quantity: prefillData.quantity || prev.quantity,
        message: prefillData.notes ? `Additional Specs: ${prefillData.notes}` : prev.message,
      }));
    }
  }, [prefillData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+ -]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.quantity.trim()) newErrors.quantity = "Estimated quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <section id="contact" className="py-24 relative bg-[var(--bg-section)] overflow-hidden transition-colors duration-300">
      {/* Background Gradients */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[var(--accent-cyan)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent-magenta)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-mono text-[var(--accent-cyan)] mb-4 font-bold shadow-sm">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>COMMERCIAL INQUIRIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-heading)] tracking-tight mb-4">
            Contact & Quote Request
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-main)] font-medium">
            Reach out to our production plant in Miraj MIDC for commercial offset printing estimates and technical consultations.
          </p>
        </div>

        {/* 2-Column Contact Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Verified Business Information */}
          <div className="lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-8">
            <div>
              <span className="text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-wider block mb-1 font-bold">
                Direct Contact Details
              </span>
              <h3 className="text-2xl font-extrabold text-[var(--text-heading)]">
                Get in Touch
              </h3>
              <div className="text-lg font-bold text-[var(--accent-cyan)] font-display mt-1">
                {COMPANY_INFO.name}
              </div>
              <div className="text-xs text-[var(--text-muted)] font-mono italic">
                “{COMPANY_INFO.tagline}”
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--bg-surface-1)] text-[var(--accent-cyan)] border border-[var(--border-color)] flex-shrink-0 mt-1">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold">Address</h4>
                <p className="text-sm text-[var(--text-main)] mt-1 leading-relaxed font-semibold">
                  {COMPANY_INFO.address}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--bg-surface-1)] text-emerald-500 border border-[var(--border-color)] flex-shrink-0 mt-1">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold">Phone / Direct Line</h4>
                <a
                  href={`tel:${COMPANY_INFO.phoneClean}`}
                  className="text-base font-bold text-[var(--text-heading)] hover:text-[var(--accent-cyan)] transition-colors mt-1 block font-mono"
                >
                  {COMPANY_INFO.phone}
                </a>
                <span className="text-xs text-[var(--text-muted)] font-medium">Available Mon – Sat, 9:00 AM – 8:30 PM</span>
              </div>
            </div>

            {/* Industry */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--bg-surface-1)] text-[var(--accent-magenta)] border border-[var(--border-color)] flex-shrink-0 mt-1">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold">Industry</h4>
                <p className="text-sm font-bold text-[var(--text-heading)] mt-1">
                  {COMPANY_INFO.industry}
                </p>
                <span className="text-xs text-[var(--text-muted)] font-medium">Met-Pet, UV Drip-off, Thermal CTP, Packaging</span>
              </div>
            </div>

            {/* Google Rating */}
            <div className="flex items-start gap-4 pt-4 border-t border-[var(--border-color)]">
              <div className="p-3 rounded-xl bg-[var(--bg-surface-1)] text-[var(--accent-yellow)] border border-[var(--border-color)] flex-shrink-0 mt-1">
                <Star className="w-5 h-5 fill-[var(--accent-yellow)]" />
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold">Google Rating</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-[var(--text-heading)]">4.8 / 5</span>
                  <span className="text-xs text-[var(--text-muted)] font-medium">from 33 Google reviews</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Directly on WhatsApp (+91 99224 49926)</span>
            </a>
          </div>

          {/* Right Column: Modern Quote Request Form */}
          <div className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-[var(--text-heading)]">
                  Quote Request Submitted Successfully
                </h3>
                <p className="text-sm text-[var(--text-main)] max-w-md mx-auto leading-relaxed font-medium">
                  Thank you for contacting Perfect Printers. Our commercial estimation team in Miraj MIDC has received your specifications and will respond within 24 hours.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: "",
                        companyName: "",
                        phone: "",
                        email: "",
                        requirement: "Met-Pet Printing & Packaging",
                        quantity: "",
                        message: "",
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-heading)] bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-color)]"
                  >
                    Submit Another Inquiry
                  </button>

                  <a
                    href={`tel:${COMPANY_INFO.phoneClean}`}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold shadow-md"
                    style={{
                      background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                      color: "var(--btn-text-color)",
                    }}
                  >
                    Call Immediately: {COMPANY_INFO.phone}
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-[var(--border-color)] pb-4 mb-6">
                  <h3 className="text-xl font-bold text-[var(--text-heading)]">
                    Request a Customized Print Quote
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                    Fill in your company details and project requirements below for direct factory pricing.
                  </p>
                </div>

                {/* Row 1: Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rajesh Patil"
                      className={`w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors shadow-sm ${
                        errors.fullName ? "border-red-500 focus:border-red-500" : "border-[var(--input-border)] focus:border-[var(--accent-cyan)]"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Patil Agro & FMCG Ltd."
                      className={`w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors shadow-sm ${
                        errors.companyName ? "border-red-500 focus:border-red-500" : "border-[var(--input-border)] focus:border-[var(--accent-cyan)]"
                      }`}
                    />
                    {errors.companyName && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.companyName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors shadow-sm ${
                        errors.phone ? "border-red-500 focus:border-red-500" : "border-[var(--input-border)] focus:border-[var(--accent-cyan)]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. purchase@company.com"
                      className={`w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors shadow-sm ${
                        errors.email ? "border-red-500 focus:border-red-500" : "border-[var(--input-border)] focus:border-[var(--accent-cyan)]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Requirement & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                      Printing Requirement *
                    </label>
                    <select
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--accent-cyan)] shadow-sm font-medium"
                    >
                      <option value="Met-Pet Printing & Metallic Packaging">Met-Pet Printing & Packaging</option>
                      <option value="UV Drip-Off Coating & Brochures">UV Drip-Off Coating & Brochures</option>
                      <option value="Multicolor Commercial Offset Printing">Multicolor Offset Printing</option>
                      <option value="Thermal CTP Pre-Press Plates">Thermal CTP Pre-Press Plates</option>
                      <option value="Packaging & Mono-cartons">Packaging & Mono-cartons</option>
                      <option value="Catalogues & Booklets">Catalogues & Booklets</option>
                      <option value="Other Custom Job">Other Custom Specification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                      Estimated Quantity *
                    </label>
                    <input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="e.g. 5,000 Boxes / 2,000 Catalogues"
                      className={`w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors shadow-sm ${
                        errors.quantity ? "border-red-500 focus:border-red-500" : "border-[var(--input-border)] focus:border-[var(--accent-cyan)]"
                      }`}
                    />
                    {errors.quantity && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.quantity}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 4: Message */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                    Project Message / Paper & Size Details (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide additional details such as finished dimensions (e.g. A4, custom carton size), paper GSM (e.g. 300 GSM Cyber XL), die-cut specs..."
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors shadow-sm"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl text-sm font-bold shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{
                    background: `linear-gradient(to right, var(--gradient-btn-from), var(--gradient-btn-to))`,
                    color: "var(--btn-text-color)",
                  }}
                >
                  {isSubmitting ? (
                    <span>Processing Specifications...</span>
                  ) : (
                    <>
                      <span>Request a Quote</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
