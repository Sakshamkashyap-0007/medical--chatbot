"use client"

import { FC } from "react"
import { ThemeSwitcher } from "@/components/utility/theme-switcher"
import { ProfileSettings } from "@/components/utility/profile-settings"

interface ChatHeaderProps {}

export const ChatHeader: FC<ChatHeaderProps> = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-white/95 px-6 backdrop-blur-md dark:bg-zinc-950/95 border-slate-100 dark:border-zinc-900 transition-colors duration-300">
      {/* Left section: Medical icon/logo & Title */}
      <div className="flex items-center space-x-3 truncate">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-100/60 dark:border-teal-900/40">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Flat medical cross */}
            <path
              d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z"
              fill="#0d9488"
              className="dark:fill-teal-500"
            />
          </svg>
        </div>
        <div className="flex flex-col truncate text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-base leading-none">
              Clinical Guidance Portal
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[9px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50">
              ● Secure Channel
            </span>
          </div>
          <p className="hidden text-[10px] text-slate-400 dark:text-zinc-500 md:block mt-0.5">
            End-to-end encrypted medical guidance & triage
          </p>
        </div>
      </div>

      {/* Right section: Theme Switcher & Profile Settings */}
      <div className="flex items-center space-x-1">
        <ThemeSwitcher />
        <div className="flex items-center pl-1 border-l border-neutral-200 dark:border-neutral-800">
          <ProfileSettings />
        </div>
      </div>
    </header>
  )
}
