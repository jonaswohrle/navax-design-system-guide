"use client"

import * as React from "react"
import type { UIMessage } from "ai"
import { cn } from "@/lib/utils"
import { User, Bot, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

/* ── Markdown custom components for rich rendering ── */
const chatMarkdownComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-4 mb-2 text-base font-bold text-foreground" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-4 mb-2 text-sm font-bold text-foreground" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-3 mb-1.5 text-sm font-semibold text-foreground" {...props}>{children}</h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-2 mb-1 text-sm font-semibold text-foreground" {...props}>{children}</h4>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-1.5 leading-relaxed" {...props}>{children}</p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-2 ml-4 list-disc space-y-1" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-2 ml-4 list-decimal space-y-1" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>{children}</li>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...props}>{children}</strong>
  ),
  a: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-2 border-l-3 border-primary/30 pl-3 text-muted-foreground italic" {...props}>{children}</blockquote>
  ),
  code: ({ children, className: codeClassName, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !codeClassName
    if (isInline) {
      return (
        <code className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[12px] text-primary" {...props}>{children}</code>
      )
    }
    return (
      <code className={cn("block font-mono text-xs", codeClassName)} {...props}>{children}</code>
    )
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-2 overflow-x-auto rounded-lg border border-foreground/10 bg-foreground/5 p-3 font-mono text-xs leading-relaxed" {...props}>{children}</pre>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-2 overflow-x-auto rounded-lg border border-foreground/10">
      <table className="min-w-full text-xs" {...props}>{children}</table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-foreground/10 bg-foreground/5 text-left font-medium" {...props}>{children}</thead>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-3 py-2 text-xs font-semibold" {...props}>{children}</th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-t border-foreground/5 px-3 py-2" {...props}>{children}</td>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-3 border-foreground/10" {...props} />
  ),
}

interface ChatMessageProps {
  message: UIMessage
  toolRenderer?: (part: Extract<UIMessage["parts"][number], { type: "tool-invocation" }>) => React.ReactNode
}

export function ChatMessage({ message, toolRenderer }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card text-foreground"
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      <div className={cn("flex max-w-[85%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
        {message.parts.map((part, idx) => {
          if (part.type === "text" && part.text.trim()) {
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  isUser
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-muted text-foreground"
                )}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{part.text}</p>
                ) : (
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={chatMarkdownComponents}
                  >
                    {part.text}
                  </Markdown>
                )}
              </div>
            )
          }

          if (part.type === "tool-invocation" && toolRenderer) {
            return <React.Fragment key={idx}>{toolRenderer(part)}</React.Fragment>
          }

          return null
        })}
      </div>
    </div>
  )
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  )
}
