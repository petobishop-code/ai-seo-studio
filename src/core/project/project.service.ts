import { randomUUID } from "crypto";
import { addProject } from "./project.store";
import { Project } from "./project.types";

export function createProject(data: {
  name: string;
  domain: string;
  repository: string;
  mainKeyword: string;
  industry: string;
  brandName: string;
  brandSlug: string;
  phone: string;
  kakaoId: string;
}) {
  const project: Project = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  };

  addProject(project);

  return project;
}
