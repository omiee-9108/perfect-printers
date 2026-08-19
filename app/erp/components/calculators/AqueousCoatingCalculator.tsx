"use client";

import React, { useState } from "react";

export default function AqueousCoatingCalculator() {
  const [filmSheetLength] = useState<number>(40); // in
  const [filmSheetWidth] = useState<number>(28); // in
  const [filmSheets] = useState<number>(10000);
  const [filmSides] = useState<number>(1);
  const [aqueousGsm, setAqueousGsm] = useState<number>(4.0);
  const [aqueousSolids, setAqueousSolids] = useState<number>(42);
  const [aqueousPasses] = useState<number>(1);
  const [aqueousRatePerKg, setAqueousRatePerKg] = useState<number>(220);

  const gumTotalSqM = filmSheetLength * 0.0254 * (filmSheetWidth * 0.0254) * filmSheets * filmSides;
  const aqueousDryKg = (gumTotalSqM * aqueousGsm * aqueousPasses) / 1000;
  const aqueousWetKg = aqueousDryKg / (aqueousSolids / 100);
  const aqueousCost = aqueousWetKg * aqueousRatePerKg;

  return (
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
  );
}
