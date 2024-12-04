'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { TagList } from './TagList';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setKeyword(searchParams?.get('keyword') ?? '');
  }, [searchParams]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (value) {
      params.set('keyword', value);
    } else {
      params.delete('keyword');
    }
    router.push(`/servers?${params.toString()}`);
  };

  return (
    <div className="w-full border-2 p-4 rounded-xl dark:border-gray-600 mx-auto space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-4 rounded-full"
        />
      </div>
      <TagList />
    </div>
  );
} 