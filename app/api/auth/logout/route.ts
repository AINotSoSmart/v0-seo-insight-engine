import { NextResponse } from "next/server"
import { stackServerApp } from "@/stack/server"

export async function GET() {
  try {
    await stackServerApp.signOut()
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
  } catch (error) {
    console.error("[auth] logout error:", error)
    // Fallback redirect if signOut fails
    const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
    return response
  }
}
