"use client";

import React, { useState } from "react";
import { useErp } from "../context/ErpContext";
import { PurchaseOrder, POLineItem } from "../types";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Printer,
  FileCheck,
  Building2,
  Calendar,
  Sparkles,
  Download,
  CheckCircle,
} from "lucide-react";

export default function PurchaseOrderView() {
  const { purchaseOrders, createPurchaseOrder, openPrintModal } = useErp();

  const [vendorName, setVendorName] = useState("Paper Trade Corporation (ITC Dealer)");
  const [vendorGstin, setVendorGstin] = useState("27AAACP9910D1ZL");
  const [vendorAddress, setVendorAddress] = useState("Industrial Area, Kolhapur, MH - 416001");
  const [poDate, setPoDate] = useState(
    new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  );
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  );
  const [gstRate, setGstRate] = useState<number>(18);
  const [terms, setTerms] = useState(
    "1. 30 Days credit from date of invoice.\n2. Raw material must strictly meet packaging moisture tolerances (6-7%).\n3. Defective sheets subject to immediate rejection and replacement."
  );

  const [lineItems, setLineItems] = useState<POLineItem[]>([
    {
      id: "li-1",
      itemType: "FBB Paperboard",
      description: "ITC Cyber XL Pac 300 GSM (28x40 in) Palletized",
      quantity: 15000,
      unit: "Sheets",
      rate: 18.5,
      amount: 277500,
    },
    {
      id: "li-2",
      itemType: "CTP Plates",
      description: "Kodak Electra XD Thermal CTP Plates (770x1030 mm)",
      quantity: 100,
      unit: "Plates",
      rate: 380.0,
      amount: 38000,
    },
  ]);

  const itemTypes = [
    "FBB Paperboard",
    "Duplex Board",
    "Kraft Board",
    "Offset CMYK Inks",
    "Pantone Spot Inks",
    "CTP Plates",
    "Thermal BOPP Film",
    "UV Varnish & Primers",
    "Pasting Adhesives",
    "Corrugated Outer Cartons",
  ];

  // Dynamic calculations
  const subtotal = lineItems.reduce((acc, curr) => acc + curr.amount, 0);
  const gstAmount = Math.round((subtotal * gstRate) / 100);
  const grandTotal = subtotal + gstAmount;

  const handleAddLine = () => {
    const newLine: POLineItem = {
      id: `li-${Date.now()}`,
      itemType: "Offset CMYK Inks",
      description: "Process CMYK Offset Inks (50kg Drum)",
      quantity: 50,
      unit: "Kg",
      rate: 480,
      amount: 24000,
    };
    setLineItems([...lineItems, newLine]);
  };

  const handleRemoveLine = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((l) => l.id !== id));
  };

  const handleUpdateLine = (id: string, field: keyof POLineItem, value: any) => {
    setLineItems(
      lineItems.map((li) => {
        if (li.id === id) {
          const updated = { ...li, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount = Number(updated.quantity) * Number(updated.rate);
          }
          return updated;
        }
        return li;
      })
    );
  };

  const handleSaveAndGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const count = purchaseOrders.length + 313;
    const poNum = `PO-2026-0${count}`;

    const newPO = createPurchaseOrder({
      poNumber: poNum,
      supplierName: vendorName,
      supplierGstin: vendorGstin,
      supplierAddress: vendorAddress,
      poDate,
      deliveryDate,
      gstRate,
      lineItems,
      subtotal,
      gstAmount,
      grandTotal,
      terms,
      status: "Approved",
    });

    openPrintModal("po", newPO);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span>Procurement & Supplier Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Purchase Order Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create GST-compliant purchase orders for paperboard, inks, thermal films, and CTP plates with instant PDF export.
          </p>
        </div>

        {/* Existing POs summary */}
        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-right">
          <div className="text-[10px] uppercase font-bold text-emerald-700 font-mono">
            Active Supplier POs
          </div>
          <div className="text-lg font-extrabold text-emerald-950 font-mono">
            {purchaseOrders.length} Issued
          </div>
        </div>
      </div>

      {/* PO Form */}
      <form onSubmit={handleSaveAndGenerate} className="space-y-6">
        {/* Vendor & General Info Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
            Supplier & Procurement Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Vendor / Supplier Name *
              </label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="e.g. Paper Trade Corp."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Supplier GSTIN
              </label>
              <input
                type="text"
                value={vendorGstin}
                onChange={(e) => setVendorGstin(e.target.value)}
                placeholder="e.g. 27AAACP9910D1ZL"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                GST Rate (%) *
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option value={0}>0% (Exempted)</option>
                <option value={5}>5% (Special Substrates)</option>
                <option value={12}>12% (Standard Paper)</option>
                <option value={18}>18% (Standard Packaging / Inks)</option>
                <option value={28}>28% (Specialty Chemicals)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                PO Date
              </label>
              <input
                type="text"
                value={poDate}
                onChange={(e) => setPoDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Expected Plant Delivery Date
              </label>
              <input
                type="text"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold text-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* Line Items Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Procurement Line Items & Specifications
            </h3>
            <button
              type="button"
              onClick={handleAddLine}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Add Line Item</span>
            </button>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3 w-44">Item Type</th>
                  <th className="p-3">Specification / Description</th>
                  <th className="p-3 w-28">Quantity</th>
                  <th className="p-3 w-24">Unit</th>
                  <th className="p-3 w-28">Rate (₹)</th>
                  <th className="p-3 w-32">Total (₹)</th>
                  <th className="p-3 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lineItems.map((li) => (
                  <tr key={li.id}>
                    {/* Item Type */}
                    <td className="p-2">
                      <select
                        value={li.itemType}
                        onChange={(e) => handleUpdateLine(li.id, "itemType", e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                      >
                        {itemTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </td>

                    {/* Description */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={li.description}
                        onChange={(e) => handleUpdateLine(li.id, "description", e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="p-2">
                      <input
                        type="number"
                        value={li.quantity}
                        onChange={(e) => handleUpdateLine(li.id, "quantity", Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                      />
                    </td>

                    {/* Unit */}
                    <td className="p-2">
                      <select
                        value={li.unit}
                        onChange={(e) => handleUpdateLine(li.id, "unit", e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                      >
                        <option value="Sheets">Sheets</option>
                        <option value="Kg">Kg</option>
                        <option value="Plates">Plates</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Liters">Liters</option>
                        <option value="Units">Units</option>
                      </select>
                    </td>

                    {/* Rate */}
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.1"
                        value={li.rate}
                        onChange={(e) => handleUpdateLine(li.id, "rate", Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                      />
                    </td>

                    {/* Amount */}
                    <td className="p-2 font-mono font-bold text-slate-900 text-right">
                      ₹{li.amount.toLocaleString()}
                    </td>

                    {/* Remove */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(li.id)}
                        className="p-1.5 text-slate-400 hover:text-red-700 rounded"
                        title="Remove Line"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Terms and Totals Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
            {/* Terms */}
            <div className="md:col-span-7">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Purchase Order Terms & Commercial Conditions
              </label>
              <textarea
                rows={4}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-mono"
              />
            </div>

            {/* Totals Summary */}
            <div className="md:col-span-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Subtotal (Excl. Tax):</span>
                <span className="font-mono font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>GST ({gstRate}%):</span>
                <span className="font-mono font-bold text-slate-900">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex justify-between items-center text-sm font-extrabold text-emerald-950">
                <span>Grand Total (INR):</span>
                <span className="font-mono text-base font-black text-emerald-900">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-7 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>Save & Generate Printable PO</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
