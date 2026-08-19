"use client";

import React, { useState } from "react";

export default function PowerConsumptionCalculator() {
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

  return (
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
  );
}
