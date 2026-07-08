"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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

const menuItems = [
  "홈 / Home",
  "회사 / Company",
  "웹사이트 / Websites",
  "AI 팀 / AI Team",
  "콘텐츠 / Content",
  "발행 / Publish",
  "SEO / SEO",
  "분석 / Analytics",
  "보고서 / Reports",
  "설정 / Settings",
];

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem("ai-seo-projects");
    if (!savedProjects) return;

    try {
      const projects: Project[] = JSON.parse(savedProjects);
      const foundProject = projects.find((item) => item.id === projectId);
      setProject(foundProject ?? null);
    } catch {
      setProject(null);
    }
  }, [projectId]);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-slate-800 bg-[#071020] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-600 text-xl font-black">
            ✦
          </div>
          <div>
            <h1 className="text-xl font-black">AI SEO Studio</h1>
            <p className="text-xs text-slate-400">AI SEO Operating System</p>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {menuItems.map((item, index) => (
            <div
              key={item}
              className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                index === 1
                  ? "bg-gradient-to-r from-blue-600 to-violet-700 shadow-lg shadow-violet-900/30"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <div className="ml-[280px]">
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-slate-800 bg-[#050816]/90 px-8 backdrop-blur">
          <div>
            <p className="text-sm text-slate-400">Project Control Center</p>
            <h2 className="text-2xl font-black">
              {project?.name ?? "프로젝트 상세"}
            </h2>
          </div>

          <Link
            href="/"
            className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 hover:text-white"
          >
            ← 홈으로 돌아가기
          </Link>
        </header>

        <main className="space-y-6 p-8">
          {!project ? (
            <section className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
              <h1 className="text-2xl font-black">
                프로젝트를 찾을 수 없습니다.
              </h1>
              <p className="mt-2 text-slate-400">
                저장된 프로젝트 정보가 없거나 삭제된 프로젝트입니다.
              </p>
            </section>
          ) : (
            <>
              <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#071020] to-[#111633] p-8">
                <p className="text-sm font-black text-sky-300">
                  PROJECT CONTROL CENTER
                </p>

                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-black">{project.name}</h1>
                    <p className="mt-2 text-slate-400">
                      {project.domain || "도메인 미등록"}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300">
                    {project.status}
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                    <p className="text-sm text-slate-400">업종</p>
                    <p className="mt-2 text-xl font-black">
                      {project.industry}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                    <p className="text-sm text-slate-400">지역</p>
                    <p className="mt-2 text-xl font-black">
                      {project.region || "미등록"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                    <p className="text-sm text-slate-400">페이지</p>
                    <p className="mt-2 text-xl font-black">{project.pages}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                    <p className="text-sm text-slate-400">AI 직원</p>
                    <p className="mt-2 text-xl font-black">
                      {project.aiWorkers}
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
                  <h2 className="text-xl font-black">웹사이트 관리</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    도메인, 사이트 구조, 기본 SEO 정보를 관리합니다.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
                  <h2 className="text-xl font-black">콘텐츠 관리</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    지역 키워드 페이지와 글 발행 계획을 관리합니다.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
                  <h2 className="text-xl font-black">AI 직원 관리</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    글쓰기, SEO, 발행, 분석 AI 작업 상태를 관리합니다.
                  </p>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}