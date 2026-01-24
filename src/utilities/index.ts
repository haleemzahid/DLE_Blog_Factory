/**
 * Utilities Index
 * Central export point for all utility functions
 */

// JSON-LD Generation
export {
  generateAgentJsonLd,
  generateBlogPostingJsonLd,
  generateFAQJsonLd,
  generateLocalBusinessJsonLd,
  generateAgentPageJsonLd,
  serializeJsonLd,
} from './generateAgentJsonLd'

// Token Replacement
export {
  replaceTokens,
  getAvailableTokens,
  findMissingTokens,
  extractTokensFromContent,
} from './replaceTokens'

// Template Rendering
export {
  renderTemplate,
  renderPostWithTemplate,
  previewTemplate,
  getAvailableSectionGenerators,
  validateTemplateSections,
  getDefaultSections,
  type TemplateSection,
  type RenderContext,
  type RenderResult,
  type RenderedSection,
} from './renderTemplate'

// Content Uniqueness
export {
  analyzeContentUniqueness,
  isSafeForSyndication,
  compareContentSimilarity,
  batchAnalyzeUniqueness,
  getRecommendedMinimumScore,
  type UniquenessAnalysis,
  type UniquenessFactors,
} from './contentUniqueness'

// Canonical URLs
export {
  getCanonicalUrl,
  getAlternateUrls,
  isCanonicalSafe,
  generateCanonicalMetaTags,
  determineCanonicalStrategy,
  validateCanonicalSetup,
  type CanonicalConfig,
  type CanonicalContext,
  type CanonicalStrategy,
  type CanonicalValidation,
} from './canonicalUrl'

// Dynamic Section Generators
export {
  generators,
  runGenerator,
  getAvailableGenerators,
  generateMarketStatsSection,
  generateNeighborhoodsSection,
  generateSchoolsSection,
  generateAgentCTASection,
  generateLocalFactsSection,
  generateEmployersSection,
  generatePriceComparisonSection,
  generateFAQSection,
  generatePlacesOfWorshipSection,
  generateCulturalCentersSection,
  generateCulturalEventsSection,
  generateDiversityOverviewSection,
  generateCommunityAmenitiesSection,
  generateLanguagesSection,
  generateAgentExpertiseSection,
  generateAgentReviewsSection,
  generateAgentLanguagesSection,
  generateAreasServedSection,
} from './generators'

// JSON-LD Import
export {
  extractJsonLdFromHtml,
  mapJsonLdToAgent,
  importJsonLdFromUrl,
  importJsonLdFromText,
  getImportPreview,
} from './importJsonLd'

// Render Post for Agent (render-time content assembly)
export {
  renderPostForAgent,
  renderPostForMultipleTenants,
  getTokenPreview,
  getAvailableSections,
} from './renderPostForAgent'
