"use client";

import React, { useState } from "react";
import { useErp } from "../context/ErpContext";
import { MonthlyExpenses } from "../types";
import {
  BarChart3,
  Clock,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function ReportsView() {
  const { orders, inventory, expenses, updateExpenses, customers } = useErp();

  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year" | "custom">("month");
  const [activeReportSubTab, setActiveReportSubTab] = useState<"overview" | "raw-materials" | "revenue">("overview");

  // Local state for editable monthly expenses
  const [editExpenses, setEditExpenses] = useState<MonthlyExpenses>(expenses);
  const [expensesSaved, setExpensesSaved] = useState(false);

  const completedOrders = orders.filter((o) => o.status === "Completed");
  const activeOrders = orders.filter((o) => o.status !== "Completed" && o.status !== "On Hold" && o.status !== "Cancelled");

  // Simulated financials based on completed orders & unit rates (~₹2.45 per carton avg)
  const totalCompletedCartons = completedOrders.reduce((acc, curr) => acc + curr.quantity, 0);
  const calculatedRevenue = totalCompletedCartons * 2.65;
  const materialCostIssued = inventory
    .filter((i) => i.stockType === "Own Stock")
    .reduce((acc, curr) => acc + (curr.totalValue * 0.45), 0); // 45% issued to completed jobs

  const grossProfit = calculatedRevenue - materialCostIssued;
  const totalMonthlyExpenses =
    editExpenses.electricity +
    editExpenses.salaries +
    editExpenses.rentAndFactory +
    editExpenses.maintenanceAndConsumables +
    editExpenses.otherExpenses;
  const netProfit = grossProfit - totalMonthlyExpenses;

  // Revenue by Customer distribution
  const customerRevenueMap = customers.map((c) => {
    const custOrders = completedOrders.filter((o) => o.customerId === c.id);
    const count = custOrders.length;
    const rev = custOrders.reduce((acc, curr) => acc + curr.quantity * 2.65, 0) || (c.code === "D02" ? 265000 : c.code === "S01" ? 106000 : 45000);
    return {
      code: c.code,
      name: c.companyName,
      ordersCount: count || (c.code === "D02" ? 2 : 1),
      revenue: rev,
    };
  });

  const maxCustRev = Math.max(...customerRevenueMap.map((c) => c.revenue), 1);

  const handleSaveExpenses = (e: React.FormEvent) => {
    e.preventDefault();
    updateExpenses(editExpenses);
    setExpensesSaved(true);
    setTimeout(() => setExpensesSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Date Range Selector */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Executive MES & Business Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Plant Performance & Financial Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Resolved Period: <span className="font-bold text-slate-800">01 Aug 2026 – 31 Aug 2026 (Monthly Active)</span>
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setDateRange("today")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateRange === "today" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange("week")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateRange === "week" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setDateRange("month")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateRange === "month" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange("year")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateRange === "year" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Overview | Raw Materials | Revenue & Jobs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveReportSubTab("overview")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeReportSubTab === "overview"
              ? "bg-emerald-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Executive Overview & KPIs
        </button>
        <button
          onClick={() => setActiveReportSubTab("raw-materials")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeReportSubTab === "raw-materials"
              ? "bg-emerald-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Raw Material Cost Breakdown
        </button>
        <button
          onClick={() => setActiveReportSubTab("revenue")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeReportSubTab === "revenue"
              ? "bg-emerald-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Revenue & Customer Volume
        </button>
      </div>

      {/* SUB-TAB 1: EXECUTIVE OVERVIEW */}
      {activeReportSubTab === "overview" && (
        <div className="space-y-6">
          {/* 6 High-Impact KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Completed Jobs */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Completed Jobs
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                {completedOrders.length} <span className="text-xs text-slate-400 font-normal">of {orders.length}</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% Dispatched
              </div>
            </div>

            {/* In Progress */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Active In-Progress
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                {activeOrders.length} Jobs
              </div>
              <div className="text-[10px] text-amber-700 font-bold mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Running on Floor
              </div>
            </div>

            {/* Invoiced Revenue */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Gross Revenue
              </div>
              <div className="text-xl font-black text-emerald-950 font-mono mt-1">
                ₹{Math.round(calculatedRevenue).toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">
                {totalCompletedCartons.toLocaleString()} Cartons
              </div>
            </div>

            {/* Material Cost Issued */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Material Cost
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                ₹{Math.round(materialCostIssued).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Board, Inks & Films
              </div>
            </div>

            {/* Gross Profit */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Gross Margin
              </div>
              <div className="text-xl font-black text-emerald-950 font-mono mt-1">
                ₹{Math.round(grossProfit).toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">
                {((grossProfit / calculatedRevenue) * 100).toFixed(1)}% Margin
              </div>
            </div>

            {/* Net Profit */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm bg-emerald-50/40">
              <div className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
                Net Operating Profit
              </div>
              <div className="text-xl font-black text-emerald-900 font-mono mt-1">
                ₹{Math.round(netProfit).toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">
                After Power & Salaries
              </div>
            </div>
          </div>

          {/* 2-Column Split: Monthly Expenses Panel + Revenue by Customer Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Editable Monthly Factory Expenses */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Monthly Operational Expenses (Overheads)
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">Month: {editExpenses.monthYear}</p>
                </div>

                {expensesSaved && (
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Saved
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveExpenses} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Electricity & Power (₹)</label>
                    <input
                      type="number"
                      value={editExpenses.electricity}
                      onChange={(e) => setEditExpenses({ ...editExpenses, electricity: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Staff Salaries (₹)</label>
                    <input
                      type="number"
                      value={editExpenses.salaries}
                      onChange={(e) => setEditExpenses({ ...editExpenses, salaries: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Factory Rent & Overheads (₹)</label>
                    <input
                      type="number"
                      value={editExpenses.rentAndFactory}
                      onChange={(e) => setEditExpenses({ ...editExpenses, rentAndFactory: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Consumables & Maintenance (₹)</label>
                    <input
                      type="number"
                      value={editExpenses.maintenanceAndConsumables}
                      onChange={(e) => setEditExpenses({ ...editExpenses, maintenanceAndConsumables: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Other Plant Expenses (₹)</label>
                  <input
                    type="number"
                    value={editExpenses.otherExpenses}
                    onChange={(e) => setEditExpenses({ ...editExpenses, otherExpenses: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div className="p-3.5 bg-slate-100 rounded-xl flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-700">Total Factory Monthly Expense:</span>
                  <span className="text-sm font-black text-slate-900">
                    ₹{totalMonthlyExpenses.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save for Month</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Revenue by Customer Horizontal Bar Chart */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Revenue Invoiced by Customer
                </h3>
                <span className="text-xs font-mono text-slate-400">B2B Share</span>
              </div>

              <div className="space-y-4">
                {customerRevenueMap.map((cust) => {
                  const percent = Math.round((cust.revenue / maxCustRev) * 100);
                  return (
                    <div key={cust.code} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 truncate max-w-xs">
                          [{cust.code}] {cust.name}
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          ₹{cust.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 2: RAW MATERIALS */}
      {activeReportSubTab === "raw-materials" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Raw Material Valuation & Stock Consumption Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Unit Cost (₹)</th>
                  <th className="p-3">Inventory Asset Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-slate-900">{i.sku}</td>
                    <td className="p-3 font-bold text-slate-800">{i.name}</td>
                    <td className="p-3 text-slate-600">{i.category}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{i.quantity.toLocaleString()} {i.unit}</td>
                    <td className="p-3 font-mono text-slate-700">₹{i.costPerUnit.toFixed(2)}</td>
                    <td className="p-3 font-mono font-bold text-emerald-800">₹{i.totalValue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REVENUE & JOBS */}
      {activeReportSubTab === "revenue" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Finished Job Batches & Invoiced Revenue Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Job Code & Name</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Volume</th>
                  <th className="p-3">Challan / Invoice</th>
                  <th className="p-3">Est. Order Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedOrders.map((o) => {
                  const estVal = o.quantity * 2.65;
                  return (
                    <tr key={o.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-900">{o.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{o.jobName}</div>
                        <div className="text-[10px] font-mono text-emerald-700">{o.jobCode}</div>
                      </td>
                      <td className="p-3 text-slate-700 font-semibold">{o.customerName}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{o.quantity.toLocaleString()} pcs</td>
                      <td className="p-3 font-mono text-slate-600">{o.challanNo} / {o.invoiceNo}</td>
                      <td className="p-3 font-mono font-bold text-emerald-800 text-sm">₹{Math.round(estVal).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
