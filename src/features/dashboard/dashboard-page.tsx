import AIControlCenter from "./ai-control-center";
import DashboardLivePanel from "./dashboard-live-panel";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <AIControlCenter />
      <DashboardLivePanel />
    </div>
  );
}