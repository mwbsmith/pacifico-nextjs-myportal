import { NextResponse } from "next/server"

export async function GET() {
  try {
    // This would call your Laravel API
    const laravelApiUrl = process.env.LARAVEL_API_URL || "http://localhost:8000/api"
    const response = await fetch(`${laravelApiUrl}/gallery/albums`, {
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
    console.error("Gallery API Error:", error)
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 })
  }
}
