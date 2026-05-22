"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import i18nConfig from "@/i18nConfig"

export default function HomePage() {
  const { theme } = useTheme()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    const isLocaleValid = i18nConfig.locales.includes(locale)
    if (isLocaleValid) {
      router.push(`/${locale}/default/chat`)
    } else {
      router.push(`/${i18nConfig.defaultLocale}/${locale}`)
    }
  }, [router, locale])

  return (
    <div className="bg-background flex size-full flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <div className="border-border bg-card flex size-16 items-center justify-center rounded-lg border shadow-sm text-teal-700 dark:text-teal-400">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Clinical Guidance Portal</h1>
          <p className="text-muted-foreground text-sm">
            Preparing secure patient consultation channel...
          </p>
        </div>

        <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
          <div className="bg-foreground h-full w-1/3 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  )
}
