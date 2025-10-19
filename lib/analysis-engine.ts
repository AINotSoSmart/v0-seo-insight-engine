import {
  getPagePerformance,
  getQueryPerformance,
  getLowCTRPages,
  getOpportunityQueries,
  saveRecommendation,
} from "./db"

interface PageRecommendation {
  page: string
  totalImpressions: number
  avgCTR: number
  avgPosition: number
  recommendations: string[]
  priority: "high" | "medium" | "low"
}

interface QueryRecommendation {
  query: string
  totalImpressions: number
  avgPosition: number
  pageCount: number
  recommendation: string
  priority: "high" | "medium" | "low"
}

interface AnalysisSummary {
  pageRecommendations: PageRecommendation[]
  queryRecommendations: QueryRecommendation[]
  newArticleOpportunities: QueryRecommendation[]
  cannibalizedKeywords: Array<{
    query: string
    pages: string[]
    recommendation: string
  }>
  totalRecommendations: number
}

export async function analyzeGSCData(propertyId: number, days = 30): Promise<AnalysisSummary> {
  const [pagePerformance, queryPerformance, lowCTRPages, opportunityQueries] = await Promise.all([
    getPagePerformance(propertyId, days),
    getQueryPerformance(propertyId, days),
    getLowCTRPages(propertyId, 100),
    getOpportunityQueries(propertyId, 8, 20),
  ])

  const pageRecommendations: PageRecommendation[] = []
  const queryRecommendations: QueryRecommendation[] = []
  const newArticleOpportunities: QueryRecommendation[] = []

  // Analyze low CTR pages
  for (const page of lowCTRPages) {
    const recommendations: string[] = []
    const avgCTR = Number(page.avg_ctr) || 0
    const avgPosition = Number(page.avg_position) || 0

    if (avgCTR < 2) {
      recommendations.push("Critical: CTR below 2%. Rewrite meta title and description to improve click-through rate.")
    } else if (avgCTR < 5) {
      recommendations.push("Improve meta title and description to increase CTR from current " + avgCTR.toFixed(1) + "%")
    }

    if (avgPosition > 10) {
      recommendations.push(
        "Page ranks below position 10. Consider adding internal links and updating content with target keywords.",
      )
    }

    if (recommendations.length > 0) {
      pageRecommendations.push({
        page: page.page,
        totalImpressions: Number(page.total_impressions),
        avgCTR: avgCTR,
        avgPosition: avgPosition,
        recommendations,
        priority: avgCTR < 2 ? "high" : "medium",
      })
    }
  }

  // Analyze opportunity queries (positions 8-20)
  for (const query of opportunityQueries) {
    const avgPosition = Number(query.avg_position) || 0
    const totalImpressions = Number(query.total_impressions) || 0
    const pageCount = Number(query.page_count) || 0

    if (pageCount === 1) {
      // Single page ranking - opportunity to improve
      queryRecommendations.push({
        query: query.query,
        totalImpressions,
        avgPosition,
        pageCount,
        recommendation: `Page ranks at position ${avgPosition.toFixed(1)} for "${query.query}". Optimize content with better keyword placement and add internal links to move to top 3.`,
        priority: avgPosition < 12 ? "high" : "medium",
      })
    } else if (pageCount > 1) {
      // Keyword cannibalization
      queryRecommendations.push({
        query: query.query,
        totalImpressions,
        avgPosition,
        pageCount,
        recommendation: `Keyword cannibalization detected: ${pageCount} pages ranking for "${query.query}". Consolidate content or add clear internal linking hierarchy.`,
        priority: "high",
      })
    }

    // New article opportunity if high impressions but no ranking
    if (totalImpressions > 500 && avgPosition > 15) {
      newArticleOpportunities.push({
        query: query.query,
        totalImpressions,
        avgPosition,
        pageCount,
        recommendation: `High-volume query "${query.query}" (${totalImpressions} impressions) with weak ranking. Create new optimized article targeting this keyword.`,
        priority: "high",
      })
    }
  }

  // Detect keyword cannibalization
  const cannibalizedKeywords: Array<{
    query: string
    pages: string[]
    recommendation: string
  }> = []

  const queryPageMap = new Map<string, string[]>()
  for (const query of queryPerformance) {
    if (!queryPageMap.has(query.query)) {
      queryPageMap.set(query.query, [])
    }
  }

  // Find queries with multiple pages
  for (const [query, pages] of queryPageMap.entries()) {
    if (pages.length > 1) {
      cannibalizedKeywords.push({
        query,
        pages,
        recommendation: `Multiple pages ranking for "${query}". Consolidate content or implement clear internal linking strategy.`,
      })
    }
  }

  // Sort by priority
  pageRecommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  queryRecommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  newArticleOpportunities.sort((a, b) => Number(b.totalImpressions) - Number(a.totalImpressions))

  return {
    pageRecommendations,
    queryRecommendations,
    newArticleOpportunities: newArticleOpportunities.slice(0, 10),
    cannibalizedKeywords,
    totalRecommendations: pageRecommendations.length + queryRecommendations.length + newArticleOpportunities.length,
  }
}

export async function generateAndSaveRecommendations(propertyId: number) {
  const analysis = await analyzeGSCData(propertyId)

  // Save page optimization recommendations
  for (const pageRec of analysis.pageRecommendations) {
    for (const rec of pageRec.recommendations) {
      await saveRecommendation(propertyId, "page_optimization", rec, pageRec.page, undefined, pageRec.priority)
    }
  }

  // Save query optimization recommendations
  for (const queryRec of analysis.queryRecommendations) {
    await saveRecommendation(
      propertyId,
      "query_optimization",
      queryRec.recommendation,
      undefined,
      queryRec.query,
      queryRec.priority,
    )
  }

  // Save new article recommendations
  for (const articleRec of analysis.newArticleOpportunities) {
    await saveRecommendation(
      propertyId,
      "new_article",
      articleRec.recommendation,
      undefined,
      articleRec.query,
      articleRec.priority,
    )
  }

  return analysis
}
