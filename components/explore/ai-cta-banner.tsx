import Link from "next/link"
import { Sparkles, Cpu, Zap } from "lucide-react"
import { IconExploreGlobe } from "./brand-icons"
import { Button } from "@/components/ui/button"

export function AiCtaBanner() {
  return (
    <section className="bg-foreground py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <IconExploreGlobe className="h-10 w-10 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Technology
              </span>
            </div>
            <h2 className="mb-4 font-heading text-2xl font-bold text-background lg:text-3xl text-balance">
              Explore Our Technology Showcase
            </h2>
            <p className="mb-6 text-base leading-relaxed text-background/70 lg:text-lg">
              Discover how we use AI, Vercel, and v0 to power next-generation travel experiences. 
              See live demos of our content pipeline, prompt engineering tools, and image generation studio.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary px-8 font-heading text-base font-semibold text-primary-foreground hover:bg-hover"
            >
              <Link href="/ai">View AI Showcases</Link>
            </Button>
          </div>

          <div className="grid w-full max-w-sm grid-cols-2 gap-3 lg:max-w-xs">
            <div className="rounded-xl bg-background/5 p-4 backdrop-blur-sm">
              <Cpu className="mb-2 h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-background">AI Content Pipeline</p>
              <p className="text-xs text-background/50">Automated generation</p>
            </div>
            <div className="rounded-xl bg-background/5 p-4 backdrop-blur-sm">
              <Zap className="mb-2 h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-background">Vercel & v0</p>
              <p className="text-xs text-background/50">Platform overview</p>
            </div>
            <div className="rounded-xl bg-background/5 p-4 backdrop-blur-sm">
              <Sparkles className="mb-2 h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-background">Image Studio</p>
              <p className="text-xs text-background/50">AI generation</p>
            </div>
            <div className="rounded-xl bg-background/5 p-4 backdrop-blur-sm">
              <span className="mb-2 block text-lg">{"</>"}</span>
              <p className="text-sm font-medium text-background">Prompt Coach</p>
              <p className="text-xs text-background/50">Engineering tools</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
