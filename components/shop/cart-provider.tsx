"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { PRODUCTS, type Product } from "@/lib/shop/data"

export type CartItem = {
  slug: string
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  add: (slug: string, qty?: number) => void
  remove: (slug: string) => void
  setQty: (slug: string, qty: number) => void
  clear: () => void
  getProduct: (slug: string) => Product | undefined
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "rossmann-cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items, hydrated])

  const value = useMemo<CartContextValue>(() => {
    const productMap = new Map(PRODUCTS.map((p) => [p.slug, p]))
    const count = items.reduce((sum, i) => sum + i.qty, 0)
    const total = items.reduce((sum, i) => {
      const p = productMap.get(i.slug)
      return sum + (p ? p.price * i.qty : 0)
    }, 0)

    return {
      items,
      count,
      total,
      getProduct: (slug) => productMap.get(slug),
      add: (slug, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.slug === slug)
          if (existing) {
            return prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i))
          }
          return [...prev, { slug, qty }]
        }),
      remove: (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug)),
      setQty: (slug, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.slug !== slug)
            : prev.map((i) => (i.slug === slug ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
