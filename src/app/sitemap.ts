import { languages } from "@/i18n/config";
import { MetadataRoute } from "next";
import { getServers } from "@/lib/servers";
import type { DocMeta } from "@/lib/docs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mcp.programnotes.cn/";

async function fetchDocs(locale: string): Promise<DocMeta[]> {
  try {
    const response = await fetch(`${baseUrl}/api/docs/${locale}`);
    if (!response.ok) {
      throw new Error("Failed to fetch docs");
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch docs for locale ${locale}:`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 获取所有语言的服务器数据
  const serversByLocale = await Promise.all(
    Object.keys(languages).map(async (lang) => {
      const servers = await getServers(lang);
      return { locale: lang, servers };
    })
  );

  // 获取所有语言的文档数据
  const docsByLocale = await Promise.all(
    Object.keys(languages).map(async (lang) => {
      const docs = await fetchDocs(lang);
      return { locale: lang, docs };
    })
  );

  // 生成首页 URLs
  const homeUrls = Object.keys(languages).map((lang) => ({
    url: lang === "en" ? baseUrl : `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // 生成服务器列表页 URLs
  const serverListUrls = Object.keys(languages).map((lang) => ({
    url: lang === "en" ? `${baseUrl}/servers` : `${baseUrl}/${lang}/servers`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // 生成服务器详情页 URLs
  const serverDetailUrls = serversByLocale.flatMap(({ locale, servers }) =>
    servers.map((server) => ({
      url:
        locale === "en"
          ? `${baseUrl}/servers/${server.id}`
          : `${baseUrl}/${locale}/servers/${server.id}`,
      lastModified: new Date(server.createTime),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // 生成文档页面 URLs
  const docUrls = docsByLocale.flatMap(({ locale, docs }) =>
    docs.map((doc) => ({
      url:
        locale === "en"
          ? `${baseUrl}/docs/${doc.slug}`
          : `${baseUrl}/${locale}/docs/${doc.slug}`,
      lastModified: doc.lastModified ? new Date(doc.lastModified) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // 生成其他静态页面 URLs
  const staticUrls = Object.keys(languages).flatMap((lang) => [
    {
      url: lang === "en" ? `${baseUrl}/docs` : `${baseUrl}/${lang}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: lang === "en" ? `${baseUrl}/specification` : `${baseUrl}/${lang}/specification`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  return [
    ...homeUrls,
    ...serverListUrls,
    ...serverDetailUrls,
    ...docUrls,
    ...staticUrls,
  ];
}
