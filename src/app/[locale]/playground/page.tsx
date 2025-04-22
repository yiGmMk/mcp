import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { locales } from '@/i18n/config';
import { IframeFullscreen } from '@/components/iframe-fullscreen';

// 设置静态生成和缓存
export const revalidate = 3600; // 每小时重新验证

type PageProps = {
  params: Promise<{ locale: string }>;
}

// 预生成所有可能的路径
export async function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('Tools');
  const tIndex = await getTranslations('Index');

  const title = `${t('playground.title')} - ${tIndex('meta.title')}`;
  let description = `${t('playground.description')} - ${tIndex('meta.description')}`;
  if (description.length > 160) {
    description = description.slice(0, 160);
  }

  return {
    title: title,
    description: description,
    icons: {
      icon: "/logo.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      url: locale === 'en' ? `https://mcp.programnotes.cn/playground` : `https://mcp.programnotes.cn/${locale}/playground`,
      title: title,
      description: description,
      images: ['/og.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/og.png'],
    },
    alternates: {
      canonical: locale === 'en' ? `https://mcp.programnotes.cn/playground` : `https://mcp.programnotes.cn/${locale}/playground`,
    },
    manifest: "/site.webmanifest",
  };
}

export default async function PlaygroundPage() {
  const t = await getTranslations('Tools');

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-grow flex">
        <IframeFullscreen
          src="https://modelscope-mcp-playground.ms.show/"
          title={t('playground.title')}
        />
      </div>
    </main>
  );
}
