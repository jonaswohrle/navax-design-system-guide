import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HartmannPrivatanwender as HartmannPrivatanwenderType } from "@/lib/sitecore"

interface HartmannPrivatanwenderProps {
  data: HartmannPrivatanwenderType
}

export function HartmannPrivatanwenderSection({ data }: HartmannPrivatanwenderProps) {
  return (
    <section className="bg-secondary py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground lg:text-3xl text-balance">
            {data.title}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            {data.description}
          </p>
          <ul className="mb-8 flex flex-col gap-3">
            {data.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
          <p className="mb-6 text-sm text-muted-foreground">
            {"Besuchen Sie HARTMANN direct Plattform und erleben Sie erstklassige Produkte, die Ihnen den Alltag erleichtern. Wir freuen uns auf Sie!"}
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-hover">
            <Link href={data.linkUrl}>
              {data.linkLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
