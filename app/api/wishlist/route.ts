import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) return NextResponse.json({ items: [] })

  const sql = neon(process.env.DATABASE_URL!)
  const items = await sql`SELECT tour_slug FROM wishlists WHERE user_id = ${Number(userId)} ORDER BY created_at DESC`
  return NextResponse.json({ items: items.map((i) => i.tour_slug) })
}

export async function POST(req: Request) {
  try {
    const { userId, tourSlug } = await req.json()
    if (!userId || !tourSlug) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

    const sql = neon(process.env.DATABASE_URL!)
    const existing = await sql`SELECT id FROM wishlists WHERE user_id = ${userId} AND tour_slug = ${tourSlug}`

    if (existing.length > 0) {
      await sql`DELETE FROM wishlists WHERE user_id = ${userId} AND tour_slug = ${tourSlug}`
      return NextResponse.json({ action: "removed" })
    } else {
      await sql`INSERT INTO wishlists (user_id, tour_slug) VALUES (${userId}, ${tourSlug})`
      return NextResponse.json({ action: "added" })
    }
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
