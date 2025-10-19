import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QueryOpportunitiesProps {
  analysis: any
}

export default function QueryOpportunities({ analysis }: QueryOpportunitiesProps) {
  const opportunities = (analysis.newArticleOpportunities || []).slice(0, 8)

  return (
    <Card className="bg-slate-900 border-slate-800 h-fit">
      <CardHeader>
        <CardTitle className="text-slate-50 text-lg">New Article Ideas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {opportunities.length > 0 ? (
            opportunities.map((opp, idx) => (
              <div key={idx} className="p-2 bg-slate-800 rounded border border-slate-700">
                <p className="text-sm font-medium text-slate-50 mb-1">{opp.query}</p>
                <p className="text-xs text-slate-400">{opp.totalImpressions} impressions</p>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center py-8 text-sm">No opportunities found</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
