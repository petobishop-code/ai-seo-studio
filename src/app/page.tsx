import AppShell from "@/components/layout/app-shell";
import ProjectPage from "@/features/projects/project-page";

export default function Home() {
  return (
    <AppShell>
      <ProjectPage />
    </AppShell>
  );
}