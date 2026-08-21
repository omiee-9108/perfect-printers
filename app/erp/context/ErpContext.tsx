"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CustomerMaster,
  JobMaster,
  EmployeeMaster,
  MachineMaster,
  ProcessMaster,
  AdminMaster,
  JobOrder,
  InventoryItem,
  StockTransaction,
  PurchaseOrder,
  Quotation,
  MonthlyExpenses,
  NotificationItem,
  ProductionAuditLog,
  StageStatus,
  UserRole,
  UserProfile,
  ErpThemeKey,
} from "../types";
import {
  INITIAL_CUSTOMERS,
  INITIAL_JOBS,
  INITIAL_EMPLOYEES,
  INITIAL_MACHINES,
  INITIAL_PROCESSES,
  INITIAL_ADMINS,
  INITIAL_JOB_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_TRANSACTIONS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_QUOTATIONS,
  INITIAL_EXPENSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from "../mockData";

export type ErpTab =
  | "job-order"
  | "new-order"
  | "master-data"
  | "inventory"
  | "completed"
  | "on-hold"
  | "cancelled"
  | "job-history"
  | "purchase-order"
  | "quotation"
  | "calculators"
  | "reports";

interface ErpContextType {
  activeTab: ErpTab;
  setActiveTab: (tab: ErpTab) => void;
  currentUser: UserProfile;
  setCurrentUserRole: (role: UserRole) => void;
  
  // Data
  customers: CustomerMaster[];
  jobs: JobMaster[];
  employees: EmployeeMaster[];
  machines: MachineMaster[];
  processes: ProcessMaster[];
  admins: AdminMaster[];
  orders: JobOrder[];
  inventory: InventoryItem[];
  transactions: StockTransaction[];
  purchaseOrders: PurchaseOrder[];
  quotations: Quotation[];
  expenses: MonthlyExpenses;
  notifications: NotificationItem[];
  auditLogs: ProductionAuditLog[];
  
  // Order Actions
  createOrder: (data: {
    customerId: string;
    jobId: string;
    quantity: number;
    dueDate: string;
    instructions?: string;
  }) => JobOrder;
  advanceOrderStage: (orderId: string, nextStage: StageStatus, operatorName?: string, notes?: string) => void;
  setOrderOnHold: (orderId: string, reason: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  restoreOrder: (orderId: string) => void;
  dispatchOrder: (orderId: string, challanNo: string, invoiceNo?: string) => void;
  
  // Master Data Actions
  addCustomer: (customer: Omit<CustomerMaster, "id">) => void;
  updateCustomer: (id: string, customer: Partial<CustomerMaster>) => void;
  deleteCustomer: (id: string) => void;
  toggleLockCustomer: (id: string) => void;
  
  addJob: (job: Omit<JobMaster, "id">) => void;
  updateJob: (id: string, job: Partial<JobMaster>) => void;
  deleteJob: (id: string) => void;

  addEmployee: (emp: Omit<EmployeeMaster, "id">) => void;
  deleteEmployee: (id: string) => void;
  toggleLockEmployee: (id: string) => void;

  addMachine: (mac: Omit<MachineMaster, "id">) => void;
  deleteMachine: (id: string) => void;

  addProcess: (prc: Omit<ProcessMaster, "id">) => void;
  deleteProcess: (id: string) => void;

  addAdmin: (admin: Omit<AdminMaster, "id">) => void;
  deleteAdmin: (id: string) => void;

  // Inventory Actions
  addInventoryItem: (item: Omit<InventoryItem, "id" | "totalValue" | "lastUpdated">) => void;
  stockInItem: (itemId: string, qty: number, poRef: string, notes?: string) => void;
  stockOutItem: (itemId: string, qty: number, jobCode: string, orderId: string, notes?: string) => void;
  deleteInventoryItem: (id: string) => void;

  // Procurement & Sales
  createPurchaseOrder: (po: Omit<PurchaseOrder, "id">) => PurchaseOrder;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder["status"]) => void;
  createQuotation: (quote: Omit<Quotation, "id">) => Quotation;
  updateQuotationStatus: (id: string, status: Quotation["status"]) => void;

  // Expenses & Reports
  updateExpenses: (exp: MonthlyExpenses) => void;

  // Notifications
  addNotification: (notif: { title: string; message: string; type?: "info" | "warning" | "success" | "critical"; orderId?: string }) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Authentication & Security Gate
  isAuthenticated: boolean;
  login: (identifier: string, secret: string) => { success: boolean; message?: string };
  loginWithRole: (role: UserRole) => void;
  logout: () => void;

  // ERP Theme Management
  erpTheme: ErpThemeKey;
  setErpTheme: (theme: ErpThemeKey) => void;

  // Global Quick Modal state
  activePrintModal: {
    type: "challan" | "po" | "quote" | "jobcard" | null;
    data: any;
  };
  openPrintModal: (type: "challan" | "po" | "quote" | "jobcard", data: any) => void;
  closePrintModal: () => void;
}

const ErpContext = createContext<ErpContextType | undefined>(undefined);

export function ErpProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<ErpTab>("job-order");

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "usr-1",
    name: "Om Upadhye",
    email: "om@perfectprinters.com",
    role: "ADMIN",
    department: "Executive Management",
  });

  const [customers, setCustomers] = useState<CustomerMaster[]>(INITIAL_CUSTOMERS);
  const [jobs, setJobs] = useState<JobMaster[]>(INITIAL_JOBS);
  const [employees, setEmployees] = useState<EmployeeMaster[]>(INITIAL_EMPLOYEES);
  const [machines, setMachines] = useState<MachineMaster[]>(INITIAL_MACHINES);
  const [processes, setProcesses] = useState<ProcessMaster[]>(INITIAL_PROCESSES);
  const [admins, setAdmins] = useState<AdminMaster[]>(INITIAL_ADMINS);
  const [orders, setOrders] = useState<JobOrder[]>(INITIAL_JOB_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<StockTransaction[]>(INITIAL_TRANSACTIONS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [expenses, setExpenses] = useState<MonthlyExpenses>(INITIAL_EXPENSES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<ProductionAuditLog[]>(INITIAL_AUDIT_LOGS);

  const [activePrintModal, setActivePrintModal] = useState<{
    type: "challan" | "po" | "quote" | "jobcard" | null;
    data: any;
  }>({ type: null, data: null });

  const [erpTheme, setErpThemeState] = useState<ErpThemeKey>("emerald-mint");

  const setErpTheme = (theme: ErpThemeKey) => {
    setErpThemeState(theme);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-erp-theme", theme);
      document.body.setAttribute("data-erp-theme", theme);
      if (theme === "dark-carbon") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    }
    try {
      localStorage.setItem("pp_erp_theme", theme);
    } catch (e) {
      console.error(e);
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (identifier: string, secret: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const matchedAdmin = admins.find(
      (a) => a.username.toLowerCase() === cleanId || a.email.toLowerCase() === cleanId
    );

    const isValidPassword =
      secret === "1234" ||
      secret === "perfect123" ||
      secret === "admin123" ||
      secret === "sales123" ||
      secret === "prod123" ||
      secret === "acc123";

    const isValidUsername =
      !!matchedAdmin ||
      cleanId.includes("admin") ||
      cleanId.includes("sales") ||
      cleanId.includes("prod") ||
      cleanId.includes("acc");

    if (isValidUsername && isValidPassword) {
      const role: UserRole = matchedAdmin?.role || (cleanId.includes("sales") ? "SALES" : cleanId.includes("prod") ? "PRODUCTION" : cleanId.includes("acc") ? "ACCOUNTS" : "ADMIN");
      const name = matchedAdmin?.name || (role === "ADMIN" ? "Om Upadhye (Admin)" : role === "SALES" ? "Mahesh Joshi (Sales)" : role === "PRODUCTION" ? "Anand Sawant (Floor Master)" : "Ketan Shinde (Accounts)");
      
      const userProfile: UserProfile = {
        id: matchedAdmin?.id || "usr-1",
        name,
        email: matchedAdmin?.email || `${cleanId || "admin"}@perfectprinters.com`,
        role,
        department: role === "ADMIN" ? "Executive Management" : role === "SALES" ? "Commercial Sales" : role === "PRODUCTION" ? "Plant Operations" : "Billing & Accounts",
      };

      setCurrentUser(userProfile);
      setIsAuthenticated(true);
      try {
        const sessionData = JSON.stringify({ authenticated: true, role, name, timestamp: Date.now() });
        localStorage.setItem("pp_erp_session", sessionData);
        sessionStorage.setItem("pp_erp_session", sessionData);
        localStorage.setItem("pp_erp_role", role);
      } catch (e) {
        console.error(e);
      }
      return { success: true };
    }

    return { success: false, message: "Invalid credentials. Please enter a valid Staff Username/Email and Password." };
  };

  const loginWithRole = (role: UserRole) => {
    setCurrentUserRole(role);
    setIsAuthenticated(true);
    try {
      const sessionData = JSON.stringify({ authenticated: true, role, timestamp: Date.now() });
      localStorage.setItem("pp_erp_session", sessionData);
      sessionStorage.setItem("pp_erp_session", sessionData);
      localStorage.setItem("pp_erp_role", role);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("pp_erp_session");
      sessionStorage.removeItem("pp_erp_session");
    } catch (e) {
      console.error(e);
    }
  };

  // Load from localstorage if available with 8-hour shift expiration check
  useEffect(() => {
    try {
      const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8-hour shift timeout
      const savedSession = localStorage.getItem("pp_erp_session") || sessionStorage.getItem("pp_erp_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.authenticated && parsed?.timestamp && (Date.now() - parsed.timestamp) < SESSION_MAX_AGE_MS) {
          setIsAuthenticated(true);
          if (parsed.role) {
            setCurrentUser((prev) => ({ ...prev, role: parsed.role, name: parsed.name || prev.name }));
          }
        } else {
          localStorage.removeItem("pp_erp_session");
          sessionStorage.removeItem("pp_erp_session");
        }
      }

      const savedTheme = localStorage.getItem("pp_erp_theme") as ErpThemeKey;
      if (savedTheme && ["emerald-mint", "dark-carbon", "executive-navy", "clean-minimalist"].includes(savedTheme)) {
        setErpThemeState(savedTheme);
        document.documentElement.setAttribute("data-erp-theme", savedTheme);
        document.body.setAttribute("data-erp-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-erp-theme", "emerald-mint");
        document.body.setAttribute("data-erp-theme", "emerald-mint");
      }

      const savedOrders = localStorage.getItem("pp_erp_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCust = localStorage.getItem("pp_erp_customers");
      if (savedCust) {
        try {
          const parsed = JSON.parse(savedCust);
          if (Array.isArray(parsed) && parsed.length >= 20) {
            setCustomers(parsed);
          } else {
            setCustomers(INITIAL_CUSTOMERS);
            localStorage.setItem("pp_erp_customers", JSON.stringify(INITIAL_CUSTOMERS));
          }
        } catch {
          setCustomers(INITIAL_CUSTOMERS);
        }
      } else {
        setCustomers(INITIAL_CUSTOMERS);
      }

      const savedJobs = localStorage.getItem("pp_erp_jobs");
      if (savedJobs) {
        try {
          const parsedJobs = JSON.parse(savedJobs);
          if (Array.isArray(parsedJobs) && parsedJobs.length >= 5) {
            setJobs(parsedJobs);
          } else {
            setJobs(INITIAL_JOBS);
          }
        } catch {
          setJobs(INITIAL_JOBS);
        }
      }

      const savedEmp = localStorage.getItem("pp_erp_employees");
      if (savedEmp) {
        try {
          const parsedEmp = JSON.parse(savedEmp);
          if (Array.isArray(parsedEmp) && parsedEmp.length >= 10) {
            setEmployees(parsedEmp);
          } else {
            setEmployees(INITIAL_EMPLOYEES);
            localStorage.setItem("pp_erp_employees", JSON.stringify(INITIAL_EMPLOYEES));
          }
        } catch {
          setEmployees(INITIAL_EMPLOYEES);
        }
      } else {
        setEmployees(INITIAL_EMPLOYEES);
      }

      const savedMac = localStorage.getItem("pp_erp_machines");
      if (savedMac) {
        try {
          const parsedMac = JSON.parse(savedMac);
          if (Array.isArray(parsedMac) && parsedMac.length >= 4) {
            setMachines(parsedMac);
          } else {
            setMachines(INITIAL_MACHINES);
            localStorage.setItem("pp_erp_machines", JSON.stringify(INITIAL_MACHINES));
          }
        } catch {
          setMachines(INITIAL_MACHINES);
        }
      } else {
        setMachines(INITIAL_MACHINES);
      }

      const savedInv = localStorage.getItem("pp_erp_inventory");
      if (savedInv) setInventory(JSON.parse(savedInv));

      const savedRole = localStorage.getItem("pp_erp_role") as UserRole;
      if (savedRole) {
        setCurrentUser((prev) => ({ ...prev, role: savedRole }));
      }
    } catch (e) {
      console.warn("Could not read localstorage", e);
    }
  }, []);

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        role,
        name:
          role === "ADMIN"
            ? "Om Upadhye (Admin)"
            : role === "SALES"
            ? "Mahesh Joshi (Sales)"
            : role === "PRODUCTION"
            ? "Anand Sawant (Floor Master)"
            : "Ketan Shinde (Accounts)",
      };
      localStorage.setItem("pp_erp_role", role);
      return updated;
    });
  };

  const triggerNotification = (notif: {
    title: string;
    message: string;
    type?: "info" | "warning" | "success" | "critical";
    orderId?: string;
  }) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: notif.title,
      message: notif.message,
      timestamp: "Just now",
      type: notif.type || "info",
      isRead: false,
      orderId: notif.orderId,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev.slice(0, 49)];
      saveToStorage("pp_erp_notifications", updated);
      return updated;
    });
  };

  const addNotification = (notif: {
    title: string;
    message: string;
    type?: "info" | "warning" | "success" | "critical";
    orderId?: string;
  }) => {
    triggerNotification(notif);
  };

  // Simulated Shop-Floor Live Telemetry & Event Notifications
  useEffect(() => {
    const floorSimulationEvents = [
      {
        title: "⚡ Offset Press Heidelberg SM 102",
        message: "Impression counter crossed 18,000 sheets on Shift A run. Speed: 9,200 SPH.",
        type: "info" as const,
      },
      {
        title: "✨ Quality Lab Inspection Approved",
        message: "Delta-E color variation < 1.2 on Sun Pharma 500mg Batch #2026-B4.",
        type: "success" as const,
      },
      {
        title: "🌡️ Thermal CTP Unit 1 Calibrated",
        message: "2400 DPI laser beam calibration complete. 8 CTP plates queued.",
        type: "info" as const,
      },
      {
        title: "📦 Automated Stock Audit",
        message: "Real-time raw material consumption synced with active press jobs.",
        type: "info" as const,
      },
      {
        title: "✂️ Bobst Die-Cutter Setup Ready",
        message: "Die punching makeready approved for 8-up pharma carton layout.",
        type: "success" as const,
      },
      {
        title: "🛡️ Shift Inspection Telemetry",
        message: "Zero register drift detected on 5-color offset run (Job JC-01).",
        type: "info" as const,
      },
    ];

    let eventIdx = 0;
    const interval = setInterval(() => {
      const event = floorSimulationEvents[eventIdx % floorSimulationEvents.length];
      eventIdx++;
      triggerNotification(event);
    }, 35000); // Trigger live update every 35 seconds

    return () => clearInterval(interval);
  }, []);

  // Helper stage progression %
  const getStageProgress = (stage: StageStatus): number => {
    switch (stage) {
      case "Pending":
        return 10;
      case "Pre-Press":
        return 25;
      case "Sheet Allocation":
        return 40;
      case "Press":
        return 60;
      case "Post-Press":
        return 80;
      case "Accounts":
        return 90;
      case "Dispatch":
      case "Completed":
        return 100;
      case "On Hold":
      case "Cancelled":
        return 0;
      default:
        return 0;
    }
  };

  // Order Actions
  const createOrder = (data: {
    customerId: string;
    jobId: string;
    quantity: number;
    dueDate: string;
    instructions?: string;
  }): JobOrder => {
    const cust = customers.find((c) => c.id === data.customerId) || customers[0];
    const j = jobs.find((jb) => jb.id === data.jobId) || jobs[0];

    const count = orders.length + 843;
    const newId = `ORD-2026-0${count}`;
    const ups = j.ups || 8;
    const makeready = 250;
    const totalSheets = Math.ceil(data.quantity / ups) + makeready;

    const newOrder: JobOrder = {
      id: newId,
      jobId: j.id,
      jobCode: j.jobCode,
      jobName: j.productName,
      customerId: cust.id,
      customerName: cust.companyName,
      customerCode: cust.code,
      quantity: data.quantity,
      ups,
      totalSheetsRequired: totalSheets,
      makereadySheets: makeready,
      sheetSize: j.sheetSize,
      boardType: j.boardType,
      boardGsm: j.boardGsm,
      colors: j.colors,
      numColors: j.numColors,
      status: "Pending",
      progressPercent: 10,
      orderDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      dueDate: data.dueDate,
      instructions: data.instructions,
      artworkUrl: j.artworkUrl,
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveToStorage("pp_erp_orders", updated);

    // Audit log
    const newLog: ProductionAuditLog = {
      id: `log-${Date.now()}`,
      orderId: newId,
      jobCode: j.jobCode,
      stage: "Pending",
      timestamp: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      operator: currentUser.name,
      action: "Direct Order Created",
      notes: `Order for ${data.quantity.toLocaleString()} cartons registered. Due: ${data.dueDate}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Automated Real-Time Notification
    triggerNotification({
      title: `New Order Booked: ${newId}`,
      message: `${cust.companyName} • ${j.jobCode} (${data.quantity.toLocaleString()} pcs)`,
      type: "success",
      orderId: newId,
    });

    return newOrder;
  };

  const advanceOrderStage = (orderId: string, nextStage: StageStatus, operatorName?: string, notes?: string) => {
    const ord = orders.find((o) => o.id === orderId);
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: nextStage,
          progressPercent: getStageProgress(nextStage),
          assignedOperator: operatorName || o.assignedOperator || currentUser.name,
        };
      }
      return o;
    });
    setOrders(updated);
    saveToStorage("pp_erp_orders", updated);

    if (ord) {
      const newLog: ProductionAuditLog = {
        id: `log-${Date.now()}`,
        orderId,
        jobCode: ord.jobCode,
        stage: nextStage,
        timestamp: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        operator: operatorName || currentUser.name,
        action: `Moved to ${nextStage}`,
        notes: notes || `Stage advanced to ${nextStage} by ${operatorName || currentUser.name}`,
      };
      setAuditLogs((prev) => [newLog, ...prev]);

      // Automated Notification
      triggerNotification({
        title: `Floor Progress: ${ord.jobCode}`,
        message: `Advanced to "${nextStage}" stage by ${operatorName || currentUser.name}`,
        type: nextStage === "Completed" || nextStage === "Dispatch" ? "success" : "info",
        orderId,
      });
    }
  };

  const setOrderOnHold = (orderId: string, reason: string) => {
    const ord = orders.find((o) => o.id === orderId);
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: "On Hold" as StageStatus,
          holdReason: reason,
        };
      }
      return o;
    });
    setOrders(updated);
    saveToStorage("pp_erp_orders", updated);

    triggerNotification({
      title: `⚠️ Order Placed On Hold`,
      message: `Job ${ord?.jobCode || orderId} paused. Reason: ${reason}`,
      type: "warning",
      orderId,
    });
  };

  const cancelOrder = (orderId: string, reason: string) => {
    const ord = orders.find((o) => o.id === orderId);
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: "Cancelled" as StageStatus,
          cancelReason: reason,
        };
      }
      return o;
    });
    setOrders(updated);
    saveToStorage("pp_erp_orders", updated);

    triggerNotification({
      title: `❌ Order Cancelled`,
      message: `Job ${ord?.jobCode || orderId} cancelled. Reason: ${reason}`,
      type: "critical",
      orderId,
    });
  };

  const restoreOrder = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: "Pending" as StageStatus,
          progressPercent: 10,
          holdReason: undefined,
          cancelReason: undefined,
        };
      }
      return o;
    });
    setOrders(updated);
    saveToStorage("pp_erp_orders", updated);

    triggerNotification({
      title: `🔄 Order Restored`,
      message: `Job ${ord?.jobCode || orderId} restored to Active Pending status.`,
      type: "info",
      orderId,
    });
  };

  const dispatchOrder = (orderId: string, challanNo: string, invoiceNo?: string) => {
    const ord = orders.find((o) => o.id === orderId);
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: "Completed" as StageStatus,
          progressPercent: 100,
          challanNo,
          invoiceNo: invoiceNo || `INV-2026-1${Math.floor(100 + Math.random() * 900)}`,
          dispatchDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        };
      }
      return o;
    });
    setOrders(updated);
    saveToStorage("pp_erp_orders", updated);

    triggerNotification({
      title: `🚚 Order Dispatched: ${ord?.jobCode || orderId}`,
      message: `Challan #${challanNo} generated. Shipped from Plant Unit 1.`,
      type: "success",
      orderId,
    });
  };

  // Master Data CRUD
  const addCustomer = (custData: Omit<CustomerMaster, "id">) => {
    const newCust: CustomerMaster = {
      id: `cust-${Date.now()}`,
      ...custData,
    };
    const updated = [newCust, ...customers];
    setCustomers(updated);
    saveToStorage("pp_erp_customers", updated);
  };

  const updateCustomer = (id: string, data: Partial<CustomerMaster>) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, ...data } : c));
    setCustomers(updated);
    saveToStorage("pp_erp_customers", updated);
  };

  const deleteCustomer = (id: string) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    saveToStorage("pp_erp_customers", updated);
  };

  const toggleLockCustomer = (id: string) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, isLocked: !c.isLocked } : c));
    setCustomers(updated);
    saveToStorage("pp_erp_customers", updated);
  };

  const addJob = (jobData: Omit<JobMaster, "id">) => {
    const newJob: JobMaster = {
      id: `job-${Date.now()}`,
      ...jobData,
    };
    const updated = [newJob, ...jobs];
    setJobs(updated);
    saveToStorage("pp_erp_jobs", updated);
  };

  const updateJob = (id: string, data: Partial<JobMaster>) => {
    const updated = jobs.map((j) => (j.id === id ? { ...j, ...data } : j));
    setJobs(updated);
    saveToStorage("pp_erp_jobs", updated);
  };

  const deleteJob = (id: string) => {
    const updated = jobs.filter((j) => j.id !== id);
    setJobs(updated);
    saveToStorage("pp_erp_jobs", updated);
  };

  const addEmployee = (empData: Omit<EmployeeMaster, "id">) => {
    const newEmp: EmployeeMaster = { id: `emp-${Date.now()}`, ...empData };
    const updated = [newEmp, ...employees];
    setEmployees(updated);
    saveToStorage("pp_erp_employees", updated);
  };

  const deleteEmployee = (id: string) => {
    const updated = employees.filter((e) => e.id !== id);
    setEmployees(updated);
    saveToStorage("pp_erp_employees", updated);
  };

  const toggleLockEmployee = (id: string) => {
    const updated = employees.map((e) => (e.id === id ? { ...e, isLocked: !e.isLocked } : e));
    setEmployees(updated);
    saveToStorage("pp_erp_employees", updated);
  };

  const addMachine = (macData: Omit<MachineMaster, "id">) => {
    const newMac: MachineMaster = { id: `mac-${Date.now()}`, ...macData };
    const updated = [newMac, ...machines];
    setMachines(updated);
    saveToStorage("pp_erp_machines", updated);
  };

  const deleteMachine = (id: string) => {
    const updated = machines.filter((m) => m.id !== id);
    setMachines(updated);
    saveToStorage("pp_erp_machines", updated);
  };

  const addProcess = (prcData: Omit<ProcessMaster, "id">) => {
    const newPrc: ProcessMaster = { id: `prc-${Date.now()}`, ...prcData };
    const updated = [newPrc, ...processes];
    setProcesses(updated);
    saveToStorage("pp_erp_processes", updated);
  };

  const deleteProcess = (id: string) => {
    const updated = processes.filter((p) => p.id !== id);
    setProcesses(updated);
    saveToStorage("pp_erp_processes", updated);
  };

  const addAdmin = (admData: Omit<AdminMaster, "id">) => {
    const newAdm: AdminMaster = { id: `adm-${Date.now()}`, ...admData };
    const updated = [newAdm, ...admins];
    setAdmins(updated);
    saveToStorage("pp_erp_admins", updated);
  };

  const deleteAdmin = (id: string) => {
    const updated = admins.filter((a) => a.id !== id);
    setAdmins(updated);
    saveToStorage("pp_erp_admins", updated);
  };

  // Inventory CRUD & Actions
  const addInventoryItem = (itemData: Omit<InventoryItem, "id" | "totalValue" | "lastUpdated">) => {
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      ...itemData,
      totalValue: itemData.quantity * itemData.costPerUnit,
      lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updated = [newItem, ...inventory];
    setInventory(updated);
    saveToStorage("pp_erp_inventory", updated);
  };

  const stockInItem = (itemId: string, qty: number, poRef: string, notes?: string) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return;

    const newQty = item.quantity + qty;
    const updatedInv = inventory.map((i) =>
      i.id === itemId
        ? {
            ...i,
            quantity: newQty,
            totalValue: newQty * i.costPerUnit,
            lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          }
        : i
    );
    setInventory(updatedInv);
    saveToStorage("pp_erp_inventory", updatedInv);

    const tx: StockTransaction = {
      id: `tx-${Date.now()}`,
      itemId: item.id,
      sku: item.sku,
      itemName: item.name,
      type: "Stock In",
      quantity: qty,
      unit: item.unit,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      referenceNo: poRef || "MANUAL-IN",
      authorizedBy: currentUser.name,
      notes,
    };
    setTransactions((prev) => [tx, ...prev]);

    triggerNotification({
      title: `📦 Stock In: ${item.name}`,
      message: `+${qty} ${item.unit} received (${poRef || "Direct"}). New Level: ${newQty} ${item.unit}`,
      type: "info",
    });
  };

  const stockOutItem = (itemId: string, qty: number, jobCode: string, orderId: string, notes?: string) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return;

    const newQty = Math.max(0, item.quantity - qty);
    const updatedInv = inventory.map((i) =>
      i.id === itemId
        ? {
            ...i,
            quantity: newQty,
            totalValue: newQty * i.costPerUnit,
            lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          }
        : i
    );
    setInventory(updatedInv);
    saveToStorage("pp_erp_inventory", updatedInv);

    const tx: StockTransaction = {
      id: `tx-${Date.now()}`,
      itemId: item.id,
      sku: item.sku,
      itemName: item.name,
      type: "Material Out (Job Issuance)",
      quantity: qty,
      unit: item.unit,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      referenceNo: orderId,
      jobCode,
      authorizedBy: currentUser.name,
      notes,
    };
    setTransactions((prev) => [tx, ...prev]);

    triggerNotification({
      title: `📦 Material Issued: ${item.name}`,
      message: `-${qty} ${item.unit} issued for Job ${jobCode || "Floor"}. Remaining: ${newQty} ${item.unit}`,
      type: "info",
    });

    if (newQty <= item.reorderLevel) {
      triggerNotification({
        title: `🚨 LOW STOCK ALERT: ${item.name}`,
        message: `Inventory (${newQty} ${item.unit}) reached reorder threshold (${item.reorderLevel} ${item.unit})!`,
        type: "critical",
      });
    }
  };

  const deleteInventoryItem = (id: string) => {
    const updated = inventory.filter((i) => i.id !== id);
    setInventory(updated);
    saveToStorage("pp_erp_inventory", updated);
  };

  // PO & Quotation CRUD
  const createPurchaseOrder = (poData: Omit<PurchaseOrder, "id">): PurchaseOrder => {
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      ...poData,
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);

    triggerNotification({
      title: `🛒 PO Generated: ${newPO.poNumber}`,
      message: `${newPO.supplierName} • ₹${newPO.grandTotal.toLocaleString()}`,
      type: "info",
    });
    return newPO;
  };

  const updatePurchaseOrderStatus = (id: string, status: PurchaseOrder["status"]) => {
    setPurchaseOrders((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, status } : p));
      const target = updated.find((p) => p.id === id);
      if (target) {
        triggerNotification({
          title: `🛒 PO Status: ${target.poNumber}`,
          message: `Status updated to "${status}"`,
          type: status === "Received" ? "success" : "info",
        });
      }
      return updated;
    });
  };

  const createQuotation = (quoteData: Omit<Quotation, "id">): Quotation => {
    const newQuote: Quotation = {
      id: `qt-${Date.now()}`,
      ...quoteData,
    };
    setQuotations((prev) => [newQuote, ...prev]);

    triggerNotification({
      title: `📄 Quotation Issued: ${newQuote.quoteNumber}`,
      message: `${newQuote.customerName} • ₹${newQuote.grandTotal.toLocaleString()}`,
      type: "info",
    });
    return newQuote;
  };

  const updateQuotationStatus = (id: string, status: Quotation["status"]) => {
    setQuotations((prev) => {
      const updated = prev.map((q) => (q.id === id ? { ...q, status } : q));
      const target = updated.find((q) => q.id === id);
      if (target) {
        triggerNotification({
          title: `📄 Quote Status: ${target.quoteNumber}`,
          message: `Status updated to "${status}"`,
          type: status === "Accepted" ? "success" : "info",
        });
      }
      return updated;
    });
  };

  const updateExpenses = (exp: MonthlyExpenses) => {
    setExpenses(exp);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      saveToStorage("pp_erp_notifications", updated);
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      saveToStorage("pp_erp_notifications", updated);
      return updated;
    });
  };

  const openPrintModal = (type: "challan" | "po" | "quote" | "jobcard", data: any) => {
    setActivePrintModal({ type, data });
  };

  const closePrintModal = () => {
    setActivePrintModal({ type: null, data: null });
  };

  return (
    <ErpContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUserRole,
        customers,
        jobs,
        employees,
        machines,
        processes,
        admins,
        orders,
        inventory,
        transactions,
        purchaseOrders,
        quotations,
        expenses,
        notifications,
        addNotification,
        auditLogs,
        createOrder,
        advanceOrderStage,
        setOrderOnHold,
        cancelOrder,
        restoreOrder,
        dispatchOrder,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toggleLockCustomer,
        addJob,
        updateJob,
        deleteJob,
        addEmployee,
        deleteEmployee,
        toggleLockEmployee,
        addMachine,
        deleteMachine,
        addProcess,
        deleteProcess,
        addAdmin,
        deleteAdmin,
        addInventoryItem,
        stockInItem,
        stockOutItem,
        deleteInventoryItem,
        createPurchaseOrder,
        updatePurchaseOrderStatus,
        createQuotation,
        updateQuotationStatus,
        updateExpenses,
        markNotificationAsRead,
        clearAllNotifications,
        isAuthenticated,
        login,
        loginWithRole,
        logout,
        erpTheme,
        setErpTheme,
        activePrintModal,
        openPrintModal,
        closePrintModal,
      }}
    >
      {children}
    </ErpContext.Provider>
  );
}

export function useErp() {
  const context = useContext(ErpContext);
  if (!context) {
    throw new Error("useErp must be used within an ErpProvider");
  }
  return context;
}
