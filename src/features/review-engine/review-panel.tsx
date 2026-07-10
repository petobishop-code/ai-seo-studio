"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReviewProject } from "./types";

export default function ReviewPanel() {
  const [projects, setProjects] = useState<ReviewProject[]>([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [instruction, setInstruction] = useState("");
  const [previewVersion, setPreviewVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const selectedProject = useMemo(
    () => projects.find((project) => project.siteName === selectedSite),
    [projects, selectedSite]
  );

  useEffect(() => {
    fetch("/api/review/projects", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: ReviewProject[]) => {
        setProjects(data);
        if (data[0]) setSelectedSite(data[0].siteName);
      });
  }, []);

  async function modifyPreview() {
    if (!selectedSite || !instruction.trim()) {
      setMessage("사이트와 수정 요청을 입력해주세요.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/review/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName: selectedSite, instruction }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "AI 수정에 실패했습니다.");

      setPreviewVersion((value) => value + 1);
      setInstruction("");
      setMessage("수정된 미리보기가 생성되었습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "수정에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function approveAndDeploy() {
    if (!selectedSite) return;

    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/review/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName: selectedSite }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "검수본 배포에 실패했습니다.");
      }

      setMessage(`검수 완료 및 배포 성공: ${data.vercelUrl}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "배포에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#071020] p-8">
      <h2 className="text-3xl font-bold">AI 사이트 검수</h2>

      <div className="mt-8 grid gap-6">
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">검수할 사이트</span>
          <select
            value={selectedSite}
            onChange={(event) => {
              setSelectedSite(event.target.value);
              setPreviewVersion((value) => value + 1);
              setMessage("");
            }}
            className="w-full rounded-xl bg-slate-900 p-4"
          >
            {projects.length === 0 ? (
              <option value="">사이트를 먼저 생성해주세요</option>
            ) : (
              projects.map((project) => (
                <option key={project.siteName} value={project.siteName}>
                  {project.siteName}
                </option>
              ))
            )}
          </select>
        </label>

        <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">현재 배포 사이트 보기</p>
          {selectedProject ? (
            <a
              href={selectedProject.siteUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-bold text-blue-400 underline"
            >
              {selectedProject.siteUrl}
            </a>
          ) : (
            <p className="mt-2 text-slate-500">등록된 사이트가 없습니다.</p>
          )}
        </div>

        <label className="grid gap-2">
          <span className="text-sm text-slate-300">AI 수정 요청</span>
          <textarea
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            placeholder="예) 메인페이지 하단에 자주 묻는 질문 5개를 추가해줘"
            rows={5}
            className="w-full rounded-xl bg-slate-900 p-4"
          />
        </label>

        <button
          type="button"
          onClick={modifyPreview}
          disabled={busy || !selectedSite}
          className="rounded-xl bg-blue-600 p-4 font-bold disabled:opacity-50"
        >
          {busy ? "처리 중..." : "AI 수정 미리보기 생성"}
        </button>

        <div>
          <p className="mb-3 text-sm text-slate-300">수정된 사이트 미리보기</p>
          <iframe
            key={`${selectedSite}-${previewVersion}`}
            title="수정된 사이트 미리보기"
            src={
              selectedSite
                ? `/api/review/preview?siteName=${encodeURIComponent(selectedSite)}&v=${previewVersion}`
                : "about:blank"
            }
            className="h-[720px] w-full rounded-2xl border border-white/10 bg-white"
          />
        </div>

        <button
          type="button"
          onClick={approveAndDeploy}
          disabled={busy || !selectedSite}
          className="rounded-xl bg-emerald-600 p-4 text-lg font-bold disabled:opacity-50"
        >
          검수 완료 및 배포
        </button>

        {message ? (
          <p className="rounded-xl border border-white/10 bg-slate-950 p-4 text-sm">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
