import type { Metadata } from "next";
import AssetsView from "@/components/AssetsView";

export const metadata: Metadata = { title: "Assets · Sentinel Demo" };

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Asset inventory</h1>
        <p className="text-muted text-sm">Every monitored asset, riskiest first.</p>
      </header>
      <AssetsView />
    </div>
  );
}
