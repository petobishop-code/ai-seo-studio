import { cp, mkdir, rm } from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

export type GithubPushInput = {
  siteName: string;
  sourceDir: string;
  brandName?: string;
  brandSlug?: string;
  industry?: string;
};

function safeFolderName(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-");
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getServiceSlug(siteName: string, industry?: string) {
  if (siteName.includes("싱크대")) return "sink";
  if (siteName.includes("변기")) return "toilet";
  if (siteName.includes("하수구")) return "drain";
  if (industry?.includes("법률")) return "law";
  if (industry?.includes("대출")) return "loan";
  if (industry?.includes("웨딩")) return "wedding";
  if (industry?.includes("병원")) return "medical";
  return "site";
}

function getRegionSlug(siteName: string) {
  const region = siteName
    .replace("하수구막힘", "")
    .replace("싱크대막힘", "")
    .replace("변기막힘", "")
    .replace("정화조막힘", "")
    .trim();

  const regionMap: Record<string, string> = {
    창원: "changwon",
    부산: "busan",
    인천: "incheon",
    강남: "gangnam",
    서초: "seocho",
    송파: "songpa",
    김포: "gimpo",
    일산: "ilsan",
    동탄: "dongtan",
    안양: "anyang",
    광명: "gwangmyeong",
    수원: "suwon",
    대전: "daejeon",
    대구: "daegu",
    김해: "gimhae",
    마산: "masan",
    진해: "jinhae",
  };

  return regionMap[region] || "local";
}

export function createRepositoryName(input: {
  siteName: string;
  brandSlug?: string;
  industry?: string;
}) {
  const brand = normalizeSlug(input.brandSlug || "brand");
  const service = getServiceSlug(input.siteName, input.industry);
  const region = getRegionSlug(input.siteName);

  return `${brand}-${service}-${region}`;
}

async function runGit(args: string[], cwd: string) {
  await execFileAsync("git", args, { cwd });
}

async function getGithubRepository(repoName: string) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;

  if (!token) throw new Error("GITHUB_TOKEN이 .env.local에 없습니다.");
  if (!owner) throw new Error("GITHUB_OWNER가 .env.local에 없습니다.");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  const check = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
    headers,
  });

  if (check.ok) {
    return {
      repoName,
      htmlUrl: `https://github.com/${owner}/${repoName}`,
      cloneUrl: `https://github.com/${owner}/${repoName}.git`,
      pushUrl: `https://${token}@github.com/${owner}/${repoName}.git`,
      reused: true,
    };
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

  return {
    repoName,
    htmlUrl: `https://github.com/${owner}/${repoName}`,
    cloneUrl: `https://github.com/${owner}/${repoName}.git`,
    pushUrl: `https://${token}@github.com/${owner}/${repoName}.git`,
    reused: false,
  };
}

export async function prepareGithubPublish(input: GithubPushInput) {
  const folderName = safeFolderName(input.siteName);
  const repoName = createRepositoryName({
    siteName: input.siteName,
    brandSlug: input.brandSlug,
    industry: input.industry,
  });

  const publishRoot = path.join(process.cwd(), "publish-ready");
  const publishDir = path.join(publishRoot, folderName);

  await rm(publishDir, { recursive: true, force: true });
  await mkdir(publishDir, { recursive: true });
  await cp(input.sourceDir, publishDir, { recursive: true });

  const githubRepo = await getGithubRepository(repoName);

  await runGit(["init"], publishDir);
  await runGit(["branch", "-M", "main"], publishDir);
  await runGit(["add", "."], publishDir);

  try {
    await runGit(
      ["commit", "-m", `site: ${input.siteName} publish`],
      publishDir
    );
  } catch {
    // 변경사항이 없으면 커밋 생략
  }

  await runGit(["remote", "add", "origin", githubRepo.pushUrl], publishDir);
  await runGit(["push", "-u", "origin", "main", "--force"], publishDir);
  await runGit(
    ["remote", "set-url", "origin", githubRepo.cloneUrl],
    publishDir
  );

  return {
    siteName: input.siteName,
    publishPath: `publish-ready/${folderName}`,
    gitInitialized: true,
    committed: true,
    pushed: true,
    repositoryName: githubRepo.repoName,
    repositoryUrl: githubRepo.htmlUrl,
    repositoryReused: githubRepo.reused,
  };
}
