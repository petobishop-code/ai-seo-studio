export type WebsiteInput = {
  mainKeyword: string;
  industry?: string;
  brandName?: string;
  phone?: string;
  siteUrl?: string;
};

export type SiteFile = {
  name: string;
  content: string;
};

export type WebsiteResult = {
  indexHtml: string;
  sitemap: string;
  robots: string;
  pages: string[];
  files: SiteFile[];
  score: number;
  variant: string;
};

export type WebsiteInfo = {
  keyword: string;
  region: string;
  service: string;
  industry: string;
  brandName: string;
  phone: string;
  siteUrl?: string;
};

