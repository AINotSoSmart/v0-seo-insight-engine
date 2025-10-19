import { google } from "googleapis"
import { getStoredTokens, setCredentials } from "./gsc-auth"
import { saveGSCProperty, saveSearchData } from "./db"

const webmasters = google.webmasters("v3")

export async function getGSCProperties(userId: string) {
  try {
    const tokens = await getStoredTokens(userId)
    if (!tokens) throw new Error("Not authenticated")

    setCredentials(tokens)

    const response = await webmasters.sites.list()
    return response.data.siteEntry || []
  } catch (error) {
    console.error("Error fetching GSC properties:", error)
    throw error
  }
}

export async function syncGSCData(userId: string, propertyUrl: string, days = 90) {
  try {
    const tokens = await getStoredTokens(userId)
    if (!tokens) throw new Error("Not authenticated")

    setCredentials(tokens)

    // Save property to database
    const propertyId = await saveGSCProperty(userId, propertyUrl, propertyUrl)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const response = await webmasters.searchanalytics.query({
      siteUrl: propertyUrl,
      requestBody: {
        startDate: startDate.toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        dimensions: ["page", "query"],
        rowLimit: 25000,
      },
    })

    // Save data to database
    if (response.data.rows) {
      await saveSearchData(propertyId, response.data.rows)
    }

    console.log("[v0] Synced", response.data.rows?.length || 0, "rows for property", propertyUrl)

    return {
      success: true,
      propertyId,
      rowsCount: response.data.rows?.length || 0,
    }
  } catch (error) {
    console.error("Error syncing GSC data:", error)
    throw error
  }
}
