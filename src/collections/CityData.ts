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
