import { cp, mkdir, readFile, rm, writeFile } from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { buildBrandFiles, mergeManifest } from "@/features/website-engine/brand-site";
import { renderAllPages } from "@/features/website-engine/create-website";
import { siteAssetPath } from "@/features/website-engine/assets";
import { EMPTY_ASSETS } from "@/features/website-engine/types";
import type {
  SiteAssets,
  SiteFile,
  SiteManifest,
  SitePageMeta,
} from "@/features/website-engine/types";

const execFileAsync = promisify(execFile);

export type GithubPushInput = {
  brandSlug: string;
  /** 생략하면 저장소에 있는 기존 manifest 값을 쓴다(페이지 삭제처럼 브랜드 정보가 안 바뀌는 경우). */
  brandName?: string;
  phone?: string;
  kakaoId?: string;
  industry?: string;
  siteUrl?: string;
  /** 저장소에서 지울 페이지 파일명. 예: ["의창구변기막힘.html"] */
  removeFiles?: string[];
  /**
   * 템플릿 재생성을 건너뛰고 그대로 커밋할 파일.
   * AI 검수로 수정된 HTML을 보존할 때만 쓴다.
   *
   * 일반 생성 경로에서는 넘기지 말 것. 넘기면 전체 manifest로 재생성된 페이지를
   * 부분 manifest로 만든 낡은 페이지가 덮어써서 내비게이션 등이 빈약해진다.
   */
  overrideFiles?: SiteFile[];
  /** 이 키워드가 새로 추가하는 페이지 메타 */
  pageMeta?: SitePageMeta[];
  /** site-assets 에서 가져온 이미지 목록 */
  assets?: SiteAssets;
};

/**
 * 배너와 작업사진은 출처가 다를 수 있다(배너는 브랜드 전용, 작업사진은 업종 공용).
 * 각자의 원본 경로에서 publishDir/images/{banner,gallery} 로 복사해 저장소에 함께 커밋한다.
 */
async function copyAssets(assets: SiteAssets, publishDir: string) {
  const target = path.join(publishDir, "images");

  const jobs: Array<[string, string]> = [
    [assets.bannerSource, "banner"],
    [assets.gallerySource, "gallery"],
    [assets.fairImagesSource, "fairs"],
  ];

  for (const [source, kind] of jobs) {
    if (!source) continue;

    await cp(siteAssetPath(source), path.join(target, kind), {
      recursive: true,
    });
  }

  // 단일 이미지 파일들 → images/ 루트
  for (const [source, name] of [
    [assets.heroImageSource, "hero.webp"],
    [assets.headerImageSource, "header.webp"],
  ] as const) {
    if (!source) continue;
    await mkdir(target, { recursive: true });
    await cp(siteAssetPath(source), path.join(target, name));
  }

  // 소유권 확인 파일은 루트에 있어야 검색엔진이 찾는다(/naverXXXX.html).
  if (assets.verifySource) {
    await cp(siteAssetPath(assets.verifySource), publishDir, {
      recursive: true,
    });
  }
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * 저장소는 브랜드 단위로 하나만 만든다.
 * 같은 브랜드의 키워드들은 모두 이 저장소 안에 페이지로 누적된다.
 */
export function createRepositoryName(input: { brandSlug: string }) {
  const slug = normalizeSlug(input.brandSlug);

  if (!slug) {
    throw new Error("브랜드 영문명(brandSlug)이 필요합니다.");
  }

  return slug;
}

async function runGit(args: string[], cwd: string) {
  await execFileAsync("git", args, { cwd });
}

/**
 * 브랜드 저장소를 보장한다(없으면 생성).
 * Vercel 프로젝트가 이 저장소를 연결하므로, Vercel 생성 전에 먼저 호출해야 한다.
 */
export async function ensureGithubRepository(repoName: string) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;

  if (!token) throw new Error("GITHUB_TOKEN이 .env.local에 없습니다.");
  if (!owner) throw new Error("GITHUB_OWNER가 .env.local에 없습니다.");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  const check = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}`,
    { headers }
  );

  const base = {
    repoName,
    htmlUrl: `https://github.com/${owner}/${repoName}`,
    cloneUrl: `https://github.com/${owner}/${repoName}.git`,
    pushUrl: `https://${token}@github.com/${owner}/${repoName}.git`,
  };

  if (check.ok) {
    return { ...base, reused: true };
  }

  const create = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: repoName,
      private: false,
      auto_init: false,
      description: "AI SEO Studio generated website",
    }),
  });

  if (!create.ok) {
    const errorText = await create.text();
    throw new Error(`GitHub 저장소 생성 실패: ${errorText}`);
  }

  return { ...base, reused: false };
}

/** 저장소에 이미 커밋돼 있는 manifest를 읽는다. 없으면 신규 브랜드. */
async function readExistingManifest(
  publishDir: string
): Promise<SiteManifest | null> {
  try {
    const raw = await readFile(
      path.join(publishDir, "site-manifest.json"),
      "utf-8"
    );

    const parsed = JSON.parse(raw) as SiteManifest;

    return Array.isArray(parsed.pages) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * 저장소의 site-manifest.json 을 GitHub API로 직접 읽는다.
 * 페이지 목록만 필요할 때 clone 비용을 피하려고 쓴다.
 */
export async function readBrandManifest(
  brandSlug: string
): Promise<SiteManifest | null> {
  const repoName = createRepositoryName({ brandSlug });

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;

  if (!token) throw new Error("GITHUB_TOKEN이 .env.local에 없습니다.");
  if (!owner) throw new Error("GITHUB_OWNER가 .env.local에 없습니다.");

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/contents/site-manifest.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.raw",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  try {
    const parsed = JSON.parse(await res.text()) as SiteManifest;
    return Array.isArray(parsed.pages) ? parsed : null;
  } catch {
    return null;
  }
}

export async function prepareGithubPublish(input: GithubPushInput) {
  const repoName = createRepositoryName({ brandSlug: input.brandSlug });
  const githubRepo = await ensureGithubRepository(repoName);

  const publishDir = path.join(process.cwd(), "publish-ready", repoName);

  // GitHub을 진실의 원천으로 삼는다. 항상 원격을 clone해 기존 페이지를 가져온 뒤 누적한다.
  await rm(publishDir, { recursive: true, force: true });
  await mkdir(path.dirname(publishDir), { recursive: true });

  await execFileAsync("git", [
    "clone",
    githubRepo.pushUrl,
    publishDir,
  ]);

  try {
    // 기존 커밋이 있는 저장소
    await runGit(["checkout", "-B", "main"], publishDir);
  } catch {
    // 방금 만든 빈 저장소는 커밋이 없어 checkout이 실패한다. HEAD만 main으로 지정한다.
    await runGit(["symbolic-ref", "HEAD", "refs/heads/main"], publishDir);
  }

  const existing = await readExistingManifest(publishDir);

  // 브랜드 정보를 안 넘기면(예: 페이지 삭제) 저장소에 있는 기존 값을 그대로 쓴다.
  const base: SiteManifest = {
    brandName: input.brandName ?? existing?.brandName ?? "",
    brandSlug: repoName,
    phone: input.phone ?? existing?.phone ?? "",
    kakaoId: input.kakaoId ?? existing?.kakaoId ?? "",
    industry: input.industry ?? existing?.industry ?? "",
    siteUrl: input.siteUrl ?? existing?.siteUrl ?? "",
    pages: existing?.pages ?? [],
    assets: input.assets ?? existing?.assets ?? EMPTY_ASSETS,
  };

  const added = mergeManifest(base, input.pageMeta ?? []);

  // 삭제 요청된 페이지는 manifest에서 빼고 파일도 지운다.
  const removeFiles = new Set(input.removeFiles ?? []);

  const removed = added.pages
    .filter((page) => removeFiles.has(page.file))
    .map((page) => page.file);

  const manifest: SiteManifest = {
    ...added,
    pages: added.pages.filter((page) => !removeFiles.has(page.file)),
  };

  for (const file of removed) {
    await rm(path.join(publishDir, file), { force: true });
  }

  await copyAssets(manifest.assets, publishDir);

  const today = new Date().toISOString().slice(0, 10);

  // 모든 페이지를 누적된 전체 manifest로 다시 만든다.
  // 그래야 템플릿 개선과 내비게이션(전체 키워드 목록)이 예전 페이지에도 반영된다.
  const byName = new Map(
    renderAllPages(manifest).map((file) => [file.name, file])
  );

  // AI 검수로 수정된 HTML만 재생성본 대신 그대로 쓴다.
  for (const file of input.overrideFiles ?? []) {
    byName.set(file.name, file);
  }

  const files = [...byName.values(), ...buildBrandFiles(manifest, today)];

  await Promise.all(
    files.map((file) =>
      writeFile(path.join(publishDir, file.name), file.content, "utf-8")
    )
  );

  // 삭제된 파일도 스테이징되도록 -A 를 쓴다.
  await runGit(["add", "-A"], publishDir);

  const message = removed.length
    ? `site: ${removed.length}개 페이지 삭제`
    : `site: ${input.pageMeta?.[0]?.region ?? repoName} 페이지 추가`;

  let committed = true;

  try {
    await runGit(["commit", "-m", message], publishDir);
  } catch {
    // 변경사항이 없으면 커밋 생략
    committed = false;
  }

  await runGit(["push", "-u", "origin", "main"], publishDir);
  await runGit(["remote", "set-url", "origin", githubRepo.cloneUrl], publishDir);

  return {
    publishPath: `publish-ready/${repoName}`,
    committed,
    pushed: true,
    repositoryName: repoName,
    repositoryUrl: githubRepo.htmlUrl,
    repositoryReused: githubRepo.reused,
    /** 이번 요청 후 저장소에 존재하는 전체 페이지 수 */
    totalPages: manifest.pages.length,
    addedPages: (input.pageMeta ?? []).map((page) => page.file),
    removedPages: removed,
    pages: manifest.pages,
  };
}
