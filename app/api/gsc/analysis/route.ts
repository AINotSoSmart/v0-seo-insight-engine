import { analyzeGSCData, generateAndSaveRecommendations } from "@/lib/analysis-engine"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")
    const days = Number.parseInt(searchParams.get("days") || "30")

    if (!propertyId) {
      return Response.json({ error: "Property ID is required" }, { status: 400 })
    }

    const propertyIdNum = Number.parseInt(propertyId)
    const analysis = await analyzeGSCData(propertyIdNum, days)

    return Response.json(analysis)
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Analysis failed" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { propertyId } = await request.json()

    if (!propertyId) {
      return Response.json({ error: "Property ID is required" }, { status: 400 })
    }

    const analysis = await generateAndSaveRecommendations(propertyId)
    return Response.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Analysis failed" }, { status: 500 })
  }
}
