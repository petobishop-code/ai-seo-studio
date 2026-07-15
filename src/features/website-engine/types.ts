/**
 * 사이트에 쓰이는 이미지 목록.
 *
 * 배너에는 전화번호가 이미지로 박혀 있어 브랜드 전용만 사용한다(업종 폴백 금지).
 * 다른 브랜드 배너를 쓰면 남의 전화번호가 노출된다.
 * 작업사진은 번호가 없으므로 브랜드 전용이 없으면 업종 공용으로 폴백한다.
 */
export type SiteAssets = {
  /** 배너 파일명 목록. 예: ["banner-01.webp", ...] */
  banners: string[];
  /** site-assets 기준 배너 원본 경로. 예: "brands/surinam/banner" */
  bannerSource: string;
  /** 작업사진 파일명 목록 */
  gallery: string[];
  /** site-assets 기준 작업사진 원본 경로. 예: "industries/drain/gallery" */
  gallerySource: string;
  /**
   * 저장소 루트에 그대로 올릴 파일들.
   * 네이버·구글 서치콘솔 소유권 확인 파일처럼 경로가 루트로 고정된 파일.
   */
  verifyFiles: string[];
  /** site-assets 기준 확인파일 경로. 예: "brands/surinam/verify" */
  verifySource: string;
};

export const EMPTY_ASSETS: SiteAssets = {
  banners: [],
  bannerSource: "",
  gallery: [],
  gallerySource: "",
  verifyFiles: [],
  verifySource: "",
};

export type WebsiteInput = {
  mainKeyword: string;
  industry?: string;
  brandName?: string;
  brandSlug?: string;
  phone?: string;
  /** 카카오톡 상담 ID. 브랜드마다 다르므로 없으면 카톡 버튼을 숨긴다. */
  kakaoId?: string;
  siteUrl?: string;
  assets?: SiteAssets;
};

export type SiteFile = {
  name: string;
  content: string;
};

/** 브랜드 저장소에 누적되는 키워드 페이지 1개의 메타데이터 */
export type SitePageMeta = {
  /** 한글 파일명. 예: "의창구싱크대막힘.html" */
  file: string;
  /** 예: "의창구싱크대막힘" */
  keyword: string;
  /** 예: "의창구" */
  region: string;
  /** 예: "싱크대막힘" */
  service: string;
  title: string;
  description: string;
  /**
   * 외부 신청/예약 링크 (예: reply-alba). 있으면 이 페이지는 세부 랜딩 페이지로,
   * CTA가 이 링크로 연결된다. 없으면 일반 콘텐츠 페이지.
   */
  applyLink?: string;
};

/**
 * 브랜드 저장소에 site-manifest.json 으로 커밋되는 진실의 원천.
 * 어떤 키워드 페이지가 쌓여 있는지를 기록해 index/sitemap 재생성에 사용한다.
 */
export type SiteManifest = {
  brandName: string;
  brandSlug: string;
  phone: string;
  /** 카카오톡 상담 ID. 없으면 카톡 버튼을 렌더링하지 않는다. */
  kakaoId: string;
  industry: string;
  siteUrl: string;
  pages: SitePageMeta[];
  /** 이 사이트에 배포된 이미지 목록. gallery.html 재생성에 필요하다. */
  assets: SiteAssets;
};

export type WebsiteResult = {
  /** 이 키워드가 새로 추가하는 페이지들 (한글 파일명) */
  keywordFiles: SiteFile[];
  /** 이 키워드가 추가하는 페이지 메타 */
  pageMeta: SitePageMeta[];
  /** 단독 사이트로 볼 수 있는 전체 파일 (키워드 페이지 + index/contact/robots/sitemap) */
  files: SiteFile[];
  /** 미리보기용 대표 페이지 HTML */
  indexHtml: string;
  sitemap: string;
  robots: string;
  /** 파일명 목록 (UI 표시용) */
  pages: string[];
  score: number;
  variant: string;
};

export type WebsiteInfo = {
  keyword: string;
  region: string;
  service: string;
  industry: string;
  brandName: string;
  brandSlug: string;
  phone: string;
  kakaoId: string;
  siteUrl: string;
};
