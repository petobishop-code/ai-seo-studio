import { DashboardPage } from "@/features/dashboard/dashboard-page";
import ProjectPage from "@/features/projects/project-page";
import SitePublisher from "@/features/publisher/site-publisher";

export default function Home() {
  return (
    <main className="space-y-6 p-8">
      <DashboardPage />
      <SitePublisher />
      <ProjectPage />
    </main>
  );
}