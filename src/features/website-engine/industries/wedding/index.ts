import {
  renderApplyHero,
  renderArticle,
  renderCatalog,
  weddingStyles,
} from "./wedding-content";
import type { IndustryModule } from "../types";
import type { SiteManifest, SitePageMeta } from "../../types";

const SERVICE = "웨딩박람회";

/** 키워드에서 지역/장소를 뽑는다. 예: "부산웨딩박람회" → "부산" */
function parseRegion(keyword: string) {
  return keyword.trim().replace(SERVICE, "").replace("웨딩페어", "").trim() || "전국";
}

function homeBody(manifest: SiteManifest) {
  return `
${renderApplyHero(`${manifest.brandName} 무료 신청`)}
<section class="section">
  <div class="grid">
    <div class="card"><h3>박람회 한곳에</h3><p>부산·경남 지역 웨딩박람회를 한 페이지에 모았습니다.</p></div>
    <div class="card"><h3>무료 신청</h3><p>원하는 박람회 버튼을 누르면 바로 신청 페이지로 연결됩니다.</p></div>
    <div class="card"><h3>사은품·특전</h3><p>사전 신청자에게 무료초대권과 사은품이 제공됩니다.</p></div>
  </div>
</section>
${renderCatalog()}`;
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
        description: `${pageKeyword} 참여 업체와 프로모션 특전을 한곳에. 무료초대권 신청은 각 박람회 신청 버튼에서.`,
      },
    ];
  },

  renderArticle,
  renderHome: homeBody,

  homeDescription(manifest) {
    return `${manifest.brandName} — 부산·경남 웨딩박람회를 한곳에 모았습니다. 무료초대권 신청과 프로모션 특전 안내.`;
  },
};
