import {
  MAIN_APPLY_LINK,
  WEDDING_CATALOG,
  fairFile,
  type WeddingEvent,
} from "./wedding-events";
import { fairThumb } from "./wedding-graphics";
import { pageHref } from "../../layout";
import type { SiteManifest, SitePageMeta } from "../../types";

/** 방문 전 체크리스트 (weddingbusan 구조 참고) */
const CHECKLIST = [
  {
    group: "필수 조건 & 계약",
    items: [
      "가계약금 100% 환불 가능 기한",
      "당일 계약 특전 혜택 범위",
      "보증 인원과 초과 시 추가 비용",
      "식대·대관료에 포함된 항목",
    ],
  },
  {
    group: "웨딩홀 내부 환경",
    items: [
      "스냅 촬영 시 조명 연출과 천장고",
      "버진로드 길이와 하객 시야",
      "신부 대기실 위치와 크기",
      "예식 시간 간격 (하객 겹침 여부)",
    ],
  },
  {
    group: "하객 편의",
    items: [
      "주차 가능 대수와 무료 주차 시간",
      "지하철·버스 접근성",
      "피로연장 좌석 수와 동선",
    ],
  },
];

const FAQ = [
  {
    q: "웨딩박람회는 꼭 가야 하나요?",
    a: "필수는 아니지만, 한자리에서 여러 업체의 견적과 혜택을 비교할 수 있어 시간과 비용을 크게 아낄 수 있습니다. 개별 상담으로는 받기 어려운 박람회 전용 특전이 있는 경우가 많습니다.",
  },
  {
    q: "무료초대권은 어떻게 신청하나요?",
    a: "원하는 박람회의 신청하기 버튼을 누르면 바로 신청 페이지로 연결됩니다. 사전 신청자에게만 제공되는 사은품과 상담 우선권이 있는 경우가 많습니다.",
  },
  {
    q: "박람회에서 바로 계약해야 하나요?",
    a: "아닙니다. 다만 당일 계약 특전이 큰 경우가 많으니, 가계약금 환불 조건을 반드시 확인한 뒤 결정하세요. 환불 가능 기한 안이라면 부담 없이 계약 후 재검토할 수 있습니다.",
  },
  {
    q: "스드메 패키지는 박람회가 더 저렴한가요?",
    a: "일반적으로 박람회 전용 패키지가 개별 계약보다 유리합니다. 다만 포함된 옵션(추가 촬영, 드레스 벌수, 헬퍼비)이 업체마다 달라 총액 기준으로 비교해야 합니다.",
  },
  {
    q: "예식일이 아직 정해지지 않았는데 가도 되나요?",
    a: "네. 오히려 날짜를 정하기 전에 방문하시면 홀별 가능 일정과 성수기·비수기 가격 차이를 비교해 유리한 날짜를 고를 수 있습니다.",
  },
  {
    q: "혼수·가전 혜택도 받을 수 있나요?",
    a: "박람회에 따라 혼수 선불카드나 가전 할인 혜택을 제공합니다. 예식 계약과 별개로 진행되는 경우가 많으니 신청 후 상담 시 조건을 확인하세요.",
  },
];

function fairImageFile(name: string) {
  return fairFile(name).replace(/\.html$/, ".webp");
}

function hasFairImage(manifest: SiteManifest, name: string) {
  return manifest.assets?.fairImages?.includes(fairImageFile(name)) ?? false;
}

/** 박람회 시각 요소: 링크 미리보기(og) 이미지가 있으면 사진, 없으면 SVG 모티프로 폴백. */
function fairVisual(manifest: SiteManifest, name: string): string {
  if (hasFairImage(manifest, name)) {
    return `<img src="/images/fairs/${encodeURI(fairImageFile(name))}" alt="${name}" loading="lazy">`;
  }

  return fairThumb(name);
}

// 목록 카드는 내부 세부 페이지로 연결한다(그래야 그 페이지가 검색에 노출된다).
// 미리보기 이미지를 상단에 크게 보여주는 세로형 카드.
function fairCard(manifest: SiteManifest, event: WeddingEvent) {
  return `      <a class="fair-card" href="${pageHref(fairFile(event.name))}">
        <span class="fair-thumb">${fairVisual(manifest, event.name)}</span>
        <span class="fair-body">
          <span class="fair-name">${event.name}</span>
          <span class="fair-apply">자세히 →</span>
        </span>
      </a>`;
}

/** 지역별 박람회 링크 목록. 홈과 키워드 페이지가 공유한다(.section 으로 폭·여백 통일). */
export function renderCatalog(manifest: SiteManifest): string {
  return WEDDING_CATALOG.map(
    (group) => `
<section class="section">
  <h2 class="cat-title">${group.region}</h2>
  <div class="fair-grid">
${group.events.map((event) => fairCard(manifest, event)).join("\n")}
  </div>
</section>`
  ).join("\n");
}

/** 대표/세부 신청 배너. link를 주면 해당 박람회 신청 링크로 연결한다. */
export function renderApplyHero(
  heading: string,
  link: string = MAIN_APPLY_LINK,
  buttonLabel = "웨딩박람회 무료 신청하기 →"
): string {
  return `
<section class="section">
  <div class="cta apply-hero">
    <p class="cta-eyebrow">FREE APPLICATION</p>
    <h2>${heading}</h2>
    <p>버튼을 누르면 바로 무료 신청 페이지로 연결됩니다.</p>
    <a class="btn btn-apply" href="${link}" target="_blank" rel="noopener noreferrer">${buttonLabel}</a>
  </div>
</section>`;
}

/** 박람회명에서 장소 성격을 짚어 문장에 변화를 준다(얇은 중복 콘텐츠 완화). */
function venueHint(name: string) {
  if (name.includes("백화점")) return "백화점에서 열리는 ";
  if (name.includes("호텔")) return "호텔에서 진행되는 ";
  if (name.includes("벡스코")) return "벡스코에서 열리는 ";
  if (name.includes("센텀")) return "신세계 센텀시티에서 열리는 ";
  if (name.includes("방송국") || name.includes("KNN")) return "방송사가 주최하는 ";
  if (name.includes("허니문")) return "허니문 준비를 위한 ";
  return "";
}

function checklistSection(kw: string) {
  const groups = CHECKLIST.map(
    (group) => `    <div class="checklist-group">
      <h3>${group.group}</h3>
      <ul>
${group.items.map((item) => `        <li>${item}</li>`).join("\n")}
      </ul>
    </div>`
  ).join("\n");

  return `
  <section class="block">
    <h2>${kw} 방문 전 체크리스트</h2>
    <p>상담 전에 아래 항목만 확인해도 계약 후 후회할 일이 크게 줄어듭니다.</p>
    <div class="checklist">
${groups}
    </div>
  </section>`;
}

function faqSection(kw: string) {
  const items = FAQ.map(
    (item) => `    <details class="faq-item">
      <summary>${item.q}</summary>
      <p>${item.a}</p>
    </details>`
  ).join("\n");

  return `
  <section class="block">
    <h2>${kw} 자주 묻는 질문</h2>
${items}
  </section>`;
}

/**
 * 박람회 세부 랜딩 페이지.
 * 박람회명을 제목/본문에 담아 그 키워드로 검색 노출을 노리고, CTA는 이 박람회의
 * reply-alba 신청 링크로 연결한다.
 */
export function renderArticle(
  manifest: SiteManifest,
  page: SitePageMeta
): string {
  const fair = page.keyword;
  const link = page.applyLink || MAIN_APPLY_LINK;

  // 미리보기 이미지가 있으면 상단에 포스터 배너로, 없으면 SVG 아이콘을 작게.
  const banner = hasFairImage(manifest, fair)
    ? `
<section class="section">
  <div class="fair-banner"><img src="/images/fairs/${encodeURI(
    fairImageFile(fair)
  )}" alt="${fair} 미리보기" width="800" height="450"></div>
</section>`
    : "";

  const head = hasFairImage(manifest, fair)
    ? `  <section class="block">
    <h2>${fair} 안내</h2>
    <p>${venueHint(fair)}${fair}의 무료초대권 신청과 참여 혜택을 안내합니다. 사전 신청자에게는 무료초대권과 사은품이 제공되며, 한자리에서 여러 웨딩 업체의 견적과 특전을 비교할 수 있습니다.</p>
  </section>`
    : `  <section class="block fair-detail-head">
    <span class="fair-thumb-lg">${fairVisual(manifest, fair)}</span>
    <div>
      <h2>${fair} 안내</h2>
      <p>${venueHint(fair)}${fair}의 무료초대권 신청과 참여 혜택을 안내합니다. 사전 신청자에게는 무료초대권과 사은품이 제공되며, 한자리에서 여러 웨딩 업체의 견적과 특전을 비교할 수 있습니다.</p>
    </div>
  </section>`;

  return `
${banner}
${renderApplyHero(`${fair} 무료 신청`, link, `${fair} 무료 신청하기 →`)}
<article class="article section">
${head}

  <section class="block">
    <h2>${fair} 참여 혜택</h2>
    <ul class="benefit-list">
      <li>사전 신청 시 무료초대권 및 사은품 증정</li>
      <li>스드메(스튜디오·드레스·메이크업) 패키지 특가 비교</li>
      <li>예식홀·혼수·가전 프로모션 특전 안내</li>
      <li>당일 계약 시 추가 혜택 (환불 조건 확인 후 결정)</li>
    </ul>
  </section>

  <section class="block">
    <h2>${fair} 신청 방법</h2>
    <p>아래 버튼을 누르면 ${fair} 무료 신청 페이지로 연결됩니다. 이름과 연락처만 입력하면 신청이 완료됩니다.</p>
    <a class="btn btn-apply" href="${link}" target="_blank" rel="noopener noreferrer">${fair} 무료 신청하기 →</a>
    <p class="fair-note">※ 일정과 특전은 주최사 사정에 따라 변경될 수 있습니다. 신청 페이지에서 최신 정보를 확인해주세요.</p>
  </section>

${checklistSection(fair)}
${faqSection(fair)}

  <section class="block">
    <a class="back-link" href="/">← 부산·경남 웨딩박람회 전체 목록 보기</a>
  </section>
</article>`;
}

/**
 * 웨딩 업종 전용 CSS.
 *
 * 공용 style() 뒤에 붙으므로 기본 테마(하수구용 남색/슬레이트)를 통째로 덮는다.
 * 고급 호텔 청첩장 톤: 샴페인 아이보리 · 딥 와인 · 앤티크 골드, 명조 제목.
 */
export const weddingStyles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Sans+KR:wght@300;400;500&display=swap');

:root{
  --ivory:#F7F1E6; --paper:#FFFDF8; --wine:#3C1F2B; --wine-deep:#2A1420;
  --gold:#A9843E; --gold-2:#C6A867; --gold-line:rgba(169,132,62,.32);
  --ink:#33272B; --muted:#8A7A6E;
}

body{background:var(--ivory);color:var(--ink);font-family:'Noto Sans KR',sans-serif;font-weight:400}

/* HEADER — 골드 헤어라인 액자 청첩장 */
.header{position:relative;background:radial-gradient(130% 150% at 50% -30%, #53303F 0%, var(--wine) 55%, var(--wine-deep) 100%);color:#F3E6D5;padding:66px 24px 58px}
.header::before{content:"";position:absolute;inset:16px;border:1px solid rgba(198,168,103,.45);pointer-events:none}
.header h1{font-family:'Nanum Myeongjo',serif;font-weight:700;font-size:46px;letter-spacing:.02em;margin:0;color:#F6ECDC;text-shadow:0 2px 20px rgba(0,0,0,.3)}
.header h1::after{content:"\\25C6";display:block;color:var(--gold-2);font-size:11px;margin:20px 0 16px}
.header .services{font-size:14px;font-weight:400;letter-spacing:.32em;color:var(--gold-2);margin:0 0 12px}
.header .notice{font-size:15px;color:#D8C4B2;margin:0 0 28px;font-weight:300}
.header-cta{gap:14px}
.btn-call,.btn-kakao{border-radius:1px;font-family:'Noto Sans KR',sans-serif;font-weight:500;font-size:15px;letter-spacing:.06em;padding:15px 30px}
.btn-call{background:var(--gold);color:var(--wine-deep);border:1px solid var(--gold);box-shadow:none}
.btn-call:hover{background:var(--gold-2);transform:translateY(-1px)}
.btn-kakao{background:transparent;color:#F3E6D5;border:1px solid rgba(198,168,103,.55)}
.btn-kakao:hover{background:rgba(198,168,103,.14)}

/* NAV */
.nav{background:var(--ivory);color:var(--wine);border-top:1px solid var(--gold-line);border-bottom:1px solid var(--gold-line);box-shadow:none;padding:16px 20px}
.nav a{color:var(--wine);font-size:14px;letter-spacing:.08em;font-weight:500;margin:6px 14px}
.nav a:hover{color:var(--gold)}
.nav-more{border:1px solid var(--gold);color:var(--gold);border-radius:1px}
.nav-more:hover{background:var(--gold);color:#fff}

.banner-strip a,.banner-strip .banner-item{border-radius:2px;box-shadow:0 18px 44px rgba(60,31,43,.16)}

/* 홈 카드 */
.card{background:var(--paper);border:1px solid var(--gold-line);border-radius:2px;box-shadow:0 18px 44px rgba(60,31,43,.06)}
.card h3{font-family:'Nanum Myeongjo',serif;font-weight:700;color:var(--wine)}
.card p{color:var(--muted);font-weight:300}
.home-title{font-family:'Nanum Myeongjo',serif;font-weight:700;font-size:30px;color:var(--wine);margin:0 0 12px;letter-spacing:.01em}
.home-title::after{content:"";display:block;width:44px;height:1.5px;background:var(--gold);margin:16px 0 0}
.home-sub{color:var(--muted);margin:0 0 30px;font-weight:300}

/* ARTICLE 조판 */
.article h2{font-family:'Nanum Myeongjo',serif;font-weight:700;font-size:29px;color:var(--wine);padding-bottom:0;border-bottom:0;letter-spacing:.01em}
.article h2::after{content:"";display:block;width:44px;height:1.5px;background:var(--gold);margin-top:16px}
.article h3{font-family:'Nanum Myeongjo',serif;color:var(--gold);font-weight:700}
.article p{color:var(--ink);font-weight:300;line-height:1.9}

/* 메인 히어로 이미지 */
.hero-visual{border:1px solid var(--gold-line);border-radius:2px;overflow:hidden;box-shadow:0 18px 44px rgba(60,31,43,.08)}
.hero-visual svg,.hero-visual img{width:100%;height:auto;display:block}

/* 박람회 링크 카드 */
.cat-title{font-family:'Nanum Myeongjo',serif;font-weight:700;font-size:29px;color:var(--wine);margin:0 0 22px;letter-spacing:.01em}
.cat-title::after{content:"";display:block;width:44px;height:1.5px;background:var(--gold);margin-top:16px}
/* 박람회 미리보기 카드 — 상단 포스터 이미지 + 하단 이름 */
.fair-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.fair-card{display:flex;flex-direction:column;background:var(--paper);border:1px solid var(--gold-line);border-radius:4px;overflow:hidden;box-shadow:0 12px 30px rgba(60,31,43,.06);transition:transform .15s,box-shadow .15s}
.fair-card:hover{transform:translateY(-3px);box-shadow:0 22px 48px rgba(60,31,43,.16)}
.fair-thumb{display:block;width:100%;aspect-ratio:16/9;border-bottom:2px solid var(--gold);background:#efe5d3}
.fair-thumb img{width:100%;height:100%;display:block;object-fit:cover}
.fair-thumb svg{width:88px;height:88px;display:block;margin:auto}
.fair-body{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px}
.fair-name{font-family:'Nanum Myeongjo',serif;font-weight:700;font-size:17px;line-height:1.35;color:var(--wine)}
.fair-apply{flex:0 0 auto;font-size:13px;font-weight:500;letter-spacing:.04em;color:var(--gold);white-space:nowrap}
.fair-card:hover .fair-apply{color:var(--wine)}
.fair-note{color:var(--muted);font-weight:300;font-size:14px;margin-top:14px}

/* 세부 페이지: 포스터 배너 */
.fair-banner{border:1px solid var(--gold-line);border-radius:3px;overflow:hidden;box-shadow:0 16px 40px rgba(60,31,43,.10)}
.fair-banner img{width:100%;height:auto;display:block}
.fair-detail-head{display:flex;align-items:center;gap:22px}
.fair-thumb-lg{flex:0 0 auto;width:96px;height:96px}
.fair-thumb-lg svg,.fair-thumb-lg img{width:96px;height:96px;display:block;border-radius:12px;object-fit:cover}
.fair-detail-head h2{margin-top:0}
.benefit-list{list-style:none;margin:0;padding:0}
.benefit-list li{padding:11px 0 11px 24px;position:relative;color:var(--ink);font-weight:300;border-bottom:1px solid var(--gold-line)}
.benefit-list li:last-child{border-bottom:0}
.benefit-list li::before{content:"\\25C6";position:absolute;left:0;top:13px;color:var(--gold);font-size:9px}
.back-link{display:inline-block;color:var(--gold);font-weight:500;letter-spacing:.02em}
.back-link:hover{color:var(--wine)}

/* 체크리스트 */
.checklist{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.checklist-group{background:var(--paper);border:1px solid var(--gold-line);border-radius:2px;padding:26px 24px;box-shadow:0 14px 34px rgba(60,31,43,.05)}
.checklist-group h3{font-family:'Nanum Myeongjo',serif;font-size:18px;margin:0 0 16px;color:var(--wine)}
.checklist-group ul{margin:0;padding:0;list-style:none}
.checklist-group li{padding:8px 0 8px 22px;position:relative;color:var(--ink);font-size:15px;font-weight:300}
.checklist-group li::before{content:"\\2713";position:absolute;left:0;top:8px;color:var(--gold);font-size:12px;font-weight:700}

/* FAQ */
.faq-item{background:transparent;border:0;border-bottom:1px solid var(--gold-line);border-radius:0;padding:22px 2px;margin-bottom:0;box-shadow:none}
.faq-item summary{cursor:pointer;font-family:'Nanum Myeongjo',serif;font-weight:700;font-size:18px;color:var(--wine);list-style:none}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::before{content:"\\002B";float:right;color:var(--gold);font-weight:400;font-size:20px;line-height:1}
.faq-item[open] summary::before{content:"\\2212"}
.faq-item[open] summary{color:var(--gold)}
.faq-item p{margin:14px 0 0;color:var(--ink);font-weight:300;line-height:1.85}

/* CTA / 대표 신청 배너 */
.cta{background:linear-gradient(135deg,var(--wine),var(--wine-deep));border-radius:2px;box-shadow:0 26px 60px rgba(42,20,32,.32);position:relative}
.cta::before{content:"";position:absolute;inset:12px;border:1px solid rgba(198,168,103,.4);pointer-events:none}
.cta-eyebrow{font-size:12px;letter-spacing:.28em;color:var(--gold-2);margin:0 0 14px}
.cta h2{font-family:'Nanum Myeongjo',serif;font-weight:700;color:#F6ECDC;border:0}
.cta h2::after{display:none}
.cta p{color:#D8C4B2;font-weight:300}
.btn{background:var(--gold);color:var(--wine-deep);border-radius:1px;font-weight:500;letter-spacing:.05em;padding:15px 32px}
.btn:hover{background:var(--gold-2)}
.btn-apply{font-size:16px;padding:17px 38px}

/* FOOTER */
.footer{background:var(--wine-deep);color:#C9B79E;border-top:1px solid rgba(198,168,103,.4);font-weight:300;letter-spacing:.02em}

@media(max-width:950px){.fair-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:800px){.checklist{grid-template-columns:1fr}.header h1{font-size:34px}}
@media(max-width:600px){.fair-grid{grid-template-columns:1fr}}
`;
