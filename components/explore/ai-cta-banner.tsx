import Link from "next/link"
import { Sparkles, Cpu, Zap, Users } from "lucide-react"
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
                Powered by Vercel & v0
              </span>
            </div>
            <h2 className="mb-4 font-heading text-2xl font-bold text-background lg:text-3xl text-balance">
              E.ON Design System -- mit Vercel, v0 & Contentful
            </h2>
            <p className="mb-6 text-base leading-relaxed text-background/70 lg:text-lg">
              Diese Seite wurde mit Vercel gebaut, mit v0 designt und durch Contentful personalisiert.
              Entdecken Sie, wie KI-Personalisierung, Content-Pipelines und Echtzeit-Segmentierung personalisierte Energieerlebnisse schaffen.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary px-8 font-heading text-base font-semibold text-primary-foreground hover:bg-hover"
            >
              <Link href="/vercel">Technologie entdecken</Link>
            </Button>
          </div>

          <div className="grid w-full max-w-sm grid-cols-2 gap-3 lg:max-w-xs">
            <div className="rounded-xl bg-background/5 p-4 backdrop-blur-sm">
              <Zap className="mb-2 h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-background">Vercel & v0</p>
              <p className="text-xs text-background/50">Platform & AI design</p>
            </div>
            <div className="rounded-xl bg-background/5 p-4 backdrop-blur-sm">
              <Users className="mb-2 h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-background">Personalization</p>
              <p className="text-xs text-background/50">Audience segmentation</p>
            </div>
            <div className="rounded-xl bg-background/5 p-4 backdrop-blur-sm">
              <Cpu className="mb-2 h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-background">Content Pipeline</p>
              <p className="text-xs text-background/50">AI-powered CMS</p>
            </div>
            <div className="rounded-xl bg-background/5 p-4 backdrop-blur-sm">
              <Sparkles className="mb-2 h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-background">AI Chat</p>
              <p className="text-xs text-background/50">Contextual assistant</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
