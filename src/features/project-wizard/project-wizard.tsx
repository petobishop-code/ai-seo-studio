"use client";

import { useState } from "react";

export default function ProjectWizard() {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [repository, setRepository] = useState("");
  const [keyword, setKeyword] = useState("");

  async function create() {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        domain,
        repository,
        mainKeyword: keyword,
        industry: "하수구",
      }),
    });

    const project = await res.json();

    alert(`${project.name} 프로젝트 생성 완료`);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#071020] p-8">
      <h2 className="text-3xl font-bold">
        프로젝트 생성
      </h2>

      <div className="mt-8 grid gap-4">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="프로젝트명"
          className="rounded-xl bg-slate-900 p-4"
        />

        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="도메인"
          className="rounded-xl bg-slate-900 p-4"
        />

        <input
          value={repository}
          onChange={(e) => setRepository(e.target.value)}
          placeholder="GitHub Repository"
          className="rounded-xl bg-slate-900 p-4"
        />

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="대표키워드"
          className="rounded-xl bg-slate-900 p-4"
        />

        <button
          onClick={create}
          className="rounded-xl bg-blue-600 p-4 font-bold"
        >
          프로젝트 생성
        </button>

      </div>
    </section>
  );
}