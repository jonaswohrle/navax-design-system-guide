"use client"

import * as React from "react"
import type { UIMessage } from "ai"
import { cn } from "@/lib/utils"
import { User, Bot, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn("flex max-w-[80%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
        {message.parts.map((part, idx) => {
          if (part.type === "text" && part.text.trim()) {
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm leading-relaxed",
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{part.text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_pre]:bg-foreground/5 [&_pre]:rounded-md [&_pre]:p-3 [&_code]:text-xs [&_code]:font-mono [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1">
                    <Markdown remarkPlugins={[remarkGfm]}>{part.text}</Markdown>
                  </div>
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
