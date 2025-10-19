import { NextResponse } from "next/server"
import { stackServerApp } from "@/stack/server"
import { getGSCProperties } from "@/lib/gsc-client"

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 })
    }
    const properties = await getGSCProperties(String((user as any).id))
    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error listing GSC properties:", error)
    return NextResponse.json({ error: "Failed to list properties" }, { status: 500 })
  }
}
