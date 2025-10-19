import { generateArticleOutline } from "@/lib/ai-recommendations"

export async function POST(request: Request) {
  try {
    const { query, impressions } = await request.json()

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 })
    }

    const outline = await generateArticleOutline(query, impressions || 500)

    return Response.json({ outline })
  } catch (error) {
    console.error("Article outline error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate outline" },
      { status: 500 },
    )
  }
}
