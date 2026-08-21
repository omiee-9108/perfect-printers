"use client";

import React, { useState } from "react";
import { useErp } from "../context/ErpContext";
import { sanitizeCsvValue } from "../utils/csv";
import {
  Database,
  Building2,
  Layers,
  Users,
  Cpu,
  Scissors,
  Shield,
  Search,
  Plus,
  Download,
  Upload,
  Lock,
  Unlock,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Phone,
  MapPin,
  Eye,
  X,
  Mail,
  Droplet,
  DollarSign,
} from "lucide-react";
import { EmployeeMaster, MachineMaster, ProcessMaster, AdminMaster } from "../types";

export default function MasterDataView() {
  const {
    customers,
    addCustomer,
    deleteCustomer,
    toggleLockCustomer,
    jobs,
    addJob,
    deleteJob,
    employees,
    addEmployee,
    deleteEmployee,
    toggleLockEmployee,
    machines,
    addMachine,
    deleteMachine,
    processes,
    addProcess,
    deleteProcess,
    admins,
    addAdmin,
    deleteAdmin,
    currentUser,
  } = useErp();

  const [activeSubTab, setActiveSubTab] = useState<
    "customers" | "jobs" | "employees" | "machines" | "processes" | "admins"
  >("customers");

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);
  const [expandedMachineId, setExpandedMachineId] = useState<string | null>(null);
  const [expandedProcessId, setExpandedProcessId] = useState<string | null>(null);
  const [expandedAdminId, setExpandedAdminId] = useState<string | null>(null);

  // Modals state
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<EmployeeMaster | null>(null);
  const [addMachineModalOpen, setAddMachineModalOpen] = useState(false);
  const [viewingMachine, setViewingMachine] = useState<MachineMaster | null>(null);
  const [addProcessModalOpen, setAddProcessModalOpen] = useState(false);
  const [viewingProcess, setViewingProcess] = useState<ProcessMaster | null>(null);
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const [viewingAdmin, setViewingAdmin] = useState<AdminMaster | null>(null);

  // New Process Form state
  const [newPrc, setNewPrc] = useState({
    code: `P-0${processes.length + 1}`,
    name: "",
    unitRate: 1.5,
    rateUnit: "per Sheet",
    category: "Coating & Lamination",
    machineType: "Laminator",
    setupTimeMin: 20,
  });

  // New Admin Form state
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    name: "",
    email: "",
    role: "PRODUCTION" as "ADMIN" | "SALES" | "PRODUCTION" | "ACCOUNTS",
    status: "Active",
    lastLogin: "Just created",
  });

  // New Machine Form state
  const [newMac, setNewMac] = useState({
    machineId: `M-0${machines.length + 1}`,
    name: "",
    description: "",
    department: "Press",
    type: "Offset Press",
    speedImpPerHour: 10000,
    hourlyRate: 1500,
    status: "Running",
  });

  // New Employee Form state
  const [newEmp, setNewEmp] = useState({
    staffId: `EMP-1${String(employees.length + 1).padStart(2, "0")}`,
    name: "",
    phone: "",
    bloodGroup: "O+",
    email: "",
    department: "Press",
    shift: "Morning (8AM-4PM)",
    status: "Active",
  });

  // New Customer Form state
  const [newCust, setNewCust] = useState({
    code: "C06",
    companyName: "",
    contactPerson: "",
    mobile: "",
    email: "",
    location: "MIDC Kupwad, Sangli",
    gstin: "27AAACC0000A1Z5",
    isGstRegistered: true,
    creditTerms: "30 Days Credit",
    tags: "Regular, Pharma",
  });

  // New Job Form state
  const [newJob, setNewJob] = useState({
    jobCode: "JC-PAR-9001",
    productName: "",
    customerId: customers[0]?.id || "",
    sheetSize: '28" × 40" (710 × 1020 mm)',
    sheetLengthInches: 40,
    sheetWidthInches: 28,
    boardType: "FBB Cyber XL Pac",
    boardGsm: 300,
    colors: "CMYK + Spot Drip-off",
    numColors: 5,
    sides: 1 as 1 | 2,
    ups: 8,
    dieCode: "DIE-NEW-01",
    artworkUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
    postPressProcesses: "Thermal Gloss Lamination, Die Punching, Pasting",
  });

  // Sub-tabs list with role-based filtering
  const allSubTabs = [
    { id: "customers", label: `Customers (${customers.length})`, icon: Building2, rolesAllowed: ["ADMIN", "SALES", "ACCOUNTS"] },
    { id: "jobs", label: `Jobs (${jobs.length})`, icon: Layers, rolesAllowed: ["ADMIN", "SALES", "PRODUCTION"] },
    { id: "employees", label: `Employees (${employees.length})`, icon: Users, rolesAllowed: ["ADMIN", "PRODUCTION", "ACCOUNTS"] },
    { id: "machines", label: `Machines (${machines.length})`, icon: Cpu, rolesAllowed: ["ADMIN", "PRODUCTION"] },
    { id: "processes", label: `Processes (${processes.length})`, icon: Scissors, rolesAllowed: ["ADMIN", "PRODUCTION"] },
    { id: "admins", label: `Admins (${admins.length})`, icon: Shield, rolesAllowed: ["ADMIN"] },
  ];

  const subTabs = allSubTabs.filter((st) => st.rolesAllowed.includes(currentUser.role));

  // Auto-switch sub-tab if active sub-tab is not allowed for current role
  React.useEffect(() => {
    const isAllowed = subTabs.some((st) => st.id === activeSubTab);
    if (!isAllowed && subTabs.length > 0) {
      setActiveSubTab(subTabs[0].id as any);
    }
  }, [currentUser.role, subTabs, activeSubTab]);

  // Export Customers to CSV (Secured)
  const handleExportCustomers = () => {
    const headers = "Code,Company Name,Contact Person,Mobile,Email,Location,GSTIN,Credit Terms\n";
    const rows = customers
      .map((c) =>
        [c.code, c.companyName, c.contactPerson, c.mobile, c.email, c.location, c.gstin, c.creditTerms]
          .map(sanitizeCsvValue)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Perfect_Printers_Customers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Export Employees to CSV (Secured)
  const handleExportEmployees = () => {
    const headers = "Staff ID,Name,Phone,Blood Group,Email,Department,Shift,Status\n";
    const rows = employees
      .map((e) =>
        [e.staffId, e.name, e.phone, e.bloodGroup || "O+", e.email || "", e.department, e.shift || "General", e.status || "Active"]
          .map(sanitizeCsvValue)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Perfect_Printers_Employees_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Export Machines to CSV (Secured)
  const handleExportMachines = () => {
    const headers = "Machine ID,Name,Description,Department,Type,Speed (imp/hr),Hourly Tariff (INR),Status\n";
    const rows = machines
      .map((m) =>
        [m.machineId, m.name, m.description || "", m.department || "", m.type || "", String(m.speedImpPerHour || 0), String(m.hourlyRate || 0), m.status || "Running"]
          .map(sanitizeCsvValue)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Perfect_Printers_Machines_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Export Processes to CSV (Secured)
  const handleExportProcesses = () => {
    const headers = "Code,Process Name,Category,Unit Tariff,Rate Unit,Machine Type,Setup Time (mins)\n";
    const rows = processes
      .map((p) =>
        [p.code, p.name, p.category, String(p.unitRate), p.rateUnit, p.machineType, String(p.setupTimeMin)]
          .map(sanitizeCsvValue)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Perfect_Printers_Processes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Export Admins to CSV (Secured)
  const handleExportAdmins = () => {
    const headers = "Role,Name,Username,Email,Status,Last Active\n";
    const rows = admins
      .map((a) =>
        [a.role, a.name, a.username, a.email, a.status, a.lastLogin]
          .map(sanitizeCsvValue)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Perfect_Printers_Admins_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Simulated Excel Import
  const handleImportExcel = () => {
    alert("Excel Sheet Parsed: Records verified successfully.");
  };

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.code.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.contactPerson.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.gstin.toLowerCase().includes(q)
    );
  });

  // Filtered Jobs
  const filteredJobs = jobs.filter((j) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      j.jobCode.toLowerCase().includes(q) ||
      j.productName.toLowerCase().includes(q) ||
      j.customerName.toLowerCase().includes(q) ||
      j.boardType.toLowerCase().includes(q)
    );
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.companyName.trim()) return;

    addCustomer({
      code: newCust.code,
      companyName: newCust.companyName,
      contactPerson: newCust.contactPerson || "Commercial Officer",
      mobile: newCust.mobile || "+91 98220 00000",
      email: newCust.email || "info@client.com",
      location: newCust.location,
      gstin: newCust.gstin,
      isGstRegistered: newCust.isGstRegistered,
      creditTerms: newCust.creditTerms,
      tags: newCust.tags.split(",").map((t) => t.trim()),
    });

    setAddCustomerModalOpen(false);
    setNewCust({
      code: `C0${customers.length + 2}`,
      companyName: "",
      contactPerson: "",
      mobile: "",
      email: "",
      location: "MIDC Kupwad, Sangli",
      gstin: "27AAACC0000A1Z5",
      isGstRegistered: true,
      creditTerms: "30 Days Credit",
      tags: "Regular, Packaging",
    });
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.productName.trim()) return;

    const cust = customers.find((c) => c.id === newJob.customerId) || customers[0];

    addJob({
      jobCode: newJob.jobCode,
      productName: newJob.productName,
      customerId: cust.id,
      customerCode: cust.code,
      customerName: cust.companyName,
      sheetSize: newJob.sheetSize,
      sheetLengthInches: Number(newJob.sheetLengthInches),
      sheetWidthInches: Number(newJob.sheetWidthInches),
      boardType: newJob.boardType,
      boardGsm: Number(newJob.boardGsm),
      colors: newJob.colors,
      numColors: Number(newJob.numColors),
      sides: newJob.sides,
      ups: Number(newJob.ups),
      dieCode: newJob.dieCode,
      artworkUrl: newJob.artworkUrl,
      postPressProcesses: newJob.postPressProcesses.split(",").map((p) => p.trim()),
    });

    setAddJobModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>ERP Master Data & Directories</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Master Data Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure client directories, standardized job codes, staff shifts, machinery rates, and post-press processes.
          </p>
        </div>

        {/* Global Sub-Tab Navigation Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {subTabs.map((st) => {
            const Icon = st.icon;
            const isActive = activeSubTab === st.id;
            return (
              <button
                key={st.id}
                onClick={() => {
                  setActiveSubTab(st.id as any);
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-white text-emerald-950 shadow-sm border border-emerald-300 font-extrabold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-700" : "text-slate-400"}`} />
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: CUSTOMERS */}
      {activeSubTab === "customers" && (
        <div className="space-y-4">
          {/* Action Strip: Search + Add + Import + Export */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                data-testid="master-data-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, code, mobile, GSTIN..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleImportExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                title="Import from Excel"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>Import XLS</span>
              </button>

              <button
                onClick={handleExportCustomers}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                title="Export to XLS/CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export XLS</span>
              </button>

              <button
                onClick={() => setAddCustomerModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>

          {/* Customer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((cust) => {
              const isExpanded = expandedCustomerId === cust.id;
              return (
                <div
                  key={cust.id}
                  className={`bg-white border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between ${
                    cust.isLocked ? "border-amber-200 bg-amber-50/20" : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div>
                    {/* Header: Code + Tags + Lock Toggle */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-900 text-white shadow-xs">
                          {cust.code}
                        </span>
                        {cust.isLocked && (
                          <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> LOCKED
                          </span>
                        )}
                      </div>

                      {/* Action Icons */}
                      <div className="flex items-center gap-1 text-slate-400">
                        <button
                          onClick={() => toggleLockCustomer(cust.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            cust.isLocked ? "text-amber-700 hover:bg-amber-100" : "hover:text-slate-800 hover:bg-slate-100"
                          }`}
                          title={cust.isLocked ? "Unlock Customer" : "Lock Customer (Halt Orders)"}
                        >
                          {cust.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                        {currentUser.role === "ADMIN" && (
                          <button
                            onClick={() => deleteCustomer(cust.id)}
                            className="p-1.5 rounded-lg hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setExpandedCustomerId(isExpanded ? null : cust.id)
                          }
                          className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Expand Details"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Company Name */}
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {cust.companyName}
                    </h3>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                      Contact: <span className="font-semibold text-slate-800">{cust.contactPerson}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {cust.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        {cust.creditTerms}
                      </span>
                    </div>

                    {/* Contact & Location Details */}
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="font-mono">{cust.mobile}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{cust.location}</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs bg-slate-50 p-3 rounded-xl space-y-1.5 animate-fadeIn">
                        <div>
                          GSTIN: <span className="font-mono font-bold text-slate-900">{cust.gstin}</span>
                        </div>
                        <div>
                          Email: <span className="font-mono text-slate-700">{cust.email}</span>
                        </div>
                        <div className="pt-1 text-[11px] text-emerald-800 font-semibold">
                          Linked Master Jobs: {jobs.filter((j) => j.customerId === cust.id).length} jobs registered
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: JOBS */}
      {activeSubTab === "jobs" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job code, product, board..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => setAddJobModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Master Job</span>
            </button>
          </div>

          {/* Jobs Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Job Code</th>
                  <th className="p-3.5">Product Name</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Sheet Size</th>
                  <th className="p-3.5">Board & GSM</th>
                  <th className="p-3.5">Colors & Ups</th>
                  <th className="p-3.5">Artwork</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-200">
                        {j.jobCode}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 max-w-xs truncate">
                      {j.productName}
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">
                      {j.customerName} ({j.customerCode})
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">{j.sheetSize}</td>
                    <td className="p-3.5 font-mono text-slate-700">
                      {j.boardType} ({j.boardGsm} GSM)
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">
                      {j.numColors} Colors ({j.ups} ups)
                    </td>
                    <td className="p-3.5">
                      {j.artworkUrl ? (
                        <a
                          href={j.artworkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" /> Proof
                        </a>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {currentUser.role === "ADMIN" && (
                        <button
                          onClick={() => deleteJob(j.id)}
                          className="p-1.5 text-slate-400 hover:text-red-700 rounded"
                          title="Delete Job"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: EMPLOYEES */}
      {activeSubTab === "employees" && (
        <div className="space-y-4">
          {/* Action Strip: Search + Import + Export + Add Employee */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, department, email..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleImportExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                title="Import from Excel"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>Import XLS</span>
              </button>

              <button
                onClick={handleExportEmployees}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                title="Export to XLS/CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export XLS</span>
              </button>

              <button
                onClick={() => setAddEmployeeModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
            </div>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees
              .filter((emp) => {
                const q = searchQuery.toLowerCase().trim();
                return (
                  !q ||
                  emp.name.toLowerCase().includes(q) ||
                  emp.phone.includes(q) ||
                  (emp.email && emp.email.toLowerCase().includes(q)) ||
                  (emp.department && emp.department.toLowerCase().includes(q)) ||
                  (emp.bloodGroup && emp.bloodGroup.toLowerCase().includes(q)) ||
                  emp.staffId.toLowerCase().includes(q)
                );
              })
              .map((emp) => {
                const isExpanded = expandedEmployeeId === emp.id;
                return (
                  <div
                    key={emp.id}
                    className={`bg-white border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between ${
                      emp.isLocked ? "border-amber-200 bg-amber-50/20" : "border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <div>
                      {/* Header: Code Badge + Lock Indicator + Actions */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-900 text-white shadow-xs">
                            {emp.staffId}
                          </span>
                          {emp.isLocked && (
                            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> LOCKED
                            </span>
                          )}
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-1 text-slate-400">
                          <button
                            onClick={() => toggleLockEmployee(emp.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              emp.isLocked ? "text-amber-700 hover:bg-amber-100" : "hover:text-slate-800 hover:bg-slate-100"
                            }`}
                            title={emp.isLocked ? "Unlock Employee" : "Lock Employee"}
                          >
                            {emp.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                          {currentUser.role === "ADMIN" && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove employee ${emp.name} from records?`)) {
                                  deleteEmployee(emp.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete Employee"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setExpandedEmployeeId(isExpanded ? null : emp.id)
                            }
                            className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Expand Details"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Employee Name */}
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {emp.name}
                      </h3>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">
                        Department: <span className="font-semibold text-slate-800">{emp.department}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {emp.bloodGroup && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            Blood: {emp.bloodGroup}
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {emp.shift || "General"}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                          {emp.status || "Active"}
                        </span>
                      </div>
                    </div>

                    {/* Contact & Location Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-mono">{emp.phone}</span>
                      </div>
                      {emp.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate font-mono text-[11px] text-slate-500">{emp.email}</span>
                        </div>
                      )}

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="mt-3 pt-2 border-t border-dashed border-slate-200 space-y-1.5 text-[11px] font-mono animate-fadeIn">
                          <div className="text-slate-500">
                            Staff ID: <span className="text-slate-900 font-bold">{emp.staffId}</span>
                          </div>
                          <div className="text-slate-500">
                            Plant Wing: <span className="text-slate-900 font-bold">MIDC Miraj - Unit 1</span>
                          </div>
                          <div className="text-slate-500">
                            Shift Window: <span className="text-emerald-700 font-semibold">{emp.shift || "8:00 AM - 4:30 PM"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MACHINES */}
      {activeSubTab === "machines" && (
        <div className="space-y-4">
          {/* Action Strip: Search + Import + Export + Add Machine */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search machine, specs, type, department..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleImportExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                title="Import from Excel"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>Import XLS</span>
              </button>

              <button
                onClick={handleExportMachines}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                title="Export to XLS/CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export XLS</span>
              </button>

              <button
                onClick={() => setAddMachineModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Machine</span>
              </button>
            </div>
          </div>

          {/* Machine Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines
              .filter((mac) => {
                const q = searchQuery.toLowerCase().trim();
                return (
                  !q ||
                  mac.name.toLowerCase().includes(q) ||
                  (mac.description && mac.description.toLowerCase().includes(q)) ||
                  (mac.department && mac.department.toLowerCase().includes(q)) ||
                  (mac.type && mac.type.toLowerCase().includes(q)) ||
                  mac.machineId.toLowerCase().includes(q)
                );
              })
              .map((mac) => {
                const isExpanded = expandedMachineId === mac.id;
                return (
                  <div
                    key={mac.id}
                    className={`bg-white border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between ${
                      mac.isLocked ? "border-amber-200 bg-amber-50/20" : "border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <div>
                      {/* Header: Machine ID Badge + Lock + Actions */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-900 text-white shadow-xs">
                            {mac.machineId}
                          </span>
                          {mac.isLocked && (
                            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> LOCKED
                            </span>
                          )}
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-1 text-slate-400">
                          <button
                            onClick={() => setViewingMachine(mac)}
                            className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {currentUser.role === "ADMIN" && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove machine ${mac.name} from records?`)) {
                                  deleteMachine(mac.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete Machine"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setExpandedMachineId(isExpanded ? null : mac.id)
                            }
                            className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Expand Details"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Machine Name */}
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {mac.name}
                      </h3>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">
                        Spec: <span className="font-semibold text-slate-800">{mac.description || "Packaging Production"}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {mac.department || (mac.type === "Offset Press" ? "Press" : "Post-Press")}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {mac.type || "Offset Press"}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                          {mac.status || "Running"}
                        </span>
                      </div>
                    </div>

                    {/* Technical Specs Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-mono">Speed: {(mac.speedImpPerHour || 10000).toLocaleString()} imp/hr</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-mono">Tariff: ₹{(mac.hourlyRate || 1500).toLocaleString()} / hr</span>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="mt-3 pt-2 border-t border-dashed border-slate-200 space-y-1.5 text-[11px] font-mono animate-fadeIn">
                          <div className="text-slate-500">
                            Machine ID: <span className="text-slate-900 font-bold">{mac.machineId}</span>
                          </div>
                          <div className="text-slate-500">
                            Plant Wing: <span className="text-slate-900 font-bold">MIDC Miraj - Unit 1</span>
                          </div>
                          {mac.currentJobCode && (
                            <div className="text-slate-500">
                              Active Job: <span className="text-emerald-700 font-bold">{mac.currentJobCode}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PROCESSES */}
      {activeSubTab === "processes" && (
        <div className="space-y-4">
          {/* Action Strip: Search + Import + Export + Add Process */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search process, code, category, machine..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleImportExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                title="Import from Excel"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>Import XLS</span>
              </button>

              <button
                onClick={handleExportProcesses}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                title="Export to XLS/CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export XLS</span>
              </button>

              <button
                onClick={() => setAddProcessModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Process</span>
              </button>
            </div>
          </div>

          {/* Process Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processes
              .filter((prc) => {
                const q = searchQuery.toLowerCase().trim();
                return (
                  !q ||
                  prc.name.toLowerCase().includes(q) ||
                  prc.code.toLowerCase().includes(q) ||
                  prc.category.toLowerCase().includes(q) ||
                  prc.machineType.toLowerCase().includes(q)
                );
              })
              .map((prc) => {
                const isExpanded = expandedProcessId === prc.id;
                return (
                  <div
                    key={prc.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all hover:border-emerald-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Header: Code Badge + Actions */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-900 text-white shadow-xs">
                          {prc.code}
                        </span>

                        {/* Action Icons */}
                        <div className="flex items-center gap-1 text-slate-400">
                          <button
                            onClick={() => setViewingProcess(prc)}
                            className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {currentUser.role === "ADMIN" && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove process ${prc.name}?`)) {
                                  deleteProcess(prc.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete Process"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedProcessId(isExpanded ? null : prc.id)}
                            className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Expand Details"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Process Name */}
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {prc.name}
                      </h3>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">
                        Machine: <span className="font-semibold text-slate-800">{prc.machineType}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {prc.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          Setup: {prc.setupTimeMin}m
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                          Active Tariff
                        </span>
                      </div>
                    </div>

                    {/* Rate & Setup Specs Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-mono font-bold text-emerald-800">₹{prc.unitRate} {prc.rateUnit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate font-mono text-[11px] text-slate-500">Machine: {prc.machineType}</span>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="mt-3 pt-2 border-t border-dashed border-slate-200 space-y-1.5 text-[11px] font-mono animate-fadeIn">
                          <div className="text-slate-500">
                            Process Code: <span className="text-slate-900 font-bold">{prc.code}</span>
                          </div>
                          <div className="text-slate-500">
                            Estimated Setup: <span className="text-slate-900 font-bold">{prc.setupTimeMin} minutes</span>
                          </div>
                          <div className="text-slate-500">
                            Category Scope: <span className="text-emerald-700 font-semibold">{prc.category}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: ADMINS */}
      {activeSubTab === "admins" && (
        <div className="space-y-4">
          {/* Action Strip: Search + Export + Add Admin */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff, username, email, role..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleExportAdmins}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                title="Export to XLS/CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export XLS</span>
              </button>

              <button
                onClick={() => setAddAdminModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Admin Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {admins
              .filter((adm) => {
                const q = searchQuery.toLowerCase().trim();
                return (
                  !q ||
                  adm.name.toLowerCase().includes(q) ||
                  adm.username.toLowerCase().includes(q) ||
                  adm.email.toLowerCase().includes(q) ||
                  adm.role.toLowerCase().includes(q)
                );
              })
              .map((adm) => {
                const isExpanded = expandedAdminId === adm.id;
                return (
                  <div
                    key={adm.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:border-emerald-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                          {adm.role}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewingAdmin(adm)}
                            className="p-1 text-slate-400 hover:text-slate-800"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {currentUser.role === "ADMIN" && admins.length > 1 && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove user ${adm.name}?`)) {
                                  deleteAdmin(adm.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{adm.name}</h4>
                      <div className="text-xs text-slate-500 font-mono">@{adm.username}</div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {adm.status}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          Role: {adm.role}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-[11px] font-mono text-slate-500 truncate">{adm.email}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Last Active: {adm.lastLogin}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {addCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Customer Record</h3>
              <button onClick={() => setAddCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Code *</label>
                  <input
                    type="text"
                    value={newCust.code}
                    onChange={(e) => setNewCust({ ...newCust, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Credit Terms</label>
                  <input
                    type="text"
                    value={newCust.creditTerms}
                    onChange={(e) => setNewCust({ ...newCust, creditTerms: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Client Name *</label>
                <input
                  type="text"
                  value={newCust.companyName}
                  onChange={(e) => setNewCust({ ...newCust, companyName: e.target.value })}
                  placeholder="e.g. Abbott Nutrition India Ltd."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newCust.contactPerson}
                    onChange={(e) => setNewCust({ ...newCust, contactPerson: e.target.value })}
                    placeholder="e.g. Sandeep Kadam"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / Phone</label>
                  <input
                    type="text"
                    value={newCust.mobile}
                    onChange={(e) => setNewCust({ ...newCust, mobile: e.target.value })}
                    placeholder="+91 98220..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={newCust.gstin}
                    onChange={(e) => setNewCust({ ...newCust, gstin: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location / Plant City</label>
                  <input
                    type="text"
                    value={newCust.location}
                    onChange={(e) => setNewCust({ ...newCust, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newCust.tags}
                  onChange={(e) => setNewCust({ ...newCust, tags: e.target.value })}
                  placeholder="e.g. Regular, Pharma, High Volume"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddCustomerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD JOB MODAL */}
      {addJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-700 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-lg font-bold text-white">Register Master Job Code</h3>
                </div>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  Admin Manual Job Code Assignment & Specs
                </p>
              </div>
              <button onClick={() => setAddJobModalOpen(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              {/* Job Code & Customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Manual Job Code (Admin Given) *
                  </label>
                  <input
                    type="text"
                    value={newJob.jobCode}
                    onChange={(e) => setNewJob({ ...newJob, jobCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. JC-CIPLA-402"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 font-bold font-mono text-xs focus:outline-none focus:border-cyan-400"
                    required
                  />
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    <span className="text-[9px] text-slate-500 font-mono">Prefix:</span>
                    {["JC-", "PP-", "PK-", "MC-"].map((prefix) => (
                      <button
                        key={prefix}
                        type="button"
                        onClick={() => setNewJob({ ...newJob, jobCode: `${prefix}${newJob.jobCode.replace(/^(JC-|PP-|PK-|MC-)/, "") || "1001"}` })}
                        className="text-[9px] font-mono px-1.5 py-0.2 bg-slate-800 text-cyan-300 rounded hover:bg-slate-700 border border-slate-700"
                      >
                        {prefix}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-200 mb-1">Customer / Client *</label>
                  <select
                    value={newJob.customerId}
                    onChange={(e) => setNewJob({ ...newJob, customerId: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label className="block font-bold text-slate-200 mb-1">Product Description / Mono Carton *</label>
                <input
                  type="text"
                  value={newJob.productName}
                  onChange={(e) => setNewJob({ ...newJob, productName: e.target.value })}
                  placeholder="e.g. Azithromycin 500mg Drip-Off Carton"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              {/* Sheet & Board */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Sheet Size</label>
                  <input
                    type="text"
                    value={newJob.sheetSize}
                    onChange={(e) => setNewJob({ ...newJob, sheetSize: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Board Type</label>
                  <input
                    type="text"
                    value={newJob.boardType}
                    onChange={(e) => setNewJob({ ...newJob, boardType: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* GSM, Colors, Ups */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">GSM</label>
                  <input
                    type="number"
                    value={newJob.boardGsm}
                    onChange={(e) => setNewJob({ ...newJob, boardGsm: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Colors (N)</label>
                  <input
                    type="number"
                    value={newJob.numColors}
                    onChange={(e) => setNewJob({ ...newJob, numColors: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Ups / Layout</label>
                  <input
                    type="number"
                    value={newJob.ups}
                    onChange={(e) => setNewJob({ ...newJob, ups: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 text-xs"
                >
                  Save Master Job Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EMPLOYEE MODAL */}
      {addEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Add New Employee</h3>
              </div>
              <button
                onClick={() => setAddEmployeeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newEmp.name.trim() || !newEmp.phone.trim()) return;
                addEmployee({
                  staffId: newEmp.staffId,
                  name: newEmp.name,
                  phone: newEmp.phone,
                  bloodGroup: newEmp.bloodGroup,
                  email: newEmp.email,
                  department: newEmp.department,
                  shift: newEmp.shift as any,
                  status: newEmp.status as any,
                  isLocked: false,
                });
                setAddEmployeeModalOpen(false);
                setNewEmp({
                  staffId: `EMP-1${String(employees.length + 2).padStart(2, "0")}`,
                  name: "",
                  phone: "",
                  bloodGroup: "O+",
                  email: "",
                  department: "Press",
                  shift: "Morning (8AM-4PM)",
                  status: "Active",
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name & Title *</label>
                <input
                  type="text"
                  required
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  placeholder="e.g. Mr. Basavraj Khemalapure"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone / Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    placeholder="e.g. 9011148816"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={newEmp.bloodGroup}
                    onChange={(e) => setNewEmp({ ...newEmp, bloodGroup: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                  >
                    {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                  placeholder="e.g. employee@gmail.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department *</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    {[
                      "Sheet Allocation",
                      "Pre-Press",
                      "Press",
                      "Post-Press",
                      "Dispatch",
                      "Accounts",
                      "Quality",
                      "Admin",
                    ].map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift</label>
                  <select
                    value={newEmp.shift}
                    onChange={(e) => setNewEmp({ ...newEmp, shift: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Morning (8AM-4PM)">Morning (8AM-4PM)</option>
                    <option value="Evening (4PM-12AM)">Evening (4PM-12AM)</option>
                    <option value="Night (12AM-8AM)">Night (12AM-8AM)</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddEmployeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d3b2e] hover:bg-[#07241c] text-white font-bold shadow-md"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW EMPLOYEE MODAL */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Employee Details</h3>
              </div>
              <button
                onClick={() => setViewingEmployee(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                <div className="text-base font-bold text-slate-900">
                  {viewingEmployee.name}
                </div>
                <div className="text-slate-500 font-mono">
                  Staff ID: <span className="font-bold text-slate-800">{viewingEmployee.staffId}</span>
                </div>
                <div className="text-slate-500">
                  Phone: <span className="font-bold text-slate-800 font-mono">{viewingEmployee.phone}</span>
                </div>
                {viewingEmployee.bloodGroup && (
                  <div className="text-slate-500">
                    Blood Group: <span className="font-bold text-rose-600 font-mono">{viewingEmployee.bloodGroup}</span>
                  </div>
                )}
                {viewingEmployee.email && (
                  <div className="text-slate-500">
                    Email: <span className="font-bold text-slate-800 font-mono">{viewingEmployee.email}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Department</div>
                  <div className="font-bold text-emerald-900 mt-0.5">{viewingEmployee.department}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Shift</div>
                  <div className="font-bold text-slate-800 mt-0.5">{viewingEmployee.shift || "General"}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingEmployee(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MACHINE MODAL */}
      {addMachineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Add New Machine</h3>
              </div>
              <button
                onClick={() => setAddMachineModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newMac.name.trim()) return;
                addMachine({
                  machineId: newMac.machineId,
                  name: newMac.name,
                  description: newMac.description,
                  department: newMac.department,
                  type: newMac.type as any,
                  speedImpPerHour: Number(newMac.speedImpPerHour),
                  hourlyRate: Number(newMac.hourlyRate),
                  status: newMac.status as any,
                });
                setAddMachineModalOpen(false);
                setNewMac({
                  machineId: `M-0${machines.length + 2}`,
                  name: "",
                  description: "",
                  department: "Press",
                  type: "Offset Press",
                  speedImpPerHour: 10000,
                  hourlyRate: 1500,
                  status: "Running",
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Machine Name *</label>
                <input
                  type="text"
                  required
                  value={newMac.name}
                  onChange={(e) => setNewMac({ ...newMac, name: e.target.value })}
                  placeholder="e.g. Heidelberg SM102 - 5 + L"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Spec</label>
                <input
                  type="text"
                  value={newMac.description}
                  onChange={(e) => setNewMac({ ...newMac, description: e.target.value })}
                  placeholder="e.g. Printing - 28 x 40 - 5 Color + Coater"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newMac.department}
                    onChange={(e) => setNewMac({ ...newMac, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pre-Press">Pre-Press</option>
                    <option value="Press">Press</option>
                    <option value="Post-Press">Post-Press</option>
                    <option value="Finishing">Finishing</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Machine Type</label>
                  <select
                    value={newMac.type}
                    onChange={(e) => setNewMac({ ...newMac, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Offset Press">Offset Press</option>
                    <option value="Die Cutter">Die Cutter</option>
                    <option value="Laminator">Laminator</option>
                    <option value="Folder Gluer">Folder Gluer</option>
                    <option value="Coater">Coater</option>
                    <option value="CTP Processor">CTP Processor</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddMachineModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d3b2e] hover:bg-[#07241c] text-white font-bold shadow-md"
                >
                  Save Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MACHINE MODAL */}
      {viewingMachine && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Machine Details</h3>
              </div>
              <button
                onClick={() => setViewingMachine(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                <div className="text-base font-bold text-slate-900">
                  {viewingMachine.name}
                </div>
                {viewingMachine.description && (
                  <div className="text-slate-500">
                    {viewingMachine.description}
                  </div>
                )}
                <div className="text-slate-500 font-mono">
                  Machine ID: <span className="font-bold text-slate-800">{viewingMachine.machineId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Department</div>
                  <div className="font-bold text-emerald-900 mt-0.5">{viewingMachine.department || "Press"}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Type</div>
                  <div className="font-bold text-slate-800 mt-0.5">{viewingMachine.type || "Offset Press"}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingMachine(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PROCESS MODAL */}
      {addProcessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Add New Process Tariff</h3>
              </div>
              <button
                onClick={() => setAddProcessModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPrc.name.trim()) return;
                addProcess({
                  code: newPrc.code,
                  name: newPrc.name,
                  category: newPrc.category as any,
                  unitRate: Number(newPrc.unitRate),
                  rateUnit: newPrc.rateUnit,
                  machineType: newPrc.machineType,
                  setupTimeMin: Number(newPrc.setupTimeMin),
                });
                setAddProcessModalOpen(false);
                setNewPrc({
                  code: `P-0${processes.length + 2}`,
                  name: "",
                  unitRate: 1.5,
                  rateUnit: "per Sheet",
                  category: "Coating & Lamination",
                  machineType: "Laminator",
                  setupTimeMin: 20,
                });
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Process Code *</label>
                  <input
                    type="text"
                    required
                    value={newPrc.code}
                    onChange={(e) => setNewPrc({ ...newPrc, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newPrc.category}
                    onChange={(e) => setNewPrc({ ...newPrc, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pre-Press">Pre-Press</option>
                    <option value="Press">Press</option>
                    <option value="Coating & Lamination">Coating & Lamination</option>
                    <option value="Finishing & Pasting">Finishing & Pasting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Process Name *</label>
                <input
                  type="text"
                  required
                  value={newPrc.name}
                  onChange={(e) => setNewPrc({ ...newPrc, name: e.target.value })}
                  placeholder="e.g. Thermal Gloss / Matte BOPP Lamination"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Tariff (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrc.unitRate}
                    onChange={(e) => setNewPrc({ ...newPrc, unitRate: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate Unit</label>
                  <input
                    type="text"
                    value={newPrc.rateUnit}
                    onChange={(e) => setNewPrc({ ...newPrc, rateUnit: e.target.value })}
                    placeholder="per Sheet / per 1000 Imp"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Setup (mins)</label>
                  <input
                    type="number"
                    value={newPrc.setupTimeMin}
                    onChange={(e) => setNewPrc({ ...newPrc, setupTimeMin: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Machine Type</label>
                <input
                  type="text"
                  value={newPrc.machineType}
                  onChange={(e) => setNewPrc({ ...newPrc, machineType: e.target.value })}
                  placeholder="e.g. Laminator / Offset Press / Die Cutter"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddProcessModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d3b2e] hover:bg-[#07241c] text-white font-bold shadow-md"
                >
                  Save Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PROCESS MODAL */}
      {viewingProcess && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Process Details</h3>
              </div>
              <button
                onClick={() => setViewingProcess(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                <div className="text-base font-bold text-slate-900">
                  {viewingProcess.name}
                </div>
                <div className="text-slate-500 font-mono">
                  Code: <span className="font-bold text-slate-800">{viewingProcess.code}</span>
                </div>
                <div className="text-emerald-800 font-mono font-bold">
                  Tariff: ₹{viewingProcess.unitRate} {viewingProcess.rateUnit}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Category</div>
                  <div className="font-bold text-emerald-900 mt-0.5">{viewingProcess.category}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Setup Time</div>
                  <div className="font-bold text-slate-800 mt-0.5">{viewingProcess.setupTimeMin} mins</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingProcess(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ADMIN MODAL */}
      {addAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Add ERP User / Staff Account</h3>
              </div>
              <button
                onClick={() => setAddAdminModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAdmin.name.trim() || !newAdmin.username.trim()) return;
                addAdmin({
                  name: newAdmin.name,
                  username: newAdmin.username.toLowerCase().replace(/\s+/g, "_"),
                  email: newAdmin.email || `${newAdmin.username}@perfectprinters.com`,
                  role: newAdmin.role,
                  status: newAdmin.status as "Active" | "Suspended",
                  lastLogin: "Just created",
                });
                setAddAdminModalOpen(false);
                setNewAdmin({
                  username: "",
                  name: "",
                  email: "",
                  role: "PRODUCTION",
                  status: "Active",
                  lastLogin: "Just created",
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                    placeholder="e.g. ramesh_k"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ADMIN">ADMIN (Full Access)</option>
                    <option value="PRODUCTION">PRODUCTION (Floor Manager)</option>
                    <option value="SALES">SALES (Orders & Estimation)</option>
                    <option value="ACCOUNTS">ACCOUNTS (Billing & PO)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="e.g. ramesh@perfectprinters.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddAdminModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d3b2e] hover:bg-[#07241c] text-white font-bold shadow-md"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ADMIN MODAL */}
      {viewingAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">User Profile</h3>
              </div>
              <button
                onClick={() => setViewingAdmin(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                <div className="text-base font-bold text-slate-900">
                  {viewingAdmin.name}
                </div>
                <div className="text-slate-500 font-mono">
                  Username: <span className="font-bold text-slate-800">@{viewingAdmin.username}</span>
                </div>
                <div className="text-slate-500 font-mono">
                  Email: <span className="font-bold text-slate-800">{viewingAdmin.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Role Guard</div>
                  <div className="font-bold text-emerald-900 mt-0.5">{viewingAdmin.role}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Status</div>
                  <div className="font-bold text-slate-800 mt-0.5">{viewingAdmin.status}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingAdmin(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
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
