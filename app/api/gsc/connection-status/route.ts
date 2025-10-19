import { NextResponse } from "next/server"
import { stackServerApp } from "@/stack/server"
import { getStoredTokens } from "@/lib/gsc-auth"

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ connected: false }, { status: 401 })
    }
    const tokens = await getStoredTokens(String((user as any).id))
    return NextResponse.json({ connected: !!(tokens && tokens.access_token) })
  } catch (error) {
    return NextResponse.json({ connected: false }, { status: 500 })
  }
}