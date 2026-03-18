import Image from "next/image"
import Link from "next/link"
import type { BlogPostFields } from "@/lib/contentful"

interface ContentCardProps {
  post: BlogPostFields
}

export function ContentCard({ post }: ContentCardProps) {
  const formattedDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <Link
      href={`/blog#${post.slug || ""}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={post.imageUrl || "/images/explore/hero-mountains.jpg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {post.category && (
          <span className="absolute left-3 top-3 rounded-md bg-primary/90 px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            {post.category}
          </span>
        )}
      </div>

      <div className="p-4">
        {formattedDate && (
          <p className="mb-1 text-xs text-muted-foreground">{formattedDate}</p>
        )}
        <h3 className="mb-2 font-heading text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
