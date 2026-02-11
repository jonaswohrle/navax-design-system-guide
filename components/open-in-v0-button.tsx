import { cn } from "@/lib/utils"

const REGISTRY_BASE_URL = "https://v0-navax-design-system-guide.vercel.app"

function V0Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-5 w-5 text-current", className)}
    >
      <path
        d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
        fill="currentColor"
      />
      <path
        d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Opens a single component's registry JSON in v0.
 */
export function OpenInV0Button({
  componentName,
  className,
}: {
  componentName: string
  className?: string
}) {
  const url = `${REGISTRY_BASE_URL}/r/${componentName}.json`
  const v0Url = `https://v0.dev/chat/api/open?url=${encodeURIComponent(url)}`

  return (
    <a
      href={v0Url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${componentName} in v0`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[6px] bg-black px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80",
        className,
      )}
    >
      <span className="sr-only">Open in </span>
      <V0Logo />
    </a>
  )
}

/**
 * Opens the full registry index in v0 -- imports everything at once.
 */
export function OpenAllInV0Button({ className }: { className?: string }) {
  const url = `${REGISTRY_BASE_URL}/r/navax-ds-all.json`
  const v0Url = `https://v0.dev/chat/api/open?url=${encodeURIComponent(url)}`

  return (
    <a
      href={v0Url}
      target="_blank"
      rel="noreferrer"
      aria-label="Open entire NAVAX design system in v0"
      className={cn(
        "inline-flex items-center gap-2 rounded-[8px] bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90",
        className,
      )}
    >
      Open in
      <V0Logo />
    </a>
  )
}
