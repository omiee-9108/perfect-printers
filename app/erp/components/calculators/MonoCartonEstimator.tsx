"use client";

import React, { useState } from "react";
import { useErp } from "../../context/ErpContext";
import { Sparkles, ArrowRight } from "lucide-react";

export default function MonoCartonEstimator() {
  const { setActiveTab } = useErp();

  // SECTION G: FLAGSHIP MONO CARTON COST ESTIMATOR
  const [mcJobName, setMcJobName] = useState("Paracetamol 500mg Drip-Off Mono Carton");
  const [mcCartonQty, setMcCartonQty] = useState<number>(50000);
  const [mcUps, setMcUps] = useState<number>(12);
  const [mcBoardGsm, setMcBoardGsm] = useState<number>(300);
  const [mcBoardRatePerKg, setMcBoardRatePerKg] = useState<number>(95);
  const [mcBoardLengthIn, setMcBoardLengthIn] = useState<number>(40);
  const [mcBoardWidthIn, setMcBoardWidthIn] = useState<number>(28);
  const [mcBoardWastagePercent, setMcBoardWastagePercent] = useState<number>(4);

  // Section 1: CTP
  const [secCtpEnabled, setSecCtpEnabled] = useState(true);
  const [mcNumColors, setMcNumColors] = useState<number>(5); // CMYK + Spot Drip-off
  const [mcPlatesPerColor, setMcPlatesPerColor] = useState<number>(1);
  const [mcPlateCost, setMcPlateCost] = useState<number>(450); // ₹ / plate

  // Section 2: Printing
  const [secPrintEnabled, setSecPrintEnabled] = useState(true);
  const [mcPressHourlyRate, setMcPressHourlyRate] = useState<number>(1800); // ₹ / hour
  const [mcPressSpeedImp, setMcPressSpeedImp] = useState<number>(6500); // impressions / hr
  const [mcMakereadySheets, setMcMakereadySheets] = useState<number>(250);

  // Section 3: Post-Printing / Surface Finishes
  const [secPostPrintEnabled, setSecPostPrintEnabled] = useState(true);
  const [mcLamEnabled, setMcLamEnabled] = useState(true);
  const [mcLamRatePerSheet, setMcLamRatePerSheet] = useState<number>(0.85); // ₹ / sheet
  const [mcUvEnabled, setMcUvEnabled] = useState(true);
  const [mcUvRatePerSheet, setMcUvRatePerSheet] = useState<number>(1.25); // ₹ / sheet

  // Section 4: Punching / Die-Cutting
  const [secPunchEnabled, setSecPunchEnabled] = useState(true);
  const [mcDieCost, setMcDieCost] = useState<number>(3500);
  const [mcDieAmortizeJobs, setMcDieAmortizeJobs] = useState<number>(1); // 1 = full die cost on this job
  const [mcPunchMachineRate, setMcPunchMachineRate] = useState<number>(900); // ₹ / hr
  const [mcPunchSpeed, setMcPunchSpeed] = useState<number>(4500); // sheets / hr

  // Section 5: Pasting & Gluing
  const [secPasteEnabled, setSecPasteEnabled] = useState(true);
  const [mcPasteRate, setMcPasteRate] = useState<number>(650); // ₹ / hr
  const [mcPasteSpeed, setMcPasteSpeed] = useState<number>(25000); // cartons / hr
  const [mcGlueCostTotal, setMcGlueCostTotal] = useState<number>(1200);

  // Commercials
  const [mcMarginPercent, setMcMarginPercent] = useState<number>(18);

  // Core Math Calculations
  const safeMcUps = Math.max(1, mcUps || 1);
  const safeMcCartonQty = Math.max(1, mcCartonQty || 1);
  const rawSheetsRequired = Math.ceil(safeMcCartonQty / safeMcUps);
  const totalSheetsWithBuffer =
    Math.ceil(rawSheetsRequired * (1 + (mcBoardWastagePercent || 0) / 100)) +
    (secPrintEnabled ? mcMakereadySheets || 0 : 0);

  // Board Weight in KG = (L(in) * W(in) * GSM * Sheets) / 3,100,000 (Industry Standard Formula)
  const totalBoardWeightKg =
    (mcBoardLengthIn * mcBoardWidthIn * mcBoardGsm * totalSheetsWithBuffer) / 3100000;
  const totalBoardCost = totalBoardWeightKg * mcBoardRatePerKg;

  // CTP Total
  const ctpTotal = secCtpEnabled ? mcNumColors * mcPlatesPerColor * mcPlateCost : 0;

  // Print Run Total
  const safePressSpeed = Math.max(100, mcPressSpeedImp || 1000);
  const printHours = totalSheetsWithBuffer / safePressSpeed;
  const printTotal = secPrintEnabled ? Math.max(1, printHours) * mcPressHourlyRate : 0;

  // Post Print Total
  const lamCost = mcLamEnabled ? totalSheetsWithBuffer * mcLamRatePerSheet : 0;
  const uvCostTotal = mcUvEnabled ? totalSheetsWithBuffer * mcUvRatePerSheet : 0;
  const postPrintTotal = secPostPrintEnabled ? lamCost + uvCostTotal : 0;

  // Punching Total
  const safePunchSpeed = Math.max(100, mcPunchSpeed || 1000);
  const safeDieAmortize = Math.max(1, mcDieAmortizeJobs || 1);
  const punchHours = totalSheetsWithBuffer / safePunchSpeed;
  const punchTotal = secPunchEnabled
    ? mcDieCost / safeDieAmortize + Math.max(1, punchHours) * mcPunchMachineRate
    : 0;

  // Pasting Total
  const safePasteSpeed = Math.max(100, mcPasteSpeed || 1000);
  const pasteHours = safeMcCartonQty / safePasteSpeed;
  const pasteTotal = secPasteEnabled
    ? Math.max(1, pasteHours) * mcPasteRate + mcGlueCostTotal
    : 0;

  const monoCartonGrandTotal =
    totalBoardCost + ctpTotal + printTotal + postPrintTotal + punchTotal + pasteTotal;
  const costPerCarton = monoCartonGrandTotal / safeMcCartonQty;
  const sellingPricePerCarton = costPerCarton * (1 + mcMarginPercent / 100);
  const totalJobValueWithMargin = sellingPricePerCarton * safeMcCartonQty;

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Breadcrumb */}
      <div className="bg-emerald-900 text-white p-4 rounded-2xl flex items-center justify-between overflow-x-auto shadow-md">
        <div className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
          Mono Carton Pipeline:
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-semibold">
          <span className="bg-emerald-800 px-2.5 py-1 rounded">1. CTP Plates</span>
          <span>➔</span>
          <span className="bg-emerald-800 px-2.5 py-1 rounded">2. Offset Print</span>
          <span>➔</span>
          <span className="bg-emerald-800 px-2.5 py-1 rounded">3. Post-Print Lamination/UV</span>
          <span>➔</span>
          <span className="bg-emerald-800 px-2.5 py-1 rounded">4. Die Punching</span>
          <span>➔</span>
          <span className="bg-emerald-800 px-2.5 py-1 rounded">5. Auto Pasting</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 5 Configurable Pipeline Sections */}
        <div className="lg:col-span-8 space-y-4">
          {/* Core Job & Board Specs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Job Context & Substrate Selection
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Description</label>
                <input
                  type="text"
                  value={mcJobName}
                  onChange={(e) => setMcJobName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Carton Quantity</label>
                <input
                  type="number"
                  value={mcCartonQty}
                  onChange={(e) => setMcCartonQty(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cartons / Ups per Sheet</label>
                <input
                  type="number"
                  value={mcUps}
                  onChange={(e) => setMcUps(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sheet Size (Inches)</label>
                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    value={mcBoardWidthIn}
                    onChange={(e) => setMcBoardWidthIn(Number(e.target.value))}
                    className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <span>×</span>
                  <input
                    type="number"
                    value={mcBoardLengthIn}
                    onChange={(e) => setMcBoardLengthIn(Number(e.target.value))}
                    className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Board GSM</label>
                <input
                  type="number"
                  value={mcBoardGsm}
                  onChange={(e) => setMcBoardGsm(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Board Cost (₹/kg)</label>
                <input
                  type="number"
                  value={mcBoardRatePerKg}
                  onChange={(e) => setMcBoardRatePerKg(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-emerald-800 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Wastage Buffer (%)</label>
                <input
                  type="number"
                  value={mcBoardWastagePercent}
                  onChange={(e) => setMcBoardWastagePercent(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-xs font-mono text-emerald-950 flex items-center justify-between">
              <span>
                Required Board Weight: {Math.round(totalBoardWeightKg).toLocaleString()} kg ({totalSheetsWithBuffer.toLocaleString()} sheets)
              </span>
              <span className="font-bold text-emerald-900">Board Cost: ₹{Math.round(totalBoardCost).toLocaleString()}</span>
            </div>
          </div>

          {/* SECTION 1: CTP */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={secCtpEnabled}
                  onChange={(e) => setSecCtpEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-900">
                  1. CTP – Computer to Plate Pre-Press
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800">
                Section Total: ₹{ctpTotal.toLocaleString()}
              </span>
            </div>

            {secCtpEnabled && (
              <div className="grid grid-cols-3 gap-3 text-xs pt-2">
                <div>
                  <label className="block text-slate-600 mb-1">No. of Colors</label>
                  <input
                    type="number"
                    value={mcNumColors}
                    onChange={(e) => setMcNumColors(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Plates / Color</label>
                  <input
                    type="number"
                    value={mcPlatesPerColor}
                    onChange={(e) => setMcPlatesPerColor(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Cost / Plate (₹)</label>
                  <input
                    type="number"
                    value={mcPlateCost}
                    onChange={(e) => setMcPlateCost(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: PRINTING */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={secPrintEnabled}
                  onChange={(e) => setSecPrintEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-900">
                  2. Offset Printing Machine Run
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800">
                Section Total: ₹{Math.round(printTotal).toLocaleString()}
              </span>
            </div>

            {secPrintEnabled && (
              <div className="grid grid-cols-3 gap-3 text-xs pt-2">
                <div>
                  <label className="block text-slate-600 mb-1">Machine Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={mcPressHourlyRate}
                    onChange={(e) => setMcPressHourlyRate(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Press Speed (imp/hr)</label>
                  <input
                    type="number"
                    value={mcPressSpeedImp}
                    onChange={(e) => setMcPressSpeedImp(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Make-Ready Sheets</label>
                  <input
                    type="number"
                    value={mcMakereadySheets}
                    onChange={(e) => setMcMakereadySheets(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: POST PRINTING */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={secPostPrintEnabled}
                  onChange={(e) => setSecPostPrintEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-900">
                  3. Post-Printing Surface Finishes
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800">
                Section Total: ₹{Math.round(postPrintTotal).toLocaleString()}
              </span>
            </div>

            {secPostPrintEnabled && (
              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mcLamEnabled}
                      onChange={(e) => setMcLamEnabled(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-emerald-600"
                    />
                    <span className="font-bold text-slate-800">Thermal Lamination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Rate/sheet (₹):</span>
                    <input
                      type="number"
                      step="0.05"
                      value={mcLamRatePerSheet}
                      onChange={(e) => setMcLamRatePerSheet(Number(e.target.value))}
                      className="w-20 p-1 bg-white border rounded font-mono text-right"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mcUvEnabled}
                      onChange={(e) => setMcUvEnabled(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-emerald-600"
                    />
                    <span className="font-bold text-slate-800">Spot UV Drip-off</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Rate/sheet (₹):</span>
                    <input
                      type="number"
                      step="0.05"
                      value={mcUvRatePerSheet}
                      onChange={(e) => setMcUvRatePerSheet(Number(e.target.value))}
                      className="w-20 p-1 bg-white border rounded font-mono text-right"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: PUNCHING / DIE CUTTING */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={secPunchEnabled}
                  onChange={(e) => setSecPunchEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <span className="text-xs font-bold text-slate-900">
                  4. Punching & Die-Cutting
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800">
                Section Total: ₹{Math.round(punchTotal).toLocaleString()}
              </span>
            </div>

            {secPunchEnabled && (
              <div className="grid grid-cols-4 gap-3 text-xs pt-2">
                <div>
                  <label className="block text-slate-600 mb-1">Die Cost (₹)</label>
                  <input
                    type="number"
                    value={mcDieCost}
                    onChange={(e) => setMcDieCost(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Amortize (Jobs)</label>
                  <input
                    type="number"
                    value={mcDieAmortizeJobs}
                    onChange={(e) => setMcDieAmortizeJobs(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Machine (₹/hr)</label>
                  <input
                    type="number"
                    value={mcPunchMachineRate}
                    onChange={(e) => setMcPunchMachineRate(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Speed (imp/hr)</label>
                  <input
                    type="number"
                    value={mcPunchSpeed}
                    onChange={(e) => setMcPunchSpeed(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: PASTING & GLUING */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={secPasteEnabled}
                  onChange={(e) => setSecPasteEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <span className="text-xs font-bold text-slate-900">
                  5. Folder Gluer Pasting & Packaging
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800">
                Section Total: ₹{Math.round(pasteTotal).toLocaleString()}
              </span>
            </div>

            {secPasteEnabled && (
              <div className="grid grid-cols-3 gap-3 text-xs pt-2">
                <div>
                  <label className="block text-slate-600 mb-1">Gluer Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={mcPasteRate}
                    onChange={(e) => setMcPasteRate(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Speed (cartons/hr)</label>
                  <input
                    type="number"
                    value={mcPasteSpeed}
                    onChange={(e) => setMcPasteSpeed(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Adhesive Cost (₹)</label>
                  <input
                    type="number"
                    value={mcGlueCostTotal}
                    onChange={(e) => setMcGlueCostTotal(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Summary & Quote Bridge */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 sticky top-24">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Total Cost & Pricing Summary
            </h3>
          </div>

          {/* Sub-total Breakdown Table */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Substrate / Board Cost:</span>
              <span className="font-mono font-bold text-slate-900">₹{Math.round(totalBoardCost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pre-Press (CTP):</span>
              <span className="font-mono font-bold text-slate-900">₹{Math.round(ctpTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Offset Press Run:</span>
              <span className="font-mono font-bold text-slate-900">₹{Math.round(printTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Post-Print Finishing:</span>
              <span className="font-mono font-bold text-slate-900">₹{Math.round(postPrintTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Die Punching:</span>
              <span className="font-mono font-bold text-slate-900">₹{Math.round(punchTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pasting & Assembly:</span>
              <span className="font-mono font-bold text-slate-900">₹{Math.round(pasteTotal).toLocaleString()}</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Factory Production Cost:</span>
              <span className="font-mono text-base font-extrabold text-slate-900">
                ₹{Math.round(monoCartonGrandTotal).toLocaleString()}
              </span>
            </div>
            <div className="text-[11px] font-mono text-emerald-700 font-bold text-right">
              ₹{costPerCarton.toFixed(3)} per carton
            </div>
          </div>

          {/* Margin Slider */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span>Target Profit Margin (%):</span>
              <span className="font-mono text-emerald-700 text-sm">{mcMarginPercent}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={mcMarginPercent}
              onChange={(e) => setMcMarginPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: "#059669" }}
            />
          </div>

          {/* Commercial Quote Value */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5 text-xs">
            <div className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
              Recommended Selling Rate
            </div>
            <div className="text-xl font-black font-mono text-emerald-950">
              ₹{sellingPricePerCarton.toFixed(2)} <span className="text-xs font-normal text-emerald-700">/ carton</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-800">
              Total Order Value: <span className="font-bold">₹{Math.round(totalJobValueWithMargin).toLocaleString()}</span>
            </div>
          </div>

          {/* Action Bridge to Quotation Module */}
          <button
            onClick={() => setActiveTab("quotation")}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102"
          >
            <span>Export Directly to Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
