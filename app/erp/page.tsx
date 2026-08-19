"use client";

import React from "react";
import { ErpProvider, useErp } from "./context/ErpContext";
import ErpNavbar from "./components/ErpNavbar";
import JobOrderDashboard from "./components/JobOrderDashboard";
import NewOrderEntry from "./components/NewOrderEntry";
import MasterDataView from "./components/MasterDataView";
import InventoryView from "./components/InventoryView";
import StatusViews from "./components/StatusViews";
import JobHistoryView from "./components/JobHistoryView";
import PurchaseOrderView from "./components/PurchaseOrderView";
import QuotationView from "./components/QuotationView";
import CostCalculators from "./components/CostCalculators";
import ReportsView from "./components/ReportsView";
import DocumentModals from "./components/DocumentModals";
import ErpLoginGate from "./components/ErpLoginGate";

function ErpContent() {
  const { activeTab, currentUser, erpTheme, isAuthenticated } = useErp();
  const [clientTime, setClientTime] = React.useState<string>("");

  React.useEffect(() => {
    setClientTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setClientTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return <ErpLoginGate />;
  }

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        erpTheme === "dark-carbon"
          ? "bg-[#0b0f19] text-slate-100 selection:bg-cyan-500 selection:text-black"
          : erpTheme === "executive-navy"
          ? "bg-[#f1f5f9] text-slate-900 selection:bg-amber-400 selection:text-black"
          : erpTheme === "clean-minimalist"
          ? "bg-[#f8fafc] text-slate-900 selection:bg-blue-300 selection:text-blue-950"
          : "bg-[#f0fdf4] text-slate-900 selection:bg-emerald-300 selection:text-emerald-950"
      }`}
    >
      {/* ERP Master Top Navigation */}
      <ErpNavbar />

      {/* Main ERP Work Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "job-order" && <JobOrderDashboard />}
        {activeTab === "new-order" && <NewOrderEntry />}
        {activeTab === "master-data" && <MasterDataView />}
        {activeTab === "inventory" && <InventoryView />}
        {activeTab === "completed" && <StatusViews statusType="Completed" />}
        {activeTab === "on-hold" && <StatusViews statusType="On Hold" />}
        {activeTab === "cancelled" && <StatusViews statusType="Cancelled" />}
        {activeTab === "job-history" && <JobHistoryView />}
        {activeTab === "purchase-order" && <PurchaseOrderView />}
        {activeTab === "quotation" && <QuotationView />}
        {activeTab === "calculators" && <CostCalculators />}
        {activeTab === "reports" && <ReportsView />}
      </main>

      {/* Global Printable Document Modals (Challan, PO, Quotation, Job Card) */}
      <DocumentModals />

      {/* Footer info strip */}
      <footer className="bg-emerald-950 text-emerald-300/80 text-[11px] font-mono py-3 px-6 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          PERFECT PRINTERS ERP • Mono Carton Production MES • Logged in as:{" "}
          <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
        </div>
        <div className="flex items-center gap-4 text-emerald-400">
          <span>Server Time: {clientTime || "Syncing..."}</span>
          <span>Plant: Miraj MIDC Unit 1</span>
        </div>
      </footer>
    </div>
  );
}

export default function ErpPage() {
  return (
    <ErpProvider>
      <ErpContent />
    </ErpProvider>
  );
}
