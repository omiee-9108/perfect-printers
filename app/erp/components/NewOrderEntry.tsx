"use client";

import React, { useState, useEffect } from "react";
import { useErp } from "../context/ErpContext";
import {
  PlusCircle,
  Building2,
  FileCheck,
  CheckCircle,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function NewOrderEntry() {
  const { customers, jobs, createOrder, setActiveTab } = useErp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ""
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "");
  const [quantity, setQuantity] = useState<number>(50000);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  );
  const [instructions, setInstructions] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>("");

  // Filter jobs by selected customer if available
  const availableJobs = jobs.filter((j) => j.customerId === selectedCustomerId);
  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const currentCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // When customer changes, default to their first job
  useEffect(() => {
    if (availableJobs.length > 0) {
      const match = availableJobs.find((j) => j.id === selectedJobId);
      if (!match) {
        setSelectedJobId(availableJobs[0].id);
      }
    } else if (jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    }
  }, [selectedCustomerId]);

  const safeUps = Math.max(1, currentJob?.ups || 1);
  const safeQty = Math.max(1, Number(quantity) || 1);
  const makereadyBuffer = (currentJob?.numColors || 4) >= 5 ? 350 : 250;
  const calculatedSheets = Math.ceil(safeQty / safeUps) + makereadyBuffer;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedJobId || quantity <= 0) return;

    const newOrd = createOrder({
      customerId: selectedCustomerId,
      jobId: selectedJobId,
      quantity: Number(quantity),
      dueDate,
      instructions,
    });

    setCreatedOrderId(newOrd.id);
    setIsSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Admin Direct Entry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create New Production Order
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Book incoming packaging orders directly into the press floor pipeline with auto-calculated board allocation.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("job-order")}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
        >
          Cancel & Back
        </button>
      </div>

      {isSuccess ? (
        /* Success Screen */
        <div className="bg-white border border-emerald-200 rounded-3xl p-10 text-center space-y-5 shadow-lg animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Order Created Successfully!
          </h2>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto text-xs space-y-1 font-mono">
            <div>
              Order ID: <span className="font-bold text-slate-950">{createdOrderId}</span>
            </div>
            <div>
              Client: <span className="font-bold">{currentCustomer?.companyName}</span>
            </div>
            <div>
              Job: <span className="font-bold">{currentJob?.jobCode}</span> ({quantity.toLocaleString()} pcs)
            </div>
            <div className="text-emerald-700">
              Allocated Sheets: ~{calculatedSheets.toLocaleString()} sheets
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            This job has been placed into the <strong>Pending Stage</strong> and is visible on the shop floor board.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsSuccess(false);
                setQuantity(50000);
                setInstructions("");
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Create Another Order
            </button>
            <button
              onClick={() => setActiveTab("job-order")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5"
            >
              <span>View Production Board</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Direct Entry Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1 & 2 Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              Step 1 & 2: Select Customer & Pre-Defined Job Code
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Customer Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Step 1: Select Customer *</span>
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 shadow-sm"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.code}] {c.companyName} • {c.location}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Credit Terms: {currentCustomer?.creditTerms} | GSTIN: {currentCustomer?.gstin}
                </p>
              </div>

              {/* Job Code Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Step 2: Select Job Code *</span>
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold font-mono focus:outline-none focus:border-emerald-500 shadow-sm"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.jobCode} — {j.productName}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-emerald-700 mt-1 font-mono font-semibold">
                  Linked to: {currentJob?.customerName}
                </p>
              </div>
            </div>

            {/* Read-Only Auto-Populated Info Card */}
            {currentJob && (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-mono font-bold text-emerald-950 uppercase tracking-wider">
                      Auto-Populated Specification Card (Read-Only)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                    MASTER VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Company</div>
                    <div className="font-bold text-slate-900 mt-0.5 truncate">{currentCustomer?.companyName}</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Sheet Size</div>
                    <div className="font-bold text-slate-900 mt-0.5">{currentJob.sheetSize}</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Substrate / Board</div>
                    <div className="font-bold text-slate-900 mt-0.5">{currentJob.boardType}</div>
                    <div className="text-[10px] font-mono text-emerald-700 font-semibold">{currentJob.boardGsm} GSM</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                    <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Colors & Ups</div>
                    <div className="font-bold text-slate-900 mt-0.5">{currentJob.numColors} Colors ({currentJob.ups} ups)</div>
                    <div className="text-[10px] text-slate-500 truncate">{currentJob.colors}</div>
                  </div>
                </div>

                {/* Artwork Reference Thumbnail & Post-press specs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-emerald-200/60 text-xs">
                  <div className="flex items-center gap-2">
                    {currentJob.artworkUrl && (
                      <img
                        src={currentJob.artworkUrl}
                        alt="Artwork Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-emerald-300"
                      />
                    )}
                    <div>
                      <div className="font-bold text-emerald-950">Die No: {currentJob.dieCode}</div>
                      <div className="text-[11px] text-emerald-800">
                        Processes: {currentJob.postPressProcesses.join(" • ")}
                      </div>
                    </div>
                  </div>

                  {currentJob.artworkUrl && (
                    <a
                      href={currentJob.artworkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline"
                    >
                      <span>Inspect Artwork</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quantity & Operational Overrides Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              Step 3: Order Quantity, Schedule & Instructions
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Order Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Order Quantity (Total Finished Cartons) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={500}
                    step={500}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                    Pcs
                  </span>
                </div>
                
                {/* Live Sheet Calculator Pill */}
                <div className="mt-2 p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-600">Calculated Sheets Required:</span>
                  <span className="font-bold text-emerald-800 text-sm">
                    {calculatedSheets.toLocaleString()} Sheets
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  Formula: ({quantity.toLocaleString()} pcs ÷ {safeUps} ups) + {makereadyBuffer} make-ready buffer
                </p>
              </div>

              {/* Delivery Due Date */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Target Delivery Due Date *</span>
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. 28 Aug 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Standard packaging SLA: 5-8 business days from approval
                </p>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Special Press / Packing Instructions (Optional Overrides)
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Extra spot UV gloss on batch number window. Pack in corrugated cartons of 500 pcs each with moisture barrier poly liner..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("job-order")}
                className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-7 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Create Production Order</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
