import { NextResponse } from "next/server";
import { cp, mkdir, writeFile } from "fs/promises";
import path from "path";
import { createWebsite } from "@/lib/website-template";
import { listSiteAssets, siteAssetPath } from "@/features/website-engine/assets";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mainKeyword = String(body.mainKeyword || "").trim();
    const industry = String(body.industry || "하수구/배관");
    const brandSlug = String(body.brandSlug || "").trim();
    const brandName = String(body.brandName || "").trim();
    const phone = String(body.phone || "").trim();
    const kakaoId = String(body.kakaoId || "").trim();

    if (!mainKeyword) {
      return NextResponse.json(
        { success: false, message: "대표키워드가 필요합니다." },
        { status: 400 }
      );
    }

    const assets = await listSiteAssets(industry, brandSlug);

    const website = createWebsite({
      mainKeyword,
      industry,
      brandSlug: brandSlug || undefined,
      brandName: brandName || undefined,
      phone: phone || undefined,
      kakaoId: kakaoId || undefined,
      assets,
    });

    const root = path.join(process.cwd(), "generated-sites", mainKeyword);

    await mkdir(root, { recursive: true });

    for (const file of website.files) {
      await writeFile(path.join(root, file.name), file.content, "utf-8");
    }

    // 미리보기에서도 이미지가 보이도록 함께 복사한다.
    const imageJobs: Array<[string, string]> = [
      [assets.bannerSource, "banner"],
      [assets.gallerySource, "gallery"],
      [assets.fairImagesSource, "fairs"],
    ];

    for (const [source, kind] of imageJobs) {
      if (!source) continue;

      await cp(siteAssetPath(source), path.join(root, "images", kind), {
        recursive: true,
      });
    }

    for (const [source, name] of [
      [assets.heroImageSource, "hero.webp"],
      [assets.headerImageSource, "header.webp"],
    ] as const) {
      if (!source) continue;
      await mkdir(path.join(root, "images"), { recursive: true });
      await cp(siteAssetPath(source), path.join(root, "images", name));
    }

    return NextResponse.json({
      success: true,
      folder: root,
      files: website.files.map((file) => file.name),
      banners: assets.banners.length,
      gallery: assets.gallery.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "사이트 생성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
