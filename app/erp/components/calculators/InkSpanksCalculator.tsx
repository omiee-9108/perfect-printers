"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";

export default function InkSpanksCalculator() {
  const [spanksWidth, setSpanksWidth] = useState<number>(28);
  const [spanksHeight, setSpanksHeight] = useState<number>(40);
  const [spanksQty, setSpanksQty] = useState<number>(20000);
  const [spanksSides, setSpanksSides] = useState<number>(1);
  const [spanksStockMultiplier, setSpanksStockMultiplier] = useState<number>(1.0); // S1
  const [spanksProcessMultiplier, setSpanksProcessMultiplier] = useState<number>(1.0); // P
  const [spanksCoverageArea, setSpanksCoverageArea] = useState<number>(25); // A (%)
  const [spanksColors, setSpanksColors] = useState<number>(4); // N
  const [spanksKindMultiplier] = useState<number>(1.0); // K
  const [spanksSpecificGravity] = useState<number>(1.05); // S2

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

  return (
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
  );
}
