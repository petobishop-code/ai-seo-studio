import {
  LOAN_CATALOG,
  loanFile,
  loanStyles,
  renderArticle,
  renderHome,
} from "./loan-content";
import type { IndustryModule } from "../types";
import type { SiteManifest, SitePageMeta } from "../../types";

export const loanIndustry: IndustryModule = {
  key: "loan",
  label: "대출",
  tagline: "신용대출 · 주택담보대출 · 전세자금대출 · 사업자대출",
  notice: "다양한 금융상품을 한곳에서 비교하고 상담하세요",
  styles: loanStyles,

  // 대출은 지역이 아니라 상품 단위다. 키워드는 트리거로만 쓰인다.
  parseRegion(keyword: string) {
    return keyword.trim() || "전국";
  },

  // 고정 카탈로그의 대출 상품마다 상세 페이지를 만든다(홈 index.html 이 전체 목록).
  buildPages(manifest: SiteManifest, _keyword: string): SitePageMeta[] {
    return LOAN_CATALOG.map((product) => ({
      file: loanFile(product.name),
      keyword: product.name,
      region: "전국",
      service: product.name,
      title: `${product.name} 정보·상담 안내 | ${manifest.brandName}`,
      description: `${product.name} ${product.cardDesc} 금리·한도·상환조건을 비교하고 상담을 신청하세요.`,
    }));
  },

  renderArticle,
  renderHome,

  homeDescription(manifest) {
    return `${manifest.brandName} — 신용대출·주택담보대출·전세자금대출·사업자대출 등 다양한 금융상품 정보를 비교하고 상담을 신청하세요.`;
  },
};
