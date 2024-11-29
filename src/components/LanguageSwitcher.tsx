'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { type Pathnames } from '@/i18n/config'
import { pathnames } from '@/i18n/config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

const languages = {
  en: 'English',
  zh: '中文',
  ja: '日本語'
} as const

type LanguageCode = keyof typeof languages

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as LanguageCode

  const pathname = usePathname()
  
  // 从路径中移除语言前缀以获取实际路径
  const path = pathname.replace(`/${currentLocale}`, '') || '/'
  
  // 将路径转换为合法的路由路径
  const getTypedPath = (path: string): keyof Pathnames => {
    return (pathnames[path as keyof typeof pathnames] || '/') as keyof Pathnames
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Globe className="h-4 w-4" />
          {languages[currentLocale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, name]) => (
          <DropdownMenuItem key={code} asChild>
            <Link
              href={getTypedPath(path)}
              locale={code}
              className={currentLocale === code ? 'font-medium' : ''}
            >
              {name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 