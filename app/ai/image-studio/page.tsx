"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ImagePlus,
  Upload,
  Loader2,
  Download,
  X,
  Sparkles,
  Wand2,
  Palette,
  Maximize2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const PROMPT_STARTERS = [
  {
    label: "Product mockup",
    prompt: "Create a sleek product mockup of a modern smart watch on a marble surface with soft studio lighting",
    icon: Wand2,
  },
  {
    label: "Illustration",
    prompt: "Create a flat vector illustration of a developer working at a desk with multiple monitors, using a magenta and teal color palette",
    icon: Palette,
  },
  {
    label: "UI concept",
    prompt: "Design a modern dark mode dashboard UI for an analytics platform with charts and data cards",
    icon: Maximize2,
  },
]

interface GeneratedImage {
  base64: string
  mediaType: string
}

interface GenerationResult {
  text: string
  images: GeneratedImage[]
  prompt: string
  uploadedImageUrl?: string
}

export default function ImageStudioPage() {
  const [prompt, setPrompt] = React.useState("")
  const [uploadedImage, setUploadedImage] = React.useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [results, setResults] = React.useState<GenerationResult[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return
    setUploadedImage(file)
    const url = URL.createObjectURL(file)
    setUploadPreview(url)
  }

  const clearUpload = () => {
    setUploadedImage(null)
    if (uploadPreview) URL.revokeObjectURL(uploadPreview)
    setUploadPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleGenerate = async (overridePrompt?: string) => {
    const finalPrompt = overridePrompt || prompt.trim()
    if (!finalPrompt || isGenerating) return

    setIsGenerating(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("prompt", finalPrompt)
      if (uploadedImage) {
        formData.append("image", uploadedImage)
      }

      const res = await fetch("/api/ai/image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Generation failed")
      }

      const data = await res.json()

      setResults((prev) => [
        {
          text: data.text,
          images: data.images,
          prompt: finalPrompt,
          uploadedImageUrl: uploadPreview || undefined,
        },
        ...prev,
      ])

      setPrompt("")
      clearUpload()
      if (textareaRef.current) textareaRef.current.style.height = "auto"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const downloadImage = (base64: string, mediaType: string, index: number) => {
    const ext = mediaType.split("/")[1] || "png"
    const link = document.createElement("a")
    link.href = `data:${mediaType};base64,${base64}`
    link.download = `generated-${Date.now()}-${index}.${ext}`
    link.click()
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ImagePlus className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-semibold text-foreground">AI Image Studio</h1>
            <p className="text-[11px] text-muted-foreground">
              Generate and transform images with Gemini 3 Pro
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 lg:p-8">

      {/* Prompt + Upload area */}
      <Card className="overflow-hidden border-border">
        <CardContent className="p-0">
          {/* Upload preview */}
          {uploadPreview && (
            <div className="relative border-b border-border bg-muted/30 p-4">
              <div className="flex items-start gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border">
                  <img
                    src={uploadPreview}
                    alt="Uploaded reference"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <p className="text-sm font-medium text-foreground">Reference image uploaded</p>
                  <p className="text-xs text-muted-foreground">
                    {uploadedImage?.name} -- {((uploadedImage?.size || 0) / 1024).toFixed(0)} KB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    The AI will use this as context for your prompt.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-7 w-7 shrink-0"
                  onClick={clearUpload}
                  aria-label="Remove uploaded image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="flex flex-col gap-0">
            <div className="p-4 pb-0">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  e.target.style.height = "auto"
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleGenerate()
                  }
                }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                placeholder="Describe the image you want to generate, or drop a reference image here..."
                rows={2}
                disabled={isGenerating}
                className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-50"
                aria-label="Image prompt"
              />
            </div>
            <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <span className="text-xs text-muted-foreground">
                  Powered by Gemini 3 Pro Image
                </span>
              </div>
              <Button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="min-w-[120px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick starters */}
      {results.length === 0 && !isGenerating && (
        <div className="flex flex-col items-center gap-6 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
            <ImagePlus className="h-8 w-8 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground text-balance">
              Create with AI
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground leading-relaxed">
              Describe what you want or upload a reference image. Gemini 3 Pro generates
              and transforms images with native multimodal understanding.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 w-full max-w-2xl">
            {PROMPT_STARTERS.map((starter) => (
              <button
                key={starter.label}
                onClick={() => {
                  setPrompt(starter.prompt)
                  handleGenerate(starter.prompt)
                }}
                className="group flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <starter.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{starter.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {starter.prompt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <X className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-destructive">Generation failed</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="flex flex-col gap-6">
          {results.map((result, rIdx) => (
            <Card key={rIdx} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Prompt bar */}
                <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-5 py-3">
                  <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                  <p className="flex-1 text-sm text-foreground line-clamp-1">{result.prompt}</p>
                  {result.uploadedImageUrl && (
                    <div className="h-7 w-7 shrink-0 overflow-hidden rounded border border-border">
                      <img src={result.uploadedImageUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {/* Images */}
                  {result.images.length > 0 && (
                    <div className={cn(
                      "grid gap-4",
                      result.images.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
                    )}>
                      {result.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="group relative overflow-hidden rounded-lg border border-border bg-muted/20">
                          <img
                            src={`data:${img.mediaType};base64,${img.base64}`}
                            alt={`Generated image ${imgIdx + 1}`}
                            className="w-full"
                          />
                          <div className="absolute bottom-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => downloadImage(img.base64, img.mediaType, imgIdx)}
                              className="shadow-lg"
                            >
                              <Download className="mr-1.5 h-3.5 w-3.5" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text response */}
                  {result.text && (
                    <div className={cn(result.images.length > 0 && "mt-4 border-t border-border pt-4")}>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.text}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
