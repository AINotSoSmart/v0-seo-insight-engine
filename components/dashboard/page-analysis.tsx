import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PageAnalysisProps {
  analysis: any
}

export default function PageAnalysis({ analysis }: PageAnalysisProps) {
  const pages = (analysis.pageRecommendations || []).slice(0, 5)

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-50">Pages Needing Optimization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pages.length > 0 ? (
            pages.map((page, idx) => (
              <div key={idx} className="p-3 bg-slate-800 rounded border border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-mono text-blue-400 truncate flex-1">{page.page}</p>
                  <span className="text-xs text-slate-400 ml-2">{page.totalImpressions} impressions</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-slate-400">CTR: {page.avgCTR.toFixed(1)}%</span>
                  <span className="text-slate-400">Pos: {page.avgPosition.toFixed(1)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center py-8">No pages need optimization</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
