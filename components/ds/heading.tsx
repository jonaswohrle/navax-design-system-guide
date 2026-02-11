import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { JSX } from "react"

const headingVariants = cva("text-balance tracking-tight", {
  variants: {
    level: {
      1: "text-4xl font-normal font-serif",
      2: "text-2xl font-semibold font-sans",
      3: "text-lg font-semibold font-sans",
      4: "text-base font-semibold font-sans",
    },
  },
  defaultVariants: {
    level: 1,
  },
})

type HeadingLevel = 1 | 2 | 3 | 4

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: `h${HeadingLevel}`
}

export function Heading({
  className,
  level = 1,
  as,
  ...props
}: HeadingProps) {
  const Tag = as || (`h${level}` as keyof JSX.IntrinsicElements)

  return (
    <Tag
      className={cn(headingVariants({ level, className }))}
      {...props}
    />
  )
}
