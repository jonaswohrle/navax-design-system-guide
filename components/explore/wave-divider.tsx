import { cn } from "@/lib/utils"

interface WaveDividerProps {
  /** Fill colour – defaults to primary (Explore red) */
  color?: string
  /** Flip vertically so wave curves the other direction */
  flip?: boolean
  className?: string
}

/**
 * Full-width decorative wave/curve separator matching the real
 * explore.co.uk hero-to-content transition.
 */
export function WaveDivider({ color = "hsl(var(--primary))", flip = false, className }: WaveDividerProps) {
  return (
    <div
      className={cn("relative -mt-1 w-full overflow-hidden leading-[0]", flip && "rotate-180", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="block h-16 w-full md:h-20 lg:h-24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 C360,100 1080,0 1440,80 L1440,100 L0,100 Z"
          fill={color}
        />
      </svg>
    </div>
  )
}
