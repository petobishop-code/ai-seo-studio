import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { approveReview, getReviewProject } from "@/features/review-engine/review.service";
import { prepareGithubPublish } from "@/features/publisher/github-push-engine";
import { createVercelProject } from "@/features/deploy-engine/vercel-deploy-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const siteName = String(body.siteName || "").trim();

    if (!siteName) {
      return NextResponse.json({ error: "사이트명이 필요합니다." }, { status: 400 });
    }

    const project = await getReviewProject(siteName);
    const approved = await approveReview(siteName);

    const publish = await prepareGithubPublish({
      siteName: project.siteName,
      sourceDir: approved.generatedDir,
      brandName: project.brandName,
      brandSlug: project.brandSlug,
      industry: project.industry,
    });

    const owner = process.env.GITHUB_OWNER;
    if (!owner) throw new Error("GITHUB_OWNER가 .env.local에 없습니다.");

    const vercel = await createVercelProject({
      projectName: publish.repositoryName,
      githubOwner: owner,
      githubRepo: publish.repositoryName,
      publishDir: path.join(process.cwd(), publish.publishPath),
    });

    return NextResponse.json({
      siteName,
      repositoryUrl: publish.repositoryUrl,
      vercelUrl: vercel.vercelUrl,
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
