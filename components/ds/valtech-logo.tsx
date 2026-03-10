import { cn } from "@/lib/utils"

interface ValtechLogoProps {
  className?: string
  variant?: "dark" | "light"
  width?: number
}

/**
 * Official Valtech logo with the asterisk mark.
 * Dark variant: black fill (for light backgrounds)
 * Light variant: white fill (for dark backgrounds)
 */
export function ValtechLogo({ className, variant = "dark", width = 160 }: ValtechLogoProps) {
  const fill = variant === "dark" ? "fill-foreground" : "fill-[#ffffff]"
  const aspectRatio = 200 / 32
  const height = width / aspectRatio

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 32"
      width={width}
      height={height}
      className={cn(fill, className)}
      aria-label="Valtech"
      role="img"
    >
      {/* "Valtech" wordmark */}
      <text
        x="0"
        y="24"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="28"
        fontWeight="400"
        letterSpacing="-0.02em"
        className={fill}
      >
        Valtech
      </text>
      {/* Asterisk mark */}
      <g transform="translate(148, 2)">
        {/* Six-pointed asterisk / star shape */}
        <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="2.5" className={variant === "dark" ? "stroke-foreground" : "stroke-[#ffffff]"} />
        <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="2.5" className={variant === "dark" ? "stroke-foreground" : "stroke-[#ffffff]"} />
        <line x1="2.5" y1="2.5" x2="21.5" y2="21.5" stroke="currentColor" strokeWidth="2.5" className={variant === "dark" ? "stroke-foreground" : "stroke-[#ffffff]"} />
        <line x1="21.5" y1="2.5" x2="2.5" y2="21.5" stroke="currentColor" strokeWidth="2.5" className={variant === "dark" ? "stroke-foreground" : "stroke-[#ffffff]"} />
      </g>
    </svg>
  )
}
