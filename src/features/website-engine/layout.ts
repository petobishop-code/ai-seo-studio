import type { SiteManifest, SitePageMeta } from "./types";

/** 지역명 등 문자열에서 안정적인 숫자를 만든다. 같은 지역이면 항상 같은 사진이 걸린다. */
function hashString(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }

  return Math.abs(hash);
}

export function bannerPath(fileName: string) {
  return `/images/banner/${fileName}`;
}

export function galleryPath(fileName: string) {
  return `/images/gallery/${fileName}`;
}

/** 페이지마다 다른 배너가 걸리도록 seed(지역명)로 고른다. */
export function pickBanner(manifest: SiteManifest, seed: string) {
  const banners = manifest.assets?.banners ?? [];
  if (!banners.length) return null;

  return banners[hashString(seed) % banners.length];
}

/** 상단에 노출할 배너 여러 장을 서로 겹치지 않게 고른다. */
export function pickBanners(
  manifest: SiteManifest,
  seed: string,
  count: number
) {
  const banners = manifest.assets?.banners ?? [];
  if (!banners.length) return [];

  const start = hashString(seed) % banners.length;

  return Array.from(
    { length: Math.min(count, banners.length) },
    (_, index) => banners[(start + index) % banners.length]
  );
}

/** 지역마다 서로 다른 작업사진 묶음이 걸리도록 seed로 시작 지점을 옮긴다. */
export function pickGallery(
  manifest: SiteManifest,
  seed: string,
  count: number
) {
  const gallery = manifest.assets?.gallery ?? [];
  if (!gallery.length) return [];

  const start = hashString(seed) % gallery.length;

  return Array.from(
    { length: Math.min(count, gallery.length) },
    (_, index) => gallery[(start + index) % gallery.length]
  );
}

export function style() {
  return `
*{box-sizing:border-box}
body{margin:0;font-family:Arial,'Noto Sans KR',sans-serif;line-height:1.7;color:#111;background:#f5f7fb}
a{text-decoration:none;color:inherit}
.header{background:#071020;color:#fff;padding:38px 20px;text-align:center}
.header h1{font-size:40px;margin:0 0 16px}
.header .services{font-size:22px;font-weight:800;margin:0 0 8px;color:#7dd3fc}
.header .notice{font-size:17px;margin:0 0 22px;color:#cbd5e1}
.header-cta{display:flex;justify-content:center;flex-wrap:wrap;gap:12px}
.btn-call,.btn-kakao{display:inline-flex;align-items:center;gap:8px;font-family:inherit;font-size:18px;font-weight:900;padding:16px 28px;border-radius:999px;border:0;cursor:pointer;transition:transform .15s,box-shadow .15s}
.btn-call{background:#0ea5e9;color:#fff;box-shadow:0 10px 26px rgba(14,165,233,.45)}
.btn-kakao{background:#fee500;color:#191600;box-shadow:0 10px 26px rgba(254,229,0,.35)}
.btn-call:hover,.btn-kakao:hover{transform:translateY(-2px)}
.banner-strip{max-width:1100px;margin:auto;padding:28px 20px 0;display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
.banner-strip a{display:block;border-radius:20px;overflow:hidden;box-shadow:0 14px 35px rgba(15,23,42,.14);transition:transform .2s}
.banner-strip a:hover{transform:translateY(-3px)}
.banner-strip img{display:block;width:100%;height:auto}
.nav{background:#0f172a;color:#fff;padding:14px 20px;text-align:center}
.nav a{font-weight:800;margin:6px 10px;display:inline-block}
.nav-rest{display:none}
.nav-rest.open{display:contents}
.nav-more{font-family:inherit;font-size:15px;font-weight:800;margin:6px 10px;padding:6px 16px;border-radius:999px;border:1px solid #38bdf8;background:transparent;color:#7dd3fc;cursor:pointer}
.nav-more:hover{background:#38bdf8;color:#0f172a}
.section{max-width:1100px;margin:auto;padding:60px 20px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:28px;box-shadow:0 14px 35px rgba(15,23,42,.08)}
.card h3{font-size:22px;margin:0 0 12px}
.cta{background:#0ea5e9;color:#fff;border-radius:28px;padding:42px;text-align:center}
.cta h2{font-size:36px;margin:0 0 10px;color:#fff;border:0}
.btn{display:inline-block;margin-top:18px;background:#fde047;color:#111;padding:16px 26px;border-radius:999px;font-weight:900}
.footer{background:#020617;color:#cbd5e1;text-align:center;padding:34px 20px}
.article{max-width:900px}
.article .block{margin-bottom:44px}
.article h2{font-size:30px;margin:0 0 16px;padding-bottom:12px;border-bottom:3px solid #0ea5e9;color:#0f172a}
.article h3{font-size:20px;margin:0 0 8px;color:#0369a1}
.article p{font-size:17px;color:#334155;margin:0 0 14px}
.keypoints{list-style:none;padding:0;margin:0 0 16px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.keypoints li{background:#f0f9ff;border:1px solid #bae6fd;border-radius:14px;padding:12px 16px;font-weight:700;color:#0c4a6e}
.keypoints li::before{content:"✓ ";color:#0ea5e9;font-weight:900}
blockquote{margin:0 0 8px;padding:20px 26px;background:#0f172a;color:#e0f2fe;border-left:6px solid #0ea5e9;border-radius:0 16px 16px 0;font-size:19px;font-weight:700;font-style:italic}
.steps{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:0 0 18px}
.step{background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:20px}
.ordered{margin:0;padding-left:22px;color:#334155;font-size:17px}
.ordered li{margin-bottom:8px;font-weight:700}
.photo-note{background:#fffbeb;border:1px dashed #fbbf24;border-radius:14px;padding:16px;color:#92400e;font-weight:700}
.region-block{margin-bottom:34px}
.region-block h3{font-size:24px;margin:0 0 14px;color:#0f172a}
.link-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.link-card{display:block;background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:20px;font-weight:800;color:#0c4a6e;box-shadow:0 8px 20px rgba(15,23,42,.06)}
.link-card span{display:block;margin-top:6px;font-size:13px;font-weight:600;color:#64748b}
.photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:0 0 16px}
.photo-grid img{width:100%;height:200px;object-fit:cover;border-radius:16px;border:1px solid #e5e7eb;background:#e2e8f0}
.gallery-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.gallery-grid figure{margin:0}
.gallery-grid img{width:100%;height:190px;object-fit:cover;border-radius:16px;border:1px solid #e5e7eb;background:#e2e8f0}
.gallery-grid figcaption{margin-top:8px;font-size:13px;color:#64748b;font-weight:600}
@media(max-width:800px){.grid,.keypoints,.steps,.link-grid,.banner-strip{grid-template-columns:1fr}.photo-grid,.gallery-grid{grid-template-columns:repeat(2,1fr)}.header h1{font-size:30px}}
`;
}

/** 한글 파일명을 href에 안전하게 넣는다. */
export function pageHref(fileName: string) {
  return `/${encodeURI(fileName)}`;
}

/** 접기 전에 바로 보여줄 키워드 링크 수 */
const NAV_VISIBLE = 6;

/**
 * 상단 내비게이션.
 * 현재 페이지를 뺀 사이트의 모든 키워드 페이지를 노출한다.
 * 개수가 많으면 앞의 몇 개만 보여주고 나머지는 '더 보기'로 접는다.
 */
export function nav(manifest: SiteManifest, currentFile?: string) {
  const others = manifest.pages.filter((page) => page.file !== currentFile);

  const link = (page: SitePageMeta) =>
    `  <a href="${pageHref(page.file)}">${page.keyword}</a>`;

  const visible = others.slice(0, NAV_VISIBLE).map(link).join("\n");
  const rest = others.slice(NAV_VISIBLE);

  // 나머지는 숨겨두고 버튼으로 펼친다. 버튼은 자기 앞의 숨은 묶음을 열고 사라진다.
  const restHtml = rest.length
    ? `
  <span class="nav-rest">
${rest.map(link).join("\n")}
  </span>
  <button class="nav-more" type="button" onclick="this.previousElementSibling.classList.add('open');this.remove()">더 보기 +${rest.length}</button>`
    : "";

  const galleryLink = manifest.assets?.gallery?.length
    ? `\n  <a href="/gallery.html">작업사진</a>`
    : "";

  return `<nav class="nav">
  <a href="/">홈</a>
${visible}${restHtml}${galleryLink}
  <a href="/contact.html">문의</a>
</nav>`;
}

export function layout(options: {
  manifest: SiteManifest;
  title: string;
  description: string;
  canonicalUrl: string;
  schema: string;
  navHtml: string;
  body: string;
  /** 헤더 배너를 고를 때 쓰는 seed. 보통 지역명. */
  bannerSeed: string;
  /** 헤더 h1. 생략하면 title을 쓴다. */
  heading?: string;
  /** 헤더의 서비스 라인. 업종 모듈이 넘긴다. */
  tagline: string;
  /** 헤더의 보조 문구. 업종 모듈이 넘긴다. */
  notice: string;
  /** 업종 전용 CSS */
  extraStyles?: string;
}) {
  const {
    manifest,
    title,
    description,
    canonicalUrl,
    schema,
    navHtml,
    body,
    bannerSeed,
    heading,
    tagline,
    notice,
    extraStyles,
  } = options;

  // 배너는 전화번호와 "클릭시 전화로 연결됩니다"가 새겨진 완성 홍보물이라
  // 배경으로 깔지 않고 원본 그대로 보여주고 전화 링크로 감싼다.
  const banners = pickBanners(manifest, bannerSeed, 2);

  const bannerStrip = banners.length
    ? `<section class="banner-strip">
${banners
  .map(
    (banner, index) => `  <a href="tel:${manifest.phone}">
    <img src="${bannerPath(banner)}" alt="${
      heading ?? title
    } 전화상담 ${index + 1}" width="900" height="820"${
      index === 0 ? "" : ' loading="lazy"'
    }>
  </a>`
  )
  .join("\n")}
</section>
`
    : "";

  const ogImage = banners[0]
    ? `\n<meta property="og:image" content="${manifest.siteUrl.replace(
        /\/+$/,
        ""
      )}${bannerPath(banners[0])}">`
    : "";

  // 카카오톡은 ID라서 tel: 처럼 바로 여는 링크가 없다. 눌러서 ID를 복사하게 한다.
  const kakaoButton = manifest.kakaoId
    ? `
    <button class="btn-kakao" type="button" onclick="navigator.clipboard.writeText('${manifest.kakaoId}');this.textContent='카카오톡 ID 복사됨 ✓'">카카오톡 ${manifest.kakaoId}</button>`
    : "";

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonicalUrl}">${ogImage}
<script type="application/ld+json">${schema}</script>
<style>${style()}${extraStyles ?? ""}</style>
</head>
<body>
<header class="header">
  <h1>${heading ?? title}</h1>
  <p class="services">${tagline}</p>
  <p class="notice">${notice}</p>
  <div class="header-cta">
    <a class="btn-call" href="tel:${manifest.phone}">전화상담 ${
      manifest.phone
    }</a>${kakaoButton}
  </div>
</header>
${navHtml}
${bannerStrip}${body}
<footer class="footer">
  <p>${manifest.brandName} | ${manifest.industry} | 대표전화 ${manifest.phone}</p>
</footer>
</body>
</html>`;
}

export function organizationSchema(manifest: SiteManifest) {
  const regions = [...new Set(manifest.pages.map((page) => page.region))];

  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: manifest.brandName,
      url: manifest.siteUrl,
      telephone: manifest.phone,
      areaServed: regions,
      knowsAbout: [
        manifest.industry,
        ...new Set(manifest.pages.map((page) => page.service)),
      ],
    },
    null,
    2
  );
}

export function canonicalUrl(manifest: SiteManifest, fileName: string) {
  const base = manifest.siteUrl.replace(/\/+$/, "");
  return fileName === "index.html"
    ? `${base}/`
    : `${base}/${encodeURI(fileName)}`;
}

export function groupByRegion(pages: SitePageMeta[]) {
  const map = new Map<string, SitePageMeta[]>();

  for (const page of pages) {
    const list = map.get(page.region) ?? [];
    list.push(page);
    map.set(page.region, list);
  }

  return map;
}
