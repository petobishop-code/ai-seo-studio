import { DashboardPage } from "@/features/dashboard/dashboard-page";
import ProjectWizard from "@/features/project-wizard/project-wizard";
import WebsiteBuilder from "@/features/website-builder/website-builder";
import SitePublisher from "@/features/publisher/site-publisher";
import SiteList from "@/features/sites/site-list";
import ProjectPage from "@/features/projects/project-page";
import ReviewPanel from "@/features/review-engine/review-panel";

export default function Home() {
  return (
    <main className="space-y-6 p-8">
      <DashboardPage />
      <ProjectWizard />
      <ReviewPanel />
      <WebsiteBuilder />
      <SitePublisher />
      <SiteList />
      <ProjectPage />
    </main>
  );
}
