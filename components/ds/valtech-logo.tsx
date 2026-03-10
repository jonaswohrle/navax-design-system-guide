import Image from "next/image"
import { cn } from "@/lib/utils"

interface ValtechLogoProps {
  className?: string
  variant?: "dark" | "light"
  width?: number
}

/**
 * Official Valtech logo using the real brand PNG.
 * Dark variant: original black logo (for light backgrounds)
 * Light variant: inverted white logo (for dark backgrounds)
 */
export function ValtechLogo({ className, variant = "dark", width = 160 }: ValtechLogoProps) {
  // The aspect ratio of the provided logo image is roughly 5.8:1
  const height = Math.round(width / 5.8)

  return (
    <Image
      src="/images/valtech-logo.png"
      alt="Valtech"
      width={width}
      height={height}
      className={cn(
        "object-contain",
        variant === "light" && "invert",
        className
      )}
      priority
    />
  )
}
