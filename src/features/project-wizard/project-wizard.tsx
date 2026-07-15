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

type Step = {
  key: string;
  label: string;
  status: "running" | "done";
  detail?: string;
};

type Result = {
  name: string;
  keywords: string[];
  siteUrl: string;
  repositoryUrl: string;
  totalPages: number;
  addedPages: string[];
};

/** 여러 줄 입력을 키워드 배열로 정리한다. 줄바꿈/쉼표 모두 허용. */
function parseKeywords(raw: string) {
  const list = raw
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);

  return [...new Set(list)];
}

export default function ProjectWizard() {
  const [keywordText, setKeywordText] = useState("");
  const [industry, setIndustry] = useState("하수구/배관");
  const [brandName, setBrandName] = useState("");
  const [brandSlug, setBrandSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [kakaoId, setKakaoId] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function applyStep(next: Step) {
    setSteps((current) => {
      const index = current.findIndex((step) => step.key === next.key);
      if (index === -1) return [...current, next];

      const copy = [...current];
      copy[index] = next;
      return copy;
    });
  }

  const keywords = parseKeywords(keywordText);

  async function create() {
    if (!keywords.length || !brandName || !brandSlug) {
      alert("키워드, 브랜드명, 브랜드 영문명을 입력해주세요.");
      return;
    }

    if (!phone.trim() && !kakaoId.trim()) {
      alert("전화번호 또는 카카오톡 ID 중 하나는 입력해주세요.");
      return;
    }

    setIsCreating(true);
    setSteps([]);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords,
          domain: `${brandSlug}.com`,
          industry,
          brandName,
          brandSlug,
          phone,
          kakaoId,
        }),
      });

      if (!res.body) throw new Error("서버 응답을 읽을 수 없습니다.");

      // 서버가 단계마다 한 줄씩(NDJSON) 흘려보낸다. 줄 단위로 끊어 읽는다.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          const event = JSON.parse(line);

          if (event.type === "step") applyStep(event as Step);
          if (event.type === "done") setResult(event.result as Result);
          if (event.type === "error") setError(event.message as string);
        }
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "사이트 생성에 실패했습니다."
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#071020] p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">원클릭 사이트 생성</h2>
        <p className="mt-2 text-slate-400">
          대표키워드, 업종, 브랜드 정보를 입력하면 GitHub 저장소까지 자동
          생성합니다.
        </p>
      </div>

      <div className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            대표키워드{" "}
            <span className="text-slate-500">
              (한 줄에 하나씩, 여러 개 가능)
            </span>
          </label>
          <textarea
            value={keywordText}
            onChange={(e) => setKeywordText(e.target.value)}
            rows={6}
            placeholder={"창원하수구막힘\n의창구하수구막힘\n성산구하수구막힘\n김해하수구막힘"}
            className="w-full rounded-xl bg-slate-900 p-4 font-mono text-sm"
          />
          <p className="mt-2 text-sm text-slate-500">
            {keywords.length > 0 ? (
              <>
                키워드 <span className="font-bold text-blue-300">{keywords.length}개</span>{" "}
                인식됨. 지역마다 하수구·싱크대·변기 3개 페이지가 만들어집니다.
              </>
            ) : (
              "지역명이 다른 키워드를 줄바꿈으로 나열하세요. 같은 지역 키워드는 같은 페이지라 자동으로 합쳐집니다."
            )}
          </p>
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
          <label className="mb-2 block text-sm text-slate-300">
            브랜드 영문명
          </label>
          <input
            value={brandSlug}
            onChange={(e) =>
              setBrandSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
            }
            placeholder="예) surinam"
            className="w-full rounded-xl bg-slate-900 p-4"
          />
          <p className="mt-2 text-sm text-slate-500">
            브랜드당 저장소 1개로 묶입니다. 같은 값을 쓰면 키워드가 같은 사이트에
            쌓입니다.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            연락처 <span className="text-slate-500">(선택)</span>
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-7601-1156"
            className="w-full rounded-xl bg-slate-900 p-4"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            카카오톡 ID <span className="text-slate-500">(선택)</span>
          </label>
          <input
            value={kakaoId}
            onChange={(e) => setKakaoId(e.target.value)}
            placeholder="예) hhssoohso"
            className="w-full rounded-xl bg-slate-900 p-4"
          />
          <p className="mt-2 text-sm text-slate-500">
            전화번호와 카카오톡 중 <span className="font-bold text-slate-300">최소 하나</span>는
            입력해야 합니다. 입력한 항목만 사이트에 상담 버튼으로 표시됩니다.
          </p>
        </div>

        <button
          onClick={create}
          disabled={isCreating}
          className="mt-3 rounded-xl bg-blue-600 p-4 text-lg font-bold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating
            ? "생성 진행중..."
            : keywords.length > 1
              ? `🚀 키워드 ${keywords.length}개 한 번에 생성`
              : "🚀 원클릭 사이트 생성"}
        </button>
      </div>

      {steps.length > 0 && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#050b16] p-6">
          <p className="mb-4 text-sm font-bold text-blue-300">진행 상황</p>

          <ol className="space-y-3">
            {steps.map((step) => (
              <li key={step.key} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 shrink-0 text-center">
                  {step.status === "done" ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                  )}
                </span>

                <div>
                  <p
                    className={
                      step.status === "done"
                        ? "font-bold text-slate-200"
                        : "font-bold text-blue-300"
                    }
                  >
                    {step.label}
                  </p>
                  {step.detail && (
                    <p className="text-sm text-slate-500">{step.detail}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {isCreating && (
            <p className="mt-4 text-xs text-slate-500">
              배포까지 1~2분 정도 걸립니다. 창을 닫지 마세요.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
          <p className="font-bold text-red-300">사이트 생성 실패</p>
          <p className="mt-2 break-all text-sm text-red-200">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
          <p className="text-lg font-black text-emerald-300">
            ✅ 배포 완료 — 키워드 {result.keywords?.length ?? 1}개
          </p>

          <p className="mt-3 text-sm text-slate-300">
            이번에 추가된 페이지 {result.addedPages?.length ?? 0}개 · 사이트 전체{" "}
            {result.totalPages}개
          </p>

          <p className="mt-1 text-xs text-slate-500">{result.name}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={result.siteUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-emerald-300"
            >
              사이트 열기 →
            </a>
            <a
              href={result.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-white/5"
            >
              GitHub 저장소
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
