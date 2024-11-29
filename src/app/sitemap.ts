import { languages } from "@/i18n/config";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.claudemcp.com";

  // 生成首页 URL (包含所有语言版本)
  const homeUrls = Object.keys(languages).map((lang) => ({
    url: lang === "en" ? baseUrl : `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // 静态页面 URL
  const staticUrls = [
    ...Object.keys(languages).map((lang) => ({
      url: lang === "en" ? `${baseUrl}/specification` : `${baseUrl}/${lang}/specification`,
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
    }))
  ];

  // 合并所有 URL
  return [...homeUrls, ...staticUrls];
} 