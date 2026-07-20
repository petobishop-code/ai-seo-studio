import {
  LOAN_CATALOG,
  LOAN_KEYWORDS,
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

  // 상품 카탈로그 + 추가 키워드 페이지. 각각 상세 페이지가 된다(홈 index.html 이 목록).
  buildPages(manifest: SiteManifest, _keyword: string): SitePageMeta[] {
    const products = LOAN_CATALOG.map((product) => ({
      file: loanFile(product.name),
      keyword: product.name,
      region: "전국",
      service: product.name,
      title: `${product.name} 정보·상담 안내 | ${manifest.brandName}`,
      description: `${product.name} ${product.cardDesc} 금리·한도·상환조건을 비교하고 상담을 신청하세요.`,
    }));

    const keywords = LOAN_KEYWORDS.map((kw) => ({
      file: loanFile(kw),
      keyword: kw,
      region: "전국",
      service: "대출",
      title: `${kw} 조건·신청 안내 | ${manifest.brandName}`,
      description: `${kw} 기본 개념부터 신청 절차, 주의사항까지. 제도권 금융 정보와 상담 안내를 확인하세요.`,
    }));

    return [...products, ...keywords];
  },

  renderArticle,
  renderHome,

  homeDescription(manifest) {
    return `${manifest.brandName} — 신용대출·주택담보대출·전세자금대출·사업자대출 등 다양한 금융상품 정보를 비교하고 상담을 신청하세요.`;
  },
};
