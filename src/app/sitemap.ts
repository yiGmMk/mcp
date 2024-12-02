import { languages } from "@/i18n/config";
import { MetadataRoute } from "next";

// async function fetchDocs(locale: string): Promise<DocMeta[]> {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_SITE_URL}/api/docs/${locale}`
//   );
//   if (!response.ok) {
//     throw new Error("Failed to fetch docs");
//   }
//   return (await response.json()) as DocMeta[];
// }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.claudemcp.com";

  // 生成首页 URL (包含所有语言版本)
  const homeUrls = Object.keys(languages).map((lang) => ({
    url: lang === "en" ? baseUrl : `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // 生成文档 URL
  const docsUrls: any[] = [];
  for (const lang of Object.keys(languages)) {
    const docs = ["introduction", "architecture", "protocol", "quickstart"];
    docs.forEach((doc) => {
      docsUrls.push({
        url: lang === "en" ? `${baseUrl}/docs/${doc}` : `${baseUrl}/${lang}/docs/${doc}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      });
    });
  }

  // 静态页面 URL
  const staticUrls = [
    ...Object.keys(languages).map((lang) => ({
      url:
        lang === "en"
          ? `${baseUrl}/specification`
          : `${baseUrl}/${lang}/specification`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    })),
    ...Object.keys(languages).map((lang) => ({
      url: lang === "en" ? `${baseUrl}/docs` : `${baseUrl}/${lang}/docs`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    })),
    ...Object.keys(languages).map((lang) => ({
      url: lang === "en" ? `${baseUrl}/blog` : `${baseUrl}/${lang}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    })),
  ];

  return [...homeUrls, ...staticUrls, ...docsUrls];
}
