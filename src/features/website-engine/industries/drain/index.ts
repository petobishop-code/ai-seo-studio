import { renderArticle } from "./drain-content";
import { groupByRegion, pageHref } from "../../layout";
import type { IndustryModule } from "../types";
import type { SiteManifest, SitePageMeta } from "../../types";

/** 이 업종이 지역마다 만들어내는 서비스 페이지들 */
const SERVICES = ["하수구막힘", "싱크대막힘", "변기막힘"];

/** 키워드에 섞여 들어올 수 있는 서비스 표현들. 지역만 남기려고 떼어낸다. */
const SERVICE_WORDS = [...SERVICES, "정화조막힘"];

function parseRegion(keyword: string) {
  let region = keyword.trim();

  for (const word of SERVICE_WORDS) {
    region = region.replace(word, "");
  }

  return region.trim() || "전국";
}

function homeBody(manifest: SiteManifest) {
  const groups = groupByRegion(manifest.pages);

  const regionBlocks = [...groups.entries()]
    .map(([region, pages]) => {
      const cards = pages
        .map(
          (page) => `      <a class="link-card" href="${pageHref(page.file)}">
        ${page.keyword}
        <span>${page.description}</span>
      </a>`
        )
        .join("\n");

      return `  <div class="region-block" id="${encodeURIComponent(region)}">
    <h3>${region} 지역 서비스</h3>
    <div class="link-grid">
${cards}
    </div>
  </div>`;
    })
    .join("\n");

  const regionNames = [...groups.keys()].join(", ");

  return `
<section class="section">
  <div class="grid">
    <div class="card"><h3>배관 막힘 점검</h3><p>배수 불량과 역류 원인을 현장에서 확인합니다.</p></div>
    <div class="card"><h3>악취·역류 해결</h3><p>반복되는 냄새와 역류의 원인을 함께 점검합니다.</p></div>
    <div class="card"><h3>전문 장비 작업</h3><p>배관내시경과 고압세척으로 원인 층까지 제거합니다.</p></div>
  </div>
</section>

<section class="section">
  <h2 style="font-size:30px;margin:0 0 24px">서비스 지역 안내</h2>
  <p style="color:#475569;margin:0 0 28px">${
    regionNames || "지역"
  } 지역의 하수구·싱크대·변기 막힘 페이지를 확인하세요.</p>
${regionBlocks}
</section>

<section class="section">
  <div class="cta">
    <h2>${manifest.brandName} 상담문의</h2>
    <p>지금 바로 전화 상담하세요.</p>
    <a class="btn" href="tel:${manifest.phone}">전화 ${manifest.phone}</a>
  </div>
</section>`;
}

export const drainIndustry: IndustryModule = {
  key: "drain",
  label: "하수구/배관",
  tagline: "하수구막힘 · 싱크대막힘 · 변기막힘",
  notice: "전국 출동 가능 / 24시간 연중무휴",

  parseRegion,

  buildPages(manifest: SiteManifest, keyword: string): SitePageMeta[] {
    const region = parseRegion(keyword);

    return SERVICES.map((service) => {
      const pageKeyword = `${region}${service}`;

      return {
        file: `${pageKeyword}.html`,
        keyword: pageKeyword,
        region,
        service,
        title: `${pageKeyword} | ${manifest.brandName}`,
        description: `${pageKeyword} 원인 점검과 현장 작업 안내. ${manifest.brandName} 상담 ${manifest.phone}`,
      };
    });
  },

  renderArticle,
  renderHome: homeBody,

  homeDescription(manifest) {
    const regions = [...groupByRegion(manifest.pages).keys()].join(" ");
    return `${manifest.brandName} ${regions} 하수구·싱크대·변기 막힘 상담 ${manifest.phone}`;
  },
};
