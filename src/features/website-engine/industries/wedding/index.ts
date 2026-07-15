import {
  renderApplyHero,
  renderArticle,
  renderCatalog,
  weddingStyles,
} from "./wedding-content";
import {
  WEDDING_CATALOG,
  fairCity,
  fairFile,
} from "./wedding-events";
import { heroSvg } from "./wedding-graphics";
import type { IndustryModule } from "../types";
import type { SiteManifest, SitePageMeta } from "../../types";

const SERVICE = "웨딩박람회";

/** 키워드에서 지역/장소를 뽑는다. 예: "부산웨딩박람회" → "부산" */
function parseRegion(keyword: string) {
  return keyword.trim().replace(SERVICE, "").replace("웨딩페어", "").trim() || "전국";
}

function homeBody(manifest: SiteManifest) {
  return `
<section class="section">
  <div class="hero-visual">${heroSvg()}</div>
</section>
${renderApplyHero(`${manifest.brandName} 무료 신청`)}
<section class="section">
  <div class="grid">
    <div class="card"><h3>박람회 한곳에</h3><p>부산·경남 지역 웨딩박람회를 한 페이지에 모았습니다.</p></div>
    <div class="card"><h3>박람회별 안내</h3><p>원하는 박람회를 누르면 일정·혜택과 무료 신청 안내를 볼 수 있습니다.</p></div>
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

  // 카탈로그의 박람회마다 세부 페이지를 만든다.
  // 각 페이지가 그 박람회명 키워드로 검색에 노출되고, CTA는 해당 신청 링크로 연결된다.
  // 카탈로그가 고정이라 키워드는 트리거로만 쓰인다(홈 index.html 이 전체 목록 역할).
  buildPages(manifest: SiteManifest, _keyword: string): SitePageMeta[] {
    return WEDDING_CATALOG.flatMap((group) =>
      group.events.map((event) => ({
        file: fairFile(event.name),
        keyword: event.name,
        region: fairCity(event.name),
        service: SERVICE,
        title: `${event.name} 무료신청·일정 안내 | ${manifest.brandName}`,
        description: `${event.name} 무료초대권 신청과 참여 혜택 안내. 사전 신청 시 사은품 증정, 스드메·예식홀 특전 비교.`,
        applyLink: event.link,
      }))
    );
  },

  renderArticle,
  renderHome: homeBody,

  homeDescription(manifest) {
    return `${manifest.brandName} — 부산·경남 웨딩박람회를 한곳에 모았습니다. 무료초대권 신청과 프로모션 특전 안내.`;
  },
};
