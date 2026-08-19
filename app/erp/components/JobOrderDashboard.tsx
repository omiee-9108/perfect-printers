"use client";

import React, { useState } from "react";
import { useErp } from "../context/ErpContext";
import { JobOrder, StageStatus } from "../types";
import {
  Layers,
  Search,
  ChevronRight,
  Filter,
  Printer,
  AlertTriangle,
  PauseCircle,
  XCircle,
  Truck,
  Eye,
  Plus,
  Box,
  Calendar,
} from "lucide-react";

export default function JobOrderDashboard() {
  const {
    orders,
    advanceOrderStage,
    setOrderOnHold,
    cancelOrder,
    setActiveTab,
    openPrintModal,
    currentUser,
  } = useErp();

  const [selectedStage, setSelectedStage] = useState<string>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<JobOrder | null>(null);
  const [advanceModalOrder, setAdvanceModalOrder] = useState<JobOrder | null>(null);
  const [targetStage, setTargetStage] = useState<StageStatus>("Pre-Press");
  const [operatorInput, setOperatorInput] = useState("");
  const [stageNotes, setStageNotes] = useState("");

  const [holdModalOrder, setHoldModalOrder] = useState<JobOrder | null>(null);
  const [holdReason, setHoldReason] = useState("");

  const [cancelModalOrder, setCancelModalOrder] = useState<JobOrder | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const stages: { label: string; stage?: StageStatus; color: string }[] = [
    { label: "All Orders", color: "bg-emerald-600" },
    { label: "Pending", stage: "Pending", color: "bg-amber-500" },
    { label: "Pre-Press", stage: "Pre-Press", color: "bg-sky-600" },
    { label: "Sheet Allocation", stage: "Sheet Allocation", color: "bg-indigo-600" },
    { label: "Press", stage: "Press", color: "bg-fuchsia-600" },
    { label: "Post-Press", stage: "Post-Press", color: "bg-purple-600" },
    { label: "Accounts", stage: "Accounts", color: "bg-teal-600" },
    { label: "Dispatch", stage: "Dispatch", color: "bg-emerald-500" },
  ];

  // Active production stages (excluding Completed, On Hold, Cancelled)
  const activeOrders = orders.filter(
    (o) => o.status !== "Completed" && o.status !== "On Hold" && o.status !== "Cancelled"
  );

  const getStageCount = (stageLabel: string, stage?: StageStatus) => {
    if (stageLabel === "All Orders") return activeOrders.length;
    return activeOrders.filter((o) => o.status === stage).length;
  };

  const filteredOrders = activeOrders.filter((ord) => {
    const matchesStage =
      selectedStage === "All Orders" || ord.status === selectedStage;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      ord.id.toLowerCase().includes(query) ||
      ord.jobCode.toLowerCase().includes(query) ||
      ord.jobName.toLowerCase().includes(query) ||
      ord.customerName.toLowerCase().includes(query) ||
      ord.customerCode.toLowerCase().includes(query);

    return matchesStage && matchesSearch;
  });

  const getStatusBadge = (status: StageStatus) => {
    switch (status) {
      case "Pending":
        return { bg: "bg-amber-100 text-amber-900 border-amber-300", dot: "bg-amber-500" };
      case "Pre-Press":
        return { bg: "bg-sky-100 text-sky-900 border-sky-300", dot: "bg-sky-500" };
      case "Sheet Allocation":
        return { bg: "bg-indigo-100 text-indigo-900 border-indigo-300", dot: "bg-indigo-500" };
      case "Press":
        return { bg: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300", dot: "bg-fuchsia-500" };
      case "Post-Press":
        return { bg: "bg-purple-100 text-purple-900 border-purple-300", dot: "bg-purple-500" };
      case "Accounts":
        return { bg: "bg-teal-100 text-teal-900 border-teal-300", dot: "bg-teal-500" };
      case "Dispatch":
      case "Completed":
        return { bg: "bg-emerald-100 text-emerald-900 border-emerald-300", dot: "bg-emerald-500" };
      default:
        return { bg: "bg-slate-100 text-slate-900 border-slate-300", dot: "bg-slate-500" };
    }
  };

  const getNextStage = (current: StageStatus): StageStatus => {
    switch (current) {
      case "Pending":
        return "Pre-Press";
      case "Pre-Press":
        return "Sheet Allocation";
      case "Sheet Allocation":
        return "Press";
      case "Press":
        return "Post-Press";
      case "Post-Press":
        return "Accounts";
      case "Accounts":
        return "Dispatch";
      case "Dispatch":
        return "Completed";
      default:
        return "Completed";
    }
  };

  const handleOpenAdvance = (order: JobOrder) => {
    const next = getNextStage(order.status);
    setAdvanceModalOrder(order);
    setTargetStage(next);
    setOperatorInput(order.assignedOperator || currentUser.name);
    setStageNotes("");
  };

  const handleConfirmAdvance = () => {
    if (!advanceModalOrder) return;
    advanceOrderStage(advanceModalOrder.id, targetStage, operatorInput, stageNotes);
    setAdvanceModalOrder(null);
  };

  const handleConfirmHold = () => {
    if (!holdModalOrder || !holdReason.trim()) return;
    setOrderOnHold(holdModalOrder.id, holdReason);
    setHoldModalOrder(null);
    setHoldReason("");
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrder || !cancelReason.trim()) return;
    cancelOrder(cancelModalOrder.id, cancelReason);
    setCancelModalOrder(null);
    setCancelReason("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Job Order Pipeline & Floor Control</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Active Production Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of mono cartons across Pre-Press, Sheet Allocation, Offset Press, Finishing & Dispatch.
          </p>
        </div>

        {/* Quick Stats & Add Order */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <div className="text-lg font-extrabold text-emerald-900 font-mono">
              {activeOrders.length}
            </div>
            <div className="text-[10px] uppercase font-bold text-emerald-700 font-mono">
              Active Orders
            </div>
          </div>

          <button
            onClick={() => setActiveTab("new-order")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Direct Entry</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Sidebar Filter + Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Status Filter with Stage Counts */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2 sticky top-24">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Status Filter</span>
            <Filter className="w-3.5 h-3.5" />
          </div>

          <div className="space-y-1">
            {stages.map((st) => {
              const isSelected = selectedStage === st.label;
              const count = getStageCount(st.label, st.stage);
              return (
                <button
                  key={st.label}
                  onClick={() => setSelectedStage(st.label)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-emerald-900 text-white shadow-md font-bold"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-950"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${st.color} ${
                        isSelected ? "ring-2 ring-white" : ""
                      }`}
                    />
                    <span>{st.label}</span>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-emerald-800 text-emerald-200 font-bold"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Stage Progression Legend */}
          <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-500 space-y-1 px-2">
            <div className="font-bold text-slate-700 font-mono text-[10px] uppercase">
              Pipeline Flow
            </div>
            <div className="font-mono text-[10px] text-slate-500 leading-relaxed">
              Pending → Pre-Press (CTP) → Sheet Allocation → Press → Post-Press → Accounts → Dispatch
            </div>
          </div>
        </div>

        {/* Right Main Area: Search Bar + Order Cards */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              data-testid="kanban-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Job Code (e.g. JC-MED-5001), Job Name, Customer (Cipla, Sun Wellness)..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-mono px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Status Badge / Count Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div>
              Showing <span className="font-bold text-slate-800">{filteredOrders.length}</span> orders in{" "}
              <span className="font-bold text-emerald-800">"{selectedStage}"</span>
            </div>
            {selectedStage !== "All Orders" && (
              <button
                onClick={() => setSelectedStage("All Orders")}
                className="text-emerald-700 hover:underline font-semibold text-[11px]"
              >
                Reset to All
              </button>
            )}
          </div>

          {/* Orders List / Cards */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                <Box className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No orders found in {selectedStage}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? "Try searching for a different Job Code, Customer Name, or clear the search query."
                  : "All orders in this stage have either been advanced or not created yet."}
              </p>
              {currentUser.role !== "ACCOUNTS" && (
                <button
                  onClick={() => setActiveTab("new-order")}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-md hover:bg-emerald-500 mt-2"
                >
                  Create New Order
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <div
                    key={order.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group hover:border-emerald-300"
                  >
                    {/* Top Row: Order ID + Status Badge */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white shadow-sm">
                              {order.id}
                            </span>
                            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {order.jobCode}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
                          <span>{order.status}</span>
                        </div>
                      </div>

                      {/* Job Title & Customer */}
                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {order.jobName}
                      </h3>
                      <div className="text-xs text-slate-600 font-semibold mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>{order.customerName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({order.customerCode})</span>
                      </div>

                      {/* Technical Specs Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] font-mono">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {order.boardType} ({order.boardGsm} GSM)
                        </span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {order.sheetSize}
                        </span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {order.numColors} Colors ({order.ups} ups)
                        </span>
                      </div>

                      {/* Quantity & Due Date */}
                      <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-xs">
                        <div>
                          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Order Quantity
                          </div>
                          <div className="font-bold font-mono text-slate-900 text-sm">
                            {order.quantity.toLocaleString()} pcs
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            ~{order.totalSheetsRequired.toLocaleString()} sheets
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Target Due Date
                          </div>
                          <div className="font-bold text-slate-800 text-xs flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{order.dueDate}</span>
                          </div>
                          {order.assignedOperator && (
                            <div className="text-[10px] text-slate-500 font-mono truncate">
                              Op: {order.assignedOperator}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Actions Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                      {/* % Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 mb-1">
                          <span>STAGE PROGRESS</span>
                          <span className="text-emerald-700">{order.progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                            style={{ width: `${order.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Triggers */}
                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        <div className="flex items-center gap-1">
                          {/* View Job Card */}
                          <button
                            onClick={() => setSelectedOrderForModal(order)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                            title="View Full Job Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Print Docket */}
                          <button
                            data-testid="print-docket-btn"
                            onClick={() => openPrintModal("jobcard", order)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                            title="Print Press Floor Docket"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Hold */}
                          <button
                            onClick={() => {
                              setHoldModalOrder(order);
                              setHoldReason("");
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors"
                            title="Put on Hold"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>

                          {/* Cancel */}
                          {currentUser.role === "ADMIN" && (
                            <button
                              onClick={() => {
                                setCancelModalOrder(order);
                                setCancelReason("");
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition-colors"
                              title="Cancel Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Advance Stage Button / Delivery Challan */}
                        {order.status === "Dispatch" ? (
                          <button
                            onClick={() => openPrintModal("challan", order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-transform hover:scale-105"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Create Challan</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenAdvance(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-emerald-700 text-white shadow-sm transition-all"
                          >
                            <span>Move to {getNextStage(order.status)}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Advance Stage Modal */}
      {advanceModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold">
                  Stage Transition Verification
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Advance Order: {advanceModalOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setAdvanceModalOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-xs space-y-1">
              <div className="font-bold text-emerald-950">{advanceModalOrder.jobName}</div>
              <div className="text-emerald-800 font-mono">
                Current: <span className="font-bold">{advanceModalOrder.status}</span> ➔ Target:{" "}
                <span className="font-bold text-slate-900">{targetStage}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Next Target Stage
                </label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as StageStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Pre-Press">Pre-Press (CTP Plates)</option>
                  <option value="Sheet Allocation">Sheet Allocation (Paper Warehouse)</option>
                  <option value="Press">Press (Offset Impression)</option>
                  <option value="Post-Press">Post-Press (Lamination & Die Cut)</option>
                  <option value="Accounts">Accounts (Quality & Billing)</option>
                  <option value="Dispatch">Dispatch (Ready for Delivery)</option>
                  <option value="Completed">Completed (Cleared Dispatch)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Machine / Operator
                </label>
                <input
                  type="text"
                  value={operatorInput}
                  onChange={(e) => setOperatorInput(e.target.value)}
                  placeholder="e.g. Ramesh Pawar (Heidelberg CD 102)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stage Audit Notes / Make-Ready Log
                </label>
                <textarea
                  rows={2}
                  value={stageNotes}
                  onChange={(e) => setStageNotes(e.target.value)}
                  placeholder="e.g. Plates mounted, ink density verified against sample swatch."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setAdvanceModalOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdvance}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
              >
                Confirm Stage Transition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Put on Hold Modal */}
      {holdModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Put Order on Hold ({holdModalOrder.id})</span>
            </div>
            <p className="text-xs text-slate-600">
              Please specify the operational or client reason for halting production on this job:
            </p>
            <textarea
              rows={3}
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              placeholder="e.g. Artwork revision requested by client / Awaiting board shipment / Plate scratch issue..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setHoldModalOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                disabled={!holdReason.trim()}
                onClick={handleConfirmHold}
                className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-md disabled:opacity-50"
              >
                Move to On Hold Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <XCircle className="w-5 h-5" />
              <span>Cancel Order ({cancelModalOrder.id})</span>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to abort this job? Provide a reason for the audit log:
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Client cancelled order / Defective raw material / Commercial terms issue..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                disabled={!cancelReason.trim()}
                onClick={handleConfirmCancel}
                className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-md disabled:opacity-50"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Job Card Quick View Modal */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-mono font-bold text-emerald-700 uppercase">
                  Production Job Card • {selectedOrderForModal.id}
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  {selectedOrderForModal.jobName}
                </h2>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Job Code: <span className="font-bold text-slate-900">{selectedOrderForModal.jobCode}</span> | Client: <span className="font-bold">{selectedOrderForModal.customerName}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Technical Specification Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Board & GSM</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedOrderForModal.boardType}</div>
                <div className="text-[11px] font-mono text-emerald-700 font-semibold">{selectedOrderForModal.boardGsm} GSM</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Sheet Size</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedOrderForModal.sheetSize}</div>
                <div className="text-[11px] font-mono text-slate-500">Grain Long/Short</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Colors & Units</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedOrderForModal.numColors} Colors</div>
                <div className="text-[10px] text-slate-500 truncate">{selectedOrderForModal.colors}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Carton Quantity</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5 text-sm">{selectedOrderForModal.quantity.toLocaleString()} pcs</div>
                <div className="text-[10px] text-slate-500">{selectedOrderForModal.ups} Ups per sheet</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Required Sheets</div>
                <div className="font-bold font-mono text-emerald-700 mt-0.5 text-sm">{selectedOrderForModal.totalSheetsRequired.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">Incl. {selectedOrderForModal.makereadySheets} make-ready</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Schedule</div>
                <div className="font-bold text-slate-900 mt-0.5">Due: {selectedOrderForModal.dueDate}</div>
                <div className="text-[10px] text-slate-500">Booked: {selectedOrderForModal.orderDate}</div>
              </div>
            </div>

            {/* Special Instructions */}
            {selectedOrderForModal.instructions && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                <div className="font-bold text-amber-900 font-mono text-[10px] uppercase mb-1">
                  Floor Instructions & Quality Overrides
                </div>
                <div className="text-amber-800 leading-relaxed font-medium">
                  {selectedOrderForModal.instructions}
                </div>
              </div>
            )}

            {/* Artwork Preview if any */}
            {selectedOrderForModal.artworkUrl && (
              <div>
                <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-2">
                  Artwork Thumbnail / Approved Proof
                </div>
                <div className="h-40 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  <img
                    src={selectedOrderForModal.artworkUrl}
                    alt="Artwork"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  const ord = selectedOrderForModal;
                  setSelectedOrderForModal(null);
                  openPrintModal("jobcard", ord);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Job Card</span>
              </button>

              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
