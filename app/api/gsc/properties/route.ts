import { getUserProperties } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"

    // Get properties from database
    const dbProperties = await getUserProperties(userId)
    return Response.json(dbProperties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch properties" },
      { status: 500 },
    )
  }
}
