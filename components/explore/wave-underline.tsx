import { cn } from "@/lib/utils"

interface WaveUnderlineProps {
  /** Width class – defaults to w-32 */
  className?: string
  color?: string
}

/**
 * Hand-drawn looking red wavy underline matching explore.co.uk's
 * heading accent (used under "An adventure travel company you can trust").
 */
export function WaveUnderline({ className, color = "hsl(var(--primary))" }: WaveUnderlineProps) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-3 w-32", className)}
      aria-hidden="true"
    >
      <path
        d="M2 8 C20 2, 40 12, 60 6 C80 0, 100 12, 120 6 C140 0, 160 12, 180 6 C190 3, 195 5, 198 4"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
