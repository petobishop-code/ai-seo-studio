"use client";

import { useState } from "react";

const industries = [
  "하수구/배관",
  "법률",
  "대출",
  "웨딩",
  "병원/의료",
  "이사/청소",
  "인테리어",
  "자동차",
  "교육",
  "기타",
];

export default function ProjectWizard() {
  const [siteName, setSiteName] = useState("");
  const [industry, setIndustry] = useState("하수구/배관");
  const [brandName, setBrandName] = useState("");
  const [brandSlug, setBrandSlug] = useState("");
  const [phone, setPhone] = useState("");

  async function create() {
    if (!siteName || !brandName || !brandSlug || !phone) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const repository = siteName.trim().toLowerCase().replace(/\s+/g, "-");
    const domain = `${repository}.com`;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: siteName,
        domain,
        repository,
        mainKeyword: siteName,
        industry,
        brandName,
        brandSlug,
        phone,
      }),
    });

    if (!res.ok) {
      alert("사이트 생성 실패");
      return;
    }

    const project = await res.json();
    alert(`✅ ${project.name} 사이트 생성 시작`);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#071020] p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">원클릭 사이트 생성</h2>
        <p className="mt-2 text-slate-400">
          대표키워드, 업종, 브랜드 정보를 입력하면 GitHub 저장소까지 자동 생성합니다.
        </p>
      </div>

      <div className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            대표키워드 / 사이트 이름
          </label>
          <input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="예) 창원하수구막힘"
            className="w-full rounded-xl bg-slate-900 p-4"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">업종</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full rounded-xl bg-slate-900 p-4"
          >
            {industries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">브랜드명</label>
          <input
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="예) 하수구 수리남"
            className="w-full rounded-xl bg-slate-900 p-4"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">브랜드 영문명</label>
          <input
            value={brandSlug}
            onChange={(e) =>
              setBrandSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
            }
            placeholder="예) surinam"
            className="w-full rounded-xl bg-slate-900 p-4"
          />
          <p className="mt-2 text-sm text-slate-500">
            GitHub 저장소와 Vercel 프로젝트 이름에 사용됩니다. 예) surinam
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">연락처</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-7601-1156"
            className="w-full rounded-xl bg-slate-900 p-4"
          />
        </div>

        <button
          onClick={create}
          className="mt-3 rounded-xl bg-blue-600 p-4 text-lg font-bold transition hover:bg-blue-500"
        >
          🚀 원클릭 사이트 생성
        </button>
      </div>
    </section>
  );
}
