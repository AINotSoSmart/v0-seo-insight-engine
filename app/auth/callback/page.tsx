"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("Processing authentication...")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")

        if (!code) {
          setError("No authorization code received")
          return
        }

        const response = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || "Authentication failed")
          return
        }

        setStatus("Authentication successful! Redirecting...")
        setTimeout(() => router.push("/dashboard"), 2000)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-600">
              <p className="font-semibold mb-2">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <p className="text-slate-600">{status}</p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
