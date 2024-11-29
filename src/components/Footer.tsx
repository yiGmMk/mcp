import { Github, Twitter, Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Link as I18nLink } from '@/i18n/routing'
import { type Pathnames } from '@/i18n/config'

export function Footer() {
  const t = useTranslations('footer')

  const navigation = {
    product: [
      { name: 'Documentation', href: '/docs' as keyof Pathnames },
      { name: 'Blog', href: '/blog' as keyof Pathnames },
      { name: 'Community', href: '/community' as keyof Pathnames },
    ],
    community: [
      { name: t('links.github'), href: 'https://github.com/anthropics/mcp' },
      { name: t('links.discord'), href: '/discord' },
      { name: t('links.twitter'), href: 'https://twitter.com/anthropic' },
      { name: t('links.feedback'), href: '/feedback' },
    ],
    legal: [
      { name: 'Privacy', href: '/docs' as keyof Pathnames },
      { name: 'Terms', href: '/docs' as keyof Pathnames },
    ],
  }

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/anthropics/mcp', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com/anthropic', icon: Twitter },
    { name: 'Website', href: 'https://anthropic.com', icon: Globe },
  ]

  return (
    <footer className="border-t bg-background/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="text-xl font-bold">
              MCP
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('description')}
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">{t('sections.product')}</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <I18nLink
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </I18nLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold">{t('sections.community')}</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.community.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">{t('sections.legal')}</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <I18nLink
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </I18nLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Anthropic. {t('copyright')}
            </p>
            <Link href="/sitemap.xml" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 