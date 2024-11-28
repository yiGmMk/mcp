'use client'

import {useTranslations} from 'next-intl'
import {Link} from '@/i18n/routing'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const t = useTranslations('nav')
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Claude MCP
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/docs"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                {t('documentation')}
              </Link>
              <Link
                href="/blog"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                {t('blog')}
              </Link>
              <Link
                href="/community"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                {t('community')}
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
} 