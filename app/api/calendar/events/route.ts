import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year")
    const month = searchParams.get("month")

    const laravelApiUrl = process.env.LARAVEL_API_URL || "http://localhost:8000/api"
    const response = await fetch(`${laravelApiUrl}/calendar/events?year=${year}&month=${month}`, {
      headers: {
        Authorization: `Bearer ${process.env.LARAVEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch from Laravel API")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Calendar API Error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
