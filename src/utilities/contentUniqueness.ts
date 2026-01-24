/**
 * Content Uniqueness Scoring Utility
 * Analyzes content to determine uniqueness for SEO safety
 *
 * Based on research from programmatic-seo-research.md:
 * - Google requires 30-50% unique content per page to avoid thin content penalties
 * - Duplicate content across syndication is a major SEO risk
 * - Dynamic data injection helps create unique content at scale
 */

import type { Agent, CityDatum, Post } from '@/payload-types'

export interface UniquenessAnalysis {
  score: number // 0-100
  grade: 'excellent' | 'good' | 'acceptable' | 'risky' | 'dangerous'
  factors: UniquenessFactors
  recommendations: string[]
  warnings: string[]
}

export interface UniquenessFactors {
  // Content composition
  dynamicContentRatio: number // % of content from dynamic generators
  tokenReplacementRatio: number // % of content with replaced tokens
  staticContentRatio: number // % of static/boilerplate content

  // Data richness
  cityDataFields: number // Count of city data fields used
  agentDataFields: number // Count of agent data fields used
  hasNeighborhoods: boolean
  hasSchools: boolean
  hasDemographics: boolean
  hasCulturalData: boolean

  // Content metrics
  totalWordCount: number
  uniqueWordCount: number
  contentLength: number

  // SEO factors
  hasLocalKeywords: boolean
  hasAgentMention: boolean
  hasCityMention: boolean
}

/**
 * Analyze content uniqueness for SEO safety
 */
export function analyzeContentUniqueness(
  content: string,
  agent?: Agent | null,
  cityData?: CityDatum | null,
  templateContent?: string
): UniquenessAnalysis {
  const factors = calculateFactors(content, agent, cityData, templateContent)
  const score = calculateScore(factors)
  const grade = getGrade(score)
  const recommendations = generateRecommendations(factors, score)
  const warnings = generateWarnings(factors, score)

  return {
    score,
    grade,
    factors,
    recommendations,
    warnings,
  }
}

/**
 * Calculate all uniqueness factors
 */
function calculateFactors(
  content: string,
  agent?: Agent | null,
  cityData?: CityDatum | null,
  templateContent?: string
): UniquenessFactors {
  const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  const uniqueWords = new Set(words)

  // Estimate dynamic vs static content
  let dynamicContentRatio = 0
  let tokenReplacementRatio = 0
  let staticContentRatio = 100

  // Check for city data presence (indicates dynamic content)
  const cityDataIndicators = [
    cityData?.cityName,
    cityData?.medianHomePrice,
    cityData?.population,
    (cityData as any)?.demographics?.diversityIndex,
  ].filter(Boolean).length

  // Check for agent data presence
  const agentDataIndicators = [
    agent?.name,
    agent?.phone,
    agent?.city,
    (agent as any)?.seo?.jsonLd?.aggregateRating,
  ].filter(Boolean).length

  // Estimate ratios based on data usage
  if (cityData) {
    dynamicContentRatio += cityDataIndicators * 8 // Up to 32%
  }
  if (agent) {
    tokenReplacementRatio += agentDataIndicators * 5 // Up to 20%
  }

  // Check for specific dynamic markers in content
  const dynamicMarkers = [
    /\$[\d,]+/g, // Currency values
    /\d{1,3}(?:,\d{3})*\s*(?:days?|months?|years?)/gi, // Time periods
    /\d+(?:\.\d+)?%/g, // Percentages
    /\d+(?:,\d{3})*\s*(?:homes?|properties|listings?)/gi, // Property counts
  ]

  dynamicMarkers.forEach(marker => {
    const matches = content.match(marker)
    if (matches && matches.length > 0) {
      dynamicContentRatio += matches.length * 2
    }
  })

  // Cap and adjust ratios
  dynamicContentRatio = Math.min(dynamicContentRatio, 60)
  tokenReplacementRatio = Math.min(tokenReplacementRatio, 30)
  staticContentRatio = Math.max(100 - dynamicContentRatio - tokenReplacementRatio, 10)

  // Count city data fields used
  const cityDataFields = cityData ? countCityDataFields(cityData, content) : 0
  const agentDataFields = agent ? countAgentDataFields(agent, content) : 0

  // Check for specific data types
  const hasNeighborhoods = Boolean(
    cityData?.neighborhoods &&
    (cityData.neighborhoods as any[]).length > 0 &&
    (cityData.neighborhoods as any[]).some(n => content.includes(n.name))
  )

  const hasSchools = Boolean(
    cityData?.topSchools &&
    (cityData.topSchools as any[]).length > 0 &&
    (cityData.topSchools as any[]).some(s => content.includes(s.name))
  )

  const demographics = (cityData as any)?.demographics
  const hasDemographics = Boolean(
    demographics?.diversityIndex ||
    demographics?.ethnicBreakdown?.length > 0
  )

  const hasCulturalData = Boolean(
    (cityData as any)?.placesOfWorship?.length > 0 ||
    (cityData as any)?.culturalCenters?.length > 0 ||
    (cityData as any)?.culturalEvents?.length > 0
  )

  // Check for local keywords
  const cityName = cityData?.cityName?.toLowerCase() || ''
  const agentCity = agent?.city?.toLowerCase() || ''
  const contentLower = content.toLowerCase()

  const hasLocalKeywords = Boolean(
    (cityName && contentLower.includes(cityName)) ||
    (agentCity && contentLower.includes(agentCity))
  )

  const hasAgentMention = Boolean(
    agent?.name && contentLower.includes(agent.name.toLowerCase()) ||
    agent?.displayName && contentLower.includes(agent.displayName.toLowerCase())
  )

  const hasCityMention = Boolean(cityName && contentLower.includes(cityName))

  return {
    dynamicContentRatio,
    tokenReplacementRatio,
    staticContentRatio,
    cityDataFields,
    agentDataFields,
    hasNeighborhoods,
    hasSchools,
    hasDemographics,
    hasCulturalData,
    totalWordCount: words.length,
    uniqueWordCount: uniqueWords.size,
    contentLength: content.length,
    hasLocalKeywords,
    hasAgentMention,
    hasCityMention,
  }
}

/**
 * Count how many city data fields are reflected in content
 */
function countCityDataFields(cityData: CityDatum, content: string): number {
  let count = 0
  const contentLower = content.toLowerCase()

  if (cityData.cityName && contentLower.includes(cityData.cityName.toLowerCase())) count++
  if (cityData.medianHomePrice && content.includes(formatCurrency(cityData.medianHomePrice))) count++
  if (cityData.population && content.includes(cityData.population.toLocaleString())) count++
  if (cityData.avgDaysOnMarket && content.includes(cityData.avgDaysOnMarket.toString())) count++
  if (cityData.neighborhoods && (cityData.neighborhoods as any[]).length > 0) count++
  if (cityData.topSchools && (cityData.topSchools as any[]).length > 0) count++

  return count
}

/**
 * Count how many agent data fields are reflected in content
 */
function countAgentDataFields(agent: Agent, content: string): number {
  let count = 0
  const contentLower = content.toLowerCase()

  if (agent.name && contentLower.includes(agent.name.toLowerCase())) count++
  if (agent.displayName && contentLower.includes(agent.displayName.toLowerCase())) count++
  if (agent.phone && content.includes(agent.phone)) count++
  if (agent.email && content.includes(agent.email)) count++
  if (agent.city && contentLower.includes(agent.city.toLowerCase())) count++

  return count
}

/**
 * Format currency for matching
 */
function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Calculate final uniqueness score (0-100)
 */
function calculateScore(factors: UniquenessFactors): number {
  let score = 0

  // Base score from content ratios (up to 50 points)
  score += factors.dynamicContentRatio * 0.5 // Up to 30
  score += factors.tokenReplacementRatio * 0.4 // Up to 12
  score += Math.max(0, 20 - factors.staticContentRatio * 0.2) // Penalty for high static

  // Data richness bonus (up to 25 points)
  score += Math.min(factors.cityDataFields * 3, 15) // Up to 15
  score += Math.min(factors.agentDataFields * 2, 10) // Up to 10

  // Specific data type bonuses (up to 15 points)
  if (factors.hasNeighborhoods) score += 4
  if (factors.hasSchools) score += 3
  if (factors.hasDemographics) score += 4
  if (factors.hasCulturalData) score += 4

  // SEO factor bonuses (up to 10 points)
  if (factors.hasLocalKeywords) score += 4
  if (factors.hasAgentMention) score += 3
  if (factors.hasCityMention) score += 3

  // Word diversity bonus
  const diversityRatio = factors.totalWordCount > 0
    ? factors.uniqueWordCount / factors.totalWordCount
    : 0
  score += diversityRatio * 5 // Up to 5 points

  return Math.min(Math.round(score), 100)
}

/**
 * Get grade based on score
 */
function getGrade(score: number): UniquenessAnalysis['grade'] {
  if (score >= 70) return 'excellent'
  if (score >= 50) return 'good'
  if (score >= 35) return 'acceptable'
  if (score >= 20) return 'risky'
  return 'dangerous'
}

/**
 * Generate recommendations to improve uniqueness
 */
function generateRecommendations(factors: UniquenessFactors, score: number): string[] {
  const recommendations: string[] = []

  if (score < 50) {
    recommendations.push('Add more city-specific market data to increase uniqueness')
  }

  if (!factors.hasNeighborhoods) {
    recommendations.push('Include neighborhood information for local SEO benefit')
  }

  if (!factors.hasSchools) {
    recommendations.push('Add school data to appeal to families and improve content depth')
  }

  if (!factors.hasDemographics) {
    recommendations.push('Include demographic data to make content more informative')
  }

  if (!factors.hasCulturalData) {
    recommendations.push('Add cultural/community information for multicultural targeting')
  }

  if (factors.staticContentRatio > 60) {
    recommendations.push('Reduce static boilerplate content and add more dynamic sections')
  }

  if (!factors.hasLocalKeywords) {
    recommendations.push('Include more local keywords (city name, neighborhoods)')
  }

  if (factors.totalWordCount < 500) {
    recommendations.push('Increase content length to at least 500 words for better SEO')
  }

  return recommendations
}

/**
 * Generate warnings for SEO risks
 */
function generateWarnings(factors: UniquenessFactors, score: number): string[] {
  const warnings: string[] = []

  if (score < 30) {
    warnings.push('CRITICAL: Content uniqueness is too low. High risk of duplicate content penalty.')
  }

  if (factors.staticContentRatio > 70) {
    warnings.push('WARNING: Too much static content. Google may classify this as thin content.')
  }

  if (factors.dynamicContentRatio < 20) {
    warnings.push('WARNING: Insufficient dynamic content. Consider adding more generators.')
  }

  if (!factors.hasCityMention) {
    warnings.push('WARNING: City name not found in content. Local SEO will suffer.')
  }

  if (factors.totalWordCount < 300) {
    warnings.push('WARNING: Content is too short. Minimum 300 words recommended.')
  }

  return warnings
}

/**
 * Check if content is safe for syndication
 * Returns true if uniqueness score meets minimum threshold
 */
export function isSafeForSyndication(
  content: string,
  agent?: Agent | null,
  cityData?: CityDatum | null,
  minimumScore: number = 30
): boolean {
  const analysis = analyzeContentUniqueness(content, agent, cityData)
  return analysis.score >= minimumScore
}

/**
 * Compare two content versions for similarity
 * Returns similarity percentage (0-100)
 */
export function compareContentSimilarity(content1: string, content2: string): number {
  const words1 = new Set(content1.toLowerCase().split(/\s+/).filter(w => w.length > 3))
  const words2 = new Set(content2.toLowerCase().split(/\s+/).filter(w => w.length > 3))

  if (words1.size === 0 || words2.size === 0) return 0

  const intersection = new Set([...words1].filter(x => words2.has(x)))
  const union = new Set([...words1, ...words2])

  // Jaccard similarity
  return Math.round((intersection.size / union.size) * 100)
}

/**
 * Batch analyze multiple content versions
 * Useful for checking syndicated content across agents
 */
export function batchAnalyzeUniqueness(
  contentVersions: Array<{
    content: string
    agent?: Agent | null
    cityData?: CityDatum | null
    identifier: string
  }>
): Array<UniquenessAnalysis & { identifier: string }> {
  return contentVersions.map(version => ({
    ...analyzeContentUniqueness(version.content, version.agent, version.cityData),
    identifier: version.identifier,
  }))
}

/**
 * Get minimum uniqueness score recommendation based on syndication scope
 */
export function getRecommendedMinimumScore(syndicationScope: 'single' | 'few' | 'many' | 'all'): number {
  switch (syndicationScope) {
    case 'single':
      return 20 // Single agent, less strict
    case 'few':
      return 30 // 2-10 agents
    case 'many':
      return 40 // 10-50 agents
    case 'all':
      return 50 // Network-wide syndication needs highest uniqueness
    default:
      return 30
  }
}

export default analyzeContentUniqueness
