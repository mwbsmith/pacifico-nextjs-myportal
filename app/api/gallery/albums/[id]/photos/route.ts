import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const laravelApiUrl = process.env.LARAVEL_API_URL || "http://localhost:8000/api"
    const response = await fetch(`${laravelApiUrl}/gallery/albums/${id}/photos`, {
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
    console.error("Gallery Photos API Error:", error)
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}
