"use client";

import React, { useRef } from "react";
import { useErp } from "../context/ErpContext";
import { Printer, X, Download, CheckCircle, ShieldCheck } from "lucide-react";

export default function DocumentModals() {
  const { activePrintModal, closePrintModal, dispatchOrder } = useErp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!activePrintModal.type || !activePrintModal.data) return null;

  const { type, data } = activePrintModal;

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmDispatch = () => {
    if (type === "challan" && data.id) {
      const challanNo = `DC-2026-0${Math.floor(400 + Math.random() * 500)}`;
      dispatchOrder(data.id, challanNo);
      closePrintModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white animate-fadeIn">
      {/* Container Box */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-6 print:m-0 print:border-none print:shadow-none print:w-full print:max-w-none">
        
        {/* Top Control Bar (Hidden during Print) */}
        <div className="p-4 bg-emerald-950 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider">
              {type === "challan" && "Official Delivery Challan (Triplicate Copy)"}
              {type === "po" && "Commercial Purchase Order Document"}
              {type === "quote" && "Sales Quotation & Technical Proposal"}
              {type === "jobcard" && "Press Floor Job Docket & Quality Card"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {type === "challan" && data.status !== "Completed" && (
              <button
                onClick={handleConfirmDispatch}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm"
              >
                Confirm & Mark Dispatched
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white text-emerald-950 hover:bg-slate-100 shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={closePrintModal}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="p-8 sm:p-12 text-slate-900 text-xs font-sans space-y-6 print:p-6 print:text-black">
          
          {/* Header Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-950 font-serif">
                PERFECT PRINTERS
              </div>
              <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                Precision Commercial Offset & Mono Carton Packaging Press
              </div>
              <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                MIDC Industrial Area, Miraj, Sangli, Maharashtra - 416410<br />
                Phone: +91 99224 49926 | Email: info@perfectprintersmiraj.com<br />
                <strong>GSTIN:</strong> 27AABCP8812K1ZQ • <strong>State Code:</strong> 27 (Maharashtra)
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold text-sm uppercase rounded print:border print:border-black print:text-black print:bg-white">
                {type === "challan" && "DELIVERY CHALLAN"}
                {type === "po" && "PURCHASE ORDER"}
                {type === "quote" && "SALES QUOTATION"}
                {type === "jobcard" && "JOB DOCKET"}
              </div>
              <div className="text-xs font-mono font-bold mt-2">
                Doc No: {data.challanNo || data.poNumber || data.quoteNumber || data.id}
              </div>
              <div className="text-[11px] text-slate-600 font-mono">
                Date: {data.dispatchDate || data.poDate || data.quoteDate || data.orderDate || "19 Aug 2026"}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 1. DELIVERY CHALLAN VIEW */}
          {/* ========================================================= */}
          {type === "challan" && (
            <div className="space-y-6">
              {/* Consignee & Dispatch Meta */}
              <div className="grid grid-cols-2 gap-4 p-4 border border-slate-300 rounded-xl">
                <div>
                  <div className="font-bold text-[10px] uppercase font-mono text-slate-500">
                    Consignee / Deliver To:
                  </div>
                  <div className="font-extrabold text-sm text-slate-900 mt-0.5">
                    {data.customerName}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Customer Code: <strong>{data.customerCode}</strong><br />
                    MIDC Industrial Zone, Sangli-Miraj Cluster<br />
                    GSTIN: 27AAACC1206D1ZM
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[10px] uppercase font-mono text-slate-500">
                    Dispatch & Transport Details:
                  </div>
                  <div className="text-[11px] text-slate-700 font-mono mt-1 space-y-1">
                    <div>Vehicle No: <strong>MH 10 CR 4412 (Tata 407)</strong></div>
                    <div>Transporter: <strong>Sangli Local Express Logistics</strong></div>
                    <div>LR / Bilty No: <strong>LR-2026-9042</strong></div>
                    <div>Place of Supply: <strong>Maharashtra (27)</strong></div>
                  </div>
                </div>
              </div>

              {/* Goods Table */}
              <table className="w-full border-collapse border border-slate-300 text-left">
                <thead className="bg-slate-100 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="border border-slate-300 p-2.5 w-12 text-center">Sr.</th>
                    <th className="border border-slate-300 p-2.5">Description of Goods / Packaging</th>
                    <th className="border border-slate-300 p-2.5">HSN Code</th>
                    <th className="border border-slate-300 p-2.5 text-right w-24">Boxes</th>
                    <th className="border border-slate-300 p-2.5 text-right w-28">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2.5 text-center font-mono">1</td>
                    <td className="border border-slate-300 p-2.5">
                      <div className="font-bold text-slate-900">{data.jobName}</div>
                      <div className="text-[10px] text-slate-600 font-mono">
                        Job Code: {data.jobCode} • Substrate: {data.boardType} ({data.boardGsm} GSM)
                      </div>
                    </td>
                    <td className="border border-slate-300 p-2.5 font-mono">48192020</td>
                    <td className="border border-slate-300 p-2.5 font-mono text-right">
                      {Math.ceil(data.quantity / 500)} Outer Ctn
                    </td>
                    <td className="border border-slate-300 p-2.5 font-mono font-bold text-right text-sm">
                      {data.quantity.toLocaleString()} Pcs
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Terms & Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="text-[10px] text-slate-600 space-y-1">
                  <div className="font-bold uppercase font-mono text-slate-800">Terms & Declarations:</div>
                  <p>1. Received material in good condition and exact verified count.</p>
                  <p>2. Any transit damage must be endorsed on this copy immediately.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center text-[10px] font-mono">
                  <div className="pt-12 border-t border-slate-400">
                    Receiver's Signature & Seal
                  </div>
                  <div className="pt-12 border-t border-slate-400 font-bold">
                    For PERFECT PRINTERS
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. PURCHASE ORDER VIEW */}
          {/* ========================================================= */}
          {type === "po" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 border border-slate-300 rounded-xl">
                <div>
                  <div className="font-bold text-[10px] uppercase font-mono text-slate-500">Supplier:</div>
                  <div className="font-bold text-slate-900 mt-0.5 text-sm">{data.supplierName}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {data.supplierAddress}<br />
                    GSTIN: <strong>{data.supplierGstin}</strong>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-700 space-y-1">
                  <div>Delivery Plant: <strong>Perfect Printers Miraj MIDC</strong></div>
                  <div>PO Date: <strong>{data.poDate}</strong></div>
                  <div>Required By: <strong>{data.deliveryDate}</strong></div>
                </div>
              </div>

              {/* Items */}
              <table className="w-full border-collapse border border-slate-300 text-left">
                <thead className="bg-slate-100 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="border border-slate-300 p-2 text-center w-10">#</th>
                    <th className="border border-slate-300 p-2">Item Description</th>
                    <th className="border border-slate-300 p-2 text-right">Quantity</th>
                    <th className="border border-slate-300 p-2 text-right">Rate (₹)</th>
                    <th className="border border-slate-300 p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lineItems?.map((li: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-300 p-2 font-bold">{li.description}</td>
                      <td className="border border-slate-300 p-2 font-mono text-right">{li.quantity} {li.unit}</td>
                      <td className="border border-slate-300 p-2 font-mono text-right">₹{li.rate}</td>
                      <td className="border border-slate-300 p-2 font-mono font-bold text-right">₹{li.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} className="border border-slate-300 p-2 text-right font-bold">Subtotal:</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-right">₹{data.subtotal?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="border border-slate-300 p-2 text-right font-bold">GST ({data.gstRate}%):</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-right">₹{data.gstAmount?.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td colSpan={4} className="border border-slate-300 p-2 text-right font-black text-sm">Grand Total (INR):</td>
                    <td className="border border-slate-300 p-2 font-mono font-black text-right text-sm">₹{data.grandTotal?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-[10px] text-slate-600 pt-2 font-mono whitespace-pre-line">
                <strong>Terms & Conditions:</strong><br />
                {data.terms}
              </div>

              <div className="pt-12 flex justify-end text-center text-[10px] font-mono">
                <div className="border-t border-slate-400 pt-1 w-48 font-bold">
                  Authorized Purchase Signatory
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. SALES QUOTATION VIEW */}
          {/* ========================================================= */}
          {type === "quote" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 border border-slate-300 rounded-xl">
                <div>
                  <div className="font-bold text-[10px] uppercase font-mono text-slate-500">Quotation For:</div>
                  <div className="font-bold text-slate-900 mt-0.5 text-sm">{data.customerName}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Attn: <strong>{data.contactPerson}</strong>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-700 space-y-1">
                  <div>Quotation Date: <strong>{data.quoteDate}</strong></div>
                  <div>Offer Validity: <strong>{data.validUntil}</strong></div>
                  <div>Payment Terms: <strong>50% Advance</strong></div>
                </div>
              </div>

              {/* Items */}
              <table className="w-full border-collapse border border-slate-300 text-left">
                <thead className="bg-slate-100 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="border border-slate-300 p-2 text-center w-10">#</th>
                    <th className="border border-slate-300 p-2">Job Scope & Technical Specs</th>
                    <th className="border border-slate-300 p-2 text-right">Qty</th>
                    <th className="border border-slate-300 p-2 text-right">Unit Rate</th>
                    <th className="border border-slate-300 p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lineItems?.map((li: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-300 p-2">
                        <div className="font-bold text-slate-900">{li.jobContext}</div>
                        <div className="text-[10px] text-slate-600">{li.specs}</div>
                      </td>
                      <td className="border border-slate-300 p-2 font-mono text-right">{li.quantity.toLocaleString()}</td>
                      <td className="border border-slate-300 p-2 font-mono text-right">₹{li.rate} / pc</td>
                      <td className="border border-slate-300 p-2 font-mono font-bold text-right">₹{li.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} className="border border-slate-300 p-2 text-right font-bold">Estimated Subtotal:</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-right">₹{data.subtotal?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="border border-slate-300 p-2 text-right font-bold">GST ({data.gstRate}%):</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-right">₹{data.gstAmount?.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td colSpan={4} className="border border-slate-300 p-2 text-right font-black text-sm">Total Proposal Value (INR):</td>
                    <td className="border border-slate-300 p-2 font-mono font-black text-right text-sm">₹{data.grandTotal?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-[10px] text-slate-600 pt-2 font-mono whitespace-pre-line">
                <strong>Estimation Terms:</strong><br />
                {data.terms}
              </div>

              <div className="pt-12 flex justify-end text-center text-[10px] font-mono">
                <div className="border-t border-slate-400 pt-1 w-48 font-bold">
                  Commercial Estimator
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. JOB DOCKET / FLOOR QUALITY CARD */}
          {/* ========================================================= */}
          {type === "jobcard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs">
                <div>Order ID: <strong>{data.id}</strong></div>
                <div>Job Code: <strong>{data.jobCode}</strong></div>
                <div>Target Due: <strong>{data.dueDate}</strong></div>
              </div>

              <div className="p-4 border border-slate-300 rounded-xl space-y-2">
                <div className="font-bold text-base">{data.jobName}</div>
                <div className="text-xs text-slate-600">Client: <strong>{data.customerName}</strong></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-400">Carton Count</div>
                  <div className="font-bold text-sm">{data.quantity.toLocaleString()} pcs</div>
                </div>
                <div className="p-2 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-400">Total Sheets</div>
                  <div className="font-bold text-sm">{data.totalSheetsRequired.toLocaleString()}</div>
                </div>
                <div className="p-2 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-400">Sheet Size</div>
                  <div className="font-bold">{data.sheetSize}</div>
                </div>
                <div className="p-2 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-400">Board & GSM</div>
                  <div className="font-bold">{data.boardType} ({data.boardGsm} GSM)</div>
                </div>
              </div>

              {/* Stage Sign-off Boxes */}
              <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 p-2 font-bold font-mono text-[10px] uppercase">
                  Floor Stage Sign-off Table
                </div>
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-[10px] font-mono border-b border-slate-200">
                    <tr>
                      <th className="p-2">Stage</th>
                      <th className="p-2">Operator Name</th>
                      <th className="p-2">Machine ID</th>
                      <th className="p-2">Date / Time</th>
                      <th className="p-2">Scrap %</th>
                      <th className="p-2">QA Initials</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    <tr>
                      <td className="p-2 font-bold">1. CTP Plates</td>
                      <td className="p-2">Sunil Kadam</td>
                      <td className="p-2">PlateRite 8600</td>
                      <td className="p-2">16 Aug, 11:30</td>
                      <td className="p-2">0%</td>
                      <td className="p-2 font-bold">SK ✓</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">2. Sheet Cutting</td>
                      <td className="p-2">Anand Sawant</td>
                      <td className="p-2">Polar 115 EMC</td>
                      <td className="p-2">17 Aug, 09:15</td>
                      <td className="p-2">0.5%</td>
                      <td className="p-2 font-bold">AS ✓</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">3. Offset Press</td>
                      <td className="p-2">Ramesh Pawar</td>
                      <td className="p-2">Heidelberg CD 102</td>
                      <td className="p-2">17 Aug, 15:45</td>
                      <td className="p-2">1.8%</td>
                      <td className="p-2 font-bold">RP ✓</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">4. Punching</td>
                      <td className="p-2">Santosh Mane</td>
                      <td className="p-2">Bobst 106</td>
                      <td className="p-2">Pending</td>
                      <td className="p-2">—</td>
                      <td className="p-2">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
