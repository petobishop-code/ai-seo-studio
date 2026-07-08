import AIControlCenter from "@/features/dashboard/ai-control-center";
import ProjectForm from "./project-form";

export default function ProjectPage() {
  return (
    <div className="space-y-6">
      <AIControlCenter />

      <ProjectForm />
    </div>
  );
}