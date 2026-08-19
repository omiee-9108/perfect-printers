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
  UserCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  Printer,
  Home,
  Check,
  Shield,
  Palette,
} from "lucide-react";
import { ERP_THEME_OPTIONS } from "../types";

export default function ErpNavbar() {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUserRole,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    orders,
    inventory,
    erpTheme,
    setErpTheme,
    logout,
  } = useErp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

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
    { id: "job-order", label: "Job Order", icon: Layers, badge: pendingCount > 0 ? pendingCount : undefined, badgeColor: "bg-amber-500", rolesAllowed: ["ADMIN", "SALES", "PRODUCTION", "ACCOUNTS"] },
    { id: "new-order", label: "New Order", icon: PlusCircle, rolesAllowed: ["ADMIN", "SALES", "PRODUCTION"] },
    { id: "master-data", label: "Master Data", icon: Database, rolesAllowed: ["ADMIN", "SALES", "PRODUCTION", "ACCOUNTS"] },
    { id: "inventory", label: "Inventory", icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: "bg-red-500", rolesAllowed: ["ADMIN", "ACCOUNTS", "PRODUCTION"] },
    { id: "completed", label: "Completed", icon: CheckCircle, rolesAllowed: ["ADMIN", "SALES", "PRODUCTION", "ACCOUNTS"] },
    { id: "on-hold", label: "On Hold", icon: PauseCircle, badge: holdCount > 0 ? holdCount : undefined, badgeColor: "bg-amber-600", rolesAllowed: ["ADMIN", "SALES", "PRODUCTION", "ACCOUNTS"] },
    { id: "cancelled", label: "Cancelled", icon: XCircle, badge: cancelledCount > 0 ? cancelledCount : undefined, badgeColor: "bg-slate-500", rolesAllowed: ["ADMIN", "SALES", "PRODUCTION", "ACCOUNTS"] },
    { id: "job-history", label: "Job History", icon: History, rolesAllowed: ["ADMIN", "ACCOUNTS"] },
    { id: "purchase-order", label: "Purchase Order", icon: ShoppingCart, rolesAllowed: ["ADMIN", "ACCOUNTS"] },
    { id: "quotation", label: "Quotation", icon: FileSpreadsheet, rolesAllowed: ["ADMIN", "SALES", "ACCOUNTS"] },
    { id: "calculators", label: "Cost Calculators", icon: Calculator, rolesAllowed: ["ADMIN", "SALES", "PRODUCTION", "ACCOUNTS"] },
    { id: "reports", label: "Reports", icon: BarChart3, rolesAllowed: ["ADMIN", "ACCOUNTS"] },
  ];

  const filteredTabs = tabs.filter((t) => t.rolesAllowed.includes(currentUser.role));

  const getHeaderStyles = () => {
    switch (erpTheme) {
      case "dark-carbon":
        return {
          header: "bg-[#070a12] border-slate-800/80 text-white",
          subBorder: "border-slate-800/60",
          brandBadge: "bg-cyan-500 text-slate-950",
          roleTag: "bg-slate-900 text-cyan-300 border-slate-700",
          btnBg: "bg-slate-900 hover:bg-slate-800 border-slate-700 text-cyan-300 hover:text-white",
          accentIcon: "text-cyan-400",
        };
      case "executive-navy":
        return {
          header: "bg-[#05162a] border-blue-950/80 text-white",
          subBorder: "border-blue-950/60",
          brandBadge: "bg-amber-500 text-slate-950",
          roleTag: "bg-blue-950 text-amber-300 border-blue-800",
          btnBg: "bg-blue-950 hover:bg-blue-900 border-blue-800 text-amber-200 hover:text-white",
          accentIcon: "text-amber-400",
        };
      case "clean-minimalist":
        return {
          header: "bg-[#0f172a] border-slate-800/80 text-white",
          subBorder: "border-slate-800/60",
          brandBadge: "bg-blue-600 text-white",
          roleTag: "bg-slate-800 text-blue-300 border-slate-700",
          btnBg: "bg-slate-800 hover:bg-slate-700 border-slate-700 text-blue-200 hover:text-white",
          accentIcon: "text-blue-400",
        };
      default:
        return {
          header: "bg-[#064e3b] border-emerald-800 text-white",
          subBorder: "border-emerald-800/80",
          brandBadge: "bg-emerald-500 text-slate-950",
          roleTag: "bg-emerald-800 text-emerald-300 border-emerald-600",
          btnBg: "bg-emerald-900/80 hover:bg-emerald-800 border-emerald-700 text-emerald-200 hover:text-white",
          accentIcon: "text-emerald-400",
        };
    }
  };

  const themeStyle = getHeaderStyles();

  return (
    <header className={`sticky top-0 z-40 shadow-xl border-b transition-colors duration-300 ${themeStyle.header}`}>
      {/* Top Meta Bar */}
      <div className={`max-w-[1700px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between border-b ${themeStyle.subBorder}`}>
        {/* Brand Mark */}
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black shadow-md ${themeStyle.brandBadge}`}>
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">
                PERFECT PRINTERS ERP
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${themeStyle.roleTag}`}>
                PACKAGING MES
              </span>
            </div>
            <p className="text-[11px] text-slate-300/80 font-mono hidden sm:block">
              Job Tracking & Production Control System
            </p>
          </div>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-3">
          {/* Quick New Order Button */}
          {currentUser.role !== "ACCOUNTS" && (
            <button
              onClick={() => setActiveTab("new-order")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Direct Order Entry</span>
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fadeIn">
                <div className="p-3.5 bg-emerald-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-300" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider">
                      Floor Alerts & Logs ({unreadNotifs.length} unread)
                    </span>
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-emerald-300 hover:text-white underline font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer hover:bg-emerald-50 ${
                          !n.isRead ? "bg-emerald-50/60 font-semibold" : "text-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ERP Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setThemeDropdownOpen(!themeDropdownOpen);
                setRoleDropdownOpen(false);
                setNotifDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-xs font-bold text-emerald-200 hover:text-white transition-all shadow-sm"
              title="Switch ERP Theme"
            >
              <Palette className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 overflow-hidden animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                    Select ERP Color Palette
                  </div>
                  <div className="text-xs font-bold text-slate-800">4 Plant Display Profiles</div>
                </div>

                <div className="space-y-1">
                  {ERP_THEME_OPTIONS.map((themeOpt) => {
                    const isSelected = erpTheme === themeOpt.id;
                    return (
                      <button
                        key={themeOpt.id}
                        onClick={() => {
                          setErpTheme(themeOpt.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-slate-100 font-bold border-2 border-emerald-600 text-slate-900"
                            : "hover:bg-slate-50 text-slate-700 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Color Swatch Pill */}
                          <div className="flex items-center -space-x-1 flex-shrink-0">
                            <span
                              className="w-4 h-4 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: themeOpt.headerBg }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: themeOpt.accent }}
                            />
                          </div>

                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{themeOpt.name}</span>
                              {themeOpt.isDark && (
                                <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-900 text-cyan-300 rounded">
                                  Dark
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                              {themeOpt.subtitle}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-left transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-inner">
                {currentUser.name[0]}
              </div>
              <div className="hidden md:block text-xs">
                <div className="font-bold leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-emerald-300 font-mono font-bold flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            {/* Role Switcher Menu */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 overflow-hidden animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                    Switch Active ERP Role
                  </div>
                  <div className="text-xs font-bold text-slate-800">Testing & Access Control</div>
                </div>

                <div className="space-y-1">
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setCurrentUserRole(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between ${
                        currentUser.role === r.role
                          ? "bg-emerald-100/80 text-emerald-950 font-bold border border-emerald-300"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{r.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                          {r.desc}
                        </div>
                      </div>
                      {currentUser.role === r.role && (
                        <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-[11px]">
                  <Link
                    href="/"
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Home className="w-3 h-3" /> Public Website
                  </Link>
                  <span className="text-slate-400 font-mono text-[10px]">ERP v2.4</span>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out / Lock Session Button */}
          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-lg bg-emerald-900/60 hover:bg-red-950/70 text-emerald-200 hover:text-red-200 border border-emerald-700 hover:border-red-700 transition-colors"
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

          const getTabStyles = () => {
            if (isActive) {
              switch (erpTheme) {
                case "dark-carbon":
                  return "bg-cyan-950/90 text-cyan-300 shadow-inner border border-cyan-600";
                case "executive-navy":
                  return "bg-blue-900 text-amber-300 shadow-inner border border-amber-600/70";
                case "clean-minimalist":
                  return "bg-slate-800 text-blue-300 shadow-inner border border-blue-600";
                default:
                  return "bg-emerald-800 text-white shadow-inner border border-emerald-600";
              }
            } else {
              switch (erpTheme) {
                case "dark-carbon":
                  return "text-slate-400 hover:text-cyan-200 hover:bg-slate-900/80";
                case "executive-navy":
                  return "text-blue-200/80 hover:text-amber-200 hover:bg-blue-950/80";
                case "clean-minimalist":
                  return "text-slate-400 hover:text-white hover:bg-slate-800/60";
                default:
                  return "text-emerald-100/80 hover:text-white hover:bg-emerald-900/60";
              }
            }
          };

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap relative flex-shrink-0 ${getTabStyles()}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full text-white ${
                    tab.badgeColor || "bg-emerald-600"
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
