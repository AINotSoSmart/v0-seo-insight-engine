import { NextRequest, NextResponse } from "next/server"
import { stackServerApp } from "@/stack/server"

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

  // Prepare a default response we can mutate
  let response: NextResponse | null = null

  // Delete legacy cookie that may cause oversized request headers (HTTP 431)
  if (request.cookies.has("session_user")) {
    response = NextResponse.next()
    response.cookies.delete("session_user")
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const user = await stackServerApp.getUser()
    if (!user) {
      const redirectResponse = NextResponse.redirect(new URL("/handler/sign-in", request.url))
      if (request.cookies.has("session_user")) {
        redirectResponse.cookies.delete("session_user")
      }
      return redirectResponse
    }
  }

  return response ?? NextResponse.next()
}

export const config = {
  matcher: ["/(.*)"],
}
