"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useErp } from "../context/ErpContext";
import { UserRole } from "../types";
import {
  Printer,
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ErpLoginGate() {
  const { login, loginWithRole } = useErp();

  const [username, setUsername] = useState("admin_om");
  const [password, setPassword] = useState("perfect123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const failedAttemptsRef = React.useRef<number>(0);

  // Check lockout on mount and interval
  React.useEffect(() => {
    const checkLockout = () => {
      try {
        const until = Number(sessionStorage.getItem("pp_erp_lockout_until") || 0);
        const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000));
        setLockoutRemaining(remaining);
      } catch (e) {
        console.error(e);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) {
      setErrorMessage(`Terminal temporarily locked due to repeated failed attempts. Please wait ${lockoutRemaining}s.`);
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (!res.success) {
        failedAttemptsRef.current += 1;
        const updated = failedAttemptsRef.current;
        if (updated >= 5) {
          const lockoutUntil = Date.now() + 30000;
          try {
            sessionStorage.setItem("pp_erp_lockout_until", String(lockoutUntil));
          } catch (e) {
            console.error(e);
          }
          setLockoutRemaining(30);
          setErrorMessage("Too many failed attempts. Terminal locked for 30 seconds.");
        } else {
          setErrorMessage(`${res.message || "Invalid credentials."} (${5 - updated} attempts remaining)`);
        }
      }
    }, 450);
  };

  const quickRoles: {
    role: UserRole;
    name: string;
    username: string;
    title: string;
    badgeColor: string;
    description: string;
  }[] = [
    {
      role: "ADMIN",
      name: "Om Upadhye",
      username: "admin_om",
      title: "System Administrator",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      description: "Full master access to all 12 modules, financial KPIs & audit logs",
    },
    {
      role: "SALES",
      name: "Mahesh Joshi",
      username: "sales_mahesh",
      title: "Sales & Estimation",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      description: "Direct Order entry, Quotation generator & 7 Cost Calculators",
    },
    {
      role: "PRODUCTION",
      name: "Anand Sawant",
      username: "prod_sawant",
      title: "Floor Production Manager",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      description: "Kanban board, Press stages, Sheet allocation & Machine floor log",
    },
    {
      role: "ACCOUNTS",
      name: "Ketan Shinde",
      username: "acc_shinde",
      title: "Accounts & Procurement",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      description: "Inventory stock, Purchase Orders, Monthly expenses & Reports",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Security Notification Banner */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/80 px-4 py-2 text-center text-xs font-mono text-emerald-300 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>
          MIRAJ PLANT 1 • SECURED INTRANET PRODUCTION MES • AUTHORIZED PERSONNEL ONLY
        </span>
      </div>

      {/* Main Login Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Plant Brand & System Profile (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0f172a] to-[#090d15] border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Brand Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                  <Printer className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-extrabold text-xl tracking-tight text-white font-sans">
                    PERFECT PRINTERS
                  </h1>
                  <p className="text-[11px] font-mono text-emerald-400 font-bold">
                    Mono Carton ERP & MES v2.4
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <p className="leading-relaxed">
                  Welcome to the centralized Job Tracking & Shop-Floor Execution system for Perfect Printers, MIDC Miraj.
                </p>

                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Server Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE (99.98%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Security Protocol:</span>
                    <span className="text-slate-200">AES-256 / Role Guard</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Active Shift:</span>
                    <span className="text-amber-300 font-bold">General Shift A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Return to website */}
            <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-xs">
              <Link
                href="/"
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-bold transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Return to Public Website</span>
              </Link>
              <span className="text-slate-500 font-mono text-[10px]">MIDC Miraj</span>
            </div>
          </div>

          {/* Right: Authentication Card & One-Click Roles (7 cols) */}
          <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Plant Authentication Gateway
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sign in with your staff credentials or select a testing profile
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center gap-2 mb-4 animate-shake">
                  <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Staff Username or Plant Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      data-testid="erp-login-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin_om or om@perfectprinters.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Security Password or Terminal PIN
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      data-testid="erp-login-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password (e.g. perfect123)"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberTerminal}
                      onChange={(e) => setRememberTerminal(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span>Remember terminal session</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Default PIN: <strong className="text-cyan-400">1234</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  data-testid="erp-login-submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Plant MES</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick One-Click Demo Role Cards for Fast Testing */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  ⚡ 1-Click Role Profiles (Quick Access)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Pre-Configured</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                {quickRoles.map((qr) => (
                  <button
                    key={qr.role}
                    type="button"
                    onClick={() => loginWithRole(qr.role)}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition-all group text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white group-hover:text-emerald-300">
                        {qr.name}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${qr.badgeColor}`}>
                        {qr.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight truncate">
                      {qr.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Footer Meta */}
      <footer className="bg-[#05080e] border-t border-slate-900 py-3 px-6 text-center text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          PERFECT PRINTERS ERP • Industrial Security Gate • Miraj Industrial Cluster
        </div>
        <div className="flex items-center gap-3 text-emerald-400/80">
          <span>Encrypted Session (TLS 1.3)</span>
          <span>Terminal ID: POS-MIRAJ-01</span>
        </div>
      </footer>
    </div>
  );
}
