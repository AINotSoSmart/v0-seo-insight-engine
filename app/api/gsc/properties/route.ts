import { getUserProperties } from "@/lib/db"
import { NextResponse } from "next/server"
import { stackServerApp } from "@/stack/server"

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 })
    }

    const dbProperties = await getUserProperties(String((user as any).id))
    return NextResponse.json(dbProperties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch properties" },
      { status: 500 },
    )
  }
}
