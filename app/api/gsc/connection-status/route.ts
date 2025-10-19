import { NextResponse } from "next/server"
import { stackServerApp } from "@/stack/server"
import { getStoredTokens } from "@/lib/gsc-auth"

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ connected: false }, { status: 401 })
    }
    const userId = (user as any).id || (user as any).primaryEmail
    if (!userId) {
      return NextResponse.json({ connected: false }, { status: 200 })
    }
    const tokens = await getStoredTokens(String(userId))
    return NextResponse.json({ connected: !!(tokens && tokens.access_token) })
  } catch (error) {
    console.error("[gsc] connection-status error:", error)
    // Return a safe response to avoid blocking the dashboard UI
    return NextResponse.json({ connected: false }, { status: 200 })
  }
}
