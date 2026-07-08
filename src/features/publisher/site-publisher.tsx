"use client";

import { useEffect, useState } from "react";

type SiteFile = {
  id: string;
  keyword: string;
  slug: string;
  url: string;
  html: string;
  sitemap: string;
  link: string;
  createdAt: string;
};

const STORAGE_KEY = "surinamcare-site-files";

const regionMap: Record<string, string> = {
  성산구: "seongsan",
  창원: "changwon",
  의창구: "uichang",
  진해구: "jinhae",
  김해: "gimhae",
  부산: "busan",
  서울: "seoul",
  인천: "incheon",
};

function getServiceSlug(keyword: string) {
  if (keyword.includes("싱크대")) return "sink";
  if (keyword.includes("변기")) return "toilet";
  if (keyword.includes("하수구")) return "drain";
  return "service";
}

function getRegionSlug(keyword: string) {
  const found = Object.keys(regionMap).find((region) =>
    keyword.includes(region)
  );

  return found ? regionMap[found] : "local";
}

function createHtml(keyword: string): SiteFile {
  const slug = `${getRegionSlug(keyword)}-${getServiceSlug(keyword)}.html`;
  const url = `https://surinamcare.kr/${slug}`;
  const today = new Date().toISOString().slice(0, 10);

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${keyword} | 수리남케어 하수구 싱크대 변기 막힘 전문</title>
<meta name="description" content="${keyword} 전문 수리남케어. 하수구막힘, 싱크대막힘, 변기막힘, 역류, 악취, 배관 점검까지 24시간 상담 가능합니다.">
<link rel="canonical" href="${url}">

<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,'Noto Sans KR',sans-serif;line-height:1.8;color:#222;background:#fff}
.hero{background:#101820;color:#fff;text-align:center;padding:70px 20px}
.hero h1{font-size:38px;margin:0 0 18px}
.hero p{font-size:20px;margin:8px 0}
.btns{margin-top:28px}
.btns a{display:inline-block;margin:6px;padding:15px 26px;border-radius:12px;background:#ffd400;color:#111;text-decoration:none;font-weight:700}
.wrap{max-width:960px;margin:0 auto;padding:45px 20px}
h2{font-size:28px;margin-top:40px}
.box{background:#f6f6f6;border-radius:18px;padding:24px;margin:22px 0}
ul{padding-left:22px}
.footer{background:#101820;color:#fff;text-align:center;padding:35px 20px;margin-top:50px}
.related a{display:inline-block;margin:6px;padding:10px 14px;background:#f1f1f1;border-radius:10px;color:#222;text-decoration:none}
</style>
</head>

<body>
<section class="hero">
  <h1>${keyword} 문제 빠르게 해결하는 수리남케어</h1>
  <p>하수구막힘 · 싱크대막힘 · 변기막힘 전문</p>
  <p>전국 출동 가능 / 24시간 연중무휴 상담</p>
  <div class="btns">
    <a href="tel:010-7601-1156">전화상담 010-7601-1156</a>
    <a href="https://open.kakao.com/o/hhssoohso">카카오톡 hhssoohso</a>
  </div>
</section>

<main class="wrap">
  <h2>${keyword} 증상이 생겼다면 먼저 원인 확인이 중요합니다</h2>
  <p>
    ${keyword}은 단순히 물이 늦게 내려가는 문제로 시작되는 경우가 많지만,
    시간이 지나면 역류, 악취, 배관 오염으로 이어질 수 있습니다.
    수리남케어는 현장 상황을 먼저 점검하고 막힘 원인에 맞는 방식으로 작업을 진행합니다.
  </p>

  <div class="box">
    <h2>주요 증상</h2>
    <ul>
      <li>물이 천천히 내려가거나 전혀 빠지지 않는 경우</li>
      <li>배수구 주변에서 악취가 올라오는 경우</li>
      <li>사용 중 물이 역류하는 경우</li>
      <li>반복적으로 막힘이 발생하는 경우</li>
    </ul>
  </div>

  <h2>${keyword} 작업 과정</h2>
  <p>
    현장에 도착하면 먼저 배관 상태와 사용 환경을 확인합니다.
    단순 이물질 막힘인지, 기름 슬러지나 오랜 찌꺼기 누적인지,
    또는 배관 구조 문제인지에 따라 장비와 작업 방식이 달라질 수 있습니다.
  </p>

  <p>
    무리하게 뚫기 작업만 진행하면 배관 손상이나 재막힘이 생길 수 있기 때문에
    수리남케어는 원인 파악 후 석션, 스프링 장비, 고압세척, 배관 내시경 등
    현장에 맞는 방식으로 문제를 해결합니다.
  </p>

  <div class="box">
    <h2>수리남케어가 중요한 이유</h2>
    <ul>
      <li>24시간 상담 가능</li>
      <li>하수구, 싱크대, 변기 막힘 전문 대응</li>
      <li>역류와 악취 원인까지 점검</li>
      <li>현장 상황에 맞는 장비 사용</li>
      <li>재발 가능성을 줄이는 작업 안내</li>
    </ul>
  </div>

  <h2>자주 묻는 질문</h2>
  <div class="box">
    <p><strong>Q. ${keyword} 작업은 바로 가능한가요?</strong></p>
    <p>A. 현장 위치와 일정에 따라 빠른 방문 상담이 가능합니다.</p>

    <p><strong>Q. 비용은 어떻게 결정되나요?</strong></p>
    <p>A. 막힘 위치, 배관 상태, 필요한 장비에 따라 달라질 수 있습니다.</p>

    <p><strong>Q. 다시 막히지 않게 관리할 수 있나요?</strong></p>
    <p>A. 작업 후 배관 사용 방법과 관리 요령을 함께 안내해드립니다.</p>
  </div>

  <h2>관련 페이지</h2>
  <div class="related">
    <a href="/seongsan-drain.html">성산구하수구막힘</a>
    <a href="/seongsan-sink.html">성산구싱크대막힘</a>
    <a href="/seongsan-toilet.html">성산구변기막힘</a>
    <a href="/changwon-drain.html">창원하수구막힘</a>
  </div>
</main>

<footer class="footer">
  <p>수리남케어 | 하수구막힘 · 싱크대막힘 · 변기막힘 전문</p>
  <p>전화상담 010-7601-1156</p>
</footer>
</body>
</html>`;

  return {
    id: crypto.randomUUID(),
    keyword,
    slug,
    url,
    html,
    sitemap: `<url>
  <loc>${url}</loc>
  <lastmod>${today}</lastmod>
  <priority>0.8</priority>
</url>`,
    link: `<a href="/${slug}">${keyword}</a>`,
    createdAt: today,
  };
}

export default function SitePublisher() {
  const [keyword, setKeyword] = useState("성산구하수구막힘");
  const [result, setResult] = useState<SiteFile | null>(null);
  const [files, setFiles] = useState<SiteFile[]>([]);

  useEffect(() => {
    const savedFiles = localStorage.getItem(STORAGE_KEY);

    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
  }, []);

  const handleGenerate = () => {
    if (!keyword.trim()) {
      alert("키워드를 입력해주세요.");
      return;
    }

    const newFile = createHtml(keyword.trim());
    setResult(newFile);
  };

  const handleSaveFile = () => {
    if (!result) {
      alert("먼저 AI 직원 실행을 눌러 페이지를 생성해주세요.");
      return;
    }

    const alreadyExists = files.some((file) => file.slug === result.slug);

    if (alreadyExists) {
      alert("이미 같은 파일명이 사이트 파일 목록에 있습니다.");
      return;
    }

    const nextFiles = [result, ...files];

    setFiles(nextFiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFiles));

    alert("사이트 파일 목록에 추가되었습니다.");
  };

  const handleDeleteFile = (id: string) => {
    const nextFiles = files.filter((file) => file.id !== id);

    setFiles(nextFiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFiles));
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0d1628]/90 p-6 text-white shadow-xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-emerald-300">
            REAL SITE PUBLISHER
          </p>
          <h2 className="mt-2 text-2xl font-black">
            실제 사이트 페이지 생성
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            키워드를 입력하면 HTML 파일을 만들고 사이트 파일 목록에 저장합니다.
          </p>
        </div>

        <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300">
          저장 파일 {files.length}개
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[#071020] p-5">
          <label className="text-sm font-bold text-slate-300">
            생성할 키워드
          </label>

          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="예: 성산구하수구막힘"
            className="mt-3 w-full rounded-2xl border border-slate-800 bg-[#050816] px-4 py-4 text-sm outline-none placeholder:text-slate-600 focus:border-emerald-400"
          />

          <button
            onClick={handleGenerate}
            className="mt-4 w-full rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-slate-950 hover:bg-emerald-300"
          >
            AI 직원 실행
          </button>

          <button
            onClick={handleSaveFile}
            className="mt-3 w-full rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm font-black text-emerald-300 hover:bg-emerald-400/20"
          >
            사이트 파일 목록에 추가
          </button>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
            <p className="font-bold text-white">생성 파일</p>
            <p className="mt-2 text-emerald-300">
              {result?.slug ?? "아직 생성된 파일 없음"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result?.url ?? "AI 직원 실행 후 URL이 표시됩니다."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#071020] p-5">
            <h3 className="font-black">1. HTML 파일 코드</h3>
            <textarea
              readOnly
              value={result?.html ?? ""}
              placeholder="AI 직원 실행 후 HTML 코드가 생성됩니다."
              className="mt-3 h-64 w-full rounded-2xl border border-slate-800 bg-[#050816] p-4 text-xs text-slate-300 outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#071020] p-5">
              <h3 className="font-black">2. sitemap.xml 추가 코드</h3>
              <textarea
                readOnly
                value={result?.sitemap ?? ""}
                className="mt-3 h-32 w-full rounded-2xl border border-slate-800 bg-[#050816] p-4 text-xs text-slate-300 outline-none"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#071020] p-5">
              <h3 className="font-black">3. 내부링크 추가 코드</h3>
              <textarea
                readOnly
                value={result?.link ?? ""}
                className="mt-3 h-32 w-full rounded-2xl border border-slate-800 bg-[#050816] p-4 text-xs text-slate-300 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#071020] p-5">
        <h3 className="text-xl font-black">사이트 파일 목록</h3>

        <div className="mt-4 space-y-3">
          {files.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-sm text-slate-500">
              아직 저장된 사이트 파일이 없습니다.
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div>
                  <p className="font-black text-white">{file.keyword}</p>
                  <p className="mt-1 text-sm text-emerald-300">{file.slug}</p>
                  <p className="mt-1 text-xs text-slate-500">{file.url}</p>
                </div>

                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="rounded-xl border border-red-400/20 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-400/10"
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}