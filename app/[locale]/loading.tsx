import { IconLoader2 } from "@tabler/icons-react"

export default function Loading() {
  return (
    <div className="bg-white dark:bg-slate-900 flex size-full flex-col items-center justify-center px-6 py-12 transition-colors duration-300">
      <div className="flex w-full max-w-[600px] flex-col items-center gap-8">
        
        {/* Centered Medical Logo with Subtle Pulse */}
        <div className="relative flex size-20 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 shadow-sm animate-pulse">
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
              fill="#3B82F6"
              className="opacity-10 dark:opacity-20"
            />
            <path
              d="M12 6V18M6 12H18"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
              stroke="#3B82F6"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Loading Text */}
        <div className="h-8 text-center flex flex-col items-center justify-center">
          <div className="flex items-center space-x-2">
            <IconLoader2 className="text-blue-500 size-4 animate-spin" />
            <p className="text-neutral-900 dark:text-neutral-100 text-sm font-semibold tracking-wide">
              Preparing assistant...
            </p>
          </div>
          <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-1">
            Setting up your secure workspace
          </p>
        </div>

        {/* Minimal Skeleton Elements representing message bubbles */}
        <div className="w-full space-y-6 border-t border-neutral-100 dark:border-neutral-800/60 pt-8 opacity-30 dark:opacity-15 select-none pointer-events-none">
          
          {/* AI message skeleton */}
          <div className="flex items-start space-x-3">
            <div className="size-8 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
            <div className="space-y-2 grow">
              <div className="h-4 w-1/4 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-3 w-5/6 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-3 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
          </div>

          {/* User message skeleton */}
          <div className="flex items-end justify-end space-x-3">
            <div className="space-y-2 max-w-[70%] w-full flex flex-col items-end">
              <div className="h-8 w-2/3 rounded-2xl rounded-tr-none bg-blue-100 dark:bg-blue-900/40" />
            </div>
          </div>

          {/* AI message skeleton 2 */}
          <div className="flex items-start space-x-3">
            <div className="size-8 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
            <div className="space-y-2 grow">
              <div className="h-4 w-1/5 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-3 w-4/5 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-3 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
