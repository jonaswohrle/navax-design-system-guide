import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

function generateRef() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `EXP-${new Date().getFullYear()}-${code}`
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) return NextResponse.json({ bookings: [] })

  const sql = neon(process.env.DATABASE_URL!)
  const bookings = await sql`
    SELECT id, reference, tour_slug, tour_title, departure_date, passengers,
           passenger_name, passenger_email, total_price, status, created_at
    FROM bookings WHERE user_id = ${Number(userId)} ORDER BY created_at DESC
  `
  return NextResponse.json({ bookings })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, tourSlug, tourTitle, departureId, departureDate, passengers, passengerName, passengerEmail, passengerPhone, specialRequests, totalPrice } = body

    if (!userId || !tourSlug || !tourTitle || !departureDate || !passengerName || !passengerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const reference = generateRef()

    const result = await sql`
      INSERT INTO bookings (user_id, reference, tour_slug, tour_title, departure_id, departure_date, passengers, passenger_name, passenger_email, passenger_phone, special_requests, total_price, status)
      VALUES (${userId}, ${reference}, ${tourSlug}, ${tourTitle}, ${departureId || ""}, ${departureDate}, ${passengers || 1}, ${passengerName}, ${passengerEmail}, ${passengerPhone || ""}, ${specialRequests || ""}, ${totalPrice || 0}, 'Confirmed')
      RETURNING id, reference, tour_slug, tour_title, departure_date, passengers, passenger_name, total_price, status, created_at
    `

    return NextResponse.json({ booking: result[0] })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
