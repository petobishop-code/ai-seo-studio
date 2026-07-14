export interface Project {
  id: string;
  name: string;
  domain: string;
  repository: string;
  mainKeyword: string;
  industry: string;
  brandName: string;
  brandSlug: string;
  phone: string;
  /** 카카오톡 상담 ID. 비어 있으면 사이트에 카톡 버튼을 표시하지 않는다. */
  kakaoId: string;
  createdAt: string;
}
