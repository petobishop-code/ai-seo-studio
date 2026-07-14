import type { SiteManifest, SitePageMeta } from "../types";

/**
 * 업종 하나가 자기 것을 전부 책임진다.
 *
 * 공용 레이어(layout / brand-site / sitemap / publisher)는 업종을 몰라야 한다.
 * 하수구 문구가 공용 코드에 박히면 웨딩 사이트 헤더에 "하수구막힘"이 뜨는 식의 사고가 난다.
 */
export type IndustryModule = {
  /** 내부 식별자. site-assets/industries/{key} 폴더명으로도 쓰인다. */
  key: string;

  /** 프로젝트 위저드의 업종 값과 정확히 일치해야 한다. 예: "하수구/배관" */
  label: string;

  /** 헤더의 서비스 라인. 예: "하수구막힘 · 싱크대막힘 · 변기막힘" */
  tagline: string;

  /** 헤더의 보조 문구. 예: "전국 출동 가능 / 24시간 연중무휴" */
  notice: string;

  /** 이 업종에만 필요한 CSS. 공용 style() 뒤에 붙는다. */
  styles?: string;

  /** 키워드에서 지역(또는 장소)을 뽑는다. 예: "의창구싱크대막힘" → "의창구" */
  parseRegion(keyword: string): string;

  /** 이 키워드가 만들어낼 페이지들. 하수구는 3개(서비스별), 웨딩은 1개. */
  buildPages(manifest: SiteManifest, keyword: string): SitePageMeta[];

  /** 키워드 페이지 본문 */
  renderArticle(manifest: SiteManifest, page: SitePageMeta): string;

  /** 브랜드 홈 본문 */
  renderHome(manifest: SiteManifest): string;

  /** 브랜드 홈 meta description */
  homeDescription(manifest: SiteManifest): string;
};
