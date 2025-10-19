import { neon } from "@neondatabase/serverless"

let sql: any = null

function getSql() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

// User token management
export async function saveUserTokens(userId: string, tokens: any) {
  const sql_client = getSql()
  const expiryDate = tokens.expiry_date ? new Date(tokens.expiry_date) : null

  await sql_client.query(
    `
    INSERT INTO user_tokens (user_id, access_token, refresh_token, token_expiry)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id) DO UPDATE SET
      access_token = $2,
      refresh_token = $3,
      token_expiry = $4,
      updated_at = CURRENT_TIMESTAMP
  `,
    [userId, tokens.access_token, tokens.refresh_token || null, expiryDate],
  )
}

export async function getUserTokens(userId: string) {
  const sql_client = getSql()
  const result = await sql_client.query("SELECT * FROM user_tokens WHERE user_id = $1", [userId])
  return result.rows[0] || null
}

// GSC Properties management
export async function saveGSCProperty(userId: string, propertyUrl: string, propertyName: string) {
  const sql_client = getSql()
  const result = await sql_client.query(
    `
    INSERT INTO gsc_properties (user_id, property_url, property_name)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, property_url) DO UPDATE SET
      property_name = $3,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id
  `,
    [userId, propertyUrl, propertyName],
  )
  return result.rows[0].id
}

export async function getUserProperties(userId: string) {
  const sql_client = getSql()
  const result = await sql_client.query(
    "SELECT * FROM gsc_properties WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  )
  return result.rows
}

// GSC Search data storage
export async function saveSearchData(propertyId: number, rows: any[]) {
  const sql_client = getSql()

  for (const row of rows) {
    const page = row.keys[0]
    const query = row.keys[1]
    const impressions = row.impressions || 0
    const clicks = row.clicks || 0
    const position = row.position || 0
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0

    await sql_client.query(
      `
      INSERT INTO gsc_search_data (property_id, page, query, impressions, clicks, avg_position, ctr, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
      ON CONFLICT (property_id, page, query, date) DO UPDATE SET
        impressions = $4,
        clicks = $5,
        avg_position = $6,
        ctr = $7
    `,
      [propertyId, page, query, impressions, clicks, position, ctr],
    )
  }
}

// Recommendations management
export async function saveRecommendation(
  propertyId: number,
  type: string,
  recommendation: string,
  targetPage?: string,
  targetQuery?: string,
  priority = "medium",
) {
  const sql_client = getSql()
  const result = await sql_client.query(
    `
    INSERT INTO seo_recommendations (property_id, type, target_page, target_query, recommendation, priority)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `,
    [propertyId, type, targetPage || null, targetQuery || null, recommendation, priority],
  )
  return result.rows[0].id
}

export async function getRecommendations(propertyId: number, status = "pending") {
  const sql_client = getSql()
  const result = await sql_client.query(
    `
    SELECT * FROM seo_recommendations 
    WHERE property_id = $1 AND status = $2
    ORDER BY priority DESC, created_at DESC
  `,
    [propertyId, status],
  )
  return result.rows
}

// Analytics queries
export async function getPagePerformance(propertyId: number, days = 30) {
  const sql_client = getSql()
  const result = await sql_client.query(
    `
    SELECT 
      page,
      SUM(impressions) as total_impressions,
      SUM(clicks) as total_clicks,
      AVG(avg_position) as avg_position,
      AVG(ctr) as avg_ctr
    FROM gsc_search_data
    WHERE property_id = $1 AND date >= CURRENT_DATE - INTERVAL '1 day' * $2
    GROUP BY page
    ORDER BY total_impressions DESC
  `,
    [propertyId, days],
  )
  return result.rows
}

export async function getQueryPerformance(propertyId: number, days = 30) {
  const sql_client = getSql()
  const result = await sql_client.query(
    `
    SELECT 
      query,
      SUM(impressions) as total_impressions,
      SUM(clicks) as total_clicks,
      AVG(avg_position) as avg_position,
      AVG(ctr) as avg_ctr
    FROM gsc_search_data
    WHERE property_id = $1 AND date >= CURRENT_DATE - INTERVAL '1 day' * $2
    GROUP BY query
    ORDER BY total_impressions DESC
  `,
    [propertyId, days],
  )
  return result.rows
}

export async function getLowCTRPages(propertyId: number, minImpressions = 100) {
  const sql_client = getSql()
  const result = await sql_client.query(
    `
    SELECT 
      page,
      SUM(impressions) as total_impressions,
      AVG(ctr) as avg_ctr,
      AVG(avg_position) as avg_position
    FROM gsc_search_data
    WHERE property_id = $1
    GROUP BY page
    HAVING SUM(impressions) >= $2 AND AVG(ctr) < 5
    ORDER BY total_impressions DESC
  `,
    [propertyId, minImpressions],
  )
  return result.rows
}

export async function getOpportunityQueries(propertyId: number, minPosition = 8, maxPosition = 20) {
  const sql_client = getSql()
  const result = await sql_client.query(
    `
    SELECT 
      query,
      SUM(impressions) as total_impressions,
      AVG(avg_position) as avg_position,
      COUNT(DISTINCT page) as page_count
    FROM gsc_search_data
    WHERE property_id = $1 AND avg_position >= $2 AND avg_position <= $3
    GROUP BY query
    ORDER BY total_impressions DESC
    LIMIT 50
  `,
    [propertyId, minPosition, maxPosition],
  )
  return result.rows
}

// Users management
export async function upsertUser(user: {
  google_id: string
  email?: string
  name?: string
  picture?: string
}) {
  const sql_client = getSql()
  const result = await sql_client.query(
    `
    INSERT INTO users (google_id, email, name, picture)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (google_id) DO UPDATE SET
      email = COALESCE(EXCLUDED.email, users.email),
      name = COALESCE(EXCLUDED.name, users.name),
      picture = COALESCE(EXCLUDED.picture, users.picture),
      updated_at = CURRENT_TIMESTAMP
    RETURNING google_id
  `,
    [user.google_id, user.email || null, user.name || null, user.picture || null],
  )
  return result.rows[0]?.google_id as string
}

export async function getUserByGoogleId(googleId: string) {
  const sql_client = getSql()
  const result = await sql_client.query("SELECT * FROM users WHERE google_id = $1", [googleId])
  return result.rows[0] || null
}
