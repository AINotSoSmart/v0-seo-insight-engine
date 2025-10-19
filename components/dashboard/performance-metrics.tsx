import { Card, CardContent } from "@/components/ui/card"

interface PerformanceMetricsProps {
  analysis: any
}

export default function PerformanceMetrics({ analysis }: PerformanceMetricsProps) {
  const summary = analysis.summary || {}

  const metrics = [
    { label: "Total Pages", value: summary.totalPages || 0 },
    { label: "Total Queries", value: summary.totalQueries || 0 },
    { label: "Avg Position", value: (summary.avgPosition || 0).toFixed(1) },
    { label: "Recommendations", value: analysis.totalRecommendations || 0 },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-400 mb-2">{metric.label}</div>
            <div className="text-2xl font-bold text-slate-50">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
