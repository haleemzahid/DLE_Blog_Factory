import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const CityData: CollectionConfig = {
  slug: 'cityData',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'cityName',
    defaultColumns: ['cityName', 'state', 'region', 'medianHomePrice', 'lastUpdated'],
    group: 'Content Management',
    description: 'Store market data and information for each city to use in AI-generated content',
  },
  fields: [
    {
      name: 'cityName',
      type: 'text',
      required: true,
      label: 'City Name',
      admin: {
        description: 'e.g., Claremont, Los Angeles, San Francisco',
      },
    },
    {
      name: 'state',
      type: 'relationship',
      relationTo: 'states',
      required: true,
      label: 'State',
    },
    {
      name: 'region',
      type: 'select',
      label: 'Region',
      options: [
        { label: 'Northern California', value: 'northern' },
        { label: 'Central California', value: 'central' },
        { label: 'Southern California', value: 'southern' },
      ],
      admin: {
        description: 'Geographic region within California',
      },
    },
    {
      name: 'population',
      type: 'number',
      label: 'Population',
      admin: {
        description: 'Current population estimate',
      },
    },
    {
      name: 'medianHomePrice',
      type: 'number',
      label: 'Median Home Price',
      admin: {
        description: 'Current median home price in dollars',
      },
    },
    {
      name: 'medianRent',
      type: 'number',
      label: 'Median Rent',
      admin: {
        description: 'Median monthly rent in dollars',
      },
    },
    {
      name: 'priceChange12Month',
      type: 'number',
      label: '12-Month Price Change (%)',
      admin: {
        description: 'Year-over-year price change percentage (e.g., 4.2 for 4.2% increase)',
      },
    },
    {
      name: 'salesCount30Days',
      type: 'number',
      label: 'Homes Sold (Last 30 Days)',
      admin: {
        description: 'Number of homes sold in the last 30 days',
      },
    },
    {
      name: 'avgDaysOnMarket',
      type: 'number',
      label: 'Average Days on Market',
      admin: {
        description: 'Average number of days homes stay on the market',
      },
    },
    {
      name: 'inventoryLevel',
      type: 'select',
      label: 'Inventory Level',
      options: [
        { label: 'Very Low (< 2 months)', value: 'very-low' },
        { label: 'Low (2-4 months)', value: 'low' },
        { label: 'Balanced (4-6 months)', value: 'balanced' },
        { label: 'High (6-8 months)', value: 'high' },
        { label: 'Very High (> 8 months)', value: 'very-high' },
      ],
    },
    {
      name: 'marketTrend',
      type: 'select',
      label: 'Market Trend',
      options: [
        { label: 'Hot Seller Market', value: 'hot-seller' },
        { label: 'Moderate Seller Market', value: 'moderate-seller' },
        { label: 'Balanced Market', value: 'balanced' },
        { label: 'Moderate Buyer Market', value: 'moderate-buyer' },
        { label: 'Hot Buyer Market', value: 'hot-buyer' },
      ],
    },
    {
      name: 'neighborhoods',
      type: 'array',
      label: 'Neighborhoods',
      admin: {
        description: 'Popular neighborhoods within the city',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Neighborhood Name',
        },
        {
          name: 'avgPrice',
          type: 'number',
          label: 'Average Price',
          admin: {
            description: 'Average home price in this neighborhood',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description:
              'Brief description of the neighborhood (e.g., "Family-friendly, near schools")',
          },
        },
      ],
    },
    {
      name: 'topSchools',
      type: 'array',
      label: 'Top Schools',
      admin: {
        description: 'Highly-rated schools in the area',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'School Name',
        },
        {
          name: 'rating',
          type: 'number',
          label: 'Rating',
          admin: {
            description: 'School rating (e.g., 9 out of 10)',
          },
        },
        {
          name: 'type',
          type: 'select',
          label: 'School Type',
          options: [
            { label: 'Elementary', value: 'elementary' },
            { label: 'Middle', value: 'middle' },
            { label: 'High', value: 'high' },
            { label: 'K-12', value: 'k12' },
          ],
        },
      ],
    },
    {
      name: 'uniqueFacts',
      type: 'array',
      label: 'Unique Facts',
      admin: {
        description: 'Interesting facts about the city to personalize content',
      },
      fields: [
        {
          name: 'fact',
          type: 'textarea',
          required: true,
          label: 'Fact',
          admin: {
            description: 'e.g., "Known as the City of Trees and PhDs due to Claremont Colleges"',
          },
        },
      ],
    },
    {
      name: 'nearbyCity',
      type: 'text',
      label: 'Nearby Major City',
      admin: {
        description: 'Closest major city for comparison (e.g., "Los Angeles" for Claremont)',
      },
    },
    {
      name: 'keyEmployers',
      type: 'array',
      label: 'Key Employers',
      admin: {
        description: 'Major employers driving the local economy',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Employer Name',
        },
        {
          name: 'industry',
          type: 'text',
          label: 'Industry',
        },
      ],
    },
    // Cultural & Community Data
    {
      name: 'placesOfWorship',
      type: 'array',
      label: 'Places of Worship',
      admin: {
        description: 'Religious institutions in the area (churches, temples, mosques, synagogues)',
      },
      maxRows: 30,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Name',
          admin: {
            description: 'e.g., St. Ambrose Catholic Church',
          },
        },
        {
          name: 'religion',
          type: 'select',
          label: 'Religion/Denomination',
          options: [
            { label: 'Catholic', value: 'catholic' },
            { label: 'Protestant', value: 'protestant' },
            { label: 'Orthodox Christian', value: 'orthodox' },
            { label: 'Jewish', value: 'jewish' },
            { label: 'Muslim', value: 'muslim' },
            { label: 'Hindu', value: 'hindu' },
            { label: 'Buddhist', value: 'buddhist' },
            { label: 'Sikh', value: 'sikh' },
            { label: 'LDS (Mormon)', value: 'lds' },
            { label: 'Non-Denominational', value: 'non-denominational' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'address',
          type: 'text',
          label: 'Address',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website URL',
        },
      ],
    },
    {
      name: 'culturalCenters',
      type: 'array',
      label: 'Cultural Centers & Community Hubs',
      admin: {
        description: 'Cultural centers, community organizations, ethnic associations',
      },
      maxRows: 20,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Name',
          admin: {
            description: 'e.g., Korean American Cultural Center',
          },
        },
        {
          name: 'type',
          type: 'select',
          label: 'Type',
          options: [
            { label: 'Cultural Center', value: 'cultural-center' },
            { label: 'Community Center', value: 'community-center' },
            { label: 'Ethnic Association', value: 'ethnic-association' },
            { label: 'Senior Center', value: 'senior-center' },
            { label: 'Youth Center', value: 'youth-center' },
            { label: 'Arts Center', value: 'arts-center' },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
    {
      name: 'ethnicCuisine',
      type: 'array',
      label: 'Ethnic Cuisine & Restaurants',
      admin: {
        description: 'Popular ethnic restaurants and food markets',
      },
      maxRows: 20,
      fields: [
        {
          name: 'cuisineType',
          type: 'text',
          required: true,
          label: 'Cuisine Type',
          admin: {
            description: 'e.g., Vietnamese, Mexican, Indian, Korean',
          },
        },
        {
          name: 'popularSpots',
          type: 'textarea',
          label: 'Notable Restaurants/Markets',
          admin: {
            description: 'List popular spots for this cuisine',
          },
        },
      ],
    },
    {
      name: 'culturalEvents',
      type: 'array',
      label: 'Cultural Events & Festivals',
      admin: {
        description: 'Annual cultural events, festivals, parades',
      },
      maxRows: 20,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Event Name',
          admin: {
            description: 'e.g., Lunar New Year Festival, Diwali Celebration',
          },
        },
        {
          name: 'timing',
          type: 'text',
          label: 'When',
          admin: {
            description: 'e.g., February (varies), October',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
    {
      name: 'languagesSpoken',
      type: 'array',
      label: 'Languages Spoken',
      admin: {
        description: 'Languages commonly spoken in the community',
      },
      maxRows: 15,
      fields: [
        {
          name: 'language',
          type: 'text',
          required: true,
          label: 'Language',
        },
        {
          name: 'percentageOfPopulation',
          type: 'number',
          label: 'Approximate % of Population',
          admin: {
            description: 'e.g., 32 for 32%',
          },
        },
      ],
    },
    {
      name: 'demographics',
      type: 'group',
      label: 'Demographics',
      admin: {
        description: 'Community demographic breakdown',
      },
      fields: [
        {
          name: 'diversityIndex',
          type: 'number',
          label: 'Diversity Index',
          admin: {
            description: 'Score 0-100 (higher = more diverse)',
          },
        },
        {
          name: 'medianAge',
          type: 'number',
          label: 'Median Age',
        },
        {
          name: 'familyHouseholds',
          type: 'number',
          label: 'Family Households (%)',
        },
        {
          name: 'ethnicBreakdown',
          type: 'array',
          label: 'Ethnic Breakdown',
          maxRows: 10,
          fields: [
            {
              name: 'ethnicity',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., White, Hispanic/Latino, Asian',
              },
            },
            {
              name: 'percentage',
              type: 'number',
              label: '%',
            },
          ],
        },
      ],
    },
    {
      name: 'communityAmenities',
      type: 'array',
      label: 'Community Amenities',
      admin: {
        description: 'Parks, recreation, libraries, etc.',
      },
      maxRows: 30,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Park', value: 'park' },
            { label: 'Recreation Center', value: 'recreation' },
            { label: 'Library', value: 'library' },
            { label: 'Museum', value: 'museum' },
            { label: 'Sports Complex', value: 'sports' },
            { label: 'Nature Preserve', value: 'nature' },
            { label: 'Golf Course', value: 'golf' },
            { label: 'Pool/Aquatic Center', value: 'aquatic' },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'lastUpdated',
      type: 'date',
      label: 'Last Updated',
      admin: {
        description: 'When this city data was last updated',
        date: {
          displayFormat: 'MMM dd, yyyy',
        },
      },
    },
    {
      name: 'dataSource',
      type: 'select',
      label: 'Data Source',
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Zillow API', value: 'zillow' },
        { label: 'Realtor.com API', value: 'realtor' },
        { label: 'Census Data', value: 'census' },
        { label: 'Multiple Sources', value: 'multiple' },
      ],
      admin: {
        description: 'Where this data came from',
      },
    },
  ],
}
