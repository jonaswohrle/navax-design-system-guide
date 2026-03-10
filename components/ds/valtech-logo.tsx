import Image from "next/image"
import { cn } from "@/lib/utils"

interface ValtechLogoProps {
  className?: string
  variant?: "dark" | "light"
  width?: number
}

/**
 * Logo component using the brand PNG.
 * Dark variant: original logo (for light backgrounds)
 * Light variant: logo for dark backgrounds (no invert needed — logo is white/gray)
 */
export function ValtechLogo({ className, variant = "dark", width = 160 }: ValtechLogoProps) {
  // The DEMO logo aspect ratio is roughly 2.5:1
  const height = Math.round(width / 2.5)

  return (
    <Image
      src="/images/valtech-logo.png"
      alt="DEMO"
      width={width}
      height={height}
      className={cn(
        "object-contain",
        variant === "dark" && "brightness-0",
        className
      )}
      priority
    />
  )
}
