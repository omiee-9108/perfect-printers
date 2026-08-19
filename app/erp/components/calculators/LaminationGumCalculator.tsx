"use client";

import React, { useState } from "react";

export default function LaminationGumCalculator() {
  const [filmSheetLength] = useState<number>(40); // in
  const [filmSheetWidth] = useState<number>(28); // in
  const [filmSheets] = useState<number>(10000);
  const [filmSides] = useState<number>(1);
  const [gumType, setGumType] = useState<"water" | "solvent-free" | "solvent">("water");
  const [gumDcwGsm, setGumDcwGsm] = useState<number>(4.5); // Dry coat weight gsm
  const [gumSolidContent, setGumSolidContent] = useState<number>(48); // %
  const [gumWastage] = useState<number>(6); // %
  const [gumRatePerKg] = useState<number>(145);

  const gumTotalSqM = filmSheetLength * 0.0254 * (filmSheetWidth * 0.0254) * filmSheets * filmSides;
  const gumDryWeightKg = (gumTotalSqM * gumDcwGsm * (1 + gumWastage / 100)) / 1000;
  const gumWetWeightKg = gumDryWeightKg / (gumSolidContent / 100);
  const gumTotalCost = gumWetWeightKg * gumRatePerKg;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <h3 className="text-lg font-black text-slate-900">
        Lamination Adhesive (Gum) Consumption
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div
          onClick={() => {
            setGumType("water");
            setGumDcwGsm(4.5);
            setGumSolidContent(48);
          }}
          className={`p-4 rounded-2xl border cursor-pointer ${
            gumType === "water" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
          }`}
        >
          <div className="font-bold text-slate-900">Water Based (BOPP to Paper)</div>
          <div className="text-[11px] text-slate-500 mt-1">DCW: 4.0 - 5.0 GSM | Solids: 45 - 50%</div>
        </div>

        <div
          onClick={() => {
            setGumType("solvent-free");
            setGumDcwGsm(2.0);
            setGumSolidContent(100);
          }}
          className={`p-4 rounded-2xl border cursor-pointer ${
            gumType === "solvent-free" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
          }`}
        >
          <div className="font-bold text-slate-900">Solvent Free (Poly to Poly)</div>
          <div className="text-[11px] text-slate-500 mt-1">DCW: 1.5 - 2.5 GSM | Solids: 100%</div>
        </div>

        <div
          onClick={() => {
            setGumType("solvent");
            setGumDcwGsm(3.5);
            setGumSolidContent(35);
          }}
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
  );
}
