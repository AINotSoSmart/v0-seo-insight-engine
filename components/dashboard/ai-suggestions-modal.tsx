"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface AISuggestionsModalProps {
  isOpen: boolean
  onClose: () => void
  page: string
  query: string
  type: "page" | "meta" | "article" | "content"
}

export default function AISuggestionsModal({ isOpen, onClose, page, query, type }: AISuggestionsModalProps) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const generateSuggestions = async () => {
    setLoading(true)
    setError(null)

    try {
      let endpoint = ""
      let body: any = { page, query }

      switch (type) {
        case "page":
          endpoint = "/api/ai/page-suggestions"
          break
        case "meta":
          endpoint = "/api/ai/meta-tags"
          break
        case "article":
          endpoint = "/api/ai/article-outline"
          body = { query }
          break
        case "content":
          endpoint = "/api/ai/content-rewrite"
          break
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw new Error("Failed to generate suggestions")
      }

      const data = await res.json()
      setSuggestions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-50">
            {type === "page" && "Page Optimization Suggestions"}
            {type === "meta" && "Meta Tag Suggestions"}
            {type === "article" && "Article Outline"}
            {type === "content" && "Content Rewrite Suggestions"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!suggestions && !loading && (
            <Button onClick={generateSuggestions} className="w-full bg-blue-600 hover:bg-blue-700">
              Generate AI Suggestions
            </Button>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Spinner className="mr-2" />
              <span className="text-slate-400">Generating suggestions...</span>
            </div>
          )}

          {error && <div className="p-4 bg-red-900/20 border border-red-800 rounded text-red-200">{error}</div>}

          {suggestions && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Array.isArray(suggestions.suggestions) ? (
                suggestions.suggestions.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-800 rounded border border-slate-700">
                    <h4 className="font-semibold text-slate-50 mb-2">{item.title || `Suggestion ${idx + 1}`}</h4>
                    <p className="text-sm text-slate-300">{item.description || JSON.stringify(item)}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-800 rounded border border-slate-700">
                  <pre className="text-xs text-slate-300 overflow-x-auto">{JSON.stringify(suggestions, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
