"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MODELS = [
  { id: "openai/gpt-5.2", label: "GPT-5.2", provider: "OpenAI" },
  { id: "anthropic/claude-opus-4.5", label: "Claude Opus 4.5", provider: "Anthropic" },
  { id: "xai/grok-4.1-fast-non-reasoning", label: "Grok 4.1 Fast", provider: "xAI" },
  { id: "google/gemini-3-pro", label: "Gemini 3 Pro", provider: "Google" },
]

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ModelSelector({ value, onChange, className }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className ?? "w-[220px] h-9 text-sm"}>
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <span className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{model.provider}</span>
              <span>{model.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { MODELS }
