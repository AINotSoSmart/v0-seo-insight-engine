import { syncGSCData } from "@/lib/gsc-client"
import { NextResponse } from "next/server"
import { stackServerApp } from "@/stack/server"

export async function POST(request: Request) {
  try {
    const { propertyUrl, days = 90 } = await request.json()

    if (!propertyUrl) {
      return NextResponse.json({ error: "Property URL is required" }, { status: 400 })
    }

    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 })
    }

    const result = await syncGSCData(String((user as any).id), propertyUrl, days)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Sync failed" }, { status: 500 })
  }
}
