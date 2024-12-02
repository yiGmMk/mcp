'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { type DocMeta } from '@/lib/docs';

export function DocSidebar() {
  const t = useTranslations('Docs');
  const pathname = usePathname();
  const currentSlug = pathname.split('/').pop() || 'introduction';
  const [docs, setDocs] = useState<Record<string, DocMeta[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // 从路径中提取真实的语言环境
        // 例如 /en/docs/introduction -> en
        // 或者 /docs/introduction -> en (默认)
        // 从路径中提取语言环境
        // 例如: /en/docs/introduction -> en
        // 或者: /zh/docs/introduction -> zh
        // 或者: /docs/introduction -> en (默认)
        const pathParts = pathname.split('/').filter(Boolean);
        let locale = 'en'; // 默认使用英文
        // 检查第一个路径部分是否是有效的语言代码
        if (pathParts.length > 0 && pathParts[0].length === 2) {
          locale = pathParts[0];
        }
        const response = await fetch(`/api/docs/${locale}`);
        const allDocs = await response.json() as DocMeta[];
        // 按章节分组
        const grouped = allDocs.reduce((acc, doc) => {
          const section = doc.section;
          if (!acc[section]) {
            acc[section] = [];
          }
          acc[section].push(doc);
          return acc;
        }, {} as Record<string, DocMeta[]>);
        setDocs(grouped);
      } catch (error) {
        console.error('Failed to fetch docs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [pathname]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="space-y-8 sticky top-24">
      {Object.entries(docs).map(([section, sectionDocs]) => (
        <div key={section}>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t(`nav.${section}`)}
          </h2>
          <ul className="space-y-2">
            {sectionDocs.map((doc) => (
              <motion.li
                key={doc.slug}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href={`/docs/${doc.slug}` as any}
                  className={cn(
                    'block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors',
                    currentSlug === doc.slug && 'text-blue-600 dark:text-blue-400 font-medium'
                  )}
                >
                  {doc.title}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}