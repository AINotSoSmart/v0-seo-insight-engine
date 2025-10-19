import { exchangeCodeForToken, saveTokens } from "@/lib/gsc-auth"

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return Response.json({ error: "No authorization code provided" }, { status: 400 })
    }

    const tokens = await exchangeCodeForToken(code)
    await saveTokens(tokens)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Callback error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Authentication failed" }, { status: 500 })
  }
}
