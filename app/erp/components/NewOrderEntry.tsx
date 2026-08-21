"use client";

import React, { useState, useEffect } from "react";
import { useErp } from "../context/ErpContext";
import { addDaysAndFormat } from "../utils/date";
import {
  PlusCircle,
  Building2,
  CheckCircle,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Edit3,
  ListFilter,
} from "lucide-react";

export default function NewOrderEntry() {
  const { customers, jobs, addJob, createOrder, setActiveTab, currentUser } = useErp();

  // Mode: "existing" or "manual"
  const [entryMode, setEntryMode] = useState<"existing" | "manual">("existing");

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ""
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "");
  const [quantity, setQuantity] = useState<number>(50000);
  const [dueDate, setDueDate] = useState<string>(addDaysAndFormat(7));
  const [instructions, setInstructions] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>("");

  // Manual Job Code Form Fields (Admin direct entry)
  const [manualJobCode, setManualJobCode] = useState<string>("");
  const [manualProductName, setManualProductName] = useState<string>("");
  const [manualSheetSize, setManualSheetSize] = useState<string>('28" × 40" (710 × 1020 mm)');
  const [manualBoardType, setManualBoardType] = useState<string>("FBB Cyber XL Pac");
  const [manualGsm, setManualGsm] = useState<number>(300);
  const [manualColors, setManualColors] = useState<string>("CMYK + Spot Drip-off");
  const [manualNumColors, setManualNumColors] = useState<number>(5);
  const [manualUps, setManualUps] = useState<number>(8);
  const [manualDieCode, setManualDieCode] = useState<string>("DIE-NEW-01");

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

  // Set default manual job code suggestion when customer changes
  useEffect(() => {
    if (currentCustomer && !manualJobCode) {
      setManualJobCode(`JC-${currentCustomer.code || "PP"}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [currentCustomer]);

  const effectiveUps = entryMode === "manual" ? Math.max(1, manualUps) : Math.max(1, currentJob?.ups || 1);
  const effectiveNumColors = entryMode === "manual" ? manualNumColors : (currentJob?.numColors || 4);
  const safeQty = Math.max(1, Number(quantity) || 1);
  const makereadyBuffer = effectiveNumColors >= 5 ? 350 : 250;
  const calculatedSheets = Math.ceil(safeQty / effectiveUps) + makereadyBuffer;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || quantity <= 0) return;

    let targetJobId = selectedJobId;

    // If Admin is entering manual job code, register the job first
    if (entryMode === "manual") {
      if (!manualJobCode.trim() || !manualProductName.trim()) {
        alert("Please enter both Manual Job Code and Product Name.");
        return;
      }

      const generatedId = `job-${Date.now()}`;
      addJob({
        jobCode: manualJobCode.trim().toUpperCase(),
        productName: manualProductName.trim(),
        customerId: currentCustomer.id,
        customerCode: currentCustomer.code,
        customerName: currentCustomer.companyName,
        sheetSize: manualSheetSize,
        sheetLengthInches: 40,
        sheetWidthInches: 28,
        boardType: manualBoardType,
        boardGsm: Number(manualGsm),
        colors: manualColors,
        numColors: Number(manualNumColors),
        sides: 1,
        ups: Number(manualUps),
        dieCode: manualDieCode,
        artworkUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
        postPressProcesses: ["Thermal Gloss Lamination", "Die Punching", "Pasting"],
      });

      targetJobId = generatedId;
    }

    const newOrd = createOrder({
      customerId: selectedCustomerId,
      jobId: targetJobId,
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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Admin Direct Entry</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Create New Production Order
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Book incoming packaging orders directly into the press floor pipeline with auto-calculated board allocation.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("job-order")}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
        >
          Cancel & Back
        </button>
      </div>

      {isSuccess ? (
        /* Success Screen */
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-10 text-center space-y-5 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/50">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-white">
            Order Created Successfully!
          </h2>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl max-w-md mx-auto text-xs space-y-1 font-mono text-slate-300">
            <div>
              Order ID: <span className="font-bold text-cyan-400">{createdOrderId}</span>
            </div>
            <div>
              Client: <span className="font-bold text-white">{currentCustomer?.companyName}</span>
            </div>
            <div>
              Job Code: <span className="font-bold text-amber-400">{entryMode === "manual" ? manualJobCode.toUpperCase() : currentJob?.jobCode}</span> ({quantity.toLocaleString()} pcs)
            </div>
            <div className="text-emerald-400 font-bold">
              Allocated Sheets: ~{calculatedSheets.toLocaleString()} sheets
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            This job has been placed into the <strong>Pending Stage</strong> and is immediately visible on the shop floor board.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsSuccess(false);
                setQuantity(50000);
                setInstructions("");
                setManualJobCode("");
                setManualProductName("");
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700"
            >
              Create Another Order
            </button>
            <button
              onClick={() => setActiveTab("job-order")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                1. Customer & Job Assignment
              </div>

              {/* Mode Switcher: Existing vs Manual Job Code */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setEntryMode("existing")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    entryMode === "existing"
                      ? "bg-slate-800 text-cyan-300 shadow-sm border border-slate-700"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Select Registered Job</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEntryMode("manual")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    entryMode === "manual"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-extrabold"
                      : "text-cyan-400 hover:text-white"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>✍️ Manual Job Code (Admin)</span>
                </button>
              </div>
            </div>

            {/* Customer Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>SELECT CLIENT / CUSTOMER *</span>
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500 shadow-sm"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.code})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Credit Terms: {currentCustomer?.creditTerms} | GSTIN: {currentCustomer?.gstin}
              </p>
            </div>

            {/* Mode A: Select from Existing Job Master */}
            {entryMode === "existing" ? (
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>SELECT FROM REGISTERED JOB MASTER *</span>
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500 shadow-sm font-mono"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      [{j.jobCode}] — {j.productName} ({j.customerName})
                    </option>
                  ))}
                </select>

                {/* Job Specs Pill */}
                {currentJob && (
                  <div className="mt-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{currentJob.productName}</span>
                      <span className="font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700">
                        {currentJob.jobCode}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                      <div>Sheet: <strong className="text-slate-200">{currentJob.sheetSize}</strong></div>
                      <div>Board: <strong className="text-slate-200">{currentJob.boardType}</strong> ({currentJob.boardGsm} GSM)</div>
                      <div>Colors: <strong className="text-slate-200">{currentJob.numColors}</strong> ({currentJob.colors})</div>
                      <div>Ups / Die: <strong className="text-slate-200">{currentJob.ups} ups</strong> ({currentJob.dieCode})</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Mode B: Manual Job Code Admin Direct Input */
              <div className="space-y-4 p-5 bg-slate-950 rounded-2xl border border-cyan-500/30">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold text-cyan-300 uppercase font-mono">
                      Manual Job Code Specifications (Admin Given)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Will auto-register into Master Data
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Manual Job Code */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Manual Job Code (Admin Assigned) *
                    </label>
                    <input
                      type="text"
                      required
                      value={manualJobCode}
                      onChange={(e) => setManualJobCode(e.target.value.toUpperCase())}
                      placeholder="e.g. JC-CIPLA-801 or PP-MONO-90"
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-slate-500 font-mono">Quick prefix:</span>
                      {["JC-", "PP-", "PK-", "MC-"].map((prefix) => (
                        <button
                          key={prefix}
                          type="button"
                          onClick={() => setManualJobCode(`${prefix}${manualJobCode.replace(/^(JC-|PP-|PK-|MC-)/, "") || "1001"}`)}
                          className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-cyan-300 rounded hover:bg-slate-700 border border-slate-700"
                        >
                          {prefix}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Product Description / Carton Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={manualProductName}
                      onChange={(e) => setManualProductName(e.target.value)}
                      placeholder="e.g. Azithromycin 500mg Drip-Off Mono Carton"
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Technical Parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-400 mb-1 text-[11px]">Sheet Size</label>
                    <input
                      type="text"
                      value={manualSheetSize}
                      onChange={(e) => setManualSheetSize(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-400 mb-1 text-[11px]">Board & GSM</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={manualBoardType}
                        onChange={(e) => setManualBoardType(e.target.value)}
                        className="w-2/3 p-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                      <input
                        type="number"
                        value={manualGsm}
                        onChange={(e) => setManualGsm(Number(e.target.value))}
                        className="w-1/3 p-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-400 mb-1 text-[11px]">Colors & Sides</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={manualNumColors}
                        onChange={(e) => setManualNumColors(Number(e.target.value))}
                        className="w-1/3 p-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                      />
                      <input
                        type="text"
                        value={manualColors}
                        onChange={(e) => setManualColors(e.target.value)}
                        className="w-2/3 p-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-400 mb-1 text-[11px]">Ups & Die Code</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={manualUps}
                        onChange={(e) => setManualUps(Number(e.target.value))}
                        className="w-1/3 p-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                      />
                      <input
                        type="text"
                        value={manualDieCode}
                        onChange={(e) => setManualDieCode(e.target.value)}
                        className="w-2/3 p-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Quantity, Due Date & Auto Board Calculation */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
              2. Quantity, Target Due Date & Automatic Sheet Calculation
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Order Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  ORDER QUANTITY (PCS) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="500"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold font-mono focus:outline-none focus:border-cyan-500 shadow-sm"
                />
                <div className="flex gap-2 mt-2">
                  {[10000, 25000, 50000, 100000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuantity(preset)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-mono border border-slate-700"
                    >
                      +{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Due Date */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>TARGET DELIVERY DATE *</span>
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 shadow-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Standard Turnaround: 5-7 business days
                </p>
              </div>
            </div>

            {/* Live Board Consumption Calculator Widget */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    Automatic Material Allocation
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Formula: (Quantity ÷ {effectiveUps} ups) + {makereadyBuffer} makeready waste sheets
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  ~{calculatedSheets.toLocaleString()}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Estimated Gross Sheets Required
                </div>
              </div>
            </div>

            {/* Special Shop Floor Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                SPECIAL SHOP-FLOOR INSTRUCTIONS (OPTIONAL)
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Urgent Pharma Batch: Ensure 100% shade matching with approved Delta-E master proof. Use high-speed die-puncher."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 shadow-sm"
              />
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab("job-order")}
              className="px-5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-xl shadow-cyan-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Order into Production Pipeline</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
