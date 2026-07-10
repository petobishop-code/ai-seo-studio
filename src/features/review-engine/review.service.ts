import { cp, mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import type { ReviewProject } from "./types";

const PROJECTS_DIR = path.join(process.cwd(), "data", "review-projects");

function safeFolderName(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "-");
}

export async function saveReviewProject(project: ReviewProject) {
  await mkdir(PROJECTS_DIR, { recursive: true });
  await writeFile(
    path.join(PROJECTS_DIR, `${project.folderName}.json`),
    JSON.stringify(project, null, 2),
    "utf-8"
  );
}

export async function listReviewProjects(): Promise<ReviewProject[]> {
  const { readdir } = await import("fs/promises");

  try {
    const files = await readdir(PROJECTS_DIR);
    const projects = await Promise.all(
      files.filter((file) => file.endsWith(".json")).map(async (file) => {
        const content = await readFile(path.join(PROJECTS_DIR, file), "utf-8");
        return JSON.parse(content) as ReviewProject;
      })
    );

    return projects.sort((a, b) => a.siteName.localeCompare(b.siteName, "ko"));
  } catch {
    return [];
  }
}

export async function getReviewProject(siteName: string) {
  const folderName = safeFolderName(siteName);
  const content = await readFile(
    path.join(PROJECTS_DIR, `${folderName}.json`),
    "utf-8"
  );
  return JSON.parse(content) as ReviewProject;
}

function extractResponseText(data: unknown) {
  if (!data || typeof data !== "object") return "";

  const response = data as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };

  if (response.output_text) return response.output_text;

  return response.output
    ?.flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text" || item.type === "text")
    .map((item) => item.text ?? "")
    .join("") ?? "";
}

function cleanHtml(value: string) {
  return value
    .trim()
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function requestHtmlRevision(currentHtml: string, instruction: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5.2";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY가 .env.local에 설정되어 있지 않습니다.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        "당신은 한국 로컬 서비스 웹사이트의 전문 HTML 편집자입니다. 기존 HTML의 SEO 메타태그, canonical, 전화번호 링크, 내부 링크와 반응형 구조를 보존하면서 사용자의 수정 요청만 반영하세요. 반드시 수정된 완전한 HTML 문서만 반환하고 설명이나 마크다운 코드펜스를 포함하지 마세요.",
      input: `사용자 수정 요청:\n${instruction}\n\n현재 index.html:\n${currentHtml}`,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`OpenAI 수정 실패: ${JSON.stringify(data)}`);
  }

  const revisedHtml = cleanHtml(extractResponseText(data));

  if (!revisedHtml.toLowerCase().includes("<!doctype html")) {
    throw new Error("AI가 완전한 HTML 문서를 반환하지 않았습니다.");
  }

  return revisedHtml;
}

export async function createReviewRevision(siteName: string, instruction: string) {
  const folderName = safeFolderName(siteName);
  const generatedDir = path.join(process.cwd(), "generated-sites", folderName);
  const reviewDir = path.join(process.cwd(), "review-ready", folderName);

  try {
    await readFile(path.join(reviewDir, "index.html"), "utf-8");
  } catch {
    await rm(reviewDir, { recursive: true, force: true });
    await mkdir(reviewDir, { recursive: true });
    await cp(generatedDir, reviewDir, { recursive: true });
  }

  const indexPath = path.join(reviewDir, "index.html");
  const currentHtml = await readFile(indexPath, "utf-8");
  const revisedHtml = await requestHtmlRevision(currentHtml, instruction);
  await writeFile(indexPath, revisedHtml, "utf-8");

  return { siteName, folderName, reviewDir };
}

export async function getReviewHtml(siteName: string) {
  const folderName = safeFolderName(siteName);
  return readFile(
    path.join(process.cwd(), "review-ready", folderName, "index.html"),
    "utf-8"
  );
}

export async function approveReview(siteName: string) {
  const folderName = safeFolderName(siteName);
  const reviewDir = path.join(process.cwd(), "review-ready", folderName);
  const generatedDir = path.join(process.cwd(), "generated-sites", folderName);

  await rm(generatedDir, { recursive: true, force: true });
  await mkdir(generatedDir, { recursive: true });
  await cp(reviewDir, generatedDir, { recursive: true });

  return { folderName, reviewDir, generatedDir };
}
