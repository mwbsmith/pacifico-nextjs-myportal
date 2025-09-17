import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const laravelApiUrl = process.env.LARAVEL_API_URL || "http://localhost:8000/api"
    const response = await fetch(`${laravelApiUrl}/downloads/files/${id}/download`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LARAVEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to process download")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Download API Error:", error)
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 })
  }
}
