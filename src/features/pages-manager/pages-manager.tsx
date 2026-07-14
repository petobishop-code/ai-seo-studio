"use client";

import { useState } from "react";

type Page = {
  file: string;
  keyword: string;
  region: string;
  service: string;
};

export default function PagesManager() {
  const [brandSlug, setBrandSlug] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [pages, setPages] = useState<Page[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function toggle(file: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(file)) next.delete(file);
      else next.add(file);
      return next;
    });
  }

  async function load() {
    if (!brandSlug.trim()) {
      alert("브랜드 영문명을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setNotice("");
    setPages([]);
    setSelected(new Set());

    try {
      const res = await fetch(
        `/api/pages?brandSlug=${encodeURIComponent(brandSlug.trim())}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setPages(data.pages);
      setSiteUrl(data.siteUrl);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "페이지 조회에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function remove() {
    const files = [...selected];

    if (!files.length) return;

    const ok = confirm(
      `${files.length}개 페이지를 삭제합니다.\n\n${files.join(
        "\n"
      )}\n\n삭제 후 사이트가 즉시 재배포됩니다. 되돌릴 수 없습니다. 진행할까요?`
    );

    if (!ok) return;

    setIsDeleting(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/pages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandSlug: brandSlug.trim(), files }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setPages(data.pages);
      setSelected(new Set());
      setNotice(
        `${data.removedPages.length}개 페이지를 삭제하고 재배포했습니다. 남은 페이지 ${data.totalPages}개.`
      );
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "페이지 삭제에 실패했습니다."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#071020] p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">페이지 관리</h2>
        <p className="mt-2 text-slate-400">
          브랜드 사이트에 올라간 키워드 페이지를 확인하고 삭제합니다. 삭제하면
          sitemap과 내비게이션에서도 함께 사라집니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={brandSlug}
          onChange={(e) =>
            setBrandSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
          }
          placeholder="브랜드 영문명 (예: surinam)"
          className="min-w-64 flex-1 rounded-xl bg-slate-900 p-4"
        />
        <button
          onClick={load}
          disabled={isLoading || isDeleting}
          className="rounded-xl bg-blue-600 px-6 py-4 font-bold transition hover:bg-blue-500 disabled:opacity-60"
        >
          {isLoading ? "불러오는 중..." : "페이지 불러오기"}
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm font-bold text-red-300">{error}</p>
        </div>
      )}

      {notice && (
        <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
          <p className="text-sm font-bold text-emerald-300">{notice}</p>
        </div>
      )}

      {pages.length > 0 && (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              전체 {pages.length}개 · 선택 {selected.size}개
              {siteUrl && (
                <>
                  {" · "}
                  <a
                    href={siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-300 underline"
                  >
                    사이트 열기
                  </a>
                </>
              )}
            </p>

            <button
              onClick={remove}
              disabled={!selected.size || isDeleting}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isDeleting
                ? "삭제 후 재배포 중..."
                : `선택한 ${selected.size}개 삭제`}
            </button>
          </div>

          <ul className="grid gap-2 md:grid-cols-2">
            {pages.map((page) => {
              const checked = selected.has(page.file);

              return (
                <li key={page.file}>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      checked
                        ? "border-red-500/50 bg-red-500/10"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(page.file)}
                      disabled={isDeleting}
                      className="h-4 w-4"
                    />
                    <span>
                      <span className="block font-bold">{page.keyword}</span>
                      <span className="block text-xs text-slate-500">
                        {page.file}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          {isDeleting && (
            <p className="mt-4 text-xs text-slate-500">
              저장소에서 삭제하고 사이트를 다시 배포하는 중입니다. 30초~1분 정도
              걸립니다.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
