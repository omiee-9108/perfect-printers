"use client";

import React, { useState } from "react";

export default function UvCoatingCalculator() {
  const [filmSheetLength] = useState<number>(40); // in
  const [filmSheetWidth] = useState<number>(28); // in
  const [filmSheets] = useState<number>(10000);
  const [uvGsm, setUvGsm] = useState<number>(5.5);
  const [uvCoverage, setUvCoverage] = useState<number>(100);
  const [uvVarnishRatePerKg, setUvVarnishRatePerKg] = useState<number>(580);

  const uvAreaSqM = filmSheetLength * 0.0254 * (filmSheetWidth * 0.0254) * filmSheets * (uvCoverage / 100);
  const uvWeightKg = (uvAreaSqM * uvGsm * 1.08) / 1000;
  const uvCost = uvWeightKg * uvVarnishRatePerKg;

  return (
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
  );
}
