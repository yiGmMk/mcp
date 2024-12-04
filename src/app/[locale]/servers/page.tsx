import { SearchBar } from '@/components/SearchBar';
import { ServerList } from '@/components/ServerList';
import { getTranslations } from 'next-intl/server';


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