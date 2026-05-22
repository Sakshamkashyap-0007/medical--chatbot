"use client"

import { FC } from "react"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = () => {
  return (
    <div className="flex flex-col items-center select-none text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 shadow-sm">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flat, solid professional medical cross */}
          <path
            d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z"
            fill="#0d9488"
            className="dark:fill-teal-500"
          />
        </svg>
      </div>

      <div className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
        Clinical Guidance Portal
      </div>
      <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 max-w-xs leading-relaxed">
        Secure patient guidance channel. Describe your concerns to begin clinical triage routing.
      </p>
    </div>
  )
}

