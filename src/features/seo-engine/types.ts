export type SeoInput = {
  siteName: string;
  siteUrl: string;
  brandName: string;
  phone: string;
  industry: string;
  region: string;
  service: string;
};

export type SeoPage = {
  fileName: string;
  title: string;
  description: string;
  canonicalUrl: string;
};

export type SeoData = {
  siteUrl: string;
  homeTitle: string;
  homeDescription: string;
  pages: SeoPage[];
  robots: string;
  sitemap: string;
  organizationSchema: string;
};
