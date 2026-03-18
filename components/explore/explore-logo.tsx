import Image from "next/image"
import { cn } from "@/lib/utils"

interface ExploreLogoProps {
  variant?: "color" | "white"
  width?: number
  className?: string
}

export function ExploreLogo({ variant = "color", width = 121, className }: ExploreLogoProps) {
  return (
    <Image
      src="/images/explore-logo.svg"
      alt="Explore"
      width={width}
      height={Math.round((width / 121) * 34)}
      style={{ width: "auto", height: "auto" }}
      className={cn(
        variant === "white" && "brightness-0 invert",
        className,
      )}
      priority
    />
  )
}
