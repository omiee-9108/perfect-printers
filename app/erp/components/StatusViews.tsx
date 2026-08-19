"use client";

import React, { useState } from "react";
import { useErp } from "../context/ErpContext";
import { JobOrder, StageStatus } from "../types";
import {
  CheckCircle,
  PauseCircle,
  XCircle,
  Search,
  RotateCcw,
  FileText,
  Truck,
  Printer,
  Calendar,
  Layers,
  Sparkles,
  Inbox,
  AlertCircle,
} from "lucide-react";

interface StatusViewProps {
  statusType: "Completed" | "On Hold" | "Cancelled";
}

export default function StatusViews({ statusType }: StatusViewProps) {
  const { orders, restoreOrder, openPrintModal, currentUser } = useErp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((o) => {
    if (o.status !== statusType) return false;
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.jobCode.toLowerCase().includes(q) ||
      o.jobName.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q)
    );
  });

  const getEmptyStateConfig = () => {
    switch (statusType) {
      case "Completed":
        return {
          icon: CheckCircle,
          iconBg: "bg-emerald-100 text-emerald-600 border-emerald-200",
          title: "No Completed Jobs Yet",
          message: "Jobs land here once they clear dispatch and delivery challans are generated.",
        };
      case "On Hold":
        return {
          icon: PauseCircle,
          iconBg: "bg-amber-100 text-amber-600 border-amber-200",
          title: "No Jobs On Hold",
          message: "All active production orders are running smoothly across pre-press and printing lines.",
        };
      case "Cancelled":
        return {
          icon: XCircle,
          iconBg: "bg-slate-100 text-slate-500 border-slate-200",
          title: "No Cancelled Jobs",
          message: "No packaging production orders have been aborted.",
        };
    }
  };

  const emptyConfig = getEmptyStateConfig();
  const Icon = emptyConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
            {statusType === "Completed" && (
              <span className="text-emerald-700 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Dispatched & Completed Archive
              </span>
            )}
            {statusType === "On Hold" && (
              <span className="text-amber-700 flex items-center gap-1.5">
                <PauseCircle className="w-4 h-4" /> Suspended / On Hold Queue
              </span>
            )}
            {statusType === "Cancelled" && (
              <span className="text-slate-600 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Aborted & Cancelled Logs
              </span>
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-900 mt-1">
            {statusType} Orders ({filteredOrders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {statusType === "Completed" && "Historical log of finished jobs, invoice numbers, and delivery challan records."}
            {statusType === "On Hold" && "Orders temporarily halted for artwork revisions, client clearances, or substrate delays."}
            {statusType === "Cancelled" && "Orders terminated before completion with documented audit reasons."}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job name, customer, order ID, job code..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Orders List / Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-16 text-center space-y-4 shadow-sm">
          <div
            className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto border ${emptyConfig.iconBg}`}
          >
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{emptyConfig.title}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {emptyConfig.message}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                      {order.id}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {order.jobCode}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold font-mono px-3 py-1 rounded-full border ${
                      statusType === "Completed"
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : statusType === "On Hold"
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Job & Customer */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {order.jobName}
                </h3>
                <div className="text-xs text-slate-600 font-semibold mt-1">
                  Customer: <span className="text-slate-900 font-bold">{order.customerName}</span> ({order.customerCode})
                </div>

                {/* Specs */}
                <div className="flex flex-wrap gap-1.5 mt-2.5 text-[11px] font-mono">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {order.boardType} ({order.boardGsm} GSM)
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {order.quantity.toLocaleString()} pcs
                  </span>
                </div>

                {/* Reason Banner if Hold / Cancelled */}
                {order.holdReason && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <div className="font-bold font-mono text-[10px] uppercase">Reason for Hold:</div>
                    <div className="mt-0.5">{order.holdReason}</div>
                  </div>
                )}

                {order.cancelReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
                    <div className="font-bold font-mono text-[10px] uppercase">Cancellation Reason:</div>
                    <div className="mt-0.5">{order.cancelReason}</div>
                  </div>
                )}

                {/* Completed Details */}
                {statusType === "Completed" && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400">Challan:</span>{" "}
                      <span className="font-bold text-emerald-800">{order.challanNo || "DC-2026-0418"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Invoice:</span>{" "}
                      <span className="font-bold text-slate-900">{order.invoiceNo || "INV-2026-1190"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {statusType === "Completed" ? (
                  <div className="flex items-center gap-2 w-full justify-end">
                    <button
                      onClick={() => openPrintModal("challan", order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                    >
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Delivery Challan</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full justify-end">
                    <button
                      onClick={() => restoreOrder(order.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-transform hover:scale-105"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore to Active Pipeline</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
