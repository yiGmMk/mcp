import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';
import { OverviewSection } from '@/components/home/overview-section';
import { ProtocolSection } from '@/components/home/protocol-section';
import { FeaturesSection } from '@/components/home/features-section';
import { IntegrationSection } from '@/components/home/integration-section';
import { GlobalSection } from '@/components/home/global-section';

type PageProps = {  
    params: Promise<{ locale: string }>;
  }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations('Index');
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.og.title'),
      description: t('meta.og.description'),
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.twitter.title'),
      description: t('meta.twitter.description'),
      images: ['/twitter-image.png'],
    },
    alternates: {
        canonical: `https://www.claudemcp.com/${locale}`,
    },
  };
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col antialiased">
      <HeroSection />
      <OverviewSection />
      <ProtocolSection />
      {/* <FeaturesSection /> */}
      <IntegrationSection />
      <GlobalSection />
    </main>
  );
} 