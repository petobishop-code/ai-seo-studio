"use client";

import { useState } from "react";
import { createWebsite } from "@/lib/website-template";

export default function WebsiteBuilder() {
  const [mainKeyword, setMainKeyword] = useState("인천하수구막힘");
  const [result, setResult] = useState(() => createWebsite({ mainKeyword }));
  const [isCreating, setIsCreating] = useState(false);
  const [createdFolder, setCreatedFolder] = useState("");

  const handleCreate = async () => {
    if (!mainKeyword.trim()) {
      alert("대표키워드를 입력해주세요.");
      return;
    }

    setIsCreating(true);
    setCreatedFolder("");

    const website = createWebsite({ mainKeyword });
    setResult(website);

    try {
      const response = await fetch("/api/website/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mainKeyword,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("사이트 파일 생성에 실패했습니다.");
        return;
      }

      setCreatedFolder(data.folder);
      alert("새 사이트 파일이 생성되었습니다.");
    } catch {
      alert("서버 연결 중 오류가 발생했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0d1628]/90 p-6 text-white shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-blue-300">WEBSITE ENGINE</p>
          <h2 className="mt-2 text-2xl font-black">원클릭 사이트 생성기</h2>
          <p className="mt-2 text-sm text-slate-400">
            대표키워드 하나만 입력하면 사이트 파일을 실제로 생성합니다.
          </p>
        </div>

        <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300">
          품질 점수 {result.score}/100
        </span>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[380px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[#071020] p-5">
          <label className="text-sm font-bold text-slate-300">대표키워드</label>

          <input
            value={mainKeyword}
            onChange={(event) => setMainKeyword(event.target.value)}
            placeholder="예: 인천하수구막힘"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-[#050816] px-4 py-4 text-sm outline-none focus:border-blue-400"
          />

          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="mt-4 w-full rounded-2xl bg-blue-400 px-5 py-4 text-sm font-black text-slate-950 hover:bg-blue-300 disabled:opacity-50"
          >
            {isCreating ? "AI 직원들이 사이트 제작중..." : "AI 사이트 생성"}
          </button>

          {createdFolder ? (
            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="font-black text-emerald-300">사이트 생성 완료</p>
              <p className="mt-2 break-all text-xs text-slate-300">
                {createdFolder}
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-black">생성 기준</p>
              <p className="mt-2 text-sm text-slate-400">
                메인, 내부페이지, 갤러리, robots, sitemap까지 생성합니다.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#071020] p-5">
            <h3 className="font-black">생성될 사이트 파일</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <FileCard title="index.html" desc="메인페이지" />
              <FileCard title="gallery.html" desc="작업사진 전체보기" />
              <FileCard title="robots.txt" desc="검색엔진 허용" />
              <FileCard title="sitemap.xml" desc="사이트맵" />
              <FileCard title="images/" desc="작업사진 폴더" />
              <FileCard title="내부페이지" desc="서비스별 페이지" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#071020] p-5">
            <h3 className="font-black">내부페이지 구조</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {result.pages.map((page) => (
                <div
                  key={page}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-slate-300"
                >
                  {page}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#071020] p-5">
            <h3 className="font-black">index.html 미리보기 코드</h3>
            <textarea
              readOnly
              value={result.indexHtml}
              className="mt-3 h-80 w-full rounded-2xl border border-slate-800 bg-[#050816] p-4 text-xs text-slate-300 outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FileCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="font-black text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{desc}</p>
    </div>
  );
}