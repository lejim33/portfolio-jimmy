import fs from "fs";
import path from "path";
import { PortfolioData } from "@/types/portfolio";
import PortfolioContent from "@/components/PortfolioContent";

function getPortfolioData(): PortfolioData {
  const filePath = path.join(process.cwd(), "data", "portfolio.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default function Home() {
  const data = getPortfolioData();
  return <PortfolioContent rawData={data} />;
}
