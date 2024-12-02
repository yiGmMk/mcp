export const locales = ['en', 'zh'] as const
export type Locale = typeof locales[number]

export const defaultLocale = 'en' as const

export const pathnames = {
  '/': '/',
  '/docs': '/docs',
  '/docs/[slug]': '/docs/[slug]',
  '/blog': '/blog',
  '/community': '/community',
  '/specification': '/specification',
} as const

export type Pathnames = typeof pathnames

export const languages = {
  en: 'English',
  zh: '中文',
} as const 