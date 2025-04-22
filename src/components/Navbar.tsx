'use client'

import { useTranslations } from 'next-intl'
import { Link as I18nLink } from '@/i18n/routing'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'

export default function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const locale = useLocale()

  // 从路径中移除语言前缀以获取实际路径
  const path = pathname.replace(`/${locale}`, '')
  // 定义类型安全的导航链接
  const navLinks = [
    { href: '/servers' as const, label: t('servers') },
    { href: '/docs' as const, label: t('documentation') },
    { href: '/playground' as const, label: t('playground') },
    { href: '/inspector' as const, label: t('inspector') },
    { href: '/specification' as const, label: t('specification') },
    // { href: 'https://programnotes.cn' as const, label: t('blog') },
  ]
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <I18nLink href="/" aria-label="Claude MCP" title="Claude MCP" className="flex items-center">
              <img src="/logo.png" alt="Claude MCP" className="w-10 h-auto mr-1" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">MCP</span>
            </I18nLink>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <I18nLink
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  title={link.label}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium",
                    path.startsWith(link.href)
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400"
                  )}
                >
                  {link.label}
                </I18nLink>
              ))}
              <Link
                href="https://programnotes.cn"
                aria-label={t('blog')}
                title={t('blog')}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  path.startsWith('/blog')
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                )}
              >
                {t('blog')}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
} 