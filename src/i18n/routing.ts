import {createNavigation} from 'next-intl/navigation'
import {defineRouting} from 'next-intl/routing'
import {locales, defaultLocale} from '@/i18n/config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  pathnames: {
    '/': '/',
    '/docs': '/docs',
    '/docs/[slug]': '/docs/[slug]',
    '/blog': '/blog',
    '/specification': '/specification',
    '/community': '/community'
  },
  localePrefix: 'as-needed'
})

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing)