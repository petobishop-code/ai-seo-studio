import { renderArticle, weddingStyles } from "./wedding-content";
import { pageHref } from "../../layout";
import type { IndustryModule } from "../types";
import type { SiteManifest, SitePageMeta } from "../../types";

const SERVICE = "웨딩박람회";

/** 키워드에서 지역/장소를 뽑는다. 예: "벡스코웨딩박람회" → "벡스코" */
function parseRegion(keyword: string) {
  return keyword.trim().replace(SERVICE, "").replace("웨딩페어", "").trim() || "전국";
}

function homeBody(manifest: SiteManifest) {
  const cards = manifest.pages
    .map(
      (page) => `      <a class="link-card" href="${pageHref(page.file)}">
        ${page.keyword}
        <span>${page.description}</span>
      </a>`
    )
    .join("\n");

  const regions = manifest.pages.map((page) => page.region).join(", ");

  return `
<section class="section">
  <div class="grid">
    <div class="card"><h3>박람회 일정 한눈에</h3><p>지역별 웨딩박람회 일정과 참여 업체를 정리했습니다.</p></div>
    <div class="card"><h3>무료초대권</h3><p>사전 신청하면 상담 예약과 사은품을 함께 받습니다.</p></div>
    <div class="card"><h3>혜택 비교</h3><p>혼수 선불카드, 페이백 등 특전을 한자리에서 비교하세요.</p></div>
  </div>
</section>

<section class="section">
  <h2 style="font-size:30px;margin:0 0 24px">지역별 웨딩박람회</h2>
  <p style="color:#475569;margin:0 0 28px">${
    regions || "지역"
  } 웨딩박람회 일정을 확인하세요.</p>
  <div class="link-grid">
${cards}
  </div>
</section>

<section class="section">
  <div class="cta">
    <h2>💌 ${manifest.brandName} 무료초대권 신청</h2>
    <p>사전 신청하시면 상담 예약과 사은품을 안내해드립니다.</p>
    <a class="btn" href="tel:${manifest.phone}">전화 신청 ${manifest.phone}</a>
  </div>
</section>`;
}

export const weddingIndustry: IndustryModule = {
  key: "wedding",
  label: "웨딩",
  tagline: "웨딩박람회 일정 · 무료초대권 · 혼수 혜택",
  notice: "사전 신청 시 무료초대권 + 사은품 증정",
  styles: weddingStyles,

  parseRegion,

  // 하수구와 달리 키워드 1개 = 페이지 1개(장소별)다.
  buildPages(manifest: SiteManifest, keyword: string): SitePageMeta[] {
    const region = parseRegion(keyword);
    const pageKeyword = `${region}${SERVICE}`;

    return [
      {
        file: `${pageKeyword}.html`,
        keyword: pageKeyword,
        region,
        service: SERVICE,
        title: `${pageKeyword} 일정 | ${manifest.brandName}`,
        description: `${pageKeyword} 일정과 참여 업체, 프로모션 특전 안내. 무료초대권 신청 ${manifest.phone}`,
      },
    ];
  },

  renderArticle,
  renderHome: homeBody,

  homeDescription(manifest) {
    const regions = manifest.pages.map((page) => page.region).join(" ");
    return `${manifest.brandName} ${regions} 웨딩박람회 일정과 무료초대권 안내. ${manifest.phone}`;
  },
};
