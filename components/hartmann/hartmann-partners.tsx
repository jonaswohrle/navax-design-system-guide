import type { HartmannPartnerCategory } from "@/lib/sitecore"

interface HartmannPartnersProps {
  categories: HartmannPartnerCategory[]
}

export function HartmannPartners({ categories }: HartmannPartnersProps) {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-8 text-center text-[22px] font-bold text-[#1a1a2e] lg:text-[28px]">
          HARTMANN Ihr Partner im Gesundheitswesen
        </h2>

        {/* Blue pill-shaped tag buttons - matching original layout */}
        <div className="flex flex-wrap justify-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="rounded-full bg-[#002F6C] px-5 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#001d44]"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
