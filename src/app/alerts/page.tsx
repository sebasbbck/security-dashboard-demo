import type { Metadata } from "next";
import AlertsView from "@/components/AlertsView";

export const metadata: Metadata = { title: "Alerts · Sentinel Demo" };

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Alerts</h1>
        <p className="text-muted text-sm">
          Newest first. Critical and high alerts need action today.
        </p>
      </header>
      <AlertsView />
    </div>
  );
}
