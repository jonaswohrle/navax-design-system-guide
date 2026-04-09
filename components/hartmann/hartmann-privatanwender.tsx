import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"
import type { HartmannPrivatanwender as HartmannPrivatanwenderType } from "@/lib/sitecore"

interface HartmannPrivatanwenderProps {
  data: HartmannPrivatanwenderType
}

export function HartmannPrivatanwenderSection({ data }: HartmannPrivatanwenderProps) {
  return (
    <section className="bg-[#f5f5f5]">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          {/* Image - left side, full bleed */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:w-[45%]">
            <Image
              src="/images/hartmann-privatanwender.jpg"
              alt="HARTMANN Privatanwender"
              fill
              className="object-cover"
            />
          </div>

          {/* Content - right side */}
          <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:px-14 lg:py-16">
            <h2 className="mb-4 text-[22px] font-bold leading-tight text-[#1a1a2e] lg:text-[26px]">
              {data.title}
            </h2>
            <p className="mb-5 text-[13px] leading-[1.7] text-[#555]">
              {data.description}
            </p>
            <p className="mb-4 text-[13px] font-semibold text-[#1a1a2e]">
              Ihre Vorteile auf einen Blick:
            </p>
            <ul className="mb-6 flex flex-col gap-2.5">
              {data.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#002F6C]">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[13px] text-[#333]">{benefit}</span>
                </li>
              ))}
            </ul>
            <p className="mb-6 text-[12px] leading-[1.7] text-[#555]">
              {"Besuchen Sie HARTMANN direct Plattform und erleben Sie erstklassige Produkte, die Ihnen den Alltag erleichtern. Wir freuen uns auf Sie!"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
