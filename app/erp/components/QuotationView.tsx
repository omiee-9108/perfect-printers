"use client";

import React, { useState } from "react";
import { useErp } from "../context/ErpContext";
import { QuotationLineItem } from "../types";
import { formatDocketDate, addDaysAndFormat } from "../utils/date";
import { FileSpreadsheet, Plus, Trash2, Printer } from "lucide-react";

export default function QuotationView() {
  const { customers, quotations, createQuotation, openPrintModal } = useErp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ""
  );
  const [contactPerson, setContactPerson] = useState(
    customers[0]?.contactPerson || "Procurement Manager"
  );
  const [quoteDate, setQuoteDate] = useState(formatDocketDate());
  const [validUntil, setValidUntil] = useState(addDaysAndFormat(15));
  const [gstRate, setGstRate] = useState<number>(18);
  const [terms, setTerms] = useState(
    "1. 50% Advance with Purchase Order, balance payment against dispatch.\n2. Plate & Die charges included for order runs exceeding 50,000 cartons.\n3. Delivery within 7-8 working days from digital PDF artwork approval."
  );

  const [lineItems, setLineItems] = useState<QuotationLineItem[]>([
    {
      id: "qli-1",
      jobContext: "Paracetamol 500mg Drip-Off Mono Carton",
      specs: 'Size: 115x45x35 mm | 300 GSM Cyber XL Pac FBB | 5 Colors (CMYK+072C) | Drip-Off UV | Die Cut & Side Pasted',
      quantity: 50000,
      unit: "Cartons",
      rate: 2.35,
      amount: 117500,
    },
    {
      id: "qli-2",
      jobContext: "Paracetamol 650mg Blister Outer Carton",
      specs: 'Size: 130x55x40 mm | 300 GSM FBB | 4 Colors CMYK | Gloss Aqueous Coating | Auto Lock Pasted',
      quantity: 30000,
      unit: "Cartons",
      rate: 2.65,
      amount: 79500,
    },
  ]);

  const currentCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const subtotal = lineItems.reduce((acc, curr) => acc + curr.amount, 0);
  const gstAmount = Math.round((subtotal * gstRate) / 100);
  const grandTotal = subtotal + gstAmount;

  const handleAddLine = () => {
    const newLine: QuotationLineItem = {
      id: `qli-${Date.now()}`,
      jobContext: "Custom Mono Carton Packaging",
      specs: "300 GSM FBB | 4-Color Process CMYK | Thermal Lamination | Automatic Die Punching & Pasting",
      quantity: 25000,
      unit: "Cartons",
      rate: 2.80,
      amount: 70000,
    };
    setLineItems([...lineItems, newLine]);
  };

  const handleRemoveLine = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((l) => l.id !== id));
  };

  const handleUpdateLine = (id: string, field: keyof QuotationLineItem, value: any) => {
    setLineItems(
      lineItems.map((li) => {
        if (li.id === id) {
          const updated = { ...li, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount = Number(updated.quantity) * Number(updated.rate);
          }
          return updated;
        }
        return li;
      })
    );
  };

  const handleSaveAndGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const count = quotations.length + 522;
    const quoteNum = `QT-2026-0${count}`;

    const newQuote = createQuotation({
      quoteNumber: quoteNum,
      customerId: selectedCustomerId,
      customerName: currentCustomer.companyName,
      contactPerson,
      quoteDate,
      validUntil,
      gstRate,
      lineItems,
      subtotal,
      gstAmount,
      grandTotal,
      terms,
      status: "Sent",
    });

    openPrintModal("quote", newQuote);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Sales Estimation & Proposals</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Commercial Quotation Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create professional B2B packaging cost estimates with technical specifications, volume rates, and GST calculations.
          </p>
        </div>

        {/* Existing Quotations summary */}
        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-right">
          <div className="text-[10px] uppercase font-bold text-emerald-700 font-mono">
            Total Quotations
          </div>
          <div className="text-lg font-extrabold text-emerald-950 font-mono">
            {quotations.length} Active
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSaveAndGenerate} className="space-y-6">
        {/* Customer & Parameters Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
            Client & Commercial Terms
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Select Customer *
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  const cust = customers.find((c) => c.id === e.target.value);
                  if (cust) setContactPerson(cust.contactPerson);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.code}] {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Attention / Contact Person
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Applicable GST Rate (%)
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option value={0}>0% (Tax Exempt)</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18% (Standard Packaging)</option>
                <option value={28}>28%</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Quotation Date
              </label>
              <input
                type="text"
                value={quoteDate}
                onChange={(e) => setQuoteDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Offer Valid Until
              </label>
              <input
                type="text"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold text-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* Estimated Scope Line Items */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Estimated Packaging Scope & Unit Pricing
            </h3>
            <button
              type="button"
              onClick={handleAddLine}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Add Scope Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {lineItems.map((li, idx) => (
              <div
                key={li.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Item #{idx + 1}
                  </span>
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(li.id)}
                      className="p-1 text-slate-400 hover:text-red-700 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Job / Product Name
                    </label>
                    <input
                      type="text"
                      value={li.jobContext}
                      onChange={(e) => handleUpdateLine(li.id, "jobContext", e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Technical Specs (Size, GSM, Inks, Finishing)
                    </label>
                    <input
                      type="text"
                      value={li.specs}
                      onChange={(e) => handleUpdateLine(li.id, "specs", e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Quantity (Cartons)
                    </label>
                    <input
                      type="number"
                      value={li.quantity}
                      onChange={(e) => handleUpdateLine(li.id, "quantity", Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Unit Rate (₹ / pc)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={li.rate}
                      onChange={(e) => handleUpdateLine(li.id, "rate", Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Total Item Amount (₹)
                    </label>
                    <div className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 text-right">
                      ₹{li.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Terms and Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
            <div className="md:col-span-7">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Quotation & Estimation Terms
              </label>
              <textarea
                rows={4}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-mono"
              />
            </div>

            <div className="md:col-span-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Total Scope Amount:</span>
                <span className="font-mono font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>GST ({gstRate}%):</span>
                <span className="font-mono font-bold text-slate-900">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex justify-between items-center text-sm font-extrabold text-emerald-950">
                <span>Combined Estimated Total:</span>
                <span className="font-mono text-base font-black text-emerald-900">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Save & Generate */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-7 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>Save & Generate Printable Quotation</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
