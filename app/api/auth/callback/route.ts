import { NextResponse } from "next/server"
import { stackServerApp } from "@/stack/server"
import { exchangeCodeForToken, saveTokens } from "@/lib/gsc-auth"

export async function POST(request: Request) {
  try {
    const user = await stackServerApp.getUser({ or: "redirect" })
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 })
    }

    const tokens = await exchangeCodeForToken(code)
    await saveTokens(tokens, String((user as any).id))

    const res = NextResponse.json({ success: true })
    // Purge legacy cookie to prevent oversized headers on subsequent requests
    res.cookies.delete("session_user")
    return res
  } catch (error: any) {
    const res = NextResponse.json({ error: error?.message || "Auth callback failed" }, { status: 500 })
    // Also purge legacy cookie on error paths
    res.cookies.delete("session_user")
    return res
  }
}
