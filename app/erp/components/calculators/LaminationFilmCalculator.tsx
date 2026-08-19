"use client";

import React, { useState } from "react";

export default function LaminationFilmCalculator() {
  const [filmSheetLength] = useState<number>(40); // in
  const [filmSheetWidth] = useState<number>(28); // in
  const [filmSheets, setFilmSheets] = useState<number>(10000);
  const [filmSides] = useState<number>(1);
  const [filmDensity, setFilmDensity] = useState<number>(0.91); // BOPP
  const [filmMicron, setFilmMicron] = useState<number>(15); // microns
  const [filmWastagePercent] = useState<number>(5);
  const [filmRatePerKg, setFilmRatePerKg] = useState<number>(185);

  const filmAreaSqM =
    filmSheetLength * 0.0254 * (filmSheetWidth * 0.0254) * filmSheets * filmSides * (1 + filmWastagePercent / 100);
  const filmTotalWeightKg = (filmAreaSqM * filmMicron * filmDensity) / 1000;
  const filmTotalCost = filmTotalWeightKg * filmRatePerKg;

  return (
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
  );
}
