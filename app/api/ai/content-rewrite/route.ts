import { generateContentRewrite } from "@/lib/ai-recommendations"

export async function POST(request: Request) {
  try {
    const { page, query, position } = await request.json()

    if (!page || !query) {
      return Response.json({ error: "Page and query are required" }, { status: 400 })
    }

    const suggestions = await generateContentRewrite(page, query, position || 10)

    return Response.json({ suggestions })
  } catch (error) {
    console.error("Content rewrite error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate suggestions" },
      { status: 500 },
    )
  }
}
