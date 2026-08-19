"use client";

import React, { useState } from "react";
import { useErp } from "../context/ErpContext";
import { CustomerMaster, JobMaster, EmployeeMaster, MachineMaster, ProcessMaster, AdminMaster } from "../types";
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
  FileSpreadsheet,
  Download,
  Upload,
  Lock,
  Unlock,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  Tag,
  Phone,
  MapPin,
} from "lucide-react";

export default function MasterDataView() {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleLockCustomer,
    jobs,
    addJob,
    deleteJob,
    employees,
    addEmployee,
    deleteEmployee,
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

  // Modals state
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [addMachineModalOpen, setAddMachineModalOpen] = useState(false);
  const [addProcessModalOpen, setAddProcessModalOpen] = useState(false);
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);

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
    jobCode: "JC-NEW-01",
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

  // Sub-tabs list
  const subTabs = [
    { id: "customers", label: `Customers (${customers.length})`, icon: Building2 },
    { id: "jobs", label: `Jobs (${jobs.length})`, icon: Layers },
    { id: "employees", label: `Employees (${employees.length})`, icon: Users },
    { id: "machines", label: `Machines (${machines.length})`, icon: Cpu },
    { id: "processes", label: `Processes (${processes.length})`, icon: Scissors },
    { id: "admins", label: `Admins (${admins.length})`, icon: Shield },
  ];

  // Sanitize CSV value against formula injection (CWE-1236)
  const sanitizeCsvValue = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    if (/^[=+\-@\t\r]/.test(str)) {
      return `"'${str}"`;
    }
    return `"${str}"`;
  };

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

  // Simulated Excel Import
  const handleImportExcel = () => {
    alert("Excel Sheet Parsed: 3 new client records verified with active GSTINs.");
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
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
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
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">
              Press Floor Staff & Shift Allocation
            </h3>
            <button
              onClick={() => setAddEmployeeModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Employee
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp) => (
              <div key={emp.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                    {emp.staffId}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    {emp.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                <div className="text-xs text-slate-600 font-semibold">
                  Department: <span className="text-emerald-800">{emp.department}</span>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Shift: {emp.shift}
                </div>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-1 pt-1 border-t border-slate-100">
                  <Phone className="w-3 h-3 text-emerald-600" /> {emp.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MACHINES */}
      {activeSubTab === "machines" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">
              Machinery Master & Hourly Tariff (MES)
            </h3>
            <button
              onClick={() => setAddMachineModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Machine
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines.map((mac) => (
              <div key={mac.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                    {mac.machineId}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      mac.status === "Running"
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {mac.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">{mac.name}</h4>
                <div className="text-xs text-slate-500 font-mono">Type: {mac.type}</div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400">Max Speed</div>
                    <div className="font-bold text-slate-900">{mac.speedImpPerHour.toLocaleString()} imp/hr</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Hourly Tariff</div>
                    <div className="font-bold text-emerald-800">₹{mac.hourlyRate.toLocaleString()} / hr</div>
                  </div>
                </div>

                {mac.currentJobCode && (
                  <div className="text-[11px] font-mono text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    Running Job: <span className="font-bold">{mac.currentJobCode}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PROCESSES */}
      {activeSubTab === "processes" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">
              Post-Press & Conversion Processes Tariff
            </h3>
            <button
              onClick={() => setAddProcessModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Process
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Process Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Unit Tariff</th>
                  <th className="p-3.5">Machine Type</th>
                  <th className="p-3.5">Setup Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processes.map((prc) => (
                  <tr key={prc.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{prc.code}</td>
                    <td className="p-3.5 font-bold text-slate-800">{prc.name}</td>
                    <td className="p-3.5 text-slate-600 font-medium">{prc.category}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-800">
                      ₹{prc.unitRate} {prc.rateUnit}
                    </td>
                    <td className="p-3.5 text-slate-600">{prc.machineType}</td>
                    <td className="p-3.5 font-mono text-slate-500">{prc.setupTimeMin} mins</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: ADMINS */}
      {activeSubTab === "admins" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">
              ERP User Accounts & Role Permissions
            </h3>
            <button
              onClick={() => setAddAdminModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
            >
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {admins.map((adm) => (
              <div key={adm.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                    {adm.role}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {adm.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{adm.name}</h4>
                <div className="text-xs text-slate-500 font-mono">@{adm.username}</div>
                <div className="text-xs text-slate-600 truncate">{adm.email}</div>
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                  Last Active: {adm.lastLogin}
                </div>
              </div>
            ))}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Register New Master Job Code</h3>
              <button onClick={() => setAddJobModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Job Code *</label>
                  <input
                    type="text"
                    value={newJob.jobCode}
                    onChange={(e) => setNewJob({ ...newJob, jobCode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer *</label>
                  <select
                    value={newJob.customerId}
                    onChange={(e) => setNewJob({ ...newJob, customerId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description / Mono Carton *</label>
                <input
                  type="text"
                  value={newJob.productName}
                  onChange={(e) => setNewJob({ ...newJob, productName: e.target.value })}
                  placeholder="e.g. Azithromycin 500mg Drip-Off Carton"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sheet Size</label>
                  <input
                    type="text"
                    value={newJob.sheetSize}
                    onChange={(e) => setNewJob({ ...newJob, sheetSize: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Board & GSM</label>
                  <input
                    type="text"
                    value={newJob.boardType}
                    onChange={(e) => setNewJob({ ...newJob, boardType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSM</label>
                  <input
                    type="number"
                    value={newJob.boardGsm}
                    onChange={(e) => setNewJob({ ...newJob, boardGsm: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Colors (N)</label>
                  <input
                    type="number"
                    value={newJob.numColors}
                    onChange={(e) => setNewJob({ ...newJob, numColors: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ups / Layout</label>
                  <input
                    type="number"
                    value={newJob.ups}
                    onChange={(e) => setNewJob({ ...newJob, ups: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  Register Master Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
