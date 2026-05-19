import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { PortfolioData } from "@/types/portfolio";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function getPortfolioData(): PortfolioData {
  const filePath = path.join(process.cwd(), "data", "portfolio.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export default async function AdminPage() {
  const data = getPortfolioData();
  return <AdminDashboard initialData={data} />;
}
