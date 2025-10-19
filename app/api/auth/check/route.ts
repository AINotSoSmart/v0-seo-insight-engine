import { getStoredTokens } from "@/lib/gsc-auth"

export async function GET() {
  try {
    const tokens = await getStoredTokens()
    if (tokens && tokens.access_token) {
      return Response.json({ authenticated: true })
    }
    return Response.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    return Response.json({ authenticated: false }, { status: 401 })
  }
}
