"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useErp, ErpTab } from "../context/ErpContext";
import { UserRole } from "../types";
import {
  Layers,
  PlusCircle,
  Database,
  Boxes,
  CheckCircle,
  PauseCircle,
  XCircle,
  History,
  ShoppingCart,
  FileSpreadsheet,
  Calculator,
  BarChart3,
  Bell,
  LogOut,
  ChevronDown,
  Printer,
  Home,
  Check,
  Shield,
} from "lucide-react";

export default function ErpNavbar() {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUserRole,
    notifications,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
    orders,
    inventory,
    logout,
  } = useErp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const holdCount = orders.filter((o) => o.status === "On Hold").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;
  const lowStockCount = inventory.filter((i) => i.quantity <= i.reorderLevel).length;

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: "ADMIN", title: "Admin (Full Access)", desc: "Can view and manage all 12 modules & financials" },
    { role: "SALES", title: "Sales Executive", desc: "Access to Job Orders, New Orders, Quotations & Calculators" },
    { role: "PRODUCTION", title: "Production Floor Manager", desc: "Access to Floor Stages, Machines, Stock & Job Dockets" },
    { role: "ACCOUNTS", title: "Accounts & Billing", desc: "Access to Inventory, POs, Quotations, Reports & Invoicing" },
  ];

  interface NavTabItem {
    id: ErpTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
    rolesAllowed: UserRole[];
  }

  const tabs: NavTabItem[] = [
    { id: "job-order", label: "Job Order", icon: Layers, badge: pendingCount > 0 ? pendingCount : undefined, badgeColor: "bg-amber-500", rolesAllowed: ["ADMIN", "SALES", "PRODUCTION"] },
    { id: "new-order", label: "New Order", icon: PlusCircle, rolesAllowed: ["ADMIN", "SALES"] },
    { id: "master-data", label: "Master Data", icon: Database, rolesAllowed: ["ADMIN", "SALES", "PRODUCTION", "ACCOUNTS"] },
    { id: "inventory", label: "Inventory", icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: "bg-red-500", rolesAllowed: ["ADMIN", "PRODUCTION", "ACCOUNTS"] },
    { id: "completed", label: "Completed", icon: CheckCircle, rolesAllowed: ["ADMIN", "SALES", "PRODUCTION"] },
    { id: "on-hold", label: "On Hold", icon: PauseCircle, badge: holdCount > 0 ? holdCount : undefined, badgeColor: "bg-amber-600", rolesAllowed: ["ADMIN", "SALES", "PRODUCTION"] },
    { id: "cancelled", label: "Cancelled", icon: XCircle, badge: cancelledCount > 0 ? cancelledCount : undefined, badgeColor: "bg-slate-500", rolesAllowed: ["ADMIN", "SALES", "PRODUCTION"] },
    { id: "job-history", label: "Job History", icon: History, rolesAllowed: ["ADMIN", "PRODUCTION", "ACCOUNTS"] },
    { id: "purchase-order", label: "Purchase Order", icon: ShoppingCart, rolesAllowed: ["ADMIN", "ACCOUNTS"] },
    { id: "quotation", label: "Quotation", icon: FileSpreadsheet, rolesAllowed: ["ADMIN", "SALES", "ACCOUNTS"] },
    { id: "calculators", label: "Cost Calculators", icon: Calculator, rolesAllowed: ["ADMIN", "SALES", "PRODUCTION"] },
    { id: "reports", label: "Reports", icon: BarChart3, rolesAllowed: ["ADMIN", "ACCOUNTS"] },
  ];

  const filteredTabs = tabs.filter((t) => t.rolesAllowed.includes(currentUser.role));

  return (
    <header className="sticky top-0 z-40 shadow-2xl bg-[#090D16] border-b border-slate-800 text-white">
      {/* Top Meta Bar */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-slate-800/80">
        {/* Brand Mark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-slate-950 shadow-md">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">
                PERFECT PRINTERS ERP
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-slate-900 text-cyan-300 border-slate-700">
                PACKAGING MES
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Job Tracking & Production Control System
            </p>
          </div>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-3">
          {/* Quick New Order Button (Admin & Sales only) */}
          {(currentUser.role === "ADMIN" || currentUser.role === "SALES") && (
            <button
              onClick={() => setActiveTab("new-order")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Direct Order Entry</span>
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Real-Time Floor Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
                    {unreadNotifs.length}
                  </span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-400 animate-ping opacity-75" />
                </>
              )}
            </button>

            {/* Notification Dropdown Tray */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-[420px] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 z-50 overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="p-3.5 bg-slate-950 border-b border-slate-800 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-300">
                      Live Press Alerts ({unreadNotifs.length} unread)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 font-mono">
                      No notifications recorded yet.
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const isUnread = !n.isRead;
                      const typeStyles =
                        n.type === "critical"
                          ? "border-l-4 border-l-red-500 bg-red-950/20"
                          : n.type === "warning"
                          ? "border-l-4 border-l-amber-500 bg-amber-950/20"
                          : n.type === "success"
                          ? "border-l-4 border-l-emerald-500 bg-emerald-950/20"
                          : "border-l-4 border-l-cyan-500 bg-slate-950/30";

                      return (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.orderId) {
                              setActiveTab("job-order");
                              setNotifDropdownOpen(false);
                            }
                          }}
                          className={`p-3.5 text-xs transition-all cursor-pointer hover:bg-slate-800/80 ${typeStyles} ${
                            isUnread ? "font-semibold" : "opacity-75"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5">
                              {isUnread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 animate-pulse" />
                              )}
                              <span className={`text-[11px] font-bold ${isUnread ? "text-white" : "text-slate-300"}`}>
                                {n.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug pl-3">
                            {n.message}
                          </p>
                          {n.orderId && (
                            <div className="pl-3 mt-1.5 flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                              <span>Click to view order</span>
                              <span>→</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer simulation / status ticker */}
                <div className="p-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-Time Stream Active</span>
                  </span>
                  <button
                    onClick={() => {
                      addNotification({
                        title: "⚡ Manual Shop-Floor Ping",
                        message: `Telemetry heartbeat triggered at ${new Date().toLocaleTimeString()} by ${currentUser.name}`,
                        type: "info",
                      });
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                  >
                    + Ping Test Alert
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-inner">
                {currentUser.name[0]}
              </div>
              <div className="hidden md:block text-xs">
                <div className="font-bold leading-tight text-slate-200">{currentUser.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono font-bold flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Menu */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 z-50 p-2 overflow-hidden animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                    Switch Active ERP Role
                  </div>
                  <div className="text-xs font-bold text-slate-200">Testing & Access Control</div>
                </div>

                <div className="space-y-1">
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setCurrentUserRole(r.role);
                        setRoleDropdownOpen(false);

                        // Check if current active tab is permitted for the new role
                        const allowedTabsForNewRole = tabs
                          .filter((t) => t.rolesAllowed.includes(r.role))
                          .map((t) => t.id);

                        if (!allowedTabsForNewRole.includes(activeTab)) {
                          const defaultTabMap: Record<UserRole, ErpTab> = {
                            ADMIN: "job-order",
                            SALES: "new-order",
                            PRODUCTION: "job-order",
                            ACCOUNTS: "purchase-order",
                          };
                          setActiveTab(defaultTabMap[r.role] || "master-data");
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between ${
                        currentUser.role === r.role
                          ? "bg-slate-800 text-cyan-300 font-bold border border-cyan-500/50"
                          : "hover:bg-slate-800/60 text-slate-300"
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{r.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                          {r.desc}
                        </div>
                      </div>
                      {currentUser.role === r.role && (
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between px-2 text-[11px]">
                  <Link
                    href="/"
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Home className="w-3 h-3" /> Public Website
                  </Link>
                  <span className="text-slate-500 font-mono text-[10px]">ERP v2.4</span>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out / Lock Session Button */}
          <button
            type="button"
            data-testid="erp-logout-btn"
            onClick={logout}
            className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/80 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-700 transition-colors"
            title="Lock Session / Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 12-Tab Primary Navigation Bar */}
      <nav className="max-w-[1700px] mx-auto px-2 sm:px-4 flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">
        {filteredTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              data-testid={`erp-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap relative flex-shrink-0 ${
                isActive
                  ? "bg-slate-800 text-cyan-300 shadow-inner border border-cyan-500/50"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full text-white ${
                    tab.badgeColor || "bg-cyan-600"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
