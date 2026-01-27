import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const ContentTemplates: CollectionConfig = {
  slug: 'contentTemplates',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'usageCount', 'isActive', 'updatedAt'],
    group: 'Content Management',
    description: 'Reusable content blueprints that posts can reference for template-based rendering',
  },
  fields: [
    // Basic Info
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Template Name',
      admin: {
        description: 'Internal name for this template (e.g., "Home Buying Guide Template")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Unique identifier (e.g., "home-buying-guide")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'What is this template for?',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Category',
      options: [
        { label: 'Buyer Guides', value: 'buyer-guides' },
        { label: 'Seller Guides', value: 'seller-guides' },
        { label: 'Market Reports', value: 'market-reports' },
        { label: 'Neighborhood', value: 'neighborhood' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'Legal & Finance', value: 'legal-finance' },
        { label: 'School District Guide', value: 'school-guide' },
        { label: 'Investment Guide', value: 'investment-guide' },
        { label: 'Moving Guide', value: 'moving-guide' },
        { label: 'Luxury Homes', value: 'luxury-homes' },
        { label: 'City Comparison', value: 'city-comparison' },
      ],
    },

    // SEO Templates
    {
      name: 'seoTemplates',
      type: 'group',
      label: 'SEO Templates',
      admin: {
        description: 'Define SEO meta templates with tokens',
      },
      fields: [
        {
          name: 'titleTemplate',
          type: 'text',
          label: 'Title Template',
          admin: {
            description: 'Use {{TOPIC}}, {{CITY_NAME}}, {{AGENT_DESIGNATION}}',
            placeholder: '{{TOPIC}} in {{CITY_NAME}} | {{AGENT_DESIGNATION}}',
          },
        },
        {
          name: 'descriptionTemplate',
          type: 'textarea',
          label: 'Description Template',
          admin: {
            description: 'Meta description with tokens',
          },
        },
      ],
    },

    // Content Sections - The key structure from planning docs
    {
      name: 'sections',
      type: 'array',
      label: 'Content Sections',
      required: true,
      admin: {
        description: 'Define the content sections for this template. These determine the structure and rendering of posts using this template.',
      },
      fields: [
        {
          name: 'sectionId',
          type: 'text',
          required: true,
          label: 'Section ID',
          admin: {
            description: 'Unique ID for this section (e.g., "intro", "market_stats")',
          },
        },
        {
          name: 'sectionName',
          type: 'text',
          required: true,
          label: 'Section Name',
          admin: {
            description: 'Display name for editors',
          },
        },
        {
          name: 'sectionType',
          type: 'select',
          required: true,
          label: 'Section Type',
          defaultValue: 'token',
          options: [
            { label: 'Static Content', value: 'static' },
            { label: 'Token Template', value: 'token' },
            { label: 'Dynamic Generator', value: 'dynamic' },
          ],
          admin: {
            description: 'Static = fixed content, Token = content with {{TOKENS}}, Dynamic = auto-generated',
          },
        },
        // For static content
        {
          name: 'defaultContent',
          type: 'richText',
          label: 'Default Content',
          admin: {
            condition: (data, siblingData) => siblingData?.sectionType === 'static',
            description: 'Default content (can be overridden by post)',
          },
        },
        // For token templates
        {
          name: 'tokenTemplate',
          type: 'richText',
          label: 'Token Template',
          admin: {
            condition: (data, siblingData) => siblingData?.sectionType === 'token',
            description: 'Content with {{TOKENS}} to be replaced (e.g., {{CITY_NAME}}, {{MEDIAN_PRICE}})',
          },
        },
        // For dynamic generators
        {
          name: 'generator',
          type: 'select',
          label: 'Generator',
          admin: {
            condition: (data, siblingData) => siblingData?.sectionType === 'dynamic',
            description: 'Select which generator to use for dynamic content',
          },
          options: [
            { label: 'Market Statistics', value: 'market_stats' },
            { label: 'Neighborhoods', value: 'neighborhoods' },
            { label: 'Schools', value: 'schools' },
            { label: 'Agent Bio & CTA', value: 'agent_cta' },
            { label: 'Local Facts', value: 'local_facts' },
            { label: 'Key Employers', value: 'employers' },
            { label: 'Price Comparison', value: 'price_comparison' },
            { label: 'FAQ Section', value: 'faq' },
            { label: 'Places of Worship', value: 'places_of_worship' },
            { label: 'Cultural Centers', value: 'cultural_centers' },
            { label: 'Cultural Events', value: 'cultural_events' },
            { label: 'Demographics Overview', value: 'diversity_overview' },
            { label: 'Community Amenities', value: 'community_amenities' },
            { label: 'Languages Spoken', value: 'languages_spoken' },
            { label: 'Agent Expertise', value: 'agent_expertise' },
            { label: 'Agent Reviews', value: 'agent_reviews' },
            { label: 'Agent Languages', value: 'agent_languages' },
            { label: 'Areas Served', value: 'areas_served' },
          ],
        },
        // Conditional rendering
        {
          name: 'condition',
          type: 'text',
          label: 'Render Condition',
          admin: {
            description: 'JS expression to show/hide section (e.g., "cityData.neighborhoods.length > 0", "agent")',
          },
        },
        // Override settings
        {
          name: 'allowPostOverride',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Post Override',
          admin: {
            description: 'Can posts override this section?',
          },
        },
        {
          name: 'allowTenantOverride',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Tenant Override',
          admin: {
            description: 'Can tenants override this section?',
          },
        },
      ],
    },

    // Legacy basePost field (kept for backward compatibility but optional now)
    {
      name: 'basePost',
      type: 'relationship',
      relationTo: 'posts',
      label: 'Base Post (Legacy)',
      admin: {
        description: 'Optional: Reference to a base post for legacy template approach',
      },
    },
    // Required City Data - which CityData fields are required for this template
    {
      name: 'requiredCityData',
      type: 'select',
      hasMany: true,
      label: 'Required City Data',
      admin: {
        description: 'Which CityData fields are required for this template?',
      },
      options: [
        { label: 'City Name', value: 'cityName' },
        { label: 'Population', value: 'population' },
        { label: 'Median Home Price', value: 'medianHomePrice' },
        { label: 'Median Rent', value: 'medianRent' },
        { label: 'Price Change (12mo)', value: 'priceChange12Month' },
        { label: 'Days on Market', value: 'avgDaysOnMarket' },
        { label: 'Sales Count', value: 'salesCount30Days' },
        { label: 'Inventory Level', value: 'inventoryLevel' },
        { label: 'Market Trend', value: 'marketTrend' },
        { label: 'Neighborhoods', value: 'neighborhoods' },
        { label: 'Schools', value: 'topSchools' },
        { label: 'Unique Facts', value: 'uniqueFacts' },
        { label: 'Key Employers', value: 'keyEmployers' },
        { label: 'Nearby City', value: 'nearbyCity' },
        { label: 'Region', value: 'region' },
        { label: 'Places of Worship', value: 'placesOfWorship' },
        { label: 'Cultural Centers', value: 'culturalCenters' },
        { label: 'Cultural Events', value: 'culturalEvents' },
        { label: 'Demographics', value: 'demographics' },
        { label: 'Community Amenities', value: 'communityAmenities' },
        { label: 'Languages Spoken', value: 'languagesSpoken' },
      ],
    },
    {
      name: 'customizationInstructions',
      type: 'textarea',
      label: 'Customization Instructions',
      admin: {
        description: 'Instructions for how to customize this template for each city',
        rows: 4,
      },
    },
    {
      name: 'aiPrompt',
      type: 'textarea',
      label: 'AI Prompt',
      admin: {
        description:
          'Optional: AI prompt for generating unique city-specific content. Use placeholders like {cityName}, {medianHomePrice}, etc.',
        rows: 10,
      },
    },
    {
      name: 'contentUniquenessTarget',
      type: 'number',
      label: 'Content Uniqueness Target (%)',
      defaultValue: 30,
      min: 20,
      max: 100,
      admin: {
        description:
          'Target percentage of unique content vs. template (minimum 30% recommended for SEO)',
      },
    },
    {
      name: 'priority',
      type: 'number',
      label: 'Priority',
      defaultValue: 50,
      admin: {
        description: 'Higher priority templates are generated first (1-100)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Only active templates will be used for content generation',
      },
    },
    {
      name: 'targetCityTier',
      type: 'select',
      label: 'Target City Tier',
      options: [
        { label: 'All Cities', value: 'all' },
        { label: 'Tier 1 Only (Top 50)', value: 'tier1' },
        { label: 'Tier 2 Only (Top 200)', value: 'tier2' },
        { label: 'Tier 3 Only (Remaining)', value: 'tier3' },
        { label: 'Tier 1 & 2', value: 'tier1-2' },
      ],
      defaultValue: 'all',
      admin: {
        description: 'Which city tiers should use this template',
      },
    },
    {
      name: 'estimatedReadTime',
      type: 'number',
      label: 'Estimated Read Time (minutes)',
      admin: {
        description: 'Approximate reading time for generated content',
      },
    },
    // Usage tracking
    {
      name: 'usageCount',
      type: 'number',
      label: 'Usage Count',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of posts currently using this template',
      },
    },
    {
      name: 'generatedCount',
      type: 'number',
      label: 'Generated Count',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times this template has been used to generate content',
      },
    },
    {
      name: 'lastGenerated',
      type: 'date',
      label: 'Last Generated',
      admin: {
        readOnly: true,
        description: 'When this template was last used',
        date: {
          displayFormat: 'MMM dd, yyyy HH:mm',
        },
      },
    },
  ],
}
