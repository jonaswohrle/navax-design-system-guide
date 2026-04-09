"use client"

import Image from "next/image"
import { useState } from "react"
import { ShieldCheck, Bandage, Droplets, Scissors, ChevronRight, Check, ExternalLink, Phone, Mail, MapPin, Globe, ArrowLeft, User, Building2, Send, Star, BookOpen, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface ProductSummary {
  slug: string
  name: string
  category: string
  description: string
  imageUrl: string
  isNew?: boolean
  isBestseller?: boolean
}

interface ProductDetailData {
  slug: string
  name: string
  category: string
  description: string
  imageUrl: string
  isNew?: boolean
  isBestseller?: boolean
  features: string[]
  applications: string[]
  certifications: string[]
  relatedProducts: string[]
}

interface ContactInfo {
  reason: string
  phone: string
  email: string
  address: string
  website: string
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  switch (category.toLowerCase()) {
    case "wundversorgung":
      return <Bandage className={className} />
    case "inkontinenz":
      return <Droplets className={className} />
    case "desinfektion":
      return <ShieldCheck className={className} />
    case "op":
      return <Scissors className={className} />
    default:
      return <Bandage className={className} />
  }
}

function categoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case "wundversorgung":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "inkontinenz":
      return "bg-violet-50 text-violet-700 border-violet-200"
    case "desinfektion":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "op":
      return "bg-amber-50 text-amber-700 border-amber-200"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

/* -------------------------------------------------------------------------- */
/*  Product Card (compact, for search results grid)                           */
/* -------------------------------------------------------------------------- */

interface ChatProductCardProps {
  product: ProductSummary
  onViewDetails?: (slug: string) => void
}

export function ChatProductCard({ product, onViewDetails }: ChatProductCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-border bg-card transition-shadow hover:shadow-md group">
      <div className="relative aspect-[4/3] w-full shrink-0 bg-secondary/50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          unoptimized
          className="object-cover"
          sizes="200px"
        />
        <div className="absolute left-2 top-2 flex gap-1">
          <Badge variant="outline" className={cn("text-[9px] font-medium backdrop-blur-sm border", categoryColor(product.category))}>
            <CategoryIcon category={product.category} className="mr-1 h-2.5 w-2.5" />
            {product.category}
          </Badge>
        </div>
        {product.isNew && (
          <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground text-[9px] border-0">
            NEU
          </Badge>
        )}
        {product.isBestseller && (
          <Badge className="absolute right-2 top-2 bg-amber-500 text-white text-[9px] border-0">
            <Star className="mr-0.5 h-2.5 w-2.5" />
            Bestseller
          </Badge>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col p-3">
        <h4 className="mb-1 line-clamp-2 text-sm font-semibold leading-tight text-foreground">
          {product.name}
        </h4>
        <p className="mb-3 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-auto">
          <Button
            size="sm"
            variant="default"
            className="w-full bg-primary text-primary-foreground text-xs hover:bg-hover"
            onClick={() => onViewDetails?.(product.slug)}
          >
            Details ansehen
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*  Product Grid                                                              */
/* -------------------------------------------------------------------------- */

interface ChatProductGridProps {
  products: ProductSummary[]
  totalFound: number
  onViewDetails?: (slug: string) => void
}

export function ChatProductGrid({ products, totalFound, onViewDetails }: ChatProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/30 p-8 text-center">
        <div className="rounded-full bg-muted p-3">
          <Bandage className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Keine Produkte gefunden</p>
        <p className="text-xs text-muted-foreground">Versuchen Sie es mit anderen Suchbegriffen.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ChatProductCard key={product.slug} product={product} onViewDetails={onViewDetails} />
        ))}
      </div>
      {totalFound > products.length && (
        <p className="text-center text-xs text-muted-foreground">
          {products.length} von {totalFound} Ergebnissen angezeigt
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Product Detail (expanded)                                                 */
/* -------------------------------------------------------------------------- */

interface ChatProductDetailProps {
  product: ProductDetailData
  onViewRelated?: (slug: string) => void
}

export function ChatProductDetail({ product, onViewRelated }: ChatProductDetailProps) {
  return (
    <Card className="overflow-hidden border-border bg-card">
      {/* Hero */}
      <div className="relative aspect-[16/9] w-full bg-secondary/30">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          unoptimized
          className="object-cover"
          sizes="500px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={cn("text-[10px] font-medium border backdrop-blur-sm", categoryColor(product.category))}>
              <CategoryIcon category={product.category} className="mr-1 h-3 w-3" />
              {product.category}
            </Badge>
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground text-[10px] border-0">NEU</Badge>
            )}
          </div>
          <h3 className="text-lg font-bold leading-tight text-white">
            {product.name}
          </h3>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <Separator />

        {/* Features */}
        {product.features.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Award className="h-3.5 w-3.5 text-primary" />
              Produkteigenschaften
            </h4>
            <ul className="space-y-1.5">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Applications */}
        {product.applications.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Anwendungsbereiche
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {product.applications.map((app, i) => (
                <Badge key={i} variant="outline" className="text-[10px] font-normal">
                  {app}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {product.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.certifications.map((cert, i) => (
              <Badge key={i} variant="secondary" className="text-[10px]">
                <ShieldCheck className="mr-0.5 h-2.5 w-2.5" />
                {cert}
              </Badge>
            ))}
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-primary text-xs text-primary-foreground hover:bg-hover"
            asChild
          >
            <a href="https://www.hartmann.info" target="_blank" rel="noopener noreferrer">
              Zum Produkt
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          {product.relatedProducts.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => onViewRelated?.(product.relatedProducts[0])}
            >
              {"Verwandte Produkte"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*  Contact Card (for canvas)                                                 */
/* -------------------------------------------------------------------------- */

interface ChatContactCardProps {
  info: ContactInfo
}

export function ChatContactCard({ info }: ChatContactCardProps) {
  const [formSubmitted, setFormSubmitted] = useState(false)

  if (formSubmitted) {
    return (
      <Card className="overflow-hidden border-border bg-card">
        <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-7 w-7 text-emerald-600" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-foreground">Nachricht gesendet!</h3>
            <p className="text-xs text-muted-foreground">
              Wir melden uns in K\u00FCrze bei Ihnen.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setFormSubmitted(false)}>
            <ArrowLeft className="mr-1.5 h-3 w-3" />
            {"Zur\u00FCck"}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border bg-card">
      <div className="border-b border-border bg-primary/5 px-5 py-4">
        <h4 className="text-sm font-semibold text-foreground">HARTMANN Kontakt</h4>
        <p className="mt-0.5 text-[10px] text-muted-foreground">Anfrage: {info.reason}</p>
      </div>

      <CardContent className="space-y-4 p-5">
        {/* Contact details */}
        <div className="grid gap-3">
          <a href={`tel:${info.phone}`} className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Telefon</span>
              <span className="block text-xs font-medium text-foreground group-hover:text-primary">{info.phone}</span>
            </div>
          </a>
          <a href={`mailto:${info.email}`} className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">E-Mail</span>
              <span className="block text-xs font-medium text-foreground group-hover:text-primary">{info.email}</span>
            </div>
          </a>
          <div className="flex items-start gap-3 rounded-lg border border-border p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Adresse</span>
              <span className="block text-xs text-foreground">{info.address}</span>
            </div>
          </div>
          <a href={info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Globe className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Website</span>
              <span className="block text-xs font-medium text-foreground group-hover:text-primary">{info.website}</span>
            </div>
          </a>
        </div>

        <Separator />

        {/* Quick contact form */}
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            setFormSubmitted(true)
          }}
        >
          <h4 className="text-xs font-semibold text-foreground">Kontaktformular</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="contact-name" className="text-[10px]">Name</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input id="contact-name" required placeholder="Ihr Name" className="h-8 pl-8 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="contact-company" className="text-[10px]">Unternehmen</Label>
              <div className="relative">
                <Building2 className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input id="contact-company" placeholder="Ihr Unternehmen" className="h-8 pl-8 text-xs" />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="contact-email" className="text-[10px]">E-Mail</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input id="contact-email" type="email" required placeholder="ihre@email.de" className="h-8 pl-8 text-xs" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="contact-message" className="text-[10px]">Nachricht</Label>
            <textarea
              id="contact-message"
              required
              placeholder="Ihre Nachricht..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <Button size="sm" className="w-full bg-primary text-xs text-primary-foreground hover:bg-hover" type="submit">
            <Send className="mr-1.5 h-3 w-3" />
            Nachricht senden
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
