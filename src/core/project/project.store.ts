import { Project } from "./project.types";

const projects: Project[] = [];

export function getProjects() {
  return projects;
}

export function addProject(project: Project) {
  projects.push(project);
}

export function findProject(id: string) {
  return projects.find((p) => p.id === id);
}