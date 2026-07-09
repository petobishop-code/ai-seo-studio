import { SiteFile, WebsiteInput, WebsiteInfo, WebsiteResult } from "../../types";

function detectService(keyword: string) {
  if (keyword.includes("싱크대")) return "싱크대막힘";
  if (keyword.includes("변기")) return "변기막힘";
  if (keyword.includes("정화조")) return "정화조막힘";
  if (keyword.includes("하수구")) return "하수구막힘";
  return "하수구막힘";
}

function detectRegion(keyword: string, service: string) {
  return keyword.replace(service, "").trim() || "전국";
}

function analyze(input: WebsiteInput): WebsiteInfo {
  const keyword = input.mainKeyword.trim();
  const service = detectService(keyword);
  const region = detectRegion(keyword, service);

  return {
    keyword,
    region,
    service,
    industry: input.industry || "하수구/배관",
    brandName: input.brandName || `${keyword} 전문센터`,
    phone: input.phone || "010-7601-1156",
  };
}

function style() {
  return `
*{box-sizing:border-box}
body{margin:0;font-family:Arial,'Noto Sans KR',sans-serif;line-height:1.7;color:#111;background:#f5f7fb}
a{text-decoration:none;color:inherit}
.header{background:#071020;color:#fff;padding:28px 20px;text-align:center}
.header h1{font-size:48px;margin:0 0 12px}
.header p{font-size:20px;margin:0;color:#dbeafe}
.nav{background:#0f172a;color:#fff;padding:14px;text-align:center}
.nav a{font-weight:800;margin:0 14px}
.section{max-width:1100px;margin:auto;padding:70px 20px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:28px;box-shadow:0 14px 35px rgba(15,23,42,.08)}
.card h3{font-size:24px;margin:0 0 12px}
.cta{background:#0ea5e9;color:#fff;border-radius:28px;padding:42px;text-align:center}
.cta h2{font-size:38px;margin:0 0 10px}
.btn{display:inline-block;margin-top:18px;background:#fde047;color:#111;padding:16px 26px;border-radius:999px;font-weight:900}
.footer{background:#020617;color:#cbd5e1;text-align:center;padding:34px 20px}
@media(max-width:800px){.grid{grid-template-columns:1fr}.header h1{font-size:34px}}
`;
}

function layout(info: WebsiteInfo, title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${title} 전문 ${info.brandName}. ${info.phone}">
<style>${style()}</style>
</head>
<body>
<header class="header">
  <h1>${title}</h1>
  <p>${info.brandName} | ${info.phone}</p>
</header>
<nav class="nav">
  <a href="/index.html">홈</a>
  <a href="/drain.html">하수구막힘</a>
  <a href="/sink.html">싱크대막힘</a>
  <a href="/toilet.html">변기막힘</a>
  <a href="/contact.html">문의</a>
</nav>
${body}
<footer class="footer">
  <p>${info.brandName} | ${info.industry} | 대표전화 ${info.phone}</p>
  <p>${info.keyword} 전문 사이트</p>
</footer>
</body>
</html>`;
}

function home(info: WebsiteInfo) {
  return layout(
    info,
    info.keyword,
    `
<section class="section">
  <div class="grid">
    <div class="card"><h3>${info.service}</h3><p>${info.region} 지역 배관 막힘 문제를 빠르게 확인합니다.</p></div>
    <div class="card"><h3>악취·역류 점검</h3><p>반복되는 냄새와 역류 원인을 꼼꼼하게 안내합니다.</p></div>
    <div class="card"><h3>전문 장비 작업</h3><p>현장 상황에 맞춰 배관 장비와 점검 과정을 구성합니다.</p></div>
  </div>
</section>
<section class="section">
  <div class="cta">
    <h2>${info.keyword} 상담문의</h2>
    <p>지금 바로 ${info.brandName}에 상담하세요.</p>
    <a class="btn" href="tel:${info.phone}">전화 ${info.phone}</a>
  </div>
</section>`
  );
}

function subPage(info: WebsiteInfo, title: string) {
  return layout(
    info,
    title,
    `
<section class="section">
  <div class="card">
    <h2>${title}</h2>
    <p>${info.region} 지역에서 발생하는 배관 문제를 상황별로 점검하고 안내합니다.</p>
    <p>${info.brandName}은 ${info.keyword} 관련 문의를 빠르게 받을 수 있도록 연락 동선을 구성합니다.</p>
  </div>
</section>
<section class="section">
  <div class="cta">
    <h2>빠른 상담</h2>
    <a class="btn" href="tel:${info.phone}">전화 ${info.phone}</a>
  </div>
</section>`
  );
}

function sitemap(files: string[]) {
  const today = new Date().toISOString().slice(0, 10);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files
  .map(
    (file) =>
      `  <url><loc>https://example.com/${file === "index.html" ? "" : file}</loc><lastmod>${today}</lastmod></url>`
  )
  .join("\n")}
</urlset>`;
}

export function createDrainWebsite(input: WebsiteInput): WebsiteResult {
  const info = analyze(input);

  const files: SiteFile[] = [
    { name: "index.html", content: home(info) },
    { name: "drain.html", content: subPage(info, `${info.region}하수구막힘`) },
    { name: "sink.html", content: subPage(info, `${info.region}싱크대막힘`) },
    { name: "toilet.html", content: subPage(info, `${info.region}변기막힘`) },
    { name: "contact.html", content: subPage(info, `${info.keyword} 고객문의`) },
  ];

  const fileNames = files.map((file) => file.name);

  files.push({
    name: "robots.txt",
    content: `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`,
  });

  files.push({
    name: "sitemap.xml",
    content: sitemap(fileNames),
  });

  return {
    indexHtml: files[0].content,
    sitemap: files.find((file) => file.name === "sitemap.xml")?.content || "",
    robots: files.find((file) => file.name === "robots.txt")?.content || "",
    pages: files.map((file) => file.name),
    files,
    score: 90,
    variant: "drain-basic",
  };
}