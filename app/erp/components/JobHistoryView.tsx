"use client";

import React, { useState } from "react";
import { useErp } from "../context/ErpContext";
import {
  History,
  Building2,
  Layers,
  Calendar,
  User,
  FileCheck,
  CheckCircle2,
  Truck,
  Printer,
  ChevronRight,
  TrendingDown,
  Sparkles,
} from "lucide-react";

export default function JobHistoryView() {
  const { customers, jobs, orders, auditLogs, openPrintModal } = useErp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("ALL");
  const [selectedJobCode, setSelectedJobCode] = useState<string>(jobs[0]?.jobCode || "");

  // Filter jobs based on customer selection
  const availableJobs =
    selectedCustomerId === "ALL"
      ? jobs
      : jobs.filter((j) => j.customerId === selectedCustomerId);

  const activeJob = jobs.find((j) => j.jobCode === selectedJobCode) || jobs[0];

  // All historical orders for this job code
  const jobOrders = orders.filter((o) => o.jobCode === selectedJobCode);
  const totalProduced = jobOrders
    .filter((o) => o.status === "Completed")
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const jobLogs = auditLogs.filter((l) => l.jobCode === selectedJobCode);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Admin Drill-Down Auditing</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Job History & Production Timeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a customer and job code to review historical batch runs, scrap analytics, operator logs, and delivery challans.
          </p>
        </div>

        {/* Lifetime volume chip */}
        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-right">
          <div className="text-[10px] uppercase font-bold text-emerald-700 font-mono">
            Lifetime Completed Cartons
          </div>
          <div className="text-lg font-extrabold text-emerald-950 font-mono">
            {totalProduced.toLocaleString()} Pcs
          </div>
        </div>
      </div>

      {/* 2 Dropdown Filter Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
          Job Selection Criteria
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Select Customer</span>
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                const matching =
                  e.target.value === "ALL"
                    ? jobs
                    : jobs.filter((j) => j.customerId === e.target.value);
                if (matching.length > 0) {
                  setSelectedJobCode(matching[0].jobCode);
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.code}] {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Job Code Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Select Job Code</span>
            </label>
            <select
              value={selectedJobCode}
              onChange={(e) => setSelectedJobCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
            >
              {availableJobs.map((j) => (
                <option key={j.id} value={j.jobCode}>
                  {j.jobCode} — {j.productName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Job Meta Card */}
        {activeJob && (
          <div className="mt-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-slate-900 text-sm">{activeJob.productName}</div>
              <div className="text-emerald-800 font-mono mt-0.5">
                Client: {activeJob.customerName} | Board: {activeJob.boardType} ({activeJob.boardGsm} GSM) | Sheet: {activeJob.sheetSize}
              </div>
            </div>
            <div className="text-[11px] font-mono text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs font-semibold">
              Die Code: {activeJob.dieCode} • {activeJob.ups} ups
            </div>
          </div>
        )}
      </div>

      {/* Production History Timeline & Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Historical Production Batches */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Orders & Batch Execution History
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {jobOrders.length} Batches Found
            </span>
          </div>

          <div className="space-y-3">
            {jobOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                      {ord.id}
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-800">
                      {ord.quantity.toLocaleString()} pcs
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      ord.status === "Completed"
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                  <div>Order Date: {ord.orderDate}</div>
                  <div>Due Date: {ord.dueDate}</div>
                  {ord.dispatchDate && <div>Dispatched: {ord.dispatchDate}</div>}
                  {ord.challanNo && <div>Challan: {ord.challanNo}</div>}
                </div>

                {ord.challanNo && (
                  <div className="pt-2 border-t border-slate-200/60 flex justify-end">
                    <button
                      onClick={() => openPrintModal("challan", ord)}
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold hover:underline"
                    >
                      <Truck className="w-3 h-3" /> View Delivery Challan
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Machine Audit Log Timeline */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Press Floor Audit Trail & Operator Logs
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Real-time MES Log
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {jobLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No floor audit records found for this job code.
              </div>
            ) : (
              jobLogs.map((log, idx) => (
                <div key={log.id} className="relative pl-6 pb-4 border-l-2 border-emerald-300 last:border-l-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white" />
                  
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-900">{log.action}</span>
                      <span className="font-mono text-slate-400">{log.timestamp}</span>
                    </div>

                    <div className="text-slate-700 font-medium">
                      Stage: <span className="font-bold">{log.stage}</span> • Operator: <span className="font-bold">{log.operator}</span>
                    </div>

                    {log.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{log.notes}"
                      </p>
                    )}

                    {(log.sheetsConsumed || log.scrapPercentage) && (
                      <div className="flex items-center gap-3 text-[10px] font-mono text-emerald-800 font-semibold pt-0.5">
                        {log.sheetsConsumed && (
                          <span>Sheets: {log.sheetsConsumed.toLocaleString()}</span>
                        )}
                        {log.scrapPercentage && (
                          <span>Scrap Rate: {log.scrapPercentage}%</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
