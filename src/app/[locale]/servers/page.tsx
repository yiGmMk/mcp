import { SearchBar } from '@/components/SearchBar';
import { ServerList } from '@/components/ServerList';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';


type PageProps = {  
  params: Promise<{ locale: string }>;
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations();

  return {
    title: `${t('Servers.title')} | ${t('Index.meta.title')}`,
    description: `${t('Servers.description')} | ${t('Index.meta.title')}`,
    icons: {
      icon: "/logo.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: `${t('Servers.title')} | ${t('Index.meta.og.title')}`,
      description: `${t('Servers.description')} | ${t('Index.meta.og.title')}`,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('Servers.title')} | ${t('Index.meta.twitter.title')}`,
      description: `${t('Servers.description')} | ${t('Index.meta.twitter.title')}`,
      images: ['/twitter-image.png'],
    },
    alternates: {
        canonical: locale === 'en' ? `https://www.claudemcp.com/servers` : `https://www.claudemcp.com/${locale}/servers`,
    },
    manifest: "/site.webmanifest",
  };
}

export default async function ServersPage() {
  const t  = await getTranslations('Servers');
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        {t('title')}
      </h1>
      
      <div className="space-y-6 max-w-7xl mx-auto">
        <SearchBar />
        <ServerList />
      </div>
    </div>
  );
} 