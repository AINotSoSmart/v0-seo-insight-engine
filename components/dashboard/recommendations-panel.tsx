"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AISuggestionsModal from "./ai-suggestions-modal"

interface RecommendationsPanelProps {
  analysis: any
}

export default function RecommendationsPanel({ analysis }: RecommendationsPanelProps) {
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [selectedRec, setSelectedRec] = useState<any>(null)

  const allRecs = [
    ...(analysis.pageRecommendations || []),
    ...(analysis.queryRecommendations || []),
    ...(analysis.newArticleOpportunities || []),
  ].slice(0, 5)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-900 text-red-200"
      case "medium":
        return "bg-yellow-900 text-yellow-200"
      default:
        return "bg-slate-700 text-slate-200"
    }
  }

  const handleAISuggestions = (rec: any) => {
    setSelectedRec(rec)
    setAiModalOpen(true)
  }

  return (
    <>
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-50">Top Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allRecs.length > 0 ? (
              allRecs.map((rec, idx) => (
                <div key={idx} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-50 flex-1">{rec.page || rec.query || "Recommendation"}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">
                    {rec.recommendations?.[0] || rec.recommendation || "No details"}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAISuggestions(rec)}
                    className="text-xs bg-slate-700 hover:bg-slate-600 border-slate-600"
                  >
                    Get AI Suggestions
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No recommendations available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedRec && (
        <AISuggestionsModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          page={selectedRec.page || ""}
          query={selectedRec.query || ""}
          type={selectedRec.page ? "page" : "article"}
        />
      )}
    </>
  )
}
