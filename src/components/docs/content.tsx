'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { type DocContent } from '@/lib/docs';
import { Markdown } from '@/components/ui/markdown';

const fetcher = async (url: string) => {
  const res = await fetch(url + '?content=true');  // 添加 content 参数
  if (!res.ok) {
    const error = new Error('Failed to fetch document');
    error.message = await res.text();
    throw error;
  }
  return res.json();
};

export function DocContent() {
  const locale = useLocale();
  const pathname = usePathname();
  const slug = pathname.split('/').pop() || 'introduction';

  const { data, error, isLoading } = useSWR<DocContent>(
    `/api/docs/${locale}/${slug}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Doc loading error:', error);
    return (
      <div className="text-red-500 dark:text-red-400">
        <h1 className="text-2xl font-bold mb-4">Error Loading Document</h1>
        <p>Sorry, we could not load the document. Please try again later.</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!data || !data.content) {
    return (
      <div className="text-yellow-500 dark:text-yellow-400">
        <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
        <p>The requested document could not be found.</p>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pb-16"
    >
      <Markdown content={data.content} />
    </motion.article>
  );
}