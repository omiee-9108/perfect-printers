import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PERFECT PRINTERS ERP • Mono Carton Production MES",
  description: "Packaging MES & Job Tracking System for Perfect Printers, Miraj MIDC",
};

export default function ErpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="erp-app-wrapper min-h-screen bg-slate-950 text-slate-100">{children}</div>;
}
