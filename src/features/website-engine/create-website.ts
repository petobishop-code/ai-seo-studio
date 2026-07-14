import {
  EMPTY_ASSETS,
  type SiteFile,
  type SiteManifest,
  type WebsiteInput,
  type WebsiteResult,
} from "./types";
import { buildBrandFiles, mergeManifest } from "./brand-site";
import { canonicalUrl, layout, nav, organizationSchema } from "./layout";
import { getIndustry } from "./industries/registry";

function toManifest(input: WebsiteInput): SiteManifest {
  const keyword = input.mainKeyword.trim();

  return {
    brandName: input.brandName || `${keyword} 전문센터`,
    brandSlug: input.brandSlug || "brand",
    phone: input.phone || "010-7601-1156",
    kakaoId: input.kakaoId || "",
    industry: input.industry || "하수구/배관",
    siteUrl: (input.siteUrl || "http://localhost:3000").replace(/\/+$/, ""),
    pages: [],
    assets: input.assets ?? EMPTY_ASSETS,
  };
}

/** manifest에 있는 페이지 하나를 현재 템플릿으로 렌더링한다. */
function renderPage(manifest: SiteManifest, file: string): SiteFile {
  const industry = getIndustry(manifest.industry);
  const page = manifest.pages.find((item) => item.file === file);

  if (!page) {
    throw new Error(`manifest에 없는 페이지입니다: ${file}`);
  }

  return {
    name: page.file,
    content: layout({
      manifest,
      title: page.title,
      description: page.description,
      canonicalUrl: canonicalUrl(manifest, page.file),
      schema: organizationSchema(manifest),
      navHtml: nav(manifest, page.file),
      bannerSeed: page.keyword,
      heading: page.keyword,
      tagline: industry.tagline,
      notice: industry.notice,
      extraStyles: industry.styles,
      body: industry.renderArticle(manifest, page),
    }),
  };
}

export function createWebsite(input: WebsiteInput): WebsiteResult {
  const industry = getIndustry(input.industry ?? "");
  const draft = toManifest(input);

  const pageMeta = industry.buildPages(draft, input.mainKeyword);
  const manifest = mergeManifest(draft, pageMeta);

  const keywordFiles = pageMeta.map((page) =>
    renderPage(manifest, page.file)
  );

  const today = new Date().toISOString().slice(0, 10);
  const brandFiles = buildBrandFiles(manifest, today);
  const files = [...keywordFiles, ...brandFiles];

  const byName = new Map(brandFiles.map((file) => [file.name, file]));

  return {
    keywordFiles,
    pageMeta,
    files,
    indexHtml: byName.get("index.html")?.content ?? "",
    sitemap: byName.get("sitemap.xml")?.content ?? "",
    robots: byName.get("robots.txt")?.content ?? "",
    pages: files.map((file) => file.name),
    score: 95,
    variant: `${industry.key}-seo-v1`,
  };
}

/**
 * manifest의 모든 키워드 페이지를 현재 템플릿으로 재렌더링한다.
 * 배포할 때마다 호출해 예전 페이지도 최신 템플릿(이미지·원고 개선 등)을 따라가게 한다.
 */
export function renderAllPages(manifest: SiteManifest): SiteFile[] {
  return manifest.pages.map((page) => renderPage(manifest, page.file));
}
