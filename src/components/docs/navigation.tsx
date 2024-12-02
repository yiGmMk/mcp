'use client';

import { Link } from '@/i18n/routing';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { type DocMeta } from '@/lib/docs';
import { useTranslations } from 'next-intl';


interface DocNavigationProps {
  locale: string;
  slug: string;
}

export function DocNavigation({ locale, slug }: DocNavigationProps) {
  const t = useTranslations('Docs');
  const [docMeta, setDocMeta] = useState<DocMeta | null>(null);
  const [prevDoc, setPrevDoc] = useState<DocMeta | null>(null);
  const [nextDoc, setNextDoc] = useState<DocMeta | null>(null);

  useEffect(() => {
    const fetchDocMeta = async () => {
      try {
        const response = await fetch(`/api/docs/${locale}/${slug}`);
        const data = await response.json();
        setDocMeta(data);

        // 获取前后文档的元数据
        if (data.prev) {
          const prevResponse = await fetch(`/api/docs/${locale}/${data.prev}`);
          setPrevDoc(await prevResponse.json());
        } else {
          setPrevDoc(null);
        }

        if (data.next) {
          const nextResponse = await fetch(`/api/docs/${locale}/${data.next}`);
          setNextDoc(await nextResponse.json());
        } else {
          setNextDoc(null);
        }
      } catch (error) {
        console.error('Failed to fetch doc metadata:', error);
      }
    };

    fetchDocMeta();
  }, [locale, slug]);

  return (
    <div className="mt-16 flex flex-col sm:flex-row justify-between gap-4 border-t dark:border-gray-800 pt-8">
      {prevDoc && docMeta?.prev ? (
        <Link
          href={`/docs/${docMeta?.prev}` as any}
          className={cn(
            "group flex items-center gap-3 text-left",
            "p-4 rounded-lg border dark:border-gray-800",
            "hover:border-blue-500/20 hover:bg-blue-50/50 dark:hover:border-blue-500/20 dark:hover:bg-blue-950/50",
            "transition-colors duration-200"
          )}
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t('nav.previous')}</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {prevDoc.title}
            </div>
          </div>
        </Link>
      ) : <div />}

      {nextDoc && docMeta?.next ? (
        <Link
          href={`/docs/${docMeta?.next}` as any}
          className={cn(
            "group flex items-center gap-3 text-right",
            "p-4 rounded-lg border dark:border-gray-800",
            "hover:border-blue-500/20 hover:bg-blue-50/50 dark:hover:border-blue-500/20 dark:hover:bg-blue-950/50",
            "transition-colors duration-200",
            !prevDoc && "ml-auto"
          )}
        >
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t('nav.next')}</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {nextDoc.title}
            </div>
          </div>
          <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </Link>
      ) : <div />}
    </div>
  );
}
