import type { SeoData, SeoInput, SeoPage } from "./types";

function normalizeSiteUrl(siteUrl?: string) {
  const resolvedUrl = siteUrl || "http://localhost:3000";
  return resolvedUrl.replace(/\/+$/, "");
}

function pageUrl(siteUrl: string, fileName: string) {
  return fileName === "index.html"
    ? `${siteUrl}/`
    : `${siteUrl}/${encodeURI(fileName)}`;
}

export function createSeoData(
  input: SeoInput,
  pageDefinitions: Array<{
    fileName: string;
    title: string;
    description: string;
  }>
): SeoData {
  const siteUrl = normalizeSiteUrl(input.siteUrl);

  const pages: SeoPage[] = pageDefinitions.map((page) => ({
    ...page,
    canonicalUrl: pageUrl(siteUrl, page.fileName),
  }));

  const home = pages.find((page) => page.fileName === "index.html");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.canonicalUrl}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${page.fileName === "index.html" ? "weekly" : "monthly"}</changefreq>
    <priority>${page.fileName === "index.html" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  const organizationSchema = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: input.brandName,
      url: siteUrl,
      telephone: input.phone,
      areaServed: input.region,
      knowsAbout: [input.industry, input.service, input.siteName],
    },
    null,
    2
  );

  return {
    siteUrl,
    homeTitle: home?.title ?? input.siteName,
    homeDescription:
      home?.description ??
      `${input.siteName} ?꾨Ц ${input.brandName}. ?곷떞 ${input.phone}`,
    pages,
    robots: `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`,
    sitemap,
    organizationSchema,
  };
}

