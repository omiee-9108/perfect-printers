export type StageStatus =
  | "Pending"
  | "Pre-Press"
  | "Sheet Allocation"
  | "Press"
  | "Post-Press"
  | "Accounts"
  | "Dispatch"
  | "Completed"
  | "On Hold"
  | "Cancelled";

export type UserRole = "ADMIN" | "SALES" | "PRODUCTION" | "ACCOUNTS";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
}

export interface CustomerMaster {
  id: string;
  code: string; // e.g. D02
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  location: string;
  gstin: string;
  isGstRegistered: boolean;
  creditTerms: string; // e.g. "30 Days Credit"
  tags: string[]; // e.g. ["Regular", "Pharma", "High Volume"]
  isLocked?: boolean;
}

export interface JobMaster {
  id: string;
  jobCode: string; // e.g. JC-MED-5001
  productName: string;
  customerId: string;
  customerCode: string;
  customerName: string;
  sheetSize: string; // e.g. 28" × 40" (710 × 1020 mm)
  sheetLengthInches: number;
  sheetWidthInches: number;
  boardType: string; // e.g. FBB Cyber XL Pac
  boardGsm: number; // e.g. 300
  colors: string; // e.g. CMYK + Pantone 072C Spot
  numColors: number; // e.g. 5
  sides: 1 | 2;
  ups: number; // e.g. 12 ups
  dieCode: string; // e.g. DIE-CART-042
  artworkUrl?: string;
  postPressProcesses: string[]; // e.g. ["Thermal Gloss Lamination", "Spot UV Drip-off", "Die Punching", "Pasting"]
}

export interface EmployeeMaster {
  id: string;
  staffId: string;
  name: string;
  department: "Pre-Press" | "Press" | "Post-Press" | "Quality" | "Dispatch" | "Accounts" | "Admin" | "Sheet Allocation" | string;
  phone: string;
  bloodGroup?: string;
  email?: string;
  shift?: "Morning (8AM-4PM)" | "Evening (4PM-12AM)" | "Night (12AM-8AM)" | "General" | string;
  status?: "Active" | "On Leave" | "Inactive" | string;
  isLocked?: boolean;
}

export interface MachineMaster {
  id: string;
  machineId: string;
  name: string;
  description?: string;
  department?: "Pre-Press" | "Press" | "Post-Press" | "Finishing" | string;
  type?: "Offset Press" | "Die Cutter" | "CTP Processor" | "Laminator" | "Folder Gluer" | "Coater" | string;
  speedImpPerHour?: number;
  hourlyRate?: number; // in INR
  currentJobCode?: string;
  status?: "Running" | "Idle" | "Maintenance" | "Active" | string;
  isLocked?: boolean;
}

export interface ProcessMaster {
  id: string;
  code: string;
  name: string;
  unitRate: number; // ₹ per 1000 sheets or per kg
  rateUnit: string;
  category: "Pre-Press" | "Press" | "Coating & Lamination" | "Finishing & Pasting";
  machineType: string;
  setupTimeMin: number;
}

export interface AdminMaster {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Suspended";
  lastLogin: string;
}

export interface JobOrder {
  id: string; // e.g. ORD-2026-0842
  jobId: string;
  jobCode: string;
  jobName: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  quantity: number; // total cartons
  ups: number;
  totalSheetsRequired: number; // (Qty / Ups) + Makeready
  makereadySheets: number;
  sheetSize: string;
  boardType: string;
  boardGsm: number;
  colors: string;
  numColors: number;
  status: StageStatus;
  progressPercent: number;
  orderDate: string;
  dueDate: string;
  instructions?: string;
  holdReason?: string;
  cancelReason?: string;
  artworkUrl?: string;
  assignedMachine?: string;
  assignedOperator?: string;
  challanNo?: string;
  invoiceNo?: string;
  dispatchDate?: string;
}

export interface ProductionAuditLog {
  id: string;
  orderId: string;
  jobCode: string;
  stage: StageStatus;
  timestamp: string;
  operator: string;
  action: string;
  notes?: string;
  sheetsConsumed?: number;
  cartonsProduced?: number;
  scrapPercentage?: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category:
    | "Paper & Board"
    | "Inks & Varnishes"
    | "Lamination Film"
    | "Adhesives & Gum"
    | "UV & Aqueous Coatings"
    | "Chemicals & Plates"
    | "Packing Materials";
  stockType: "Own Stock" | "Client Stock";
  clientName?: string;
  quantity: number;
  unit: "Kg" | "Reams" | "Sheets" | "Liters" | "Rolls" | "Plates";
  reorderLevel: number;
  costPerUnit: number; // in INR
  totalValue: number; // quantity * costPerUnit
  location: string; // e.g. "Rack B-04 / Warehouse 1"
  lastUpdated: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  type: "Stock In" | "Material Out (Job Issuance)" | "Adjustment" | "Return";
  quantity: number;
  unit: string;
  date: string;
  referenceNo: string; // PO number or Order ID
  jobCode?: string;
  authorizedBy: string;
  notes?: string;
}

export interface POLineItem {
  id: string;
  itemType: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. PO-2026-0312
  supplierName: string;
  supplierGstin?: string;
  supplierAddress?: string;
  poDate: string;
  deliveryDate: string;
  gstRate: number; // 0, 5, 12, 18, 28
  lineItems: POLineItem[];
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  terms: string;
  status: "Draft" | "Approved" | "Ordered" | "Received";
}

export interface QuotationLineItem {
  id: string;
  jobContext: string;
  specs: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string; // e.g. QT-2026-0521
  customerId: string;
  customerName: string;
  contactPerson: string;
  quoteDate: string;
  validUntil: string;
  gstRate: number;
  lineItems: QuotationLineItem[];
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  terms: string;
  status: "Draft" | "Sent" | "Accepted" | "Rejected";
}

export interface MonthlyExpenses {
  monthYear: string; // e.g. "August 2026"
  electricity: number;
  salaries: number;
  rentAndFactory: number;
  maintenanceAndConsumables: number;
  otherExpenses: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "warning" | "success" | "alert" | "critical";
  isRead: boolean;
  orderId?: string;
}

export type ErpThemeKey = "emerald-mint" | "dark-carbon" | "executive-navy" | "clean-minimalist";

export interface ErpThemeOption {
  id: ErpThemeKey;
  name: string;
  subtitle: string;
  headerBg: string;
  pageBg: string;
  accent: string;
  isDark: boolean;
}

export const ERP_THEME_OPTIONS: ErpThemeOption[] = [
  {
    id: "emerald-mint",
    name: "Emerald Mint",
    subtitle: "Packaging Press Signature (Green Header + Mint Canvas)",
    headerBg: "#064e3b",
    pageBg: "#f0fdf4",
    accent: "#059669",
    isDark: false,
  },
  {
    id: "dark-carbon",
    name: "Heidelberg Dark Carbon",
    subtitle: "Industrial Dark Mode (Cyan Accents + Deep Slate Cards)",
    headerBg: "#090d14",
    pageBg: "#0b0f19",
    accent: "#00e5ff",
    isDark: true,
  },
  {
    id: "executive-navy",
    name: "Corporate Executive Navy",
    subtitle: "Deep Navy & Gold (Corporate Blue Header + Clean Slate)",
    headerBg: "#05162a",
    pageBg: "#f1f5f9",
    accent: "#d97706",
    isDark: false,
  },
  {
    id: "clean-minimalist",
    name: "Minimalist Studio Slate",
    subtitle: "Modern Monochrome (Charcoal Header + Bright White Cards)",
    headerBg: "#0f172a",
    pageBg: "#f8fafc",
    accent: "#2563eb",
    isDark: false,
  },
];
