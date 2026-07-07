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
    <div className="grid gap-6 lg:grid-cols-[430px_1fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/10 bg-[#0d1628]/90 p-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold">새 프로젝트 생성</h2>
        <p className="mt-2 text-sm text-slate-400">
          AI 직원들이 운영할 새 회사를 등록합니다.
        </p>

        <div className="mt-6 space-y-4">
          <Field label="프로젝트명">
            <input name="name" required placeholder="예: 수리남케어" className={inputClass} />
          </Field>

          <Field label="도메인">
            <input name="domain" required placeholder="예: surinamcare.kr" className={inputClass} />
          </Field>

          <Field label="업종">
            <select name="category" required className={inputClass}>
              {projectCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </Field>

          <Field label="지역">
            <input name="region" required placeholder="예: 전국, 창원, 서울" className={inputClass} />
          </Field>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.01] hover:bg-blue-100"
        >
          프로젝트 생성
        </button>
      </form>

      <section className="rounded-3xl border border-white/10 bg-[#0d1628]/90 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">내 프로젝트</h2>
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300">
            {projects.length}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-sm text-slate-400">
              아직 생성된 프로젝트가 없습니다.
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-white/10 bg-[#071020] p-5"
              >
                <div className="flex items-center justify-between">
                  <strong>{project.name}</strong>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                    {project.status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">{project.domain}</p>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <Metric label="페이지" value="0" />
                  <Metric label="키워드" value="0" />
                  <Metric label="AI" value="5" />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400/60";

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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}