import { NextResponse } from "next/server"
import { stackServerApp } from "@/stack/server"

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (user) {
      return NextResponse.json({ authenticated: true })
    }
    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
