import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { approveReview, getReviewProject } from "@/features/review-engine/review.service";
import { prepareGithubPublish } from "@/features/publisher/github-push-engine";
import {
  deployVercel,
  ensureVercelProject,
} from "@/features/deploy-engine/vercel-deploy-engine";
import { listSiteAssets } from "@/features/website-engine/assets";
import type { SiteManifest } from "@/features/website-engine/types";

/** 검수 완료된 폴더에서 이 키워드의 페이지들과 메타를 읽어온다. */
async function readApprovedPages(generatedDir: string) {
  let manifest: SiteManifest;

  try {
    const raw = await readFile(
      path.join(generatedDir, "site-manifest.json"),
      "utf-8"
    );
    manifest = JSON.parse(raw) as SiteManifest;
  } catch {
    throw new Error(
      "site-manifest.json이 없습니다. 이 사이트를 다시 생성한 뒤 검수해주세요."
    );
  }

  const keywordFiles = await Promise.all(
    manifest.pages.map(async (page) => ({
      name: page.file,
      content: await readFile(path.join(generatedDir, page.file), "utf-8"),
    }))
  );

  return {
    keywordFiles,
    pageMeta: manifest.pages,
    assets: manifest.assets,
    kakaoId: manifest.kakaoId ?? "",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const siteName = String(body.siteName || "").trim();

    if (!siteName) {
      return NextResponse.json({ error: "사이트명이 필요합니다." }, { status: 400 });
    }

    const project = await getReviewProject(siteName);
    const approved = await approveReview(siteName);

    const { keywordFiles, pageMeta, assets, kakaoId } = await readApprovedPages(
      approved.generatedDir
    );

    const publish = await prepareGithubPublish({
      brandName: project.brandName,
      brandSlug: project.brandSlug,
      phone: project.phone,
      kakaoId,
      industry: project.industry,
      siteUrl: project.siteUrl,
      overrideFiles: keywordFiles,
      pageMeta,
      assets:
        assets ?? (await listSiteAssets(project.industry, project.brandSlug)),
    });

    const owner = process.env.GITHUB_OWNER;
    if (!owner) throw new Error("GITHUB_OWNER가 .env.local에 없습니다.");

    const vercel = await ensureVercelProject({
      projectName: publish.repositoryName,
      githubOwner: owner,
      githubRepo: publish.repositoryName,
    });

    const deployment = await deployVercel({
      publishDir: path.join(process.cwd(), publish.publishPath),
      projectId: vercel.projectId,
      orgId: vercel.orgId,
    });

    return NextResponse.json({
      siteName,
      repositoryUrl: publish.repositoryUrl,
      vercelUrl: vercel.siteUrl,
      deploymentUrl: deployment.deploymentUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "검수 완료 및 배포에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
