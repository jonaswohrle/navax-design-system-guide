"use client"

import * as React from "react"
import { SendHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (text: string) => void
  status: "ready" | "streaming" | "submitted" | "error"
  placeholder?: string
  className?: string
}

export function ChatInput({ onSend, status, placeholder = "Type a message...", className }: ChatInputProps) {
  const [input, setInput] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const isDisabled = status === "streaming" || status === "submitted"

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || isDisabled) return
    onSend(trimmed)
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className={cn("flex items-end gap-2 rounded-lg border border-input bg-background p-2", className)}>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={isDisabled}
        className="min-h-[40px] max-h-[160px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
        aria-label="Chat input"
      />
      <Button
        onClick={handleSubmit}
        disabled={isDisabled || !input.trim()}
        size="icon"
        className="h-9 w-9 shrink-0"
        aria-label="Send message"
      >
        {isDisabled ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendHorizontal className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
