'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function TagList() {
  const router = useRouter();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const [tags, setTags] = useState<string[]>([]);
  const selectedTags = searchParams?.getAll('tags') ?? [];

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/servers/${locale}/tags`);
        const data = await res.json();
        setTags(data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    }

    fetchTags();
  }, [locale]);

  const handleTagClick = (tag: string | null) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    
    if (tag === null) {
      // 点击 All 标签时，移除所有标签过滤
      params.delete('tags');
    } else {
      const currentTags = params.getAll('tags');
      
      if (currentTags.includes(tag)) {
        // Remove tag
        params.delete('tags');
        currentTags.filter(t => t !== tag).forEach(t => params.append('tags', t));
      } else {
        // Add tag
        params.append('tags', tag);
      }
    }
    
    router.push(`/servers?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => handleTagClick(null)}
        className={`rounded-full text-sm font-medium transition-colors
          ${selectedTags.length === 0
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
      >
        All
      </Button>
      {tags.map(tag => (
        <Button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`rounded-full text-sm font-medium transition-colors
            ${selectedTags.includes(tag)
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
} 