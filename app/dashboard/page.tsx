"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import PropertySelector from "@/components/dashboard/property-selector"
import PerformanceMetrics from "@/components/dashboard/performance-metrics"
import RecommendationsPanel from "@/components/dashboard/recommendations-panel"
import PageAnalysis from "@/components/dashboard/page-analysis"
import QueryOpportunities from "@/components/dashboard/query-opportunities"
import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [syncing, setSyncing] = useState(false)
  const [connected, setConnected] = useState(false)
  const [googleProperties, setGoogleProperties] = useState<any[]>([])
  const [selectedGooglePropertyUrl, setSelectedGooglePropertyUrl] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check")
        if (!res.ok) {
          router.push("/handler/sign-in")
          return
        }
        setIsAuthenticated(true)
        await loadConnectionStatus()
      } catch (error) {
        router.push("/handler/sign-in")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const loadProperties = async () => {
    try {
      const res = await fetch("/api/gsc/properties")
      if (res.ok) {
        const data = await res.json()
        setProperties(data)
        if (data.length > 0) {
          setSelectedProperty(data[0].id.toString())
        }
      }
    } catch (error) {
      console.error("Error loading properties:", error)
    }
  }

  const loadConnectionStatus = async () => {
    try {
      const res = await fetch("/api/gsc/connection-status")
      if (res.ok) {
        const data = await res.json()
        const isConn = !!data.connected
        setConnected(isConn)
        if (isConn) {
          await Promise.all([loadProperties(), loadGoogleProperties()])
        }
      }
    } catch (error) {
      console.error("Error checking connection:", error)
    }
  }

  const loadGoogleProperties = async () => {
    try {
      const res = await fetch("/api/gsc/list-properties")
      if (res.ok) {
        const data = await res.json()
        setGoogleProperties(data)
        if (data.length > 0) {
          setSelectedGooglePropertyUrl(data[0].siteUrl)
        }
      }
    } catch (error) {
      console.error("Error loading Google properties:", error)
    }
  }


  const handleSync = async () => {
    if (!selectedProperty) return

    setSyncing(true)
    try {
      const property = properties.find((p) => p.id.toString() === selectedProperty)
      const res = await fetch("/api/gsc/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyUrl: property.property_url }),
      })

      if (res.ok) {
        await loadAnalysis()
      }
    } catch (error) {
      console.error("Sync error:", error)
    } finally {
      setSyncing(false)
    }
  }

  const handleInitialSync = async () => {
    if (!selectedGooglePropertyUrl) return

    setSyncing(true)
    try {
      const res = await fetch("/api/gsc/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyUrl: selectedGooglePropertyUrl }),
      })

      if (res.ok) {
        await loadProperties()
      }
    } catch (error) {
      console.error("Initial sync error:", error)
    } finally {
      setSyncing(false)
    }
  }

  const loadAnalysis = async () => {
    if (!selectedProperty) return

    try {
      const res = await fetch(`/api/gsc/analysis?propertyId=${selectedProperty}`)
      if (res.ok) {
        const data = await res.json()
        setAnalysis(data)
      }
    } catch (error) {
      console.error("Analysis error:", error)
    }
  }

  useEffect(() => {
    if (selectedProperty) {
      loadAnalysis()
    }
  }, [selectedProperty])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">SEO Insights</h1>
            <p className="text-slate-400">Analyze your search performance and get optimization recommendations</p>
          </div>
          <div className="flex gap-4">
            {connected && properties.length > 0 ? (
              <div className="flex gap-4">
                <PropertySelector
                  properties={properties}
                  selectedProperty={selectedProperty}
                  onSelect={setSelectedProperty}
                />
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg font-medium transition"
                >
                  {syncing ? "Syncing..." : "Sync Data"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {!connected ? (
                  <button
                    onClick={() => (window.location.href = "/api/auth/login")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    Connect Google
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedGooglePropertyUrl || ""}
                      onChange={(e) => setSelectedGooglePropertyUrl(e.target.value)}
                      className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-slate-200"
                    >
                      {googleProperties.map((p) => (
                        <option key={p.siteUrl} value={p.siteUrl}>
                          {p.siteUrl}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleInitialSync}
                      disabled={!selectedGooglePropertyUrl || syncing}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg font-medium transition"
                    >
                      {syncing ? "Syncing..." : "Sync Property"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {analysis ? (
          <div className="space-y-6">
            <PerformanceMetrics analysis={analysis} />

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <RecommendationsPanel analysis={analysis} />
                <PageAnalysis analysis={analysis} />
              </div>
              <QueryOpportunities analysis={analysis} />
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center bg-slate-900 border-slate-800">
            <p className="text-slate-400 mb-4">No data available. Click "Sync Data" to fetch your GSC metrics.</p>
          </Card>
        )}
      </div>
    </main>
  )
}
