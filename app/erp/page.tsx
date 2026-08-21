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
  const { activeTab, setActiveTab, currentUser, isAuthenticated } = useErp();
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

  const TAB_ROLES: Record<string, string[]> = {
    "job-order": ["ADMIN", "SALES", "PRODUCTION"],
    "new-order": ["ADMIN", "SALES"],
    "master-data": ["ADMIN", "SALES", "PRODUCTION", "ACCOUNTS"],
    "inventory": ["ADMIN", "PRODUCTION", "ACCOUNTS"],
    "completed": ["ADMIN", "SALES", "PRODUCTION"],
    "on-hold": ["ADMIN", "SALES", "PRODUCTION"],
    "cancelled": ["ADMIN", "SALES", "PRODUCTION"],
    "job-history": ["ADMIN", "PRODUCTION", "ACCOUNTS"],
    "purchase-order": ["ADMIN", "ACCOUNTS"],
    "quotation": ["ADMIN", "SALES", "ACCOUNTS"],
    "calculators": ["ADMIN", "SALES", "PRODUCTION"],
    "reports": ["ADMIN", "ACCOUNTS"],
  };

  const isTabAllowed = TAB_ROLES[activeTab]?.includes(currentUser.role);

  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#080C14] text-slate-100 selection:bg-cyan-400 selection:text-black">
      {/* ERP Master Top Navigation */}
      <ErpNavbar />

      {/* Main ERP Work Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!isTabAllowed ? (
          <div className="max-w-xl mx-auto my-16 bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto text-amber-400 font-bold border border-amber-500/20 text-2xl">
              🛡️
            </div>
            <h2 className="text-xl font-black text-white">Module Access Restricted</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your current logged in profile role <span className="font-bold font-mono px-2 py-0.5 bg-slate-800 rounded text-cyan-300 border border-slate-700">{currentUser.role}</span> does not have authorization to access the <strong>{activeTab.replace("-", " ").toUpperCase()}</strong> module.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  const defaultTab = currentUser.role === "SALES" ? "new-order" : currentUser.role === "ACCOUNTS" ? "purchase-order" : "job-order";
                  setActiveTab(defaultTab as any);
                }}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Go to My Permitted Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>

      {/* Global Printable Document Modals (Challan, PO, Quotation, Job Card) */}
      <DocumentModals />

      {/* Footer info strip */}
      <footer className="bg-[#05080E] text-slate-400 text-[11px] font-mono py-3 px-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          PERFECT PRINTERS ERP • Industrial MES • Logged in as:{" "}
          <strong className="text-slate-100">{currentUser.name}</strong> ({currentUser.role})
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Server Time: <span className="text-cyan-400 font-bold">{clientTime || "Syncing..."}</span></span>
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
