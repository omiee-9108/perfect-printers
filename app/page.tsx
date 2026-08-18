"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProcessTimeline from "@/components/ProcessTimeline";
import WorkGallery from "@/components/WorkGallery";
import QualitySection from "@/components/QualitySection";
import ReviewsSection from "@/components/ReviewsSection";
import QuoteCalculator from "@/components/QuoteCalculator";
import CtaBanner from "@/components/CtaBanner";
import ContactSection from "@/components/ContactSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import QuoteModal from "@/components/QuoteModal";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ThemeProvider } from "@/context/ThemeContext";

export default function HomePage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedModalService, setSelectedModalService] = useState<string | undefined>(undefined);
  const [contactPrefill, setContactPrefill] = useState<{
    requirement: string;
    quantity: string;
    notes: string;
  } | undefined>(undefined);

  const handleOpenQuote = (serviceName?: string) => {
    setSelectedModalService(serviceName);
    setQuoteModalOpen(true);
  };

  const handleApplyToForm = (data: { requirement: string; quantity: string; notes: string }) => {
    setContactPrefill(data);
  };

  return (
    <ThemeProvider>
      <main className="min-h-screen text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-black">
        {/* Sticky Header */}
        <Navbar onOpenQuote={() => handleOpenQuote()} />

        {/* Hero Section */}
        <Hero onOpenQuote={() => handleOpenQuote()} />

        {/* Trust & Stats Section */}
        <StatsStrip />

        {/* About Perfect Printers */}
        <AboutSection onOpenQuote={() => handleOpenQuote()} />

        {/* Services & Core Capabilities */}
        <ServicesSection onOpenQuote={(name) => handleOpenQuote(name)} />

        {/* Why Businesses Choose Perfect Printers */}
        <WhyChooseUs />

        {/* Printing Process Timeline */}
        <ProcessTimeline />

        {/* Work Gallery & Portfolios */}
        <WorkGallery onOpenQuote={() => handleOpenQuote()} />

        {/* Quality & Precision Section */}
        <QualitySection />

        {/* Google Ratings & Business Trust */}
        <ReviewsSection />

        {/* Interactive Project Configurator / Calculator */}
        <QuoteCalculator onApplyToForm={handleApplyToForm} />

        {/* Conversion CTA Banner */}
        <CtaBanner onOpenQuote={() => handleOpenQuote()} />

        {/* Contact & Request a Quote Form */}
        <ContactSection prefillData={contactPrefill} />

        {/* Google Maps Location Container */}
        <MapSection />

        {/* Footer */}
        <Footer onOpenQuote={() => handleOpenQuote()} />

        {/* Global Quote Request Modal */}
        <QuoteModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          defaultService={selectedModalService}
        />

        {/* Live Theme Switcher Floating Widget */}
        <ThemeSwitcher />
      </main>
    </ThemeProvider>
  );
}
