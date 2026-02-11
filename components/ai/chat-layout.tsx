"use client"

import * as React from "react"
import type { UIMessage } from "ai"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { cn } from "@/lib/utils"

interface ChatLayoutProps {
  messages: UIMessage[]
  onSend: (text: string) => void
  status: "ready" | "streaming" | "submitted" | "error"
  toolRenderer?: (part: Extract<UIMessage["parts"][number], { type: "tool-invocation" }>) => React.ReactNode
  placeholder?: string
  emptyState?: React.ReactNode
  className?: string
}

export function ChatLayout({
  messages,
  onSend,
  status,
  toolRenderer,
  placeholder,
  emptyState,
  className,
}: ChatLayoutProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && emptyState ? (
          <div className="flex h-full items-center justify-center">{emptyState}</div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                toolRenderer={toolRenderer}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={onSend} status={status} placeholder={placeholder} />
        </div>
      </div>
    </div>
  )
}
