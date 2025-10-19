"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/login"
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect Google Search Console</CardTitle>
          <CardDescription>Authorize access to your Search Console data to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            We'll securely connect to your Google Search Console property to analyze your search performance and provide
            optimization recommendations.
          </p>
          <Button onClick={handleGoogleLogin} className="w-full" size="lg">
            Sign in with Google
          </Button>
          <div className="text-center">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
