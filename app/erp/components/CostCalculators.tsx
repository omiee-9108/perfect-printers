"use client";

import React, { useState } from "react";
import {
  Calculator,
  Zap,
  Droplet,
  Layers,
  Sparkles,
  Sun,
  Package,
  Film,
} from "lucide-react";

import MonoCartonEstimator from "./calculators/MonoCartonEstimator";
import InkSpanksCalculator from "./calculators/InkSpanksCalculator";
import PowerConsumptionCalculator from "./calculators/PowerConsumptionCalculator";
import LaminationFilmCalculator from "./calculators/LaminationFilmCalculator";
import LaminationGumCalculator from "./calculators/LaminationGumCalculator";
import UvCoatingCalculator from "./calculators/UvCoatingCalculator";
import AqueousCoatingCalculator from "./calculators/AqueousCoatingCalculator";

export default function CostCalculators() {
  const [activeTool, setActiveTool] = useState<
    "monocarton" | "spanks" | "power" | "film" | "gum" | "uv" | "aqueous"
  >("monocarton");

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

      {/* Calculator Render Area */}
      {activeTool === "monocarton" && <MonoCartonEstimator />}
      {activeTool === "spanks" && <InkSpanksCalculator />}
      {activeTool === "power" && <PowerConsumptionCalculator />}
      {activeTool === "film" && <LaminationFilmCalculator />}
      {activeTool === "gum" && <LaminationGumCalculator />}
      {activeTool === "uv" && <UvCoatingCalculator />}
      {activeTool === "aqueous" && <AqueousCoatingCalculator />}
    </div>
  );
}
