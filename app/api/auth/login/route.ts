import { generateAuthUrl } from "@/lib/gsc-auth"

export async function GET() {
  try {
    const authUrl = generateAuthUrl()
    return Response.redirect(authUrl)
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Failed to generate auth URL" }, { status: 500 })
  }
}
