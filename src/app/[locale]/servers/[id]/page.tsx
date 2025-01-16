import { ServerDetails } from '@/components/ServerDetails';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

// 每小时重新生成页面
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
}

async function fetchServer(locale: string, id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/servers/${locale}/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch server:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations('Servers');
  const server = await fetchServer(locale, id);

  return {
    title: `${server?.name} | ${t('title')}`,
    description: `${server?.digest} | ${t('title')}`,
    icons: {
      icon: "/logo.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: `${server?.name} | ${t('title')}`,
      description: `${server?.digest} | ${t('title')}`,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${server?.name} | ${t('title')}`,
      description: `${server?.digest} | ${t('title')}`,
      images: ['/twitter-image.png'],
    },
    alternates: {
      canonical: locale === 'en' ? `https://mcp.programnotes.cn/servers/${id}` : `https://mcp.programnotes.cn/${locale}/servers/${id}`,
    },
    manifest: "/site.webmanifest",
  };
}

export default async function ServerDetailPage({
  params }: PageProps) {

  const { locale, id } = await params;

  const server = await fetchServer(locale, id);

  return (
    <div className="container mx-auto py-8">
      <ServerDetails server={server} />
    </div>
  );
} 