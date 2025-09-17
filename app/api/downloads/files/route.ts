import { NextResponse } from "next/server"

export async function GET() {
  try {
    const laravelApiUrl = process.env.LARAVEL_API_URL || "http://localhost:8000/api"
    const response = await fetch(`${laravelApiUrl}/downloads/files`, {
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
    console.error("Downloads API Error:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}
