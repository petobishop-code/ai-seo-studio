import { getWeddingEvents, type WeddingEvent } from "./wedding-events";
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
    a: "사전 신청 후 방문하시면 됩니다. 초대권 없이 현장 방문도 가능하지만, 사전 신청자에게만 제공되는 사은품과 상담 우선권이 있는 경우가 많습니다.",
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
    a: "박람회에 따라 혼수 선불카드나 가전 할인 혜택을 제공합니다. 예식 계약과 별개로 진행되는 경우가 많으니 상담 시 조건을 확인하세요.",
  },
];

function eventCard(event: WeddingEvent) {
  const benefits = event.benefits
    .map((benefit) => `        <li>${benefit}</li>`)
    .join("\n");

  return `    <article class="event-card">
      <h3>${event.name}</h3>
      <dl class="event-meta">
        <div><dt>장소</dt><dd>${event.venue}</dd></div>
        <div><dt>주소</dt><dd>${event.address}</dd></div>
        <div><dt>일정</dt><dd>${event.date}</dd></div>
      </dl>
      <p class="event-benefit-title">✨ 프로모션 특전</p>
      <ul class="event-benefits">
${benefits}
      </ul>
    </article>`;
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
    <h2>📋 ${kw} 방문 전 체크리스트</h2>
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

/** 웨딩박람회 페이지 본문. 목록 → 체크리스트 → FAQ → CTA 순서. */
export function renderArticle(
  manifest: SiteManifest,
  page: SitePageMeta
): string {
  const kw = page.keyword;
  const events = getWeddingEvents(page.region);

  const cards = events.map(eventCard).join("\n");

  return `
<article class="article section">
  <section class="block">
    <h2>${kw} 일정 안내</h2>
    <p>${page.region} 지역에서 열리는 웨딩박람회 일정과 참여 업체, 프로모션 특전을 정리했습니다. 무료초대권을 신청하면 사전 상담 예약과 사은품을 함께 받을 수 있습니다.</p>
  </section>

  <section class="block">
    <h2>${page.region} 웨딩박람회 목록</h2>
    <div class="event-grid">
${cards}
    </div>
    <p class="event-note">※ 일정과 특전은 주최사 사정에 따라 변경될 수 있습니다. 방문 전 확인해주세요.</p>
  </section>
${checklistSection(kw)}
${faqSection(kw)}

  <section class="block">
    <div class="cta">
      <h2>💌 ${kw} 무료초대권 신청</h2>
      <p>사전 신청하시면 상담 예약과 사은품을 함께 안내해드립니다.</p>
      <a class="btn" href="tel:${manifest.phone}">전화 신청 ${manifest.phone}</a>
    </div>
  </section>
</article>`;
}

/**
 * 웨딩 업종 전용 CSS.
 *
 * 공용 style() 뒤에 붙으므로 기본 테마(하수구용 남색/슬레이트)를 통째로 덮는다.
 * 헤더·내비·푸터까지 바꾸지 않으면 액센트만 핑크인 칙칙한 화면이 된다.
 */
export const weddingStyles = `
body{background:linear-gradient(180deg,#fff5f9 0%,#fdf2f8 100%);color:#4a2338}

.header{background:linear-gradient(135deg,#fb7fc0 0%,#ec4899 45%,#be185d 100%)}
.header h1{text-shadow:0 3px 16px rgba(131,24,67,.35)}
.header .services{color:#ffe9f3}
.header .notice{color:#fdd7ea}

.nav{background:#fff;color:#9d174d;border-bottom:2px solid #fbcfe8;box-shadow:0 6px 22px rgba(190,24,93,.07)}
.nav a{color:#9d174d}
.nav a:hover{color:#ec4899}
.nav-more{border-color:#ec4899;color:#be185d}
.nav-more:hover{background:#ec4899;color:#fff}

.banner-strip a{box-shadow:0 16px 40px rgba(190,24,93,.16)}

.card{border-color:#f9d3e3;box-shadow:0 14px 36px rgba(190,24,93,.10)}
.card h3{color:#9d174d}
.card p{color:#6b4356}

.article h2{color:#831843;border-bottom-color:#ec4899}
.article h3{color:#be185d}
.article p{color:#5f3a4c}

.cta{background:linear-gradient(135deg,#f472b6,#be185d);box-shadow:0 22px 55px rgba(190,24,93,.30)}
.cta p{color:#ffeaf4}
.btn{background:#fff;color:#be185d}
.btn:hover{background:#fff0f6}

/* 헤더가 핑크라 전화 버튼도 핑크면 묻힌다. 흰 버튼으로 대비를 준다. */
.btn-call{background:#fff;color:#be185d;box-shadow:0 10px 28px rgba(131,24,67,.32)}
.btn-call:hover{background:#fff0f6}

.link-card{border-color:#f9d3e3;color:#9d174d;box-shadow:0 10px 24px rgba(190,24,93,.08)}
.link-card:hover{border-color:#ec4899}
.link-card span{color:#a4778a}
.region-block h3{color:#831843}

.footer{background:linear-gradient(135deg,#831843,#4c0519);color:#fbcfe8}
.event-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
.event-card{background:linear-gradient(180deg,#fff 0%,#fff7fb 100%);border:1px solid #f7cfe1;border-radius:22px;padding:24px;box-shadow:0 14px 34px rgba(190,24,93,.11)}
.event-card h3{font-size:21px;margin:0 0 14px;color:#9d174d}
.event-meta{margin:0 0 16px;font-size:15px}
.event-meta div{display:flex;gap:10px;padding:5px 0;border-bottom:1px dashed #f1e0e8}
.event-meta dt{flex:0 0 44px;font-weight:800;color:#9d174d}
.event-meta dd{margin:0;color:#475569}
.event-benefit-title{margin:0 0 8px;font-weight:900;color:#be185d}
.event-benefits{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.event-benefits li{background:#fdf2f8;border:1px solid #fbcfe8;border-radius:999px;padding:7px 14px;font-size:14px;font-weight:700;color:#9d174d}
.event-note{margin-top:16px;font-size:14px;color:#94a3b8}
.checklist{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.checklist-group{background:#fff;border:1px solid #f7cfe1;border-radius:20px;padding:22px;box-shadow:0 10px 26px rgba(190,24,93,.07)}
.checklist-group h3{font-size:18px;margin:0 0 12px;color:#be185d}
.checklist-group ul{margin:0;padding:0;list-style:none}
.checklist-group li{padding:7px 0 7px 24px;position:relative;color:#334155;font-size:15px}
.checklist-group li::before{content:"☑";position:absolute;left:0;color:#ec4899;font-weight:900}
.faq-item{background:#fff;border:1px solid #f7cfe1;border-radius:16px;padding:18px 22px;margin-bottom:10px;box-shadow:0 8px 20px rgba(190,24,93,.06)}
.faq-item summary{cursor:pointer;font-weight:800;font-size:17px;color:#831843}
.faq-item[open] summary{color:#ec4899}
.faq-item p{margin:12px 0 0;color:#5f3a4c}
@media(max-width:800px){.event-grid,.checklist{grid-template-columns:1fr}}
`;
