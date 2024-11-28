'use client'

import {useLocale} from 'next-intl'
import {usePathname, useRouter} from '@/i18n/routing'
import {languages} from '@/i18n/config'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale})
  }

  return (
    <div className="flex items-center space-x-2">
      {Object.entries(languages).map(([code, label]) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          className={`px-3 py-1 rounded-md text-sm ${
            locale === code
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
} 