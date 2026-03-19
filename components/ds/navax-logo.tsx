import Image from "next/image"
import { cn } from "@/lib/utils"

interface NavaxLogoProps {
  className?: string
  variant?: "dark" | "light" | "brand"
  width?: number
}

/**
 * E.ON logo – renders the E.ON brand PNG.
 * - "light" → white logo (for dark backgrounds, using brightness-0 invert)
 * - "dark"  → original red/orange logo (for light backgrounds)
 * - "brand" → original red/orange logo
 */
export function NavaxLogo({ className, variant = "dark", width = 140 }: NavaxLogoProps) {
  const aspectRatio = 4 / 1 // approximate E.ON logo dimensions
  const height = Math.round(width / aspectRatio)

  return (
    <Image
      src="/images/eon-logo.png"
      alt="E.ON"
      width={width}
      height={height}
      style={{ width: "auto", height: "auto", maxWidth: width }}
      className={cn(
        "object-contain",
        variant === "light" && "brightness-0 invert",
        className,
      )}
      priority
    />
  )
}
