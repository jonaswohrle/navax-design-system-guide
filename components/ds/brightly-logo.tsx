import Image from "next/image"
import { cn } from "@/lib/utils"

interface BrightlyLogoProps {
  className?: string
  variant?: "dark" | "light"
  width?: number
}

/**
 * Brightly logo component.
 * Dark variant: dark navy logo for light backgrounds (default)
 * Light variant: inverted logo for dark backgrounds
 */
export function BrightlyLogo({ className, variant = "dark", width = 140 }: BrightlyLogoProps) {
  const height = Math.round(width / 3.5)

  return (
    <Image
      src="/images/brightly-logo.png"
      alt="Brightly - A Siemens Company"
      width={width}
      height={height}
      className={cn(
        "object-contain",
        variant === "light" && "brightness-0 invert",
        className
      )}
      priority
    />
  )
}
