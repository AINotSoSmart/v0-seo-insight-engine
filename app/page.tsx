"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check")
        setIsAuthenticated(res.ok)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 pt-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">SEO Insight Engine</h1>
          <p className="text-xl text-slate-600 mb-8">
            Connect your Google Search Console and get AI-powered SEO recommendations
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Connect your Google Search Console property</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-6">
                  Analyze your search performance, identify optimization opportunities, and get AI-powered content
                  recommendations.
                </p>
                <Link href="/auth/login">
                  <Button className="w-full">Connect Google Search Console</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ Real-time GSC data sync</li>
                  <li>✓ Page performance analysis</li>
                  <li>✓ Keyword opportunity detection</li>
                  <li>✓ Content optimization suggestions</li>
                  <li>✓ New article recommendations</li>
                  <li>✓ AI-powered insights</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center">
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
