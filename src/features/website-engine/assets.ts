import { readdir, stat } from "fs/promises";
import path from "path";
import { EMPTY_ASSETS, type SiteAssets } from "./types";

import { hasIndustry, industryAssetDir } from "./industries/registry";

/** 업종 → site-assets/industries 하위 폴더. 모듈이 없는 업종은 공용 자산도 없다. */
export function assetDirForIndustry(industry: string) {
  return hasIndustry(industry) ? industryAssetDir(industry) : "";
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

/** site-assets 기준 상대경로를 절대경로로 바꾼다. */
export function siteAssetPath(relative: string) {
  return path.join(process.cwd(), "site-assets", relative);
}

async function listFiles(relative: string, pattern: RegExp) {
  try {
    const files = await readdir(siteAssetPath(relative));

    return files
      .filter((file) => pattern.test(file))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

const listImages = (relative: string) =>
  listFiles(relative, /\.(webp|png|jpe?g)$/i);

async function fileExists(relative: string) {
  try {
    return (await stat(siteAssetPath(relative))).isFile();
  } catch {
    return false;
  }
}

/**
 * 이 사이트에 쓸 이미지를 찾는다.
 *
 * - 배너: brands/{brandSlug}/banner 만 본다.
 *   배너 이미지에 전화번호가 박혀 있어, 없다고 다른 폴더로 폴백하면
 *   남의 전화번호가 찍힌 배너가 노출된다. 없으면 배너 없이 간다.
 * - 작업사진: brands/{brandSlug}/gallery → 없으면 industries/{업종}/gallery
 */
export async function listSiteAssets(
  industry: string,
  brandSlug: string
): Promise<SiteAssets> {
  const brand = normalizeSlug(brandSlug);
  const industryDir = assetDirForIndustry(industry);

  if (!brand && !industryDir) return EMPTY_ASSETS;

  const bannerSource = brand ? `brands/${brand}/banner` : "";
  const banners = bannerSource ? await listImages(bannerSource) : [];

  // 소유권 확인 파일도 브랜드 전용이다. 사이트마다 발급 해시가 다르다.
  const verifySource = brand ? `brands/${brand}/verify` : "";
  const verifyFiles = verifySource
    ? await listFiles(verifySource, /\.(html?|txt|xml)$/i)
    : [];

  // 항목별 이미지(박람회 등)와 히어로 이미지 — 브랜드 전용.
  const fairImagesSource = brand ? `brands/${brand}/fairs` : "";
  const fairImages = fairImagesSource
    ? await listImages(fairImagesSource)
    : [];

  const heroRel = brand ? `brands/${brand}/hero.webp` : "";
  const heroImageSource = heroRel && (await fileExists(heroRel)) ? heroRel : "";

  const headerRel = brand ? `brands/${brand}/header.webp` : "";
  const headerImageSource =
    headerRel && (await fileExists(headerRel)) ? headerRel : "";

  // 본문 사진: 브랜드 전용 → 없으면 업종 공용.
  const brandPhotosSource = brand ? `brands/${brand}/photos` : "";
  const brandPhotos = brandPhotosSource
    ? await listImages(brandPhotosSource)
    : [];
  const industryPhotosSource = industryDir
    ? `industries/${industryDir}/photos`
    : "";
  const industryPhotos = industryPhotosSource
    ? await listImages(industryPhotosSource)
    : [];
  const useBrandPhotos = brandPhotos.length > 0;
  const photos = useBrandPhotos ? brandPhotos : industryPhotos;
  const photosSource = useBrandPhotos
    ? brandPhotosSource
    : industryPhotos.length
      ? industryPhotosSource
      : "";

  const extra = {
    verifyFiles,
    verifySource: verifyFiles.length ? verifySource : "",
    fairImages,
    fairImagesSource: fairImages.length ? fairImagesSource : "",
    heroImageSource,
    headerImageSource,
    photos,
    photosSource,
  };

  const brandGallerySource = brand ? `brands/${brand}/gallery` : "";
  const brandGallery = brandGallerySource
    ? await listImages(brandGallerySource)
    : [];

  if (brandGallery.length) {
    return {
      banners,
      bannerSource: banners.length ? bannerSource : "",
      gallery: brandGallery,
      gallerySource: brandGallerySource,
      ...extra,
    };
  }

  const industryGallerySource = industryDir
    ? `industries/${industryDir}/gallery`
    : "";
  const industryGallery = industryGallerySource
    ? await listImages(industryGallerySource)
    : [];

  return {
    banners,
    bannerSource: banners.length ? bannerSource : "",
    gallery: industryGallery,
    gallerySource: industryGallery.length ? industryGallerySource : "",
    ...extra,
  };
}
