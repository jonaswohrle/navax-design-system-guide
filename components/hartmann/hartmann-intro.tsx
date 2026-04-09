import type { HartmannIntroSection } from "@/lib/sitecore"

interface HartmannIntroProps {
  intro: HartmannIntroSection
}

export function HartmannIntro({ intro }: HartmannIntroProps) {
  return (
    <section className="bg-[#f5f5f5] py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-[820px]">
          <h2 className="mb-6 text-center text-[22px] font-bold text-[#1a1a2e] lg:text-[28px]">
            {intro.title}
          </h2>
          {intro.description.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-4 text-center text-[13px] leading-[1.8] text-[#555] last:mb-0 lg:text-[14px]">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Horizontal navigation dots - like the original breadcrumb strip */}
        <div className="mt-12 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {[
              { icon: "\u2302", label: "Start" },
              { icon: "\u2764", label: "Ihr Partner" },
              { icon: "\u2714", label: "Unsere Kompetenzen" },
              { icon: "\u2605", label: "F\u00FCr Privatanwender" },
              { icon: "\u25CF", label: "Unsere Produkte" },
              { icon: "\u25CB", label: "\u00DCber HARTMANN" },
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-2 text-[12px] text-[#555] transition-colors hover:text-[#002F6C]"
              >
                <span className="flex h-3 w-3 items-center justify-center rounded-full border border-[#ccc] text-[6px]" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
