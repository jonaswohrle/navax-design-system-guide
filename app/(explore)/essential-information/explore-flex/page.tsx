import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "E.ON Plus | Verträge bündeln & sparen",
  description:
    "Mit E.ON Plus kombinieren Sie verschiedene Energieverträge und sichern sich jährlich bis zu 200 Euro Rabatt.",
}

const FAQS = [
  {
    question: "Was ist E.ON Plus?",
    answer:
      "E.ON Plus ist unser Vorteilsprogramm, mit dem Sie verschiedene Energieverträge bündeln und dafür jährlich bis zu 200 Euro Rabatt erhalten. Je mehr Verträge Sie kombinieren, desto mehr sparen Sie.",
  },
  {
    question: "Welche Verträge kann ich kombinieren?",
    answer:
      "Sie können Strom-, Gas-, Solar-, Wärmepumpen- und E-Mobilitätsverträge miteinander kombinieren. Auch Verträge unserer Partnerunternehmen für Internet und Mobilfunk sind kompatibel.",
  },
  {
    question: "Wie erhalte ich den E.ON Plus Rabatt?",
    answer:
      "Sobald Sie zwei oder mehr E.ON Verträge haben, wird der E.ON Plus Rabatt automatisch auf Ihrer nächsten Jahresabrechnung gutgeschrieben. Sie müssen sich nicht extra anmelden.",
  },
  {
    question: "Kann ich E.ON Plus auch nachträglich nutzen?",
    answer:
      "Ja, auch als Bestandskunde können Sie jederzeit weitere Verträge hinzufügen und ab dem nächsten Abrechnungszeitraum vom E.ON Plus Rabatt profitieren.",
  },
  {
    question: "Gibt es eine Mindestlaufzeit?",
    answer:
      "E.ON Plus ist an keine eigene Mindestlaufzeit gebunden. Der Vorteil gilt, solange Sie mindestens zwei aktive E.ON Verträge haben.",
  },
  {
    question: "Wie hoch ist der Rabatt genau?",
    answer:
      "Der Rabatt staffelt sich je nach Anzahl der gebündelten Verträge: Ab 2 Verträgen erhalten Sie 60 EUR/Jahr, ab 3 Verträgen 120 EUR/Jahr und ab 4 Verträgen den maximalen Rabatt von 200 EUR/Jahr.",
  },
]

export default function ExploreFlexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-secondary py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-accent/10 p-3">
              <ShieldCheck className="h-10 w-10 text-accent" />
            </div>
            <div>
              <h1 className="font-heading text-4xl font-bold text-foreground lg:text-5xl">
                E.ON Plus
              </h1>
              <p className="mt-1 text-lg text-primary font-medium">
                Verträge bündeln, dauerhaft sparen.
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
              Mehr bündeln, mehr sparen
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Mit E.ON Plus kombinieren Sie verschiedene Energieverträge und sichern sich jährlich bis zu 200 Euro Rabatt sowie weitere exklusive Vorteile. Ob Strom und Gas, Solar und Wallbox oder Wärmepumpe und Smart Home -- je mehr Verträge Sie bündeln, desto mehr profitieren Sie.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
              Häufig gestellte Fragen
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
