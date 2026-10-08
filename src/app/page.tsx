import OverviewView from "@/components/OverviewView";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-muted text-sm">What needs attention right now.</p>
      </header>
      <OverviewView />
    </div>
  );
}
