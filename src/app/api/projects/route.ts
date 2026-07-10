import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { createProject } from "@/core/project/project.service";
import { getProjects } from "@/core/project/project.store";
import { createWebsite } from "@/lib/website-template";
import {
  createRepositoryName,
  prepareGithubPublish,
} from "@/features/publisher/github-push-engine";
import { createVercelProject } from "@/features/deploy-engine/vercel-deploy-engine";
import { saveReviewProject } from "@/features/review-engine/review.service";

export async function GET() {
  return NextResponse.json(getProjects());
}

function safeFolderName(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "-");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const project = createProject({
      name: body.name,
      domain: body.domain,
      repository: body.repository,
      mainKeyword: body.mainKeyword,
      industry: body.industry,
      brandName: body.brandName,
      brandSlug: body.brandSlug,
      phone: body.phone,
    });

    const repositoryName = createRepositoryName({
      siteName: project.name,
      brandSlug: project.brandSlug,
      industry: project.industry,
    });

    const siteUrl = `https://${repositoryName}.vercel.app`;

    const website = createWebsite({
      mainKeyword: project.mainKeyword,
      industry: project.industry,
      brandName: project.brandName,
      phone: project.phone,
      siteUrl,
    });

    const folderName = safeFolderName(project.name);
    const siteDir = path.join(process.cwd(), "generated-sites", folderName);

    await rm(siteDir, { recursive: true, force: true });
    await mkdir(siteDir, { recursive: true });

    await Promise.all(
      website.files.map((file) =>
        writeFile(path.join(siteDir, file.name), file.content, "utf-8")
      )
    );

    const publish = await prepareGithubPublish({
      siteName: project.name,
      sourceDir: siteDir,
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

    await saveReviewProject({
      siteName: project.name,
      folderName,
      siteUrl,
      repositoryName: publish.repositoryName,
      repositoryUrl: publish.repositoryUrl,
      brandName: project.brandName,
      brandSlug: project.brandSlug,
      industry: project.industry,
      phone: project.phone,
    });

    return NextResponse.json({
      ...project,
      siteUrl,
      generatedSitePath: `generated-sites/${folderName}`,
      publishPath: publish.publishPath,
      repositoryName: publish.repositoryName,
      repositoryUrl: publish.repositoryUrl,
      repositoryReused: publish.repositoryReused,
      vercelProjectName: vercel.projectName,
      vercelUrl: vercel.vercelUrl,
      vercelReused: vercel.reused,
      pages: website.pages,
      score: website.score,
      variant: website.variant,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "사이트 생성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
