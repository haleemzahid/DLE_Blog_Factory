/**
 * AI Content Generation Utility
 *
 * This utility generates unique, city-specific content from templates using AI.
 * It ensures each generated version is sufficiently unique (30%+) to avoid SEO penalties.
 */

import type { Payload } from 'payload'

export interface CityData {
  cityName: string
  population?: number
  medianHomePrice?: number
  medianRent?: number
  priceChange12Month?: number
  salesCount30Days?: number
  avgDaysOnMarket?: number
  inventoryLevel?: string
  marketTrend?: string
  neighborhoods?: Array<{
    name: string
    avgPrice?: number
    description?: string
  }>
  topSchools?: Array<{
    name: string
    rating?: number
    type?: string
  }>
  uniqueFacts?: Array<{
    fact: string
  }>
  nearbyCity?: string
  region?: string
  keyEmployers?: Array<{
    name: string
    industry?: string
  }>
}

export interface GeneratedContent {
  titleOverride: string
  descriptionOverride: string
  introOverride: string
  customSlug?: string
}

export interface AIPromptContext {
  cityName: string
  templateTitle: string
  templateContent: string
  cityData: CityData
  aiPrompt?: string
  cityDataTokens?: {
    useCityName?: boolean
    useMedianPrice?: boolean
    usePriceChange?: boolean
    useSchools?: boolean
    useNeighborhoods?: boolean
    useUniqueFacts?: boolean
    useMarketStats?: boolean
  }
}

/**
 * Generate city-specific content using AI
 *
 * @param payload - Payload CMS instance
 * @param templateId - ID of the template post
 * @param cityId - ID of the city data
 * @returns Generated unique content for the city
 */
export async function generateCityContent(
  payload: Payload,
  templateId: string,
  cityId: string,
): Promise<GeneratedContent> {
  try {
    // 1. Fetch template post
    const template = await payload.findByID({
      collection: 'posts',
      id: templateId,
    })

    if (!template) {
      throw new Error(`Template post ${templateId} not found`)
    }

    if (!template.isTemplate) {
      throw new Error(`Post ${templateId} is not marked as a template`)
    }

    // 2. Fetch city data
    const cityData = await payload.findByID({
      collection: 'cityData',
      id: cityId,
    })

    if (!cityData) {
      throw new Error(`City data ${cityId} not found`)
    }

    // 3. Build AI prompt context
    const context = buildPromptContext(template, cityData)

    // 4. Generate content using AI
    const generatedContent = await callAI(context)

    // 5. Validate uniqueness (should be 30%+ different)
    const isUnique = await validateContentUniqueness(
      template.title,
      generatedContent.titleOverride,
      30,
    )

    if (!isUnique) {
      console.warn(
        `Generated content for ${cityData.cityName} may not be unique enough. Consider adjusting AI prompt.`,
      )
    }

    return generatedContent
  } catch (error) {
    console.error('Error generating city content:', error)
    throw error
  }
}

/**
 * Build AI prompt context from template and city data
 */
function buildPromptContext(template: any, cityData: any): AIPromptContext {
  const tokens = template.cityDataTokens || {}

  return {
    cityName: cityData.cityName,
    templateTitle: template.title,
    templateContent: extractTextFromLexical(template.content),
    cityData: cityData,
    aiPrompt: template.aiPrompt,
    cityDataTokens: tokens,
  }
}

/**
 * Call AI API to generate unique content
 *
 * Note: This is a placeholder. You'll need to integrate with your preferred AI service:
 * - OpenAI GPT-4
 * - Anthropic Claude
 * - Google Gemini
 * - Azure OpenAI
 */
async function callAI(context: AIPromptContext): Promise<GeneratedContent> {
  // Placeholder implementation
  // TODO: Replace with actual AI API call

  const defaultPrompt = buildDefaultPrompt(context)

  // Example structure for AI API call:
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a real estate content writer creating unique, SEO-optimized content for specific cities.',
        },
        {
          role: 'user',
          content: defaultPrompt,
        },
      ],
      temperature: 0.8, // Higher for more variation
    }),
  })

  const data = await response.json()
  return parseAIResponse(data.choices[0].message.content)
  */

  // For now, return a simple token-replacement version
  return generateSimpleContent(context)
}

/**
 * Build default AI prompt
 */
function buildDefaultPrompt(context: AIPromptContext): string {
  const { cityName, templateTitle, cityData, cityDataTokens } = context

  let prompt = `Generate unique, engaging real estate content for ${cityName}.\n\n`
  prompt += `Base Template Title: "${templateTitle}"\n\n`
  prompt += `Requirements:\n`
  prompt += `- Create a unique title that includes "${cityName}"\n`
  prompt += `- Write a unique meta description (150-160 characters)\n`
  prompt += `- Write a unique introduction paragraph (2-3 sentences)\n`
  prompt += `- Content must be at least 30% different from the template\n`
  prompt += `- Use natural, engaging language\n`
  prompt += `- Focus on local market insights\n\n`

  prompt += `City Information:\n`
  prompt += `- City: ${cityName}\n`

  if (cityDataTokens?.useMedianPrice && cityData.medianHomePrice) {
    prompt += `- Median Home Price: $${cityData.medianHomePrice.toLocaleString()}\n`
  }

  if (cityDataTokens?.usePriceChange && cityData.priceChange12Month) {
    prompt += `- 12-Month Price Change: ${cityData.priceChange12Month}%\n`
  }

  if (cityDataTokens?.useMarketStats) {
    if (cityData.salesCount30Days) {
      prompt += `- Homes Sold (30 days): ${cityData.salesCount30Days}\n`
    }
    if (cityData.avgDaysOnMarket) {
      prompt += `- Avg Days on Market: ${cityData.avgDaysOnMarket}\n`
    }
    if (cityData.marketTrend) {
      prompt += `- Market Trend: ${cityData.marketTrend}\n`
    }
  }

  if (cityDataTokens?.useNeighborhoods && cityData.neighborhoods?.length) {
    prompt += `- Top Neighborhoods: ${cityData.neighborhoods.map((n) => n.name).join(', ')}\n`
  }

  if (cityDataTokens?.useSchools && cityData.topSchools?.length) {
    prompt += `- Top Schools: ${cityData.topSchools.map((s) => s.name).join(', ')}\n`
  }

  if (cityDataTokens?.useUniqueFacts && cityData.uniqueFacts?.length) {
    prompt += `\nUnique Facts about ${cityName}:\n`
    cityData.uniqueFacts.forEach((fact) => {
      prompt += `- ${fact.fact}\n`
    })
  }

  prompt += `\nPlease return a JSON object with the following structure:\n`
  prompt += `{\n`
  prompt += `  "titleOverride": "Your unique title here",\n`
  prompt += `  "descriptionOverride": "Your unique meta description here",\n`
  prompt += `  "introOverride": "Your unique introduction paragraph here"\n`
  prompt += `}\n`

  return prompt
}

/**
 * Generate simple content using token replacement (fallback)
 */
function generateSimpleContent(context: AIPromptContext): GeneratedContent {
  const { cityName, templateTitle, cityData } = context

  // Simple token replacement
  let title = templateTitle.replace(/\[CITY\]/gi, cityName)
  let description = `Learn about the ${cityName} real estate market. Get insights on home prices, neighborhoods, and market trends in ${cityName}.`
  let intro = `Thinking about buying or selling a home in ${cityName}? `

  // Add city-specific details
  if (cityData.medianHomePrice) {
    intro += `The median home price in ${cityName} is $${cityData.medianHomePrice.toLocaleString()}. `
  }

  if (cityData.uniqueFacts && cityData.uniqueFacts.length > 0) {
    intro += cityData.uniqueFacts[0].fact + ' '
  }

  intro += `As your local ${cityName} real estate expert, I'm here to guide you through every step of the process.`

  return {
    titleOverride: title,
    descriptionOverride: description,
    introOverride: intro,
    customSlug: templateTitle
      .toLowerCase()
      .replace(/\[city\]/gi, cityName.toLowerCase())
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  }
}

/**
 * Validate content uniqueness (simple check)
 */
async function validateContentUniqueness(
  original: string,
  generated: string,
  minUniquePercentage: number = 30,
): Promise<boolean> {
  // Simple word-level comparison
  const originalWords = new Set(original.toLowerCase().split(/\s+/))
  const generatedWords = generated.toLowerCase().split(/\s+/)

  const uniqueWords = generatedWords.filter((word) => !originalWords.has(word))
  const uniquePercentage = (uniqueWords.length / generatedWords.length) * 100

  return uniquePercentage >= minUniquePercentage
}

/**
 * Extract plain text from Lexical JSON
 */
function extractTextFromLexical(content: any): string {
  if (!content || !content.root) return ''

  let text = ''

  function traverse(node: any) {
    if (node.type === 'text') {
      text += node.text + ' '
    }
    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  traverse(content.root)
  return text.trim()
}

/**
 * Parse AI response (for when using actual AI API)
 */
function parseAIResponse(response: string): GeneratedContent {
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(response)
    return {
      titleOverride: parsed.titleOverride || '',
      descriptionOverride: parsed.descriptionOverride || '',
      introOverride: parsed.introOverride || '',
      customSlug: parsed.customSlug,
    }
  } catch (e) {
    // If not valid JSON, return as-is
    console.error('Failed to parse AI response as JSON:', e)
    throw new Error('Invalid AI response format')
  }
}
