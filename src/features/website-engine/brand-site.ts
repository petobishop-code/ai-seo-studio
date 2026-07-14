import type { SiteFile, SiteManifest, SitePageMeta } from "./types";
import {
  canonicalUrl,
  galleryPath,
  groupByRegion,
  layout,
  nav,
  organizationSchema,
} from "./layout";
import { getIndustry } from "./industries/registry";

/** 같은 파일명은 최신 것으로 덮고, 나머지는 누적한다. */
export function mergeManifest(
  base: SiteManifest,
  incoming: SitePageMeta[]
): SiteManifest {
  const byFile = new Map(base.pages.map((page) => [page.file, page]));

  for (const page of incoming) {
    byFile.set(page.file, page);
  }

  const pages = [...byFile.values()].sort((a, b) =>
    a.file.localeCompare(b.file, "ko")
  );

  return { ...base, pages };
}

function contactBody(manifest: SiteManifest) {
  const regions = [...groupByRegion(manifest.pages).keys()].join(", ");

  return `
<section class="section">
  <div class="card">
    <h2>${manifest.brandName} 고객문의</h2>
    <p>${manifest.industry} 관련 문의는 전화로 바로 상담 가능합니다.</p>
    <p>서비스 지역: ${regions || "전국"}</p>
    <p>대표전화: ${manifest.phone}</p>
  </div>
</section>
<section class="section">
  <div class="cta">
    <h2>빠른 상담</h2>
    <a class="btn" href="tel:${manifest.phone}">전화 ${manifest.phone}</a>
  </div>
</section>`;
}

function galleryBody(manifest: SiteManifest) {
  const regions = [...groupByRegion(manifest.pages).keys()];
  const gallery = manifest.assets?.gallery ?? [];

  const figures = gallery
    .map((photo, index) => {
      // 사진마다 지역을 돌아가며 붙여 alt 텍스트가 전부 같아지지 않게 한다.
      const region = regions[index % Math.max(regions.length, 1)] ?? "";

      return `    <figure>
      <img src="${galleryPath(photo)}" alt="${region} 작업사진 ${
        index + 1
      }" loading="lazy" width="900" height="600">
      <figcaption>현장 작업사진 ${index + 1}</figcaption>
    </figure>`;
    })
    .join("\n");

  return `
<section class="section">
  <h2 style="font-size:30px;margin:0 0 12px">${manifest.brandName} 작업사진</h2>
  <p style="color:#475569;margin:0 0 28px">${
    regions.join(", ") || "전국"
  } 지역에서 진행한 현장 작업사진입니다. 총 ${gallery.length}장.</p>
  <div class="gallery-grid">
${figures}
  </div>
</section>

<section class="section">
  <div class="cta">
    <h2>작업 문의</h2>
    <a class="btn" href="tel:${manifest.phone}">전화 ${manifest.phone}</a>
  </div>
</section>`;
}

function buildSitemap(manifest: SiteManifest, today: string) {
  const hasGallery = (manifest.assets?.gallery?.length ?? 0) > 0;

  const entries = [
    { file: "index.html", priority: "1.0", changefreq: "weekly" },
    ...manifest.pages.map((page) => ({
      file: page.file,
      priority: "0.8",
      changefreq: "monthly",
    })),
    ...(hasGallery
      ? [{ file: "gallery.html", priority: "0.6", changefreq: "monthly" }]
      : []),
    { file: "contact.html", priority: "0.5", changefreq: "monthly" },
  ];

  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${canonicalUrl(manifest, entry.file)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * manifest 전체를 기준으로 브랜드 공통 파일을 재생성한다.
 * 새 키워드가 추가될 때마다 호출해 index/sitemap이 누적된 모든 페이지를 반영하게 한다.
 */
export function buildBrandFiles(
  manifest: SiteManifest,
  today: string
): SiteFile[] {
  const industry = getIndustry(manifest.industry);
  const schema = organizationSchema(manifest);
  const base = manifest.siteUrl.replace(/\/+$/, "");

  const shared = {
    manifest,
    schema,
    tagline: industry.tagline,
    notice: industry.notice,
    extraStyles: industry.styles,
  };

  const indexHtml = layout({
    ...shared,
    title: `${manifest.brandName} | ${manifest.industry}`,
    description: industry.homeDescription(manifest),
    canonicalUrl: canonicalUrl(manifest, "index.html"),
    navHtml: nav(manifest, "index.html"),
    bannerSeed: manifest.brandSlug,
    heading: manifest.brandName,
    body: industry.renderHome(manifest),
  });

  const contactHtml = layout({
    ...shared,
    title: `${manifest.brandName} 고객문의`,
    description: `${manifest.brandName} 전화 상담과 문의 안내. ${manifest.phone}`,
    canonicalUrl: canonicalUrl(manifest, "contact.html"),
    navHtml: nav(manifest, "contact.html"),
    bannerSeed: `${manifest.brandSlug}-contact`,
    body: contactBody(manifest),
  });

  const files: SiteFile[] = [
    { name: "index.html", content: indexHtml },
    { name: "contact.html", content: contactHtml },
    {
      name: "robots.txt",
      content: `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml`,
    },
    { name: "sitemap.xml", content: buildSitemap(manifest, today) },
    {
      name: "site-manifest.json",
      content: JSON.stringify(manifest, null, 2),
    },
  ];

  if (manifest.assets?.gallery?.length) {
    const regions = [...groupByRegion(manifest.pages).keys()].join(" ");

    files.push({
      name: "gallery.html",
      content: layout({
        ...shared,
        title: `${manifest.brandName} 작업사진`,
        description: `${manifest.brandName} 현장 작업사진 모음. ${regions} 작업 사례. 상담 ${manifest.phone}`,
        canonicalUrl: canonicalUrl(manifest, "gallery.html"),
        navHtml: nav(manifest, "gallery.html"),
        bannerSeed: `${manifest.brandSlug}-gallery`,
        body: galleryBody(manifest),
      }),
    });
  }

  return files;
}
