export type WebsiteInput = {
  mainKeyword: string;
};

type SiteFile = {
  name: string;
  content: string;
};

type Tone = "city" | "premium" | "coastal" | "kitchen" | "toilet" | "field";

type KeywordInfo = {
  keyword: string;
  region: string;
  service: string;
  tone: Tone;
  phone: string;
  kakaoId: string;
  companyName: string;
};

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

function analyzeKeyword(mainKeyword: string): KeywordInfo {
  const keyword = mainKeyword.trim() || "인천하수구막힘";
  const service = detectService(keyword);
  const region = detectRegion(keyword, service);

  let tone: Tone = "field";

  if (region.includes("강남") || region.includes("서초") || region.includes("송파")) tone = "premium";
  else if (region.includes("부산") || region.includes("해운대") || region.includes("수영")) tone = "coastal";
  else if (service.includes("싱크대")) tone = "kitchen";
  else if (service.includes("변기")) tone = "toilet";
  else if (region.includes("인천") || region.includes("서울")) tone = "city";
  else if (region.includes("창원") || region.includes("김해") || region.includes("진해")) tone = "field";

  return {
    keyword,
    region,
    service,
    tone,
    phone: "010-7601-1156",
    kakaoId: "hhssoohso",
    companyName: `${keyword} 전문센터`,
  };
}

function pageFile(title: string) {
  return `${title}.html`;
}

function getKeywordPages(info: KeywordInfo) {
  return [
    `${info.region}하수구막힘`,
    `${info.region}싱크대막힘`,
    `${info.region}변기막힘`,
    `${info.region}정화조막힘`,
    `${info.region}배관내시경`,
    `${info.region}고압세척`,
    `${info.region}하수구악취`,
    `${info.region}하수구역류`,
  ];
}

function getMenuPages(info: KeywordInfo) {
  return [
    { title: "회사소개", file: "company.html", heading: `${info.keyword} 전문 업체 소개` },
    { title: "하수구막힘/뚫음", file: "drain.html", heading: `${info.region}하수구막힘 해결 안내` },
    { title: "변기막힘/뚫음", file: "toilet.html", heading: `${info.region}변기막힘 긴급 대응` },
    { title: "정화조막힘/뚫음", file: "septic.html", heading: `${info.region}정화조막힘 점검` },
    { title: "갤러리", file: "gallery.html", heading: `${info.keyword} 작업사진` },
    { title: "고객문의", file: "contact.html", heading: `${info.keyword} 고객문의` },
  ];
}

function getTheme(info: KeywordInfo) {
  const themes = {
    city: {
      bg: "#071a2f",
      primary: "#0ea5e9",
      accent: "#ffe100",
      title: "광역 24시 대응형",
      hero: "도심 생활 배관 문제를 빠르게 확인하고 복구합니다.",
      visual: "CITY RESPONSE",
    },
    premium: {
      bg: "#0a0a0a",
      primary: "#d4af37",
      accent: "#facc15",
      title: "프리미엄 주거·상가형",
      hero: "고급 아파트와 상가 공간에 맞는 깔끔한 작업과 사후 안내를 제공합니다.",
      visual: "PREMIUM CARE",
    },
    coastal: {
      bg: "#063b5b",
      primary: "#22d3ee",
      accent: "#fde047",
      title: "대형 배관·긴급 복구형",
      hero: "해안 도시와 대형 배관 환경에 맞춘 신속 대응 서비스를 제공합니다.",
      visual: "WATER LINE",
    },
    kitchen: {
      bg: "#431407",
      primary: "#fb923c",
      accent: "#fed7aa",
      title: "주방 배수 전문형",
      hero: "기름 슬러지, 음식물 찌꺼기, 주방 배수 역류를 집중 점검합니다.",
      visual: "KITCHEN DRAIN",
    },
    toilet: {
      bg: "#1e1b4b",
      primary: "#818cf8",
      accent: "#c7d2fe",
      title: "욕실 긴급 해결형",
      hero: "갑작스러운 변기 막힘과 욕실 배수 문제를 빠르게 확인합니다.",
      visual: "TOILET SOS",
    },
    field: {
      bg: "#042f2e",
      primary: "#2dd4bf",
      accent: "#ccfbf1",
      title: "현장 출동·장비 전문형",
      hero: "현장 상황에 맞는 전문 장비로 막힘과 역류 문제를 해결합니다.",
      visual: "FIELD WORK",
    },
  };

  return themes[info.tone];
}

function baseStyle(info: KeywordInfo) {
  const t = getTheme(info);

  return `
*{box-sizing:border-box}
body{margin:0;font-family:Arial,'Noto Sans KR',sans-serif;color:#111827;background:#f5f7fb;line-height:1.7}
a{text-decoration:none;color:inherit}
.top{background:#050816;color:#fff;font-size:13px;font-weight:800}
.top-inner{max-width:1180px;margin:auto;padding:9px 20px;display:flex;justify-content:flex-end;gap:18px}
.header{background:#fff;border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:50}
.header-inner{max-width:1180px;margin:auto;padding:18px 20px;display:flex;justify-content:space-between;align-items:center}
.logo{font-size:30px;font-weight:900;color:${t.bg}}
.logo span{color:${t.primary}}
.logo small{display:block;font-size:12px;color:#64748b}
.cta{display:flex;gap:10px;flex-wrap:wrap}
.cta a,.btn{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:13px 20px;font-weight:900}
.tel{background:${t.accent};color:#111}
.kakao{background:#20c763;color:#052e16}
.nav{background:${t.bg};color:#fff}
.nav-inner{max-width:1180px;margin:auto;padding:14px 20px;display:flex;justify-content:center;gap:30px;font-weight:900}
.section{max-width:1180px;margin:auto;padding:78px 20px}
.title{text-align:center;margin-bottom:38px}
.title h2{font-size:44px;margin:0 0 10px;letter-spacing:-1.5px}
.title span{color:${t.primary}}
.title p{color:#64748b;font-size:18px;margin:0}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:28px;padding:30px;box-shadow:0 18px 45px rgba(15,23,42,.08)}
.card b{display:inline-flex;width:48px;height:48px;border-radius:15px;align-items:center;justify-content:center;background:#e0f2fe;color:${t.bg};font-size:20px}
.card h3{font-size:25px;margin:18px 0 10px}
.links a{background:#fff;border:1px solid #dbe3ef;border-radius:18px;padding:16px;text-align:center;font-weight:900;box-shadow:0 10px 25px rgba(15,23,42,.06)}
.gallery{padding:78px 20px;background:linear-gradient(135deg,#ffe87a,#fff3a3)}
.gallery-inner{max-width:1180px;margin:auto;position:relative}
.photo{height:176px;border-radius:22px;background:linear-gradient(135deg,#334155,#cbd5e1);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900}
.photo-card p{font-size:14px;font-weight:800}
.more{position:absolute;right:0;top:18px;width:74px;height:74px;border:4px solid #e11d48;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-weight:900}
.contact{background:linear-gradient(135deg,${t.bg},${t.primary});color:#fff;border-radius:34px;padding:50px;text-align:center}
.contact h2{font-size:44px;margin:0 0 12px}
.side{position:fixed;right:24px;top:42%;z-index:60;display:flex;flex-direction:column;gap:10px}
.side a{width:92px;height:82px;border-radius:12px;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;color:#fff;box-shadow:0 12px 30px rgba(15,23,42,.25)}
.blog{background:#22c55e}.talk{background:#ffe100;color:#111!important}.call{background:#5b45bd}
.sub-hero{background:${t.bg};color:#fff;text-align:center;padding:80px 20px}
.sub-hero h1{font-size:52px;margin:0 0 12px}
.content{background:#fff;border:1px solid #e5e7eb;border-radius:30px;padding:38px;box-shadow:0 18px 45px rgba(15,23,42,.08)}
.footer{background:#050816;color:#cbd5e1;text-align:center;padding:38px 20px}
@media(max-width:900px){
.header-inner,.top-inner{flex-direction:column;align-items:flex-start}
.nav-inner{flex-wrap:wrap;gap:14px}
.grid3,.grid4{grid-template-columns:1fr}
.side{display:none}
}
`;
}

function layoutStart(info: KeywordInfo, title: string, desc: string) {
  const menu = getMenuPages(info).map((p) => `<a href="/${p.file}">${p.title}</a>`).join("");
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<style>${baseStyle(info)}</style>
</head>
<body>
<div class="top"><div class="top-inner"><span>24시 출장 가능</span><span>상담 ${info.phone}</span><span>카카오톡 ${info.kakaoId}</span></div></div>
<header class="header">
  <div class="header-inner">
    <div class="logo">${info.keyword}<span>24</span><small>${info.region} ${info.service} 전문</small></div>
    <div class="cta">
      <a class="tel" href="tel:${info.phone}">전화 ${info.phone}</a>
      <a class="kakao" href="https://open.kakao.com/o/${info.kakaoId}">카카오톡 ${info.kakaoId}</a>
    </div>
  </div>
</header>
<nav class="nav"><div class="nav-inner">${menu}</div></nav>`;
}

function layoutEnd(info: KeywordInfo) {
  return `
<div class="side">
  <a class="blog" href="#">블로그</a>
  <a class="talk" href="https://open.kakao.com/o/${info.kakaoId}">카톡상담</a>
  <a class="call" href="tel:${info.phone}">고객센터</a>
</div>
<footer class="footer">
  <p>${info.companyName} | 대표전화 ${info.phone} | 카카오톡 ${info.kakaoId}</p>
  <p>${info.region} ${info.service} 전문 · Copyright © ${info.companyName}. All rights reserved.</p>
</footer>
</body>
</html>`;
}

function createHero(info: KeywordInfo) {
  const t = getTheme(info);

  if (info.tone === "premium") {
    return `
<section style="background:linear-gradient(135deg,#050505,#111827);color:white;padding:100px 20px">
  <div style="max-width:1180px;margin:auto;display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center">
    <div>
      <p style="color:${t.accent};font-weight:900">PREMIUM DRAIN CARE</p>
      <h1 style="font-size:72px;line-height:1.05;margin:20px 0">${info.keyword}<br><span style="color:${t.accent};font-size:42px">24시 출장 가능</span></h1>
      <p style="font-size:22px;color:#d1d5db">${t.hero}</p>
      <h2 style="font-size:52px">${info.phone}</h2>
      <div class="cta"><a class="tel btn" href="tel:${info.phone}">전화상담</a><a class="kakao btn" href="https://open.kakao.com/o/${info.kakaoId}">카카오톡</a></div>
    </div>
    <div style="background:#f8fafc;color:#111;border-radius:36px;padding:50px;box-shadow:0 40px 90px rgba(0,0,0,.45)">
      <h2>고급 현장 전용 관리</h2>
      <p>아파트, 상가, 사무실 배관 문제를 깔끔하게 점검합니다.</p>
    </div>
  </div>
</section>`;
  }

  if (info.tone === "coastal") {
    return `
<section style="background:linear-gradient(135deg,#063b5b,#0891b2);color:white;padding:95px 20px;position:relative;overflow:hidden">
  <div style="max-width:1180px;margin:auto;display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center">
    <div>
      <p class="badge">${t.title}</p>
      <h1 style="font-size:68px;line-height:1.05;margin:22px 0">${info.keyword}<br><span style="color:${t.accent};font-size:42px">대형 배관 긴급 복구</span></h1>
      <p style="font-size:22px">${t.hero}</p>
      <h2 style="font-size:52px">${info.phone}</h2>
      <div class="cta"><a class="tel btn" href="tel:${info.phone}">전화상담</a><a class="kakao btn" href="https://open.kakao.com/o/${info.kakaoId}">카카오톡</a></div>
    </div>
    <div style="height:380px;border-radius:40px;background:radial-gradient(circle,#fff,#bae6fd,#0ea5e9);display:flex;align-items:center;justify-content:center;color:#075985;font-size:34px;font-weight:900">WATER LINE</div>
  </div>
</section>`;
  }

  if (info.tone === "kitchen") {
    return `
<section style="background:linear-gradient(135deg,#431407,#ea580c);color:white;padding:90px 20px">
  <div style="max-width:1180px;margin:auto;display:grid;grid-template-columns:.9fr 1.1fr;gap:44px;align-items:center">
    <div style="background:#fff7ed;color:#431407;border-radius:36px;padding:42px">
      <h2>주방 배수 집중 케어</h2>
      <p>기름 슬러지, 음식물 찌꺼기, 악취까지 함께 점검합니다.</p>
    </div>
    <div>
      <p class="badge">${t.title}</p>
      <h1 style="font-size:66px;line-height:1.05;margin:20px 0">${info.keyword}<br><span style="color:${t.accent};font-size:40px">주방 배수 전문</span></h1>
      <p style="font-size:22px">${t.hero}</p>
      <h2 style="font-size:50px">${info.phone}</h2>
      <div class="cta"><a class="tel btn" href="tel:${info.phone}">전화상담</a><a class="kakao btn" href="https://open.kakao.com/o/${info.kakaoId}">카카오톡</a></div>
    </div>
  </div>
</section>`;
  }

  return `
<section style="background:${t.bg};color:white;padding:90px 20px">
  <div style="max-width:1180px;margin:auto;display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center">
    <div>
      <p class="badge">${t.title}</p>
      <h1 style="font-size:68px;line-height:1.05;margin:22px 0">${info.keyword}<br><span style="color:${t.accent};font-size:42px">24시 출장 가능</span></h1>
      <p style="font-size:22px">${t.hero}</p>
      <h2 style="font-size:52px">${info.phone}</h2>
      <div class="cta"><a class="tel btn" href="tel:${info.phone}">전화상담</a><a class="kakao btn" href="https://open.kakao.com/o/${info.kakaoId}">카카오톡</a></div>
    </div>
    <div style="height:390px;border-radius:36px;background:linear-gradient(145deg,#fff,#dbeafe);display:flex;align-items:center;justify-content:center;color:${t.bg};font-size:34px;font-weight:900">${t.visual}</div>
  </div>
</section>`;
}

function createHomePage(info: KeywordInfo) {
  const t = getTheme(info);
  const keywords = getKeywordPages(info);
  const photos = Array.from({ length: 8 })
    .map((_, i) => `<div class="photo-card"><div class="photo">${t.visual} ${i + 1}</div><p>${info.keyword} 현장사진 ${i + 1}</p></div>`)
    .join("");

  return layoutStart(info, info.keyword, `${info.keyword} 전문 사이트`) + createHero(info) + `
<section class="section">
  <div class="title"><h2>${info.keyword} <span>전문 서비스</span></h2><p>키워드 성격에 맞춰 서비스 구조가 자동 구성됩니다.</p></div>
  <div class="grid3">
    <div class="card"><b>01</b><h3>${info.service}</h3><p>${t.hero}</p></div>
    <div class="card"><b>02</b><h3>역류·악취 점검</h3><p>반복되는 냄새와 역류는 배관 내부 상태 확인이 중요합니다.</p></div>
    <div class="card"><b>03</b><h3>전문 장비 작업</h3><p>현장 상황에 맞춰 장비를 사용합니다.</p></div>
  </div>
</section>

<section class="section">
  <div class="title"><h2>내부페이지 <span>바로가기</span></h2><p>네이버가 이해하기 쉬운 내부링크 구조입니다.</p></div>
  <div class="grid4 links">${keywords.map((k) => `<a href="/${pageFile(k)}">${k}</a>`).join("")}</div>
</section>

<section class="gallery">
  <div class="gallery-inner">
    <div class="title"><h2>Construction <span>Gallery</span></h2><p>작업사진이 많이 들어가도 깔끔하게 보이도록 구성했습니다.</p></div>
    <a class="more" href="/gallery.html">더보기</a>
    <div class="gallery-grid grid4">${photos}</div>
  </div>
</section>

<section class="section">
  <div class="contact">
    <h2>${info.keyword} 상담문의</h2>
    <p>전화와 카카오톡 상담 버튼을 반복 배치했습니다.</p>
    <div class="cta" style="justify-content:center">
      <a class="tel btn" href="tel:${info.phone}">전화 ${info.phone}</a>
      <a class="kakao btn" href="https://open.kakao.com/o/${info.kakaoId}">카카오톡 ${info.kakaoId}</a>
    </div>
  </div>
</section>` + layoutEnd(info);
}

function createSubPage(info: KeywordInfo, heading: string, type: string) {
  const t = getTheme(info);

  const body =
    info.tone === "premium"
      ? `<section class="section"><div class="content"><h2>${heading}</h2><p>고급 주거지와 상업 공간은 작업 품질과 사후 정리가 중요합니다. ${t.hero}</p><p>${type}에 맞춰 상담 동선과 신뢰 정보를 구성했습니다.</p></div></section>`
      : info.tone === "coastal"
      ? `<section class="section"><div class="content"><h2>${heading}</h2><p>대형 배관과 생활 배수 문제를 빠르게 구분하고 현장 상황에 맞춰 대응합니다.</p><p>${t.hero}</p></div></section>`
      : info.tone === "kitchen"
      ? `<section class="section"><div class="content"><h2>${heading}</h2><p>주방 배수는 기름 슬러지와 음식물 찌꺼기가 누적되기 쉬워 정확한 원인 확인이 필요합니다.</p><p>${t.hero}</p></div></section>`
      : `<section class="section"><div class="content"><h2>${heading}</h2><p>${info.region} 지역에서 발생하는 ${info.service} 문제를 현장 중심으로 점검합니다.</p><p>${t.hero}</p></div></section>`;

  return layoutStart(info, heading, `${heading} 안내 페이지`) + `
<section class="sub-hero"><h1>${heading}</h1><p>${t.title} · ${info.phone}</p></section>
${body}
<section class="section">
  <div class="grid3">
    <div class="card"><b>01</b><h3>현장 확인</h3><p>증상과 위치를 확인합니다.</p></div>
    <div class="card"><b>02</b><h3>원인 점검</h3><p>막힘, 악취, 역류 원인을 구분합니다.</p></div>
    <div class="card"><b>03</b><h3>작업 안내</h3><p>작업 과정과 상담 방법을 안내합니다.</p></div>
  </div>
</section>
<section class="section"><div class="contact"><h2>지금 상담하세요</h2><div class="cta" style="justify-content:center"><a class="tel btn" href="tel:${info.phone}">전화 ${info.phone}</a><a class="kakao btn" href="https://open.kakao.com/o/${info.kakaoId}">카카오톡 ${info.kakaoId}</a></div></div></section>` + layoutEnd(info);
}

function createGalleryPage(info: KeywordInfo) {
  const t = getTheme(info);
  const photos = Array.from({ length: 24 })
    .map((_, i) => `<div class="photo-card"><div class="photo">${t.visual} ${i + 1}</div><p>${info.keyword} 현장사진 ${i + 1}</p></div>`)
    .join("");

  return layoutStart(info, `${info.keyword} 작업사진 갤러리`, `${info.keyword} 작업사진 전체보기`) +
    `<section class="gallery"><div class="gallery-inner"><div class="title"><h1>${info.keyword} 작업사진 전체보기</h1><p>현장 사진을 한눈에 볼 수 있는 갤러리 페이지입니다.</p></div><div class="gallery-grid grid4">${photos}</div></div></section>` +
    layoutEnd(info);
}

function createSitemap(files: string[], today: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map((file) => `  <url><loc>https://example.com/${file === "index.html" ? "" : file}</loc><lastmod>${today}</lastmod><priority>${file === "index.html" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>`;
}

export function createWebsite(input: WebsiteInput) {
  const today = new Date().toISOString().slice(0, 10);
  const info = analyzeKeyword(input.mainKeyword);
  const menuPages = getMenuPages(info);
  const keywordPages = getKeywordPages(info);

  const files: SiteFile[] = [
    { name: "index.html", content: createHomePage(info) },
    { name: "gallery.html", content: createGalleryPage(info) },
    ...menuPages.filter((p) => p.file !== "gallery.html").map((p) => ({
      name: p.file,
      content: createSubPage(info, p.heading, p.title),
    })),
    ...keywordPages.map((keyword) => ({
      name: pageFile(keyword),
      content: createSubPage(info, keyword, "키워드 랜딩"),
    })),
  ];

  const names = files.map((file) => file.name);

  files.push({
    name: "robots.txt",
    content: `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`,
  });

  files.push({
    name: "sitemap.xml",
    content: createSitemap(names, today),
  });

  return {
    indexHtml: files.find((file) => file.name === "index.html")?.content ?? "",
    galleryHtml: files.find((file) => file.name === "gallery.html")?.content ?? "",
    sitemap: files.find((file) => file.name === "sitemap.xml")?.content ?? "",
    robots: files.find((file) => file.name === "robots.txt")?.content ?? "",
    pages: files.map((file) => file.name),
    files,
    score: 99,
    variant: info.tone,
  };
}