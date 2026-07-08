"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
  domain: string;
  industry: string;
  region: string;
  status: string;
  pages: number;
  keywords: number;
  aiWorkers: number;
};

const STORAGE_KEY = "ai-seo-projects";

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [industry, setIndustry] = useState("하수구/배관");
  const [region, setRegion] = useState("");

  useEffect(() => {
    const savedProjects = localStorage.getItem(STORAGE_KEY);

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const handleCreateProject = () => {
    if (!name.trim()) {
      alert("프로젝트명을 입력해주세요.");
      return;
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      domain,
      industry,
      region,
      status: "준비중",
      pages: 0,
      keywords: 0,
      aiWorkers: 5,
    };

    const nextProjects = [newProject, ...projects];

    setProjects(nextProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProjects));

    setName("");
    setDomain("");
    setIndustry("하수구/배관");
    setRegion("");
  };

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <h2 className="text-2xl font-black text-white">새 프로젝트 생성</h2>
        <p className="mt-2 text-sm text-slate-400">
          AI 직원들이 운영할 새 회사를 등록합니다.
        </p>

        <div className="mt-7 space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-300">
              프로젝트명
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="예: 수리남케어"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-[#060817] px-4 py-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-300">도메인</label>
            <input
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              placeholder="예: surinamcare.kr"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-[#060817] px-4 py-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-300">업종</label>
            <select
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-[#060817] px-4 py-4 text-sm text-white outline-none focus:border-violet-500"
            >
              <option>하수구/배관</option>
              <option>법률/변호사</option>
              <option>병원/의료</option>
              <option>인테리어/시공</option>
              <option>프랜차이즈</option>
              <option>기타</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-300">지역</label>
            <input
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              placeholder="예: 전국, 창원, 서울"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-[#060817] px-4 py-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
            />
          </div>

          <button
            onClick={handleCreateProject}
            className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-violet-200"
          >
            프로젝트 생성
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">내 프로젝트</h2>

          <span className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-bold text-violet-300">
            {projects.length}
          </span>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-sm text-slate-500">
              아직 생성된 프로젝트가 없습니다.
            </div>
          ) : (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group block rounded-3xl border border-slate-800 bg-[#080d1c] p-5 transition hover:-translate-y-1 hover:border-violet-500 hover:bg-[#101735]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {project.domain || "도메인 미등록"}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                    {project.status}
                  </span>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">페이지</p>
                    <p className="mt-1 text-sm font-black text-white">
                      {project.pages}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">키워드</p>
                    <p className="mt-1 text-sm font-black text-white">
                      {project.keywords}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">AI</p>
                    <p className="mt-1 text-sm font-black text-white">
                      {project.aiWorkers}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-xs font-bold text-violet-300 opacity-0 transition group-hover:opacity-100">
                  프로젝트 관리로 이동 →
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}