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
    defaultColumns: ['name', 'category', 'priority', 'isActive'],
    group: 'Content Management',
    description: 'Manage templates for AI-generated city-specific content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Template Name',
      admin: {
        description: 'e.g., "Housing Market Forecast Template"',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Category',
      options: [
        { label: 'Market Report', value: 'market-report' },
        { label: 'Neighborhood Guide', value: 'neighborhood-guide' },
        { label: 'Home Valuation', value: 'home-valuation' },
        { label: 'Buyer Guide', value: 'buyer-guide' },
        { label: 'Seller Guide', value: 'seller-guide' },
        { label: 'Investment Guide', value: 'investment-guide' },
        { label: 'School District Guide', value: 'school-guide' },
        { label: 'Moving Guide', value: 'moving-guide' },
        { label: 'Luxury Homes', value: 'luxury-homes' },
        { label: 'City Comparison', value: 'city-comparison' },
      ],
    },
    {
      name: 'basePost',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      label: 'Base Post',
      admin: {
        description: 'The template post that will be used to generate city-specific versions',
      },
    },
    {
      name: 'requiredCityData',
      type: 'array',
      label: 'Required City Data',
      admin: {
        description: 'Which city data fields are needed for this template',
      },
      fields: [
        {
          name: 'dataField',
          type: 'select',
          required: true,
          label: 'Data Field',
          options: [
            { label: 'City Name', value: 'cityName' },
            { label: 'Population', value: 'population' },
            { label: 'Median Home Price', value: 'medianHomePrice' },
            { label: 'Median Rent', value: 'medianRent' },
            { label: 'Price Change (12 months)', value: 'priceChange12Month' },
            { label: 'Sales Count (30 days)', value: 'salesCount30Days' },
            { label: 'Average Days on Market', value: 'avgDaysOnMarket' },
            { label: 'Inventory Level', value: 'inventoryLevel' },
            { label: 'Market Trend', value: 'marketTrend' },
            { label: 'Neighborhoods', value: 'neighborhoods' },
            { label: 'Top Schools', value: 'topSchools' },
            { label: 'Unique Facts', value: 'uniqueFacts' },
            { label: 'Nearby City', value: 'nearbyCity' },
            { label: 'Region', value: 'region' },
          ],
        },
        {
          name: 'isRequired',
          type: 'checkbox',
          defaultValue: true,
          label: 'Required',
          admin: {
            description: 'Is this data field mandatory for content generation?',
          },
        },
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
      required: true,
      admin: {
        description:
          'The prompt to send to the AI for generating unique city-specific content. Use placeholders like {cityName}, {medianHomePrice}, etc.',
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
