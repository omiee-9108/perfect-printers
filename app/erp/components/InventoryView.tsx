"use client";

import React, { useState } from "react";
import { useErp } from "../context/ErpContext";
import { sanitizeCsvValue } from "../utils/csv";
import { InventoryItem } from "../types";
import {
  Boxes,
  Search,
  Plus,
  ArrowDownLeft,
  History,
  AlertTriangle,
  Download,
  Trash2,
} from "lucide-react";

export default function InventoryView() {
  const {
    inventory,
    transactions,
    addInventoryItem,
    stockInItem,
    deleteInventoryItem,
    currentUser,
  } = useErp();

  const [activeSubTab, setActiveSubTab] = useState<
    "own" | "client" | "material-out" | "log"
  >("own");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Modals
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [stockInModalItem, setStockInModalItem] = useState<InventoryItem | null>(null);
  const [stockInQty, setStockInQty] = useState(500);
  const [stockInPoRef, setStockInPoRef] = useState("PO-2026-0312");
  const [stockInNotes, setStockInNotes] = useState("");

  const [historyModalItem, setHistoryModalItem] = useState<InventoryItem | null>(null);

  // New Item State
  const [newItem, setNewItem] = useState({
    sku: "BRD-NEW-01",
    name: "",
    category: "Paper & Board" as InventoryItem["category"],
    stockType: "Own Stock" as InventoryItem["stockType"],
    clientName: "",
    quantity: 1000,
    unit: "Sheets" as InventoryItem["unit"],
    reorderLevel: 500,
    costPerUnit: 18.5,
    location: "Bay B - Shelf 02",
  });

  const categories = [
    "All Categories",
    "Paper & Board",
    "Inks & Varnishes",
    "Lamination Film",
    "Adhesives & Gum",
    "UV & Aqueous Coatings",
    "Chemicals & Plates",
    "Packing Materials",
  ];

  // Filtering
  const filteredItems = inventory.filter((item) => {
    if (activeSubTab === "own" && item.stockType !== "Own Stock") return false;
    if (activeSubTab === "client" && item.stockType !== "Client Stock") return false;

    const matchesCategory =
      selectedCategory === "All Categories" || item.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.sku.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      (item.clientName && item.clientName.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  const materialOutTransactions = transactions.filter(
    (t) => t.type === "Material Out (Job Issuance)"
  );

  const totalStockValue = inventory
    .filter((i) => i.stockType === "Own Stock")
    .reduce((acc, curr) => acc + curr.totalValue, 0);

  const lowStockCount = inventory.filter(
    (i) => i.quantity <= i.reorderLevel
  ).length;

  // Export Stock List to CSV (Secured against CWE-1236)
  const handleExportInventory = () => {
    const headers = "SKU,Item Description,Category,Stock Type,Quantity,Unit,Unit Cost (INR),Total Valuation (INR),Storage Rack\n";
    const rows = inventory
      .map((i) =>
        [i.sku, i.name, i.category, i.stockType, i.quantity, i.unit, i.costPerUnit, i.totalValue, i.location]
          .map(sanitizeCsvValue)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Perfect_Printers_Stock_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    addInventoryItem({
      sku: newItem.sku,
      name: newItem.name,
      category: newItem.category,
      stockType: newItem.stockType,
      clientName: newItem.clientName || undefined,
      quantity: Number(newItem.quantity),
      unit: newItem.unit,
      reorderLevel: Number(newItem.reorderLevel),
      costPerUnit: Number(newItem.costPerUnit),
      location: newItem.location,
    });

    setAddItemModalOpen(false);
  };

  const handleConfirmStockIn = () => {
    if (!stockInModalItem || stockInQty <= 0) return;
    stockInItem(stockInModalItem.id, Number(stockInQty), stockInPoRef, stockInNotes);
    setStockInModalItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & KPI Summary */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
            <Boxes className="w-4 h-4 text-emerald-600" />
            <span>Warehouse Raw Materials & Stock Control</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of substrates, process offset inks, lamination films, adhesives, and CTP plates.
          </p>
        </div>

        {/* Financial KPI chips */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-right">
            <div className="text-[10px] uppercase font-bold text-emerald-700 font-mono">
              Own Stock Valuation
            </div>
            <div className="text-lg font-extrabold text-emerald-950 font-mono">
              ₹{totalStockValue.toLocaleString()}
            </div>
          </div>

          {lowStockCount > 0 && (
            <div className="px-3.5 py-2 bg-red-50 border border-red-200 rounded-2xl text-center animate-pulse">
              <div className="text-[10px] uppercase font-bold text-red-700 font-mono">
                Low Stock Alerts
              </div>
              <div className="text-lg font-extrabold text-red-800 font-mono">
                {lowStockCount} Items
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Tab Strip */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("own")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "own"
                ? "bg-emerald-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Own Factory Stock ({inventory.filter((i) => i.stockType === "Own Stock").length})
          </button>
          <button
            onClick={() => setActiveSubTab("client")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "client"
                ? "bg-emerald-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Client Free-Issue Stock ({inventory.filter((i) => i.stockType === "Client Stock").length})
          </button>
          <button
            onClick={() => setActiveSubTab("material-out")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "material-out"
                ? "bg-emerald-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Material Out (Job Issuance)
          </button>
          <button
            onClick={() => setActiveSubTab("log")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "log"
                ? "bg-emerald-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Transaction Log ({transactions.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportInventory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Stock XLS</span>
          </button>
          <button
            onClick={() => setAddItemModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* SUB-TABS: OWN & CLIENT STOCK LISTS */}
      {(activeSubTab === "own" || activeSubTab === "client") && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, item name, location..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Item Name & Category</th>
                  <th className="p-3.5">Available Stock</th>
                  <th className="p-3.5">Cost / Unit</th>
                  <th className="p-3.5">Total Valuation</th>
                  <th className="p-3.5">Rack Location</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No raw material inventory matches current filter.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const isLow = item.quantity <= item.reorderLevel;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* SKU */}
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded border border-slate-200">
                            {item.sku}
                          </span>
                        </td>

                        {/* Name & Tag */}
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {item.category}
                            </span>
                            {item.clientName && (
                              <span className="text-[10px] font-mono text-purple-800 bg-purple-50 px-2 py-0.2 rounded border border-purple-200">
                                Client: {item.clientName}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock Quantity */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-slate-900">
                              {item.quantity.toLocaleString()} {item.unit}
                            </span>
                            {isLow && (
                              <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <AlertTriangle className="w-2.5 h-2.5" /> LOW
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Reorder threshold: {item.reorderLevel} {item.unit}
                          </div>
                        </td>

                        {/* Unit Cost */}
                        <td className="p-3.5 font-mono text-slate-700 font-semibold">
                          ₹{item.costPerUnit.toFixed(2)} / {item.unit}
                        </td>

                        {/* Total Value */}
                        <td className="p-3.5 font-mono font-bold text-emerald-800 text-sm">
                          ₹{item.totalValue.toLocaleString()}
                        </td>

                        {/* Location */}
                        <td className="p-3.5 font-mono text-slate-600">{item.location}</td>

                        {/* Action Buttons */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Stock In Button */}
                            <button
                              data-testid="stock-in-btn"
                              onClick={() => {
                                setStockInModalItem(item);
                                setStockInQty(1000);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1"
                              title="Stock In New Delivery"
                            >
                              <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                              <span>Stock In</span>
                            </button>

                            {/* History Modal Button */}
                            <button
                              onClick={() => setHistoryModalItem(item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                              title="View Issuance History"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            {currentUser.role === "ADMIN" && (
                              <button
                                onClick={() => deleteInventoryItem(item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB: MATERIAL OUT (JOB ISSUANCE) */}
      {activeSubTab === "material-out" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Raw Materials Issued to Production Jobs
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Auto-linked with Job Orders
            </span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Job Code / Order ID</th>
                <th className="p-3">Material SKU & Item</th>
                <th className="p-3">Quantity Issued</th>
                <th className="p-3">Authorized Operator</th>
                <th className="p-3">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materialOutTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80">
                  <td className="p-3 font-mono text-slate-500">{tx.date}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">
                    <span className="text-emerald-800 font-bold">{tx.jobCode}</span> ({tx.referenceNo})
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{tx.itemName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{tx.sku}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900 text-sm">
                    {tx.quantity.toLocaleString()} {tx.unit}
                  </td>
                  <td className="p-3 text-slate-700 font-semibold">{tx.authorizedBy}</td>
                  <td className="p-3 text-slate-500 text-[11px]">{tx.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUB-TAB: TRANSACTION LOG */}
      {activeSubTab === "log" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Complete Store In/Out Transaction Audit Trail
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {transactions.length} Total Logs
            </span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Tx ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Item</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Ref No.</th>
                <th className="p-3">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80">
                  <td className="p-3 font-mono text-[10px] text-slate-400">{tx.id}</td>
                  <td className="p-3 font-mono text-slate-600">{tx.date}</td>
                  <td className="p-3 font-semibold">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        tx.type === "Stock In"
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-800">{tx.itemName}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {tx.quantity.toLocaleString()} {tx.unit}
                  </td>
                  <td className="p-3 font-mono text-slate-600">{tx.referenceNo}</td>
                  <td className="p-3 text-slate-700">{tx.authorizedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* STOCK IN MODAL */}
      {stockInModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold">
                  Store Material Receipt (GRN)
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Stock In: {stockInModalItem.name}
                </h3>
              </div>
              <button onClick={() => setStockInModalItem(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-xs space-y-1">
              <div>SKU: <span className="font-mono font-bold text-slate-900">{stockInModalItem.sku}</span></div>
              <div>Current Available: <span className="font-bold">{stockInModalItem.quantity} {stockInModalItem.unit}</span></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Received Quantity ({stockInModalItem.unit}) *
                </label>
                <input
                  type="number"
                  value={stockInQty}
                  onChange={(e) => setStockInQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Purchase Order / Invoice Ref Number
                </label>
                <input
                  type="text"
                  value={stockInPoRef}
                  onChange={(e) => setStockInPoRef(e.target.value)}
                  placeholder="e.g. PO-2026-0312"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  GRN Notes / Batch Certificate
                </label>
                <input
                  type="text"
                  value={stockInNotes}
                  onChange={(e) => setStockInNotes(e.target.value)}
                  placeholder="e.g. Batch #ITC-881 verified, no transit moisture"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setStockInModalItem(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStockIn}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                Confirm Stock In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {historyModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold">
                  Material Ledger History
                </div>
                <h3 className="text-base font-bold text-slate-900">{historyModalItem.name}</h3>
              </div>
              <button onClick={() => setHistoryModalItem(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
              {transactions
                .filter((t) => t.itemId === historyModalItem.id)
                .map((t) => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{t.type}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {t.date} • Ref: {t.referenceNo}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">
                        {t.quantity.toLocaleString()} {t.unit}
                      </div>
                      <div className="text-[10px] text-slate-500">{t.authorizedBy}</div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setHistoryModalItem(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {addItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Raw Material SKU</h3>
              <button onClick={() => setAddItemModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Type</label>
                  <select
                    value={newItem.stockType}
                    onChange={(e) => setNewItem({ ...newItem, stockType: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Own Stock">Own Factory Stock</option>
                    <option value="Client Stock">Client Free-Issue Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Material / Item Name *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Hubergroup CMYK Process Cyan Ink"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {categories.filter((c) => c !== "All Categories").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit of Measure</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Sheets">Sheets</option>
                    <option value="Kg">Kg</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Liters">Liters</option>
                    <option value="Plates">Plates</option>
                    <option value="Reams">Reams</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Qty</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost / Unit (₹)</label>
                  <input
                    type="number"
                    value={newItem.costPerUnit}
                    onChange={(e) => setNewItem({ ...newItem, costPerUnit: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    value={newItem.reorderLevel}
                    onChange={(e) => setNewItem({ ...newItem, reorderLevel: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rack / Storage Location</label>
                <input
                  type="text"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="e.g. Bay A - Stack 14"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  Save Material SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
