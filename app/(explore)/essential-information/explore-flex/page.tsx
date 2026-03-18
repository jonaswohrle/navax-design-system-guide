import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import { getFlexPolicy } from "@/lib/contentful"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Explore Flex | Flexible Booking - Explore",
  description:
    "Book with confidence with Explore Flex. Our flexible booking policy means you can change your trip dates or switch to a different adventure.",
}

const FAQS = [
  {
    question: "What is Explore Flex?",
    answer:
      "Explore Flex is our flexible booking policy that lets you change your trip dates or switch to a different adventure. We understand that plans can change, and we want you to book with complete confidence.",
  },
  {
    question: "How far in advance can I change my booking?",
    answer:
      "You can change your booking up to 60 days before your departure date at no extra cost. Changes made within 60 days of departure may incur an administration fee.",
  },
  {
    question: "Can I transfer my booking to someone else?",
    answer:
      "Yes, you can transfer your booking to another person at any time before departure, subject to availability. A small administration fee may apply.",
  },
  {
    question: "What happens if Explore cancels my trip?",
    answer:
      "If we cancel your trip, you will be offered a full refund or the option to transfer to an alternative departure date or a different trip at no extra cost.",
  },
  {
    question: "Does Explore Flex cover flights?",
    answer:
      "Explore Flex covers the land-only portion of your trip. If you have booked flights through us, separate terms will apply. We recommend purchasing travel insurance that covers flight changes.",
  },
  {
    question: "Is there a cost for Explore Flex?",
    answer:
      "Explore Flex is included as standard with every booking at no additional cost. It's our commitment to giving you peace of mind when you book your adventure.",
  },
]

export default async function ExploreFlexPage() {
  const flex = await getFlexPolicy()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page hero */}
      <section className="bg-secondary py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-accent/10 p-3">
              <ShieldCheck className="h-10 w-10 text-accent" />
            </div>
            <div>
              <h1 className="font-heading text-4xl font-bold text-foreground lg:text-5xl">
                {flex?.heading || "Explore Flex"}
              </h1>
              <p className="mt-1 text-lg text-primary font-medium">
                Flexible booking, peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-10 rounded-xl border border-border bg-card p-6 lg:p-8">
            <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
              Your wellbeing comes first
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {flex?.description ||
                "We understand that plans change, so we offer a flexible booking policy. With Explore Flex, you can book with confidence knowing that you can change your trip dates or switch to a different adventure. We believe travel should be stress-free from the moment you book."}
            </p>
          </div>

          <div className="mb-4">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left font-heading text-base font-semibold text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}
