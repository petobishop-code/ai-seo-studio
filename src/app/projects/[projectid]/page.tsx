import { DashboardPage } from "@/features/dashboard/dashboard-page";
import WebsiteBuilder from "@/features/website-builder/website-builder";
import SitePublisher from "@/features/publisher/site-publisher";
import ProjectPage from "@/features/projects/project-page";

export default function Home() {
  return (
    <main className="space-y-6 p-8">
      <DashboardPage />
      <WebsiteBuilder />
      <SitePublisher />
      <ProjectPage />
    </main>
  );
}import SiteList from "@/features/sites/site-list";