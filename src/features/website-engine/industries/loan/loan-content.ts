import { ctaButtonsHtml } from "../../layout";
import type { SiteManifest, SitePageMeta } from "../../types";

/**
 * 대출 상품 카탈로그.
 *
 * ⚠️ 금융/대출 광고는 대출성 상품 광고 규제·대출중개업 등록·법정 고지 의무가 있다.
 * 콘텐츠는 "정보 비교·상담 안내"에 한정하고, 금리/한도/승인을 단정하거나 보장하지 않는다.
 * 실제 운영 전 상호·사업자정보·대출중개업 등록번호·법정 고지를 반드시 실제 값으로 채워야 한다.
 */
export type LoanProduct = {
  /** 상품명 = 페이지 키워드. 예: "신용대출" */
  name: string;
  icon: string;
  /** 홈 카드 설명 */
  cardDesc: string;
  /** 상세 페이지 도입 문단 */
  intro: string;
  /** 신청 전 확인사항 */
  checks: string[];
};

export const LOAN_CATALOG: LoanProduct[] = [
  {
    name: "신용대출",
    icon: "💳",
    cardDesc: "직장인·개인사업자 신용대출 정보를 한눈에 확인하세요.",
    intro:
      "신용대출은 담보 없이 개인의 신용도와 소득을 바탕으로 이용하는 상품입니다. 한도뿐 아니라 금리 유형(고정·변동), 상환방식, 중도상환수수료와 총 상환비용을 함께 비교하는 것이 중요합니다.",
    checks: [
      "본인의 소득·재직 상태와 기존 부채 현황 확인",
      "신용점수와 금리 유형(고정·변동) 비교",
      "월 상환 가능 금액을 고려한 상환 계획 수립",
    ],
  },
  {
    name: "주택담보대출",
    icon: "🏠",
    cardDesc: "주택을 담보로 이용할 수 있는 금융상품의 조건을 알아보세요.",
    intro:
      "주택담보대출은 보유 주택을 담보로 이용하는 상품으로, 담보 시세와 LTV·DSR 등 규제 요건에 따라 한도가 달라집니다. 금리 유형과 중도상환수수료, 총 상환비용을 함께 확인하세요.",
    checks: [
      "담보 주택의 시세와 LTV(담보인정비율) 확인",
      "DSR(총부채원리금상환비율) 등 규제 요건 검토",
      "고정·변동 금리와 중도상환수수료 비교",
    ],
  },
  {
    name: "전세자금대출",
    icon: "🔑",
    cardDesc: "전세 보증금 마련을 위한 대출 상품과 주요 조건을 확인하세요.",
    intro:
      "전세자금대출은 전세 보증금 마련을 돕는 상품으로, 임대차계약 내용과 보증기관 보증 여부, 소득 요건에 따라 이용 조건이 달라집니다.",
    checks: [
      "임대차계약서와 대상 주택 요건 확인",
      "보증기관(주택도시보증공사 등) 보증 가능 여부",
      "소득 요건과 상환 계획 검토",
    ],
  },
  {
    name: "사업자대출",
    icon: "🧑‍💼",
    cardDesc: "개인사업자와 법인사업자를 위한 자금 상품을 비교해보세요.",
    intro:
      "사업자대출은 개인·법인사업자의 운영자금·시설자금 마련을 돕는 상품입니다. 업력과 매출, 소득 증빙, 담보·보증 여부에 따라 조건이 달라집니다.",
    checks: [
      "사업자등록 상태와 업력 확인",
      "매출·소득 증빙 자료 준비",
      "자금 용도와 상환 계획 정리",
    ],
  },
  {
    name: "자동차대출",
    icon: "🚗",
    cardDesc: "신차·중고차 구입에 활용할 수 있는 금융상품을 확인하세요.",
    intro:
      "자동차대출은 신차·중고차 구입 자금을 위한 상품으로, 차량 가액과 할부·대출 방식, 금리와 기간에 따라 총 비용이 달라집니다.",
    checks: [
      "차량 가액과 필요 자금 규모 확인",
      "할부와 대출 방식의 총 비용 비교",
      "금리·상환 기간과 중도상환수수료 검토",
    ],
  },
  {
    name: "소액대출",
    icon: "💰",
    cardDesc: "비교적 적은 금액이 필요할 때 확인할 수 있는 상품 정보입니다.",
    intro:
      "소액대출은 비교적 적은 금액이 단기로 필요할 때 확인하는 상품입니다. 금액이 작아도 금리와 수수료를 포함한 총 상환비용을 반드시 확인하고, 제도권 금융인지 점검해야 합니다.",
    checks: [
      "필요 금액과 상환 기간 명확히 하기",
      "이자·수수료를 포함한 총 상환비용 확인",
      "제도권 금융회사 상품인지 반드시 점검",
    ],
  },
  {
    name: "직장인대출",
    icon: "🏢",
    cardDesc: "재직·소득 조건에 따라 확인할 수 있는 직장인 금융상품 안내입니다.",
    intro:
      "직장인대출은 재직과 소득을 바탕으로 이용하는 상품입니다. 재직 기간과 소득 증빙, 기존 부채 현황에 따라 조건이 달라집니다.",
    checks: [
      "재직 기간과 4대보험 가입 여부 확인",
      "소득 증빙(원천징수·급여명세 등) 준비",
      "기존 부채와 상환 여력 점검",
    ],
  },
  {
    name: "프리랜서대출",
    icon: "💻",
    cardDesc: "소득 형태가 일정하지 않은 프리랜서를 위한 대출 정보입니다.",
    intro:
      "프리랜서대출은 소득이 일정하지 않은 분들이 확인하는 상품으로, 소득 증빙 방법과 신용 관리 상태에 따라 이용 조건이 달라집니다.",
    checks: [
      "소득 증빙 방법(세금신고·입금내역 등) 확인",
      "신용점수와 부채 관리 상태 점검",
      "불규칙 소득을 고려한 상환 계획 수립",
    ],
  },
  {
    name: "저신용자대출",
    icon: "🛡️",
    cardDesc: "신용점수가 낮은 경우 확인할 수 있는 제도권 금융 정보를 안내합니다.",
    intro:
      "신용점수가 낮은 경우에도 정책서민금융 등 제도권 금융을 우선 확인하는 것이 안전합니다. 지나치게 높은 금리나 선입금을 요구하는 불법 사금융은 반드시 피해야 합니다.",
    checks: [
      "정책서민금융·서민금융진흥원 지원 제도 우선 확인",
      "선입금·고금리를 요구하는 불법 사금융 주의",
      "신용회복·채무조정 제도 병행 검토",
    ],
  },
];

/**
 * 추가 대출 키워드 페이지.
 * 상위노출용 랜딩 페이지로, 5개 소제목 + 약 2000자 정보성 원고 + 사진 3~5장을 넣는다.
 * ⚠️ 무직자·연체자·무서류 등 고위험 키워드가 포함되므로, 원고는 승인/금리를 단정하지 않고
 * 제도권 금융·정책서민금융 우선, 불법 사금융 주의의 소비자보호 톤으로 통일한다.
 */
export const LOAN_KEYWORDS: string[] = [
  "연체자대출",
  "기대출과다자대출",
  "무직자대출",
  "비상금대출",
  "생활비대출",
  "생계자금대출",
  "100만원소액대출",
  "비대면대출",
  "개인신용대출",
  "직장인신용대출",
  "신용회복중대출",
  "영세사업자대출",
  "신규사업자대출",
  "여성직장인대출",
  "여성전문대출",
  "예비창업자대출",
  "아파트청약대출",
  "신혼부부대출",
  "월세보증금대출",
  "대학생대출",
  "청년대출",
  "간편비대면대출",
  "무서류대출",
  "본인인증대출",
  "무방문대출",
  "소액대출추천",
  "무직자비상금대출",
  "청년생활비대출",
];

const KEYWORD_SET = new Set(LOAN_KEYWORDS);

export function isKeywordPage(keyword: string) {
  return KEYWORD_SET.has(keyword);
}

const STEPS = ["정보 확인", "상품 비교", "상담 신청", "조건 안내", "진행 여부 결정"];

const DISCLAIMER =
  "본 사이트는 금융상품 정보를 비교·안내하는 플랫폼입니다. 금리·한도·승인 여부는 금융회사와 개인의 신용·소득·상환능력 등에 따라 달라지며, 특정 결과를 보장하지 않습니다. 실제 운영 시 상호·사업자정보·대출중개업 등록정보 및 법정 고지사항을 반드시 정확히 기재하세요.";

export function loanFile(name: string) {
  return `${name}.html`;
}

/** 상담 CTA — 문의(상담) 페이지 + 있는 연락 수단 */
function consultCta(manifest: SiteManifest) {
  const contact = `<a class="btn" href="/contact.html">상담 신청하기</a>`;
  const extra = ctaButtonsHtml(manifest);
  return [contact, extra].filter(Boolean).join("\n      ");
}

/** 홈: 상품 카드 그리드 + 배너 CTA + 절차 + 고지 */
export function renderHome(manifest: SiteManifest): string {
  const cards = LOAN_CATALOG.map(
    (p) => `      <a class="card" href="/${encodeURI(loanFile(p.name))}">
        <div class="icon">${p.icon}</div>
        <h3>${p.name}</h3>
        <p>${p.cardDesc}</p>
        <span class="link">자세히 보기 →</span>
      </a>`
  ).join("\n");

  const steps = STEPS.map(
    (label, i) =>
      `      <div class="step"><div class="num">${i + 1}</div><h3>${label}</h3></div>`
  ).join("\n");

  return `
<section class="section" id="products">
  <h2 class="title">다양한 대출 상품을 한눈에 비교하세요</h2>
  <p class="sub">필요한 목적에 맞는 대출 정보를 선택해 확인할 수 있습니다.</p>
  <div class="cards">
${cards}
  </div>
</section>

<section class="section alt">
  <div class="loan-banner">
    <div>
      <h2>복잡한 조건, 혼자 찾지 마세요</h2>
      <p>기본 정보를 남기면 상담을 통해 적합한 상품 탐색을 도와드립니다.</p>
    </div>
    ${consultCta(manifest)}
  </div>
</section>

<section class="section">
  <h2 class="title">간편한 진행 절차</h2>
  <div class="steps">
${steps}
  </div>
</section>

<section class="section">
  <h2 class="title">이런 대출도 함께 확인하세요</h2>
  <div class="keyword-list">
${LOAN_KEYWORDS.map(
  (kw) =>
    `    <a href="/${encodeURI(loanFile(kw))}">${kw}</a>`
).join("\n")}
  </div>
</section>

<section class="section">
  <div class="notice">${DISCLAIMER}</div>
</section>`;
}

function hash(value: string) {
  let h = 0;
  for (const ch of value) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

/** 키워드마다 다른 사진 3~5장을 고른다(같은 키워드는 항상 같은 사진). */
function pickPhotos(manifest: SiteManifest, kw: string): string[] {
  const photos = manifest.assets?.photos ?? [];
  if (!photos.length) return [];

  const count = Math.min(3 + (hash(kw) % 3), photos.length); // 3~5장
  const start = hash(kw) % photos.length;

  return Array.from(
    { length: count },
    (_, i) => photos[(start + i) % photos.length]
  );
}

function photoImg(file: string, alt: string) {
  return `  <figure class="loan-photo"><img src="/images/photos/${encodeURI(
    file
  )}" alt="${alt}" loading="lazy" width="880" height="550"></figure>`;
}

/**
 * 대출 키워드 랜딩 페이지 — 소제목 5개 + 약 2000자 정보성 원고 + 사진 3~5장.
 * 승인/금리를 단정하지 않고 제도권 금융·불법 사금융 주의 톤으로 통일.
 */
export function renderKeywordArticle(
  manifest: SiteManifest,
  kw: string
): string {
  const photos = pickPhotos(manifest, kw);
  const photo = (i: number, alt: string) =>
    photos[i] ? photoImg(photos[i], alt) : "";

  return `
<article class="article section">
  <div class="notice">본 페이지는 ${kw} 관련 일반 정보를 제공하며, 금리·한도·승인 여부는 금융회사와 개인의 신용·소득·상환능력 등에 따라 달라집니다.</div>

  <p>${kw}은(는) 자금이 급하게 필요할 때 많은 분들이 찾는 정보입니다. 다만 조건과 절차를 정확히 이해하지 못하면 불필요한 비용을 부담하거나 불법 금융 피해를 볼 수 있습니다. 아래에서 ${kw}의 기본 개념부터 신청 전 확인사항, 신청 절차, 주의사항, 상담 방법까지 단계별로 정리했으니 천천히 읽어보고 본인 상황에 맞게 판단하시기 바랍니다.</p>

  <h2>1. ${kw} 기본 개념</h2>
  <p>${kw}은(는) 개인의 신용도와 소득, 상환 능력 등을 종합적으로 검토해 이용 여부와 조건이 결정되는 금융 상품입니다. 같은 이름의 상품이라도 금융회사에 따라 금리와 한도, 상환 방식, 중도상환수수료가 크게 다를 수 있습니다. 특히 신용점수는 연체 이력, 기존 대출 건수와 금액, 카드 이용 형태 등 여러 요소로 산정되기 때문에, 같은 상품이라도 사람마다 적용되는 조건이 달라집니다. 따라서 광고에 표시된 최저 금리나 최대 한도만 보고 판단하기보다, 본인의 조건에서 실제로 적용되는 금리와 총 상환비용을 기준으로 비교하는 것이 무엇보다 중요합니다.</p>
${photo(0, `${kw} 상담 안내`)}

  <h2>2. ${kw} 신청 전 확인사항</h2>
  <p>${kw}을(를) 신청하기 전에는 먼저 본인의 소득과 기존 부채 현황을 정확히 파악해야 합니다. 매달 갚아야 하는 원리금이 소득에서 차지하는 비중, 즉 총부채원리금상환비율(DSR)이 지나치게 높으면 승인이 어렵거나 이용하더라도 상환에 큰 부담이 됩니다. 금리 유형(고정·변동)과 상환 기간, 중도상환 시 수수료 여부를 함께 확인하고, 필요 이상으로 큰 금액을 무리하게 신청하지 않는 것이 좋습니다. 여러 금융회사의 조건을 한 번에 비교해 본인에게 가장 유리한 상품을 고르는 것이 합리적입니다.</p>
${photo(1, `${kw} 신청 전 확인사항`)}

  <h2>3. ${kw} 신청 절차와 필요 서류</h2>
  <p>${kw}의 일반적인 진행 절차는 ①정보 확인 ②상품 비교 ③상담 신청 ④조건 안내 ⑤진행 여부 결정 순으로 이루어집니다. 신청 시에는 신분증과 함께 소득·재직을 증빙할 수 있는 서류(재직증명서, 소득금액증명원, 급여명세서 등)가 필요한 경우가 많습니다. 최근에는 비대면으로 서류 제출과 본인 인증을 처리할 수 있는 곳도 늘어, 방문 없이 상담과 신청이 가능한 경우도 있습니다. 다만 절차가 간편하다는 점만 앞세우면서 정작 금리와 수수료 정보를 명확히 안내하지 않는 곳은 실제 조건을 더 꼼꼼히 확인해야 합니다.</p>
${photo(2, `${kw} 신청 절차`)}

  <h2>4. ${kw} 주의사항</h2>
  <p>${kw}을(를) 알아볼 때는 반드시 제도권 금융회사(은행·저축은행·카드·캐피탈 등)인지 먼저 확인해야 합니다. ‘무조건 승인’, ‘무서류·무방문 즉시 대출’, ‘신용 조회 없이 당일 입금’ 등을 내세우거나 대출 실행 전에 수수료·보증금·선이자를 먼저 요구하는 곳은 불법 사금융일 가능성이 매우 높으므로 절대 이용하지 마세요. 소득 증빙이 어렵거나 신용점수가 낮은 경우에는 서민금융진흥원 등에서 안내하는 정책서민금융 상품과 채무조정·신용회복 제도를 먼저 확인하는 것이 안전하며, 불법 사금융 피해가 우려될 때는 금융감독원(1332)에 상담할 수 있습니다.</p>
${photo(3, `${kw} 주의사항`)}

  <h2>5. ${kw} 상담 및 이용 안내</h2>
  <p>본 페이지의 내용은 ${kw} 관련 일반 정보이며, 실제 이용 가능한 상품과 조건은 개인의 신용·소득 상황에 따라 달라집니다. 정확한 금리와 한도, 상환 조건은 해당 금융회사 또는 정식 상담 절차를 통해 반드시 직접 확인하시기 바랍니다. 아래 상담 신청을 통해 기본 정보를 남기시면 조건에 맞는 상품을 탐색하는 데 도움을 드리며, 상담 과정에서 안내받은 내용도 최종 결정 전에 스스로 다시 한번 점검하시길 권합니다.</p>
${photo(4, `${kw} 상담 안내`)}

  <div class="cta">
    <h2>${kw} 상담 신청</h2>
    <p>기본 정보를 남기면 상담을 통해 적합한 상품 탐색을 도와드립니다.</p>
    ${consultCta(manifest)}
  </div>

  <div class="notice" style="margin-top:28px">${DISCLAIMER}</div>
</article>`;
}

/** 상세: 상품별 안내(1.~란? / 2.신청 전 확인 / 3.상담) */
export function renderArticle(
  manifest: SiteManifest,
  page: SitePageMeta
): string {
  if (isKeywordPage(page.keyword)) {
    return renderKeywordArticle(manifest, page.keyword);
  }

  const product =
    LOAN_CATALOG.find((p) => p.name === page.keyword) ?? LOAN_CATALOG[0];

  const checks = product.checks
    .map((c) => `    <li>${c}</li>`)
    .join("\n");

  return `
<article class="article section">
  <div class="notice">금리와 한도는 금융회사 및 개인의 신용·소득·상환능력 등에 따라 달라질 수 있습니다.</div>

  <h2>1. ${product.name}이란?</h2>
  <p>${product.intro}</p>

  <h2>2. 신청 전 확인사항</h2>
  <ul>
${checks}
  </ul>

  <h2>3. 상담을 통해 조건 확인하기</h2>
  <p>개인별 조건에 따라 확인 가능한 상품이 다를 수 있으므로, 정확한 내용은 해당 금융회사 또는 정식 상담 절차를 통해 확인하세요.</p>

  <div class="cta">
    <h2>${product.name} 상담 신청</h2>
    <p>기본 정보를 남기면 상담을 통해 적합한 상품 탐색을 도와드립니다.</p>
    ${consultCta(manifest)}
  </div>

  <div class="notice" style="margin-top:28px">${DISCLAIMER}</div>
</article>`;
}

/** 대출 업종 전용 CSS — 네이비/블루 금융 테마 */
export const loanStyles = `
body{background:#fff;color:#14213d;font-family:Arial,'Noto Sans KR',sans-serif}

.header{background:linear-gradient(120deg,#061a3d,#0756b9);color:#fff;padding:56px 24px}
.header::before{display:none}
.header h1{font-family:inherit;font-weight:900;font-size:40px;color:#fff;text-shadow:none;letter-spacing:0}
.header h1::after{display:none}
.header .services{font-size:16px;letter-spacing:.06em;color:#bcd4ff;font-weight:700}
.header .notice{background:none;border:0;padding:0;color:#dce9ff;font-weight:400;font-size:15px}
.btn-call,.btn-kakao{border-radius:12px;font-weight:800;letter-spacing:0}
.btn-call{background:#1264f5;color:#fff;border:0}
.btn-call:hover{background:#0d55d8}
.btn-kakao{background:#fee500;color:#191600;border:0}

.nav{background:#fff;color:#071d46;border-top:0;border-bottom:1px solid #e7ecf4;box-shadow:0 2px 12px rgba(7,29,70,.05)}
.nav a{color:#14213d;font-weight:700;font-size:14px;letter-spacing:0}
.nav a:hover{color:#1264f5}
.nav-more{border:1px solid #1264f5;color:#1264f5;border-radius:8px}
.nav-more:hover{background:#1264f5;color:#fff}

.title{text-align:center;font-family:inherit;font-weight:900;font-size:32px;color:#071d46;margin:0 0 12px}
.sub{text-align:center;color:#667085;margin:0 0 36px}

.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.card{display:block;background:#fff;border:1px solid #e7ecf4;border-radius:20px;padding:28px;box-shadow:0 8px 30px rgba(20,40,80,.06);transition:transform .15s,box-shadow .15s}
.card:hover{transform:translateY(-3px);box-shadow:0 18px 44px rgba(20,40,80,.12)}
.card .icon{font-size:34px}
.card h3{font-family:inherit;font-weight:800;font-size:21px;color:#071d46;margin:10px 0 8px}
.card p{color:#667085;line-height:1.7;margin:0 0 12px}
.card .link{color:#1264f5;font-weight:800}

.loan-banner{background:linear-gradient(100deg,#0756db,#1679ff);color:#fff;border-radius:24px;padding:36px 44px;display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}
.loan-banner h2{font-family:inherit;color:#fff;font-size:26px;margin:0 0 8px;border:0}
.loan-banner h2::after{display:none}
.loan-banner p{margin:0;color:#dce9ff}
.loan-banner .btn{white-space:nowrap}

.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
.step{text-align:center;padding:24px 10px}
.step .num{width:46px;height:46px;border-radius:50%;background:#edf5ff;color:#1264f5;display:grid;place-items:center;margin:0 auto 12px;font-weight:900;font-size:18px}
.step h3{font-family:inherit;font-weight:700;font-size:16px;color:#14213d;margin:0}

.article h2{font-family:inherit;font-weight:800;color:#071d46;font-size:24px;border-bottom:0;padding-bottom:0;margin-top:36px}
.article h2::after{display:none}
.article p,.article li{line-height:1.9;color:#4b5565;font-weight:400}
.article ul{padding-left:20px}
.article ul li{margin-bottom:8px}
.loan-photo{margin:22px 0;border-radius:16px;overflow:hidden;border:1px solid #e7ecf4;box-shadow:0 10px 30px rgba(20,40,80,.08)}
.loan-photo img{width:100%;height:auto;display:block}

.keyword-list{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.keyword-list a{display:inline-block;padding:10px 16px;border:1px solid #e7ecf4;border-radius:999px;background:#fff;color:#14213d;font-weight:700;font-size:14px;transition:all .15s}
.keyword-list a:hover{border-color:#1264f5;color:#1264f5;background:#f5f9ff}

.notice{background:#fff8e8;border:1px solid #ffe0a1;padding:18px;border-radius:12px;color:#6d5315;font-size:14px;line-height:1.7}

.cta{background:linear-gradient(100deg,#0756db,#1679ff);border-radius:24px;padding:40px;text-align:center;margin-top:32px}
.cta h2{font-family:inherit;color:#fff;border:0}
.cta h2::after{display:none}
.cta p{color:#dce9ff}
.btn{display:inline-block;background:#fff;color:#0756db;border-radius:12px;padding:15px 30px;font-weight:800;margin:14px 6px 0}
.btn:hover{background:#eef4ff}
button.btn{border:0;cursor:pointer}

.footer{background:#061a3d;color:#b9c7df}

@media(max-width:900px){.cards{grid-template-columns:repeat(2,1fr)}.steps{grid-template-columns:repeat(2,1fr)}}
@media(max-width:800px){.header h1{font-size:32px}.loan-banner{display:block}.loan-banner .btn{margin-top:16px}}
@media(max-width:600px){.cards{grid-template-columns:1fr}}
`;
