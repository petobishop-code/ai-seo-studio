"use client";

import { projectCategories } from "@/config/project-categories";
import type { Project } from "@/types/project";
import { useState } from "react";

export default function ProjectForm() {
  const [projects, setProjects] = useState<Project[]>([]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: String(formData.get("name")),
      domain: String(formData.get("domain")),
      category: formData.get("category") as Project["category"],
      region: String(formData.get("region")),
      status: "준비중",
    };

    setProjects((prev) => [newProject, ...prev]);
    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
      >
        <h2 className="text-xl font-semibold">새 프로젝트 생성</h2>

        <p className="mt-2 text-sm text-slate-400">
          AI 직원이 운영할 웹사이트 프로젝트를 등록합니다.
        </p>

        <div className="mt-6 space-y-4">
          <Field label="프로젝트명">
            <input
              name="name"
              required
              placeholder="예: 수리남케어"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </Field>

          <Field label="도메인">
            <input
              name="domain"
              required
              placeholder="예: surinamcare.kr"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </Field>

          <Field label="업종">
            <select
              name="category"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-slate-500"
            >
              {projectCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </Field>

          <Field label="지역">
            <input
              name="region"
              required
              placeholder="예: 전국, 창원, 서울"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </Field>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200"
        >
          프로젝트 생성
        </button>
      </form>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">프로젝트 목록</h2>

        <div className="mt-6 space-y-3">
          {projects.length === 0 ? (
            <p className="text-sm text-slate-400">
              아직 생성된 프로젝트가 없습니다.
            </p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-center justify-between">
                  <strong>{project.name}</strong>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                    {project.status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  {project.domain} · {project.category} · {project.region}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      {children}
    </label>
  );
}