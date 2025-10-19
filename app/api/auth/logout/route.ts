export async function GET() {
  // Clear session/tokens
  const response = Response.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
  response.headers.set("Set-Cookie", "auth=; Max-Age=0; Path=/")
  return response
}
