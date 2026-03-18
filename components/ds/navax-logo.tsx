import Image from "next/image"
import { cn } from "@/lib/utils"

interface NavaxLogoProps {
  className?: string
  variant?: "dark" | "light" | "brand"
  width?: number
}

/**
 * Demo logo – renders the pixel-block "DEMO" PNG.
 * - "light" → white logo (for dark backgrounds)
 * - "dark"  → inverted to black (for light backgrounds)
 * - "brand" → white logo (same as light)
 */
export function NavaxLogo({ className, variant = "dark", width = 140 }: NavaxLogoProps) {
  const aspectRatio = 883 / 340 // original image dimensions
  const height = Math.round(width / aspectRatio)

  return (
    <Image
      src="/images/demo-logo.png"
      alt="DEMO"
      width={width}
      height={height}
      className={cn(
        "object-contain",
        variant === "dark" && "invert",
        className,
      )}
      priority
    />
  )
}
