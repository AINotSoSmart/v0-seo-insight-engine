import { syncGSCData } from "@/lib/gsc-client"

export async function POST(request: Request) {
  try {
    const { propertyUrl, days = 90, userId = "default" } = await request.json()

    if (!propertyUrl) {
      return Response.json({ error: "Property URL is required" }, { status: 400 })
    }

    const result = await syncGSCData(userId, propertyUrl, days)
    return Response.json(result)
  } catch (error) {
    console.error("Sync error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Sync failed" }, { status: 500 })
  }
}
