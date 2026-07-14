import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { createProject } from "@/core/project/project.service";
import { getProjects } from "@/core/project/project.store";
import { createWebsite } from "@/lib/website-template";
import { listSiteAssets } from "@/features/website-engine/assets";
import {
  createRepositoryName,
  ensureGithubRepository,
  prepareGithubPublish,
} from "@/features/publisher/github-push-engine";
import {
  deployVercel,
  ensureVercelProject,
} from "@/features/deploy-engine/vercel-deploy-engine";
import { saveReviewProject } from "@/features/review-engine/review.service";
import type { SitePageMeta } from "@/features/website-engine/types";

export async function GET() {
  return NextResponse.json(getProjects());
}

function safeFolderName(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "-");
}

/** 클라이언트가 진행 상황을 그릴 수 있도록 흘려보내는 이벤트 */
type ProgressEvent =
  | { type: "step"; key: string; label: string; status: "running" }
  | { type: "step"; key: string; label: string; status: "done"; detail?: string }
  | { type: "done"; result: Record<string, unknown> }
  | { type: "error"; message: string };

type Emit = (event: ProgressEvent) => void;

/** 여러 줄/배열로 들어온 키워드를 정리한다. 공백 제거 + 중복 제거. */
function parseKeywords(body: Record<string, unknown>) {
  const raw = Array.isArray(body.keywords)
    ? (body.keywords as unknown[]).map(String)
    : [String(body.mainKeyword ?? body.name ?? "")];

  const cleaned = raw.map((value) => value.trim()).filter(Boolean);

  return [...new Set(cleaned)];
}

/**
 * 원클릭 생성 파이프라인.
 *
 * 키워드가 여러 개여도 저장소·Vercel·clone·push·배포는 한 번만 돈다.
 * 키워드마다 파이프라인을 통째로 돌리면 배포가 N번 일어나 몇 배로 느려진다.
 */
async function runPipeline(body: Record<string, unknown>, emit: Emit) {
  const step = async <T>(
    key: string,
    label: string,
    run: () => Promise<T>,
    detail?: (value: T) => string
  ): Promise<T> => {
    emit({ type: "step", key, label, status: "running" });
    const value = await run();
    emit({
      type: "step",
      key,
      label,
      status: "done",
      detail: detail?.(value),
    });
    return value;
  };

  const owner = process.env.GITHUB_OWNER;
  if (!owner) throw new Error("GITHUB_OWNER가 .env.local에 없습니다.");

  const keywords = parseKeywords(body);

  if (!keywords.length) {
    throw new Error("대표키워드를 1개 이상 입력해주세요.");
  }

  const industry = String(body.industry ?? "");
  const brandName = String(body.brandName ?? "");
  const brandSlug = String(body.brandSlug ?? "");
  const phone = String(body.phone ?? "");
  const kakaoId = String(body.kakaoId ?? "").trim();

  const repositoryName = createRepositoryName({ brandSlug });

  await step(
    "github",
    "GitHub 저장소 준비",
    () => ensureGithubRepository(repositoryName),
    (value) =>
      value.reused
        ? `기존 저장소 사용 (${repositoryName})`
        : `새 저장소 생성 (${repositoryName})`
  );

  // Vercel을 먼저 만들어야 실제 배정된 도메인을 알 수 있고, canonical/sitemap이 정확해진다.
  const vercel = await step(
    "vercel",
    "Vercel 프로젝트 준비 및 도메인 확인",
    () =>
      ensureVercelProject({
        projectName: repositoryName,
        githubOwner: owner,
        githubRepo: repositoryName,
      }),
    (value) => value.siteUrl
  );

  const siteUrl = vercel.siteUrl;
  const assets = await listSiteAssets(industry, brandSlug);

  // 키워드별로 페이지만 만든다. 무거운 작업(clone/push/배포)은 뒤에서 한 번만.
  const pageMetaByFile = new Map<string, SitePageMeta>();

  for (const [index, keyword] of keywords.entries()) {
    await step(
      `generate:${keyword}`,
      `페이지 생성 (${index + 1}/${keywords.length}) — ${keyword}`,
      async () => {
        const project = createProject({
          name: keyword,
          domain: String(body.domain ?? ""),
          repository: repositoryName,
          mainKeyword: keyword,
          industry,
          brandName,
          brandSlug,
          phone,
          kakaoId,
        });

        const website = createWebsite({
          mainKeyword: keyword,
          industry,
          brandName,
          brandSlug,
          phone,
          kakaoId,
          siteUrl,
          assets,
        });

        const folderName = safeFolderName(keyword);
        const siteDir = path.join(process.cwd(), "generated-sites", folderName);

        await rm(siteDir, { recursive: true, force: true });
        await mkdir(siteDir, { recursive: true });

        await Promise.all(
          website.files.map((file) =>
            writeFile(path.join(siteDir, file.name), file.content, "utf-8")
          )
        );

        await saveReviewProject({
          siteName: project.name,
          folderName,
          siteUrl,
          repositoryName,
          repositoryUrl: `https://github.com/${owner}/${repositoryName}`,
          brandName,
          brandSlug,
          industry,
          phone,
        });

        // 같은 지역 키워드는 같은 페이지를 만든다(창원하수구막힘 / 창원싱크대막힘 → 창원 3페이지).
        // 파일명으로 합쳐 중복 생성을 막는다.
        let fresh = 0;

        for (const page of website.pageMeta) {
          if (!pageMetaByFile.has(page.file)) fresh += 1;
          pageMetaByFile.set(page.file, page);
        }

        return fresh;
      },
      (fresh) => (fresh ? `페이지 ${fresh}개 추가` : "이미 포함된 지역 (중복)")
    );
  }

  const pageMeta = [...pageMetaByFile.values()];

  const publish = await step(
    "publish",
    "저장소 동기화 및 페이지 푸시",
    () =>
      prepareGithubPublish({
        brandName,
        brandSlug,
        phone,
        kakaoId,
        industry,
        siteUrl,
        pageMeta,
        assets,
      }),
    (value) => `사이트 전체 ${value.totalPages}개 페이지`
  );

  await step(
    "deploy",
    "Vercel 배포",
    () =>
      deployVercel({
        publishDir: path.join(process.cwd(), publish.publishPath),
        projectId: vercel.projectId,
        orgId: vercel.orgId,
      }),
    () => siteUrl
  );

  emit({
    type: "done",
    result: {
      name: keywords.join(", "),
      keywords,
      siteUrl,
      repositoryUrl: publish.repositoryUrl,
      addedPages: publish.addedPages,
      totalPages: publish.totalPages,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit: Emit = (event) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        await runPipeline(body, emit);
      } catch (error) {
        emit({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "사이트 생성에 실패했습니다.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
