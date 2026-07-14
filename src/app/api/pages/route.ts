import path from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  prepareGithubPublish,
  readBrandManifest,
} from "@/features/publisher/github-push-engine";
import {
  deployVercel,
  ensureVercelProject,
} from "@/features/deploy-engine/vercel-deploy-engine";

/** GET /api/pages?brandSlug=surinam — 브랜드 사이트에 올라가 있는 페이지 목록 */
export async function GET(request: NextRequest) {
  const brandSlug = request.nextUrl.searchParams.get("brandSlug")?.trim();

  if (!brandSlug) {
    return NextResponse.json(
      { error: "brandSlug가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const manifest = await readBrandManifest(brandSlug);

    if (!manifest) {
      return NextResponse.json(
        { error: `'${brandSlug}' 브랜드 사이트를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      brandSlug,
      brandName: manifest.brandName,
      siteUrl: manifest.siteUrl,
      pages: manifest.pages,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "페이지 조회에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pages — 브랜드 사이트에서 페이지를 삭제하고 재배포한다.
 * body: { brandSlug, files: ["의창구변기막힘.html", ...] }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const brandSlug = String(body.brandSlug ?? "").trim();
    const files: string[] = Array.isArray(body.files) ? body.files : [];

    if (!brandSlug || !files.length) {
      return NextResponse.json(
        { error: "brandSlug와 삭제할 files가 필요합니다." },
        { status: 400 }
      );
    }

    const owner = process.env.GITHUB_OWNER;
    if (!owner) throw new Error("GITHUB_OWNER가 .env.local에 없습니다.");

    // 브랜드 정보는 저장소의 기존 manifest를 그대로 쓴다(삭제는 브랜드 정보를 바꾸지 않는다).
    const publish = await prepareGithubPublish({
      brandSlug,
      removeFiles: files,
    });

    if (!publish.removedPages.length) {
      return NextResponse.json(
        { error: "삭제 대상 페이지를 찾지 못했습니다." },
        { status: 404 }
      );
    }

    const vercel = await ensureVercelProject({
      projectName: publish.repositoryName,
      githubOwner: owner,
      githubRepo: publish.repositoryName,
    });

    await deployVercel({
      publishDir: path.join(process.cwd(), publish.publishPath),
      projectId: vercel.projectId,
      orgId: vercel.orgId,
    });

    return NextResponse.json({
      removedPages: publish.removedPages,
      totalPages: publish.totalPages,
      pages: publish.pages,
      siteUrl: vercel.siteUrl,
      repositoryUrl: publish.repositoryUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "페이지 삭제에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
