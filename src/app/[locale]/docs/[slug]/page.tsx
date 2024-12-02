import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { DocContent } from '@/components/docs/content';
import { DocSidebar } from '@/components/docs/sidebar';
import { locales } from '@/i18n/config';
import type { DocMeta } from '@/lib/docs';
import { DocNavigation } from '@/components/docs/navigation'; // Add this line


// 每小时重新生成页面
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
}

async function fetchDocs(locale: string): Promise<DocMeta[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/docs/${locale}`);
  if (!response.ok) {
    throw new Error('Failed to fetch docs');
  }
  return await response.json() as DocMeta[];
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  locales.forEach(async (locale) => {
    const docs = await fetchDocs(locale);
    docs.forEach((doc: DocMeta) => {
      params.push({ locale, slug: doc.title });
    });
  });
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations('Docs');
  
  return {
    title: `${t('meta.title')} - ${t(`nav.items.${slug}`)}`,
    description: t('meta.description'),
    openGraph: {
      title: `${t('meta.og.title')} - ${t(`nav.items.${slug}`)}`,
      description: t('meta.og.description'),
    },
    alternates: {
      canonical: locale === 'en' ? `https://www.claudemcp.com/docs/${slug}` : `https://www.claudemcp.com/${locale}/docs/${slug}`,
    },  
  };
}

export default async function DocPage({ params }: PageProps) {
  const { locale, slug } = await params;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* 顶部装饰 */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/20 dark:from-blue-950/20" />
      
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏 */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <DocSidebar />
              </div>
            </div>

            {/* 主要内容 */}
            <div className="flex-1 min-w-0">
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <DocContent />
              </div>
              
              {/* 文档导航 */}
              <DocNavigation locale={locale} slug={slug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 