'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function DefaultDocsPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    router.replace(`/${locale}/docs/introduction`);
  }, [router, locale]);

  // 重定向时显示一个简单的加载状态
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-gray-600 dark:text-gray-400">
        Loading...
      </div>
    </div>
  );
}
