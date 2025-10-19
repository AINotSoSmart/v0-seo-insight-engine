import { generateText } from "ai"

export async function generatePageOptimizationSuggestions(
  page: string,
  query: string,
  currentPosition: number,
  ctr: number,
) {
  const prompt = `You are an SEO expert. Analyze this page and provide specific optimization recommendations.

Page URL: ${page}
Target Query: ${query}
Current Position: ${currentPosition}
Current CTR: ${ctr}%

Provide 3-5 specific, actionable recommendations to improve this page's ranking and CTR. Format as a JSON array with objects containing "title" and "description" fields.`

  const { text } = await generateText({
    model: "google/gemini-2.0-flash",
    prompt,
  })

  try {
    return JSON.parse(text)
  } catch {
    return [{ title: "Optimization Needed", description: text }]
  }
}

export async function generateArticleOutline(query: string, impressions: number) {
  const prompt = `You are an SEO content strategist. Create a detailed article outline for a blog post targeting this search query.

Query: ${query}
Monthly Impressions: ${impressions}

Generate a comprehensive article outline with:
1. Meta title (60 chars max)
2. Meta description (160 chars max)
3. Main sections with subsections
4. Target keywords to include
5. Content recommendations

Format as JSON with fields: metaTitle, metaDescription, sections (array), targetKeywords (array), recommendations (array)`

  const { text } = await generateText({
    model: "google/gemini-2.0-flash",
    prompt,
  })

  try {
    return JSON.parse(text)
  } catch {
    return { outline: text }
  }
}

export async function generateMetaTagSuggestions(page: string, query: string, currentCTR: number) {
  const prompt = `You are an SEO copywriter. Generate improved meta tags for this page to increase CTR.

Page: ${page}
Target Query: ${query}
Current CTR: ${currentCTR}%

Generate:
1. New meta title (50-60 characters, include main keyword)
2. New meta description (150-160 characters, include call-to-action)
3. Explanation of why these will improve CTR

Format as JSON with fields: title, description, explanation`

  const { text } = await generateText({
    model: "google/gemini-2.0-flash",
    prompt,
  })

  try {
    return JSON.parse(text)
  } catch {
    return { suggestions: text }
  }
}

export async function generateContentRewrite(page: string, query: string, currentPosition: number) {
  const prompt = `You are an SEO content expert. Provide specific content rewrite suggestions for this page.

Page: ${page}
Target Query: ${query}
Current Position: ${currentPosition}

Suggest:
1. Key sections to add or expand
2. Keywords to naturally incorporate
3. Internal linking opportunities
4. Content structure improvements
5. Estimated impact on ranking

Format as JSON with fields: sections, keywords, internalLinks, structure, impact`

  const { text } = await generateText({
    model: "google/gemini-2.0-flash",
    prompt,
  })

  try {
    return JSON.parse(text)
  } catch {
    return { suggestions: text }
  }
}
