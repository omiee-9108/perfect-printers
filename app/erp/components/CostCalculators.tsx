"use client";

import React, { useState } from "react";
import { useErp } from "../context/ErpContext";
import {
  Calculator,
  Droplet,
  Zap,
  Film,
  Layers,
  Sparkles,
  Sun,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
  CheckCircle2,
  Sliders,
  DollarSign,
  Package,
} from "lucide-react";

export default function CostCalculators() {
  const { setActiveTab } = useErp();

  const [activeTool, setActiveTool] = useState<
    "spanks" | "power" | "film" | "gum" | "uv" | "aqueous" | "monocarton"
  >("monocarton");

  // ==========================================
  // TOOL A: SPANKS INK FORMULA
  // ==========================================
  const [spanksWidth, setSpanksWidth] = useState<number>(28);
  const [spanksHeight, setSpanksHeight] = useState<number>(40);
  const [spanksQty, setSpanksQty] = useState<number>(20000);
  const [spanksSides, setSpanksSides] = useState<number>(1);
  const [spanksStockMultiplier, setSpanksStockMultiplier] = useState<number>(1.0); // S1
  const [spanksProcessMultiplier, setSpanksProcessMultiplier] = useState<number>(1.0); // P
  const [spanksCoverageArea, setSpanksCoverageArea] = useState<number>(25); // A (%)
  const [spanksColors, setSpanksColors] = useState<number>(4); // N
  const [spanksKindMultiplier, setSpanksKindMultiplier] = useState<number>(1.0); // K
  const [spanksSpecificGravity, setSpanksSpecificGravity] = useState<number>(1.05); // S2

  // Formula: S × P × A × N × K × S ÷ 353 * (Width * Height * Qty * Sides / 1,000,000)
  // Standard SPANKS: Area in sq inches * coverage * multipliers / 353,000
  const spanksTotalAreaSqIn = spanksWidth * spanksHeight * spanksQty * spanksSides;
  const spanksInkKg =
    (spanksTotalAreaSqIn *
      spanksStockMultiplier *
      spanksProcessMultiplier *
      (spanksCoverageArea / 100) *
      spanksColors *
      spanksKindMultiplier *
      spanksSpecificGravity) /
    353000;

  // ==========================================
  // TOOL B: POWER CONSUMPTION
  // ==========================================
  const [powerSupply, setPowerSupply] = useState<"1-ph" | "3-ph">("3-ph");
  const [powerVoltage, setPowerVoltage] = useState<number>(415);
  const [powerCurrent, setPowerCurrent] = useState<number>(45);
  const [powerFactor, setPowerFactor] = useState<number>(0.85);
  const [powerHoursPerDay, setPowerHoursPerDay] = useState<number>(12);
  const [powerDaysPerMonth, setPowerDaysPerMonth] = useState<number>(26);
  const [electricityRate, setElectricityRate] = useState<number>(11.5); // ₹/kWh

  // Presets
  const applyPowerPreset = (type: string) => {
    switch (type) {
      case "press":
        setPowerSupply("3-ph");
        setPowerVoltage(415);
        setPowerCurrent(65);
        setPowerFactor(0.88);
        break;
      case "cutter":
        setPowerSupply("3-ph");
        setPowerVoltage(415);
        setPowerCurrent(25);
        setPowerFactor(0.82);
        break;
      case "ctp":
        setPowerSupply("1-ph");
        setPowerVoltage(230);
        setPowerCurrent(16);
        setPowerFactor(0.92);
        break;
      case "compressor":
        setPowerSupply("3-ph");
        setPowerVoltage(415);
        setPowerCurrent(30);
        setPowerFactor(0.8);
        break;
      case "office":
        setPowerSupply("1-ph");
        setPowerVoltage(230);
        setPowerCurrent(10);
        setPowerFactor(0.95);
        break;
    }
  };

  const powerKw =
    powerSupply === "3-ph"
      ? (1.732 * powerVoltage * powerCurrent * powerFactor) / 1000
      : (powerVoltage * powerCurrent * powerFactor) / 1000;
  const powerMonthlyKwh = powerKw * powerHoursPerDay * powerDaysPerMonth;
  const powerMonthlyCost = powerMonthlyKwh * electricityRate;

  // ==========================================
  // TOOL C: LAMINATION FILM
  // ==========================================
  const [filmSheetLength, setFilmSheetLength] = useState<number>(40); // in
  const [filmSheetWidth, setFilmSheetWidth] = useState<number>(28); // in
  const [filmSheets, setFilmSheets] = useState<number>(10000);
  const [filmSides, setFilmSides] = useState<number>(1);
  const [filmDensity, setFilmDensity] = useState<number>(0.91); // BOPP
  const [filmMicron, setFilmMicron] = useState<number>(15); // microns
  const [filmWastagePercent, setFilmWastagePercent] = useState<number>(5);
  const [filmRatePerKg, setFilmRatePerKg] = useState<number>(185);

  const filmAreaSqM =
    (filmSheetLength * 0.0254 * (filmSheetWidth * 0.0254) * filmSheets * filmSides * (1 + filmWastagePercent / 100));
  const filmTotalWeightKg = (filmAreaSqM * filmMicron * filmDensity) / 1000;
  const filmTotalCost = filmTotalWeightKg * filmRatePerKg;

  // ==========================================
  // TOOL D: LAMINATION GUM
  // ==========================================
  const [gumType, setGumType] = useState<"water" | "solvent-free" | "solvent">("water");
  const [gumDcwGsm, setGumDcwGsm] = useState<number>(4.5); // Dry coat weight gsm
  const [gumSolidContent, setGumSolidContent] = useState<number>(48); // %
  const [gumWastage, setGumWastage] = useState<number>(6); // %
  const [gumRatePerKg, setGumRatePerKg] = useState<number>(145);

  const gumTotalSqM = (filmSheetLength * 0.0254 * (filmSheetWidth * 0.0254) * filmSheets * filmSides);
  const gumDryWeightKg = (gumTotalSqM * gumDcwGsm * (1 + gumWastage / 100)) / 1000;
  const gumWetWeightKg = gumDryWeightKg / (gumSolidContent / 100);
  const gumTotalCost = gumWetWeightKg * gumRatePerKg;

  // ==========================================
  // TOOL E: UV COATING
  // ==========================================
  const [uvMethod, setUvMethod] = useState<"roller" | "duct" | "screen">("roller");
  const [uvGsm, setUvGsm] = useState<number>(5.5);
  const [uvCoverage, setUvCoverage] = useState<number>(100);
  const [uvDilutionPercent, setUvDilutionPercent] = useState<number>(5);
  const [uvVarnishRatePerKg, setUvVarnishRatePerKg] = useState<number>(580);

  const uvAreaSqM = (filmSheetLength * 0.0254 * (filmSheetWidth * 0.0254) * filmSheets * (uvCoverage / 100));
  const uvWeightKg = (uvAreaSqM * uvGsm * 1.08) / 1000;
  const uvCost = uvWeightKg * uvVarnishRatePerKg;

  // ==========================================
  // TOOL F: AQUEOUS COATING
  // ==========================================
  const [aqueousGsm, setAqueousGsm] = useState<number>(4.0);
  const [aqueousSolids, setAqueousSolids] = useState<number>(42);
  const [aqueousPasses, setAqueousPasses] = useState<number>(1);
  const [aqueousRatePerKg, setAqueousRatePerKg] = useState<number>(220);

  const aqueousDryKg = (gumTotalSqM * aqueousGsm * aqueousPasses) / 1000;
  const aqueousWetKg = aqueousDryKg / (aqueousSolids / 100);
  const aqueousCost = aqueousWetKg * aqueousRatePerKg;

  // ==========================================
  // TOOL G: FLAGSHIP MONO CARTON COST ESTIMATOR
  // ==========================================
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
  const [mcNumColors, setMcNumColors] = useState<number>(5);
  const [mcPlatesPerColor, setMcPlatesPerColor] = useState<number>(1);
  const [mcPlateCost, setMcPlateCost] = useState<number>(450);

  // Section 2: Printing
  const [secPrintEnabled, setSecPrintEnabled] = useState(true);
  const [mcPressHourlyRate, setMcPressHourlyRate] = useState<number>(1800);
  const [mcPressSpeedImp, setMcPressSpeedImp] = useState<number>(8500);
  const [mcMakereadySheets, setMcMakereadySheets] = useState<number>(250);

  // Section 3: Post Printing
  const [secPostPrintEnabled, setSecPostPrintEnabled] = useState(true);
  const [mcLamEnabled, setMcLamEnabled] = useState(true);
  const [mcLamRatePerSheet, setMcLamRatePerSheet] = useState<number>(1.35);
  const [mcUvEnabled, setMcUvEnabled] = useState(true);
  const [mcUvRatePerSheet, setMcUvRatePerSheet] = useState<number>(2.10);

  // Section 4: Punching / Die Cut
  const [secPunchEnabled, setSecPunchEnabled] = useState(true);
  const [mcDieCost, setMcDieCost] = useState<number>(3500);
  const [mcDieAmortizeJobs, setMcDieAmortizeJobs] = useState<number>(1);
  const [mcPunchMachineRate, setMcPunchMachineRate] = useState<number>(1200);
  const [mcPunchSpeed, setMcPunchSpeed] = useState<number>(6500);

  // Section 5: Pasting & Gluing
  const [secPasteEnabled, setSecPasteEnabled] = useState(true);
  const [mcPasteRate, setMcPasteRate] = useState<number>(950);
  const [mcPasteSpeed, setMcPasteSpeed] = useState<number>(16000); // cartons/hr
  const [mcGlueCostTotal, setMcGlueCostTotal] = useState<number>(1800);

  // Margin slider
  const [mcMarginPercent, setMcMarginPercent] = useState<number>(25);

  // Mono Carton Calculations
  const rawSheetsRequired = Math.ceil(mcCartonQty / mcUps);
  const totalSheetsWithBuffer = Math.ceil(rawSheetsRequired * (1 + mcBoardWastagePercent / 100)) + mcMakereadySheets;
  
  // Sheet weight in kg: (L in * W in * GSM) / (1550 * 1000)
  const singleSheetWeightKg = (mcBoardLengthIn * mcBoardWidthIn * mcBoardGsm) / 1550000;
  const totalBoardWeightKg = totalSheetsWithBuffer * singleSheetWeightKg;
  const totalBoardCost = totalBoardWeightKg * mcBoardRatePerKg;

  // CTP Total
  const ctpTotal = secCtpEnabled ? mcNumColors * mcPlatesPerColor * mcPlateCost : 0;

  // Printing Total
  const printHours = totalSheetsWithBuffer / mcPressSpeedImp;
  const printTotal = secPrintEnabled ? Math.max(1, printHours) * mcPressHourlyRate : 0;

  // Post Print Total
  let postPrintTotal = 0;
  if (secPostPrintEnabled) {
    if (mcLamEnabled) postPrintTotal += totalSheetsWithBuffer * mcLamRatePerSheet;
    if (mcUvEnabled) postPrintTotal += totalSheetsWithBuffer * mcUvRatePerSheet;
  }

  // Punching Total
  const punchHours = totalSheetsWithBuffer / mcPunchSpeed;
  const punchTotal = secPunchEnabled
    ? mcDieCost / mcDieAmortizeJobs + Math.max(1, punchHours) * mcPunchMachineRate
    : 0;

  // Pasting Total
  const pasteHours = mcCartonQty / mcPasteSpeed;
  const pasteTotal = secPasteEnabled
    ? Math.max(1, pasteHours) * mcPasteRate + mcGlueCostTotal
    : 0;

  const monoCartonGrandTotal =
    totalBoardCost + ctpTotal + printTotal + postPrintTotal + punchTotal + pasteTotal;
  const costPerCarton = monoCartonGrandTotal / mcCartonQty;
  const sellingPricePerCarton = costPerCarton * (1 + mcMarginPercent / 100);
  const totalJobValueWithMargin = sellingPricePerCarton * mcCartonQty;

  const tools = [
    { id: "monocarton", label: "Flagship Mono Carton Estimator", icon: Package },
    { id: "spanks", label: "Ink SPANKS Formula", icon: Droplet },
    { id: "power", label: "Power Consumption", icon: Zap },
    { id: "film", label: "Lamination Film", icon: Film },
    { id: "gum", label: "Lamination Gum", icon: Layers },
    { id: "uv", label: "UV Coating", icon: Sun },
    { id: "aqueous", label: "Aqueous Coating", icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Technical Production Estimation Tools</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Printing Press Cost Calculators
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Industry-standard formulas for offset ink SPANKS, factory electrical loads, BOPP film yields, UV coatings, and full mono carton estimates.
          </p>
        </div>
      </div>

      {/* 7 Calculator Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-emerald-950 shadow-sm border border-emerald-300 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-700" : "text-slate-400"}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TOOL 1: FLAGSHIP MONO CARTON COST ESTIMATOR */}
      {/* ============================================================== */}
      {activeTool === "monocarton" && (
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
                  <span>Required Board Weight: {Math.round(totalBoardWeightKg).toLocaleString()} kg ({totalSheetsWithBuffer.toLocaleString()} sheets)</span>
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
      )}

      {/* ============================================================== */}
      {/* TOOL 2: SPANKS INK FORMULA */}
      {/* ============================================================== */}
      {activeTool === "spanks" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase">
                Offset Ink Consumption Formula
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                SPANKS Mathematical Ink Calculator
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-xs text-emerald-900 font-bold">
              Formula: (S × P × A × N × K × S ÷ 353) = Ink (Kg)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sheet Width × Height (in)</label>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  value={spanksWidth}
                  onChange={(e) => setSpanksWidth(Number(e.target.value))}
                  className="w-1/2 p-2 bg-slate-50 border rounded-xl"
                />
                <span>×</span>
                <input
                  type="number"
                  value={spanksHeight}
                  onChange={(e) => setSpanksHeight(Number(e.target.value))}
                  className="w-1/2 p-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Quantity (Copies/Sheets)</label>
              <input
                type="number"
                value={spanksQty}
                onChange={(e) => setSpanksQty(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Printing Sides (1 or 2)</label>
              <select
                value={spanksSides}
                onChange={(e) => setSpanksSides(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-bold font-mono"
              >
                <option value={1}>1-Sided Printing</option>
                <option value={2}>2-Sided Printing</option>
              </select>
            </div>
          </div>

          {/* SPANKS Multipliers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-3 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Stock Type (S)</label>
              <select
                value={spanksStockMultiplier}
                onChange={(e) => setSpanksStockMultiplier(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl"
              >
                <option value={1.0}>Coated FBB Board (1.0)</option>
                <option value={1.2}>Coated Duplex Grey Back (1.2)</option>
                <option value={1.5}>Uncoated Maplitho / Kraft (1.5)</option>
                <option value={0.8}>Met-Pet Polyester Foil (0.8)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Process Type (P)</label>
              <select
                value={spanksProcessMultiplier}
                onChange={(e) => setSpanksProcessMultiplier(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl"
              >
                <option value={1.0}>Sheetfed Conventional Offset (1.0)</option>
                <option value={0.9}>Sheetfed UV Offset (0.9)</option>
                <option value={1.2}>Web Heatset (1.2)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Coverage % (A)</label>
              <input
                type="number"
                value={spanksCoverageArea}
                onChange={(e) => setSpanksCoverageArea(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">No. of Colors (N)</label>
              <input
                type="number"
                value={spanksColors}
                onChange={(e) => setSpanksColors(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
                Estimated Offset Ink Consumption
              </div>
              <div className="text-2xl font-black font-mono text-emerald-950 mt-0.5">
                {spanksInkKg.toFixed(2)} Kg <span className="text-xs font-normal text-emerald-700">Total Offset Inks Required</span>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-emerald-900">
              Per Color Average: ~{(spanksInkKg / spanksColors).toFixed(2)} kg / color
            </div>
          </div>

          {/* Reference Table for Transparency */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>SPANKS Standard Multiplier Reference Table</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-600 font-mono">
              <div><strong>Stock (S):</strong> Coated=1.0, Uncoated=1.5, Met-Pet=0.8</div>
              <div><strong>Kind of Image (K):</strong> Light Text=0.5, Medium=1.0, Heavy Solids=2.0</div>
              <div><strong>Specific Gravity:</strong> Black=1.0, Cyan=1.1, Yellow=1.15, White=1.5</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOOL 3: POWER CONSUMPTION */}
      {/* ============================================================== */}
      {activeTool === "power" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase">
                Plant Electrical MES Calculator
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Pressroom Power & Energy Tariff
              </h3>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 text-xs">
              <button onClick={() => applyPowerPreset("press")} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold">Press (3-Ph)</button>
              <button onClick={() => applyPowerPreset("cutter")} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold">Die Cutter</button>
              <button onClick={() => applyPowerPreset("ctp")} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold">CTP (1-Ph)</button>
              <button onClick={() => applyPowerPreset("compressor")} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold">Compressor</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Supply Phase</label>
              <select
                value={powerSupply}
                onChange={(e) => setPowerSupply(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border rounded-xl font-bold font-mono"
              >
                <option value="3-ph">Three-Phase (415V)</option>
                <option value="1-ph">Single-Phase (230V)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Voltage (V) & Current (A)</label>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  value={powerVoltage}
                  onChange={(e) => setPowerVoltage(Number(e.target.value))}
                  className="w-1/2 p-2 bg-slate-50 border rounded-xl"
                />
                <span>V</span>
                <input
                  type="number"
                  value={powerCurrent}
                  onChange={(e) => setPowerCurrent(Number(e.target.value))}
                  className="w-1/2 p-2 bg-slate-50 border rounded-xl"
                />
                <span>A</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Power Factor: {powerFactor}</label>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.01"
                value={powerFactor}
                onChange={(e) => setPowerFactor(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs pt-3 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Operating Hours / Day</label>
              <input
                type="number"
                value={powerHoursPerDay}
                onChange={(e) => setPowerHoursPerDay(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Working Days / Month</label>
              <input
                type="number"
                value={powerDaysPerMonth}
                onChange={(e) => setPowerDaysPerMonth(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Electricity Rate (₹/kWh Unit)</label>
              <input
                type="number"
                value={electricityRate}
                onChange={(e) => setElectricityRate(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono font-bold text-emerald-800"
              />
            </div>
          </div>

          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Running Load</div>
              <div className="text-xl font-black text-slate-900 font-mono">{powerKw.toFixed(1)} kW</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Monthly Units</div>
              <div className="text-xl font-black text-slate-900 font-mono">{Math.round(powerMonthlyKwh).toLocaleString()} kWh</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Monthly Power Cost</div>
              <div className="text-xl font-black text-emerald-950 font-mono">₹{Math.round(powerMonthlyCost).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOOL 4: LAMINATION FILM */}
      {/* ============================================================== */}
      {activeTool === "film" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase">
                Thermal & Wet Lamination
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                BOPP / PET Film Yield & Weight Calculator
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Film Material</label>
              <select
                value={filmDensity}
                onChange={(e) => setFilmDensity(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-semibold"
              >
                <option value={0.91}>BOPP Film (0.91 g/cm³)</option>
                <option value={1.40}>PET Polyester (1.40 g/cm³)</option>
                <option value={1.15}>Nylon Thermal (1.15 g/cm³)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Thickness (Microns)</label>
              <select
                value={filmMicron}
                onChange={(e) => setFilmMicron(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono font-bold"
              >
                <option value={12}>12 µ (Ultra-Thin)</option>
                <option value={15}>15 µ (Standard Gloss)</option>
                <option value={18}>18 µ (Matte Film)</option>
                <option value={24}>24 µ (Velvet Soft-Touch)</option>
                <option value={35}>35 µ (Heavy Rigid)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Sheets to Laminate</label>
              <input
                type="number"
                value={filmSheets}
                onChange={(e) => setFilmSheets(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Film Rate (₹/kg)</label>
              <input
                type="number"
                value={filmRatePerKg}
                onChange={(e) => setFilmRatePerKg(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono font-bold text-emerald-800"
              />
            </div>
          </div>

          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Film Area Required</div>
              <div className="text-xl font-black text-slate-900 font-mono">{Math.round(filmAreaSqM).toLocaleString()} m²</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Total Film Weight</div>
              <div className="text-xl font-black text-slate-900 font-mono">{filmTotalWeightKg.toFixed(1)} Kg</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Total Film Material Cost</div>
              <div className="text-xl font-black text-emerald-950 font-mono">₹{Math.round(filmTotalCost).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOOL 5: LAMINATION GUM */}
      {/* ============================================================== */}
      {activeTool === "gum" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900">
            Lamination Adhesive (Gum) Consumption
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div
              onClick={() => { setGumType("water"); setGumDcwGsm(4.5); setGumSolidContent(48); }}
              className={`p-4 rounded-2xl border cursor-pointer ${
                gumType === "water" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
              }`}
            >
              <div className="font-bold text-slate-900">Water Based (BOPP to Paper)</div>
              <div className="text-[11px] text-slate-500 mt-1">DCW: 4.0 - 5.0 GSM | Solids: 45 - 50%</div>
            </div>

            <div
              onClick={() => { setGumType("solvent-free"); setGumDcwGsm(2.0); setGumSolidContent(100); }}
              className={`p-4 rounded-2xl border cursor-pointer ${
                gumType === "solvent-free" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
              }`}
            >
              <div className="font-bold text-slate-900">Solvent Free (Poly to Poly)</div>
              <div className="text-[11px] text-slate-500 mt-1">DCW: 1.5 - 2.5 GSM | Solids: 100%</div>
            </div>

            <div
              onClick={() => { setGumType("solvent"); setGumDcwGsm(3.5); setGumSolidContent(35); }}
              className={`p-4 rounded-2xl border cursor-pointer ${
                gumType === "solvent" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
              }`}
            >
              <div className="font-bold text-slate-900">Solvent Based (Rigid Packaging)</div>
              <div className="text-[11px] text-slate-500 mt-1">DCW: 3.0 - 4.5 GSM | Solids: 30 - 40%</div>
            </div>
          </div>

          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Wet Adhesive Needed</div>
              <div className="text-xl font-black text-slate-900 font-mono">{gumWetWeightKg.toFixed(1)} Kg</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Estimated Adhesive Cost</div>
              <div className="text-xl font-black text-emerald-950 font-mono">₹{Math.round(gumTotalCost).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOOL 6: UV COATING */}
      {/* ============================================================== */}
      {activeTool === "uv" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900">
            UV Gloss & Drip-Off Varnish Consumption
          </h3>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Coat Weight (GSM)</label>
              <input
                type="number"
                value={uvGsm}
                onChange={(e) => setUvGsm(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Coverage Area (%)</label>
              <input
                type="number"
                value={uvCoverage}
                onChange={(e) => setUvCoverage(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">UV Varnish Cost (₹/kg)</label>
              <input
                type="number"
                value={uvVarnishRatePerKg}
                onChange={(e) => setUvVarnishRatePerKg(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono font-bold text-emerald-800"
              />
            </div>
          </div>

          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">UV Varnish Needed</div>
              <div className="text-xl font-black text-slate-900 font-mono">{uvWeightKg.toFixed(1)} Kg</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Total UV Coating Cost</div>
              <div className="text-xl font-black text-emerald-950 font-mono">₹{Math.round(uvCost).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOOL 7: AQUEOUS COATING */}
      {/* ============================================================== */}
      {activeTool === "aqueous" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900">
            Water-Based Aqueous Varnish Estimator
          </h3>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dry Coat Weight (GSM)</label>
              <input
                type="number"
                value={aqueousGsm}
                onChange={(e) => setAqueousGsm(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Solid Content (%)</label>
              <input
                type="number"
                value={aqueousSolids}
                onChange={(e) => setAqueousSolids(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Varnish Rate (₹/kg)</label>
              <input
                type="number"
                value={aqueousRatePerKg}
                onChange={(e) => setAqueousRatePerKg(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl font-mono font-bold text-emerald-800"
              />
            </div>
          </div>

          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Wet Coating Required</div>
              <div className="text-xl font-black text-slate-900 font-mono">{aqueousWetKg.toFixed(1)} Kg</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Total Aqueous Coating Cost</div>
              <div className="text-xl font-black text-emerald-950 font-mono">₹{Math.round(aqueousCost).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
