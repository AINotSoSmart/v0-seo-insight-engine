import { generatePageOptimizationSuggestions } from "@/lib/ai-recommendations"

export async function POST(request: Request) {
  try {
    const { page, query, position, ctr } = await request.json()

    if (!page || !query) {
      return Response.json({ error: "Page and query are required" }, { status: 400 })
    }

    const suggestions = await generatePageOptimizationSuggestions(page, query, position || 10, ctr || 5)

    return Response.json({ suggestions })
  } catch (error) {
    console.error("AI suggestion error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate suggestions" },
      { status: 500 },
    )
  }
}
