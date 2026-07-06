import Link from "next/link"
import {
  MapPin,
  Heart,
  Mail,
  Users,
  Gift,
  Facebook,
  Instagram,
  Youtube,
  Check,
  Store,
  Home,
  ChevronRight,
} from "lucide-react"

const benefits = [
  { icon: MapPin, label: "Filiale finden", href: "#" },
  { icon: Heart, label: "babywelt", href: "#" },
  { icon: Mail, label: "Newsletter", href: "#" },
  { icon: Users, label: "Karriere", href: "#" },
  { icon: Gift, label: "Gutscheine", href: "#" },
]

const legalLinks = [
  "Impressum",
  "Datenschutz",
  "Cookie Einstellungen",
  "AGB Rossmann Onlineshop",
  "Kontakt",
  "Verbraucherschlichtung",
  "Barrierefreiheitserklärung",
]

const advantages = ["Sendungsverfolgung", "Kauf auf Rechnung", "Kostenlose Rücksendung"]
const newsletterPoints = ["alle Angebote zum Werbestart", "tolle Aktionen im Blick", "meine Themen im Mittelpunkt"]

export function SiteFooter() {
  return (
    <footer className="mt-12">
      {/* Benefits bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
          {benefits.map((b) => (
            <Link key={b.label} href={b.href} className="flex items-center gap-3 hover:opacity-90">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-foreground/60">
                <b.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-sm font-medium">{b.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Legal links + social */}
      <div className="bg-card">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l}>
                <Link href="#" className="text-sm text-foreground hover:text-primary">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Link href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-hover">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-hover">
              <Youtube className="h-4 w-4" />
            </Link>
            <Link href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-hover">
              <Instagram className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Advantages / delivery / newsletter */}
      <div className="bg-secondary">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 lg:grid-cols-3">
          {/* Advantages */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-foreground">Vorteile beim Online-Kauf</h3>
            <ul className="space-y-3">
              {advantages.map((a) => (
                <li key={a} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery */}
          <div className="bg-card p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-foreground">
              Lieferung in Ihre Filiale oder nach Hause
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Store className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">kostenlose Lieferung in die Filiale</span> ab 20 € Bestellwert
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Home className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">kostenlose Lieferung nach Hause</span> ab 69 € Bestellwert
                </p>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-card p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-foreground">Newsletter abonnieren</h3>
            <ul className="mb-5 space-y-3">
              {newsletterPoints.map((n) => (
                <li key={n} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
            <Link
              href="#"
              className="inline-flex items-center gap-1 bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-hover"
            >
              <ChevronRight className="h-4 w-4" /> jetzt abonnieren
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-card">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Payment: VISA · Mastercard · PayPal · Klarna · SEPA</span>
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dirk Rossmann GmbH – Demo-Nachbau
          </p>
        </div>
      </div>
    </footer>
  )
}
