"use client"

import { Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface WishlistButtonProps {
  tourSlug: string
  className?: string
  size?: "sm" | "md"
}

export function WishlistButton({ tourSlug, className = "", size = "sm" }: WishlistButtonProps) {
  const { user, isInWishlist, toggleWishlist } = useAuth()
  const router = useRouter()
  const inWishlist = isInWishlist(tourSlug)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      router.push("/my-explore")
      return
    }
    await toggleWishlist(tourSlug)
  }

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"

  return (
    <button
      onClick={handleClick}
      className={`rounded-full bg-card/80 p-2 backdrop-blur-sm transition-colors hover:bg-card ${
        inWishlist ? "text-primary" : "text-foreground/60 hover:text-primary"
      } ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`${iconSize} ${inWishlist ? "fill-current" : ""}`} />
    </button>
  )
}
