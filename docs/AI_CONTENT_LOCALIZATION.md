# AI Content Localization System

A scalable system for creating unique, city-specific content from templates using AI to avoid SEO duplicate content penalties.

## 🎯 Overview

This system allows you to:
1. Create ONE template blog post (e.g., "Housing Market Forecast")
2. Automatically generate 972 UNIQUE versions for each California city
3. Each version is 30%+ different to avoid SEO penalties
4. Uses AI to personalize content with local data

## 📦 What Was Built

### New Collections

1. **CityData** (`/admin/cityData`)
   - Stores market data for each city
   - Population, median prices, neighborhoods, schools, etc.
   - Used to personalize AI-generated content

2. **ContentTemplates** (`/admin/contentTemplates`)
   - Manages template configurations
   - Links to template posts
   - Defines AI prompts and required city data

### Updated Collections

3. **Posts** (Enhanced)
   - New field: `isTemplate` - Mark posts as templates
   - New field: `cityDataTokens` - Control what data to inject
   - New field: `templateCategory` - Categorize templates

### Utilities

4. **cityContent.ts** - AI content generation
5. **syndicateContent.ts** - Batch syndication to cities

### Scripts

6. **syndicate-to-cities.ts** - CLI tool for syndication

---

## 🚀 Quick Start

### 1. Create City Data

Go to **Admin → City Data** and add cities:

```
City Name: Claremont
State: California
Region: Southern California
Median Home Price: 925000
Neighborhoods:
  - North Claremont ($1,150,000)
  - Claremont Village ($875,000)
  - South Claremont ($795,000)
Unique Facts:
  - Known as the "City of Trees and PhDs" due to Claremont Colleges
```

### 2. Create a Template Post

1. Go to **Admin → Posts → Create New**
2. Write your post with placeholders:
   - Title: `[CITY] Housing Market Forecast 2026`
   - Content: Use `[CITY]`, `[MEDIAN_PRICE]`, `[NEIGHBORHOOD_1]`, etc.
3. Check the **Is Template Post** checkbox
4. Select **City Data Tokens** (what data to inject)
5. Choose **Template Category**
6. Publish the post

### 3. Syndicate to Cities

#### Option A: Using the Admin Panel (Future)
*Coming soon: Admin UI for syndication*

#### Option B: Using the CLI Script

```bash
# Dry run (preview without making changes)
pnpm tsx scripts/syndicate-to-cities.ts --template <POST_ID> --dry-run

# Syndicate to specific cities
pnpm tsx scripts/syndicate-to-cities.ts --template <POST_ID> --cities city1,city2,city3

# Syndicate to all Southern California cities
pnpm tsx scripts/syndicate-to-cities.ts --template <POST_ID> --region southern

# Syndicate to top 50 cities only
pnpm tsx scripts/syndicate-to-cities.ts --template <POST_ID> --tier tier1

# Limit to first 10 cities
pnpm tsx scripts/syndicate-to-cities.ts --template <POST_ID> --max 10
```

---

## 📝 How It Works

### Step 1: Template Creation
```typescript
// You create a post like this:
Title: "[CITY] Housing Market Forecast 2026"
Content: "Are you buying or selling in [CITY]? The median price is [MEDIAN_PRICE]..."
```

### Step 2: AI Generation
```typescript
// System generates unique content for each city:
Claremont: "Claremont Housing Market Forecast 2026: What Local Buyers Need to Know"
Los Angeles: "Los Angeles Real Estate Forecast 2026: Expert Market Insights"
```

### Step 3: Syndication
```typescript
// Each city gets the post with custom SEO:
tenantSeoOverrides: [
  {
    tenant: "mr-claremont",
    titleOverride: "Claremont Housing Market Forecast 2026...",
    descriptionOverride: "Known as the City of Trees and PhDs...",
    introOverride: "<unique intro about Claremont>"
  }
]
```

---

## 🎨 Template Best Practices

### Use Placeholders

```markdown
# [CITY] Housing Market Forecast 2026

Are you thinking about buying or selling a home in [CITY]? 

## Current Market Conditions in [CITY]

The median home price in [CITY] is $[MEDIAN_PRICE], which represents 
a [PRICE_CHANGE]% change compared to last year.

## [CITY] Neighborhoods to Watch

Popular neighborhoods include:
- [NEIGHBORHOOD_1] - $[N1_PRICE]
- [NEIGHBORHOOD_2] - $[N2_PRICE]
- [NEIGHBORHOOD_3] - $[N3_PRICE]
```

### Select Appropriate Tokens

When creating a template, check the boxes for data you want to inject:

- ✅ **City Name** - Always recommended
- ✅ **Median Price** - For market reports
- ✅ **Neighborhoods** - For area guides
- ✅ **Schools** - For family content
- ✅ **Unique Facts** - For personalization
- ✅ **Market Stats** - For data-driven posts

---

## 🔧 Configuration

### AI Provider Setup

Currently uses simple token replacement. To enable AI:

1. Get API key from OpenAI, Anthropic, or similar
2. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Update `src/utilities/cityContent.ts` `callAI()` function
4. Uncomment the AI API call code

### City Tiers

Define city importance in `cityData`:

- **Tier 1** (Top 50): LA, SF, San Diego, Sacramento...
- **Tier 2** (Next 200): Mid-sized cities with active markets
- **Tier 3** (Remaining 700+): Smaller towns

---

## 📊 Workflow Example

### Phase 1: Start with 5 Pilot Cities

```bash
# 1. Create city data for 5 cities (via admin)
# 2. Create 1 template post
# 3. Test syndication

pnpm tsx scripts/syndicate-to-cities.ts \
  --template abc123 \
  --cities claremont,losangeles,sandiego,sanfrancisco,sacramento \
  --dry-run

# 4. Review output, verify uniqueness
# 5. Run without --dry-run to execute
```

### Phase 2: Scale to Top 50 Cities

```bash
# 1. Add city data for top 50 cities
# 2. Syndicate template to tier 1

pnpm tsx scripts/syndicate-to-cities.ts \
  --template abc123 \
  --tier tier1
```

### Phase 3: Complete Rollout

```bash
# Syndicate to all cities
pnpm tsx scripts/syndicate-to-cities.ts \
  --template abc123 \
  --region all
```

---

## 🎯 SEO Best Practices

### Canonical URLs
- Set `primaryTenant` on template posts
- Main website gets canonical tag
- City-specific pages reference canonical

### Content Uniqueness
- Minimum 30% unique content per city
- AI generates unique titles, descriptions, intros
- Different examples, statistics, local references

### Schema Markup
Add structured data to city pages:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "spatialCoverage": {
    "@type": "Place",
    "name": "Claremont, California"
  }
}
```

---

## 🐛 Troubleshooting

### "Template post not found"
- Verify post ID is correct
- Check post is marked as template (`isTemplate: true`)

### "No agent found for city"
- Ensure agent exists with designation "Mr. [City]" or "Ms. [City]"
- Check agent has a tenant assigned

### "Content not unique enough"
- Adjust AI prompt for more variation
- Add more city-specific data
- Use more unique facts

### Script errors
- Ensure database connection is working
- Check Payload CMS is properly configured
- Verify `.env` variables are set

---

## 📈 Monitoring

### Track Performance

```typescript
import { getCityPostPerformance } from '@/utilities/syndicateContent'

const stats = await getCityPostPerformance(payload, cityId)
// Returns: views, leads, engagement
```

### Analytics to Monitor
- Organic traffic per city page
- Bounce rate by city
- Conversion rate (form fills)
- Keyword rankings per city
- Content uniqueness scores

---

## 🔮 Future Enhancements

### Coming Soon
- [ ] Admin UI for syndication (click-to-syndicate)
- [ ] Real-time AI integration (OpenAI/Claude)
- [ ] Automated city data updates from APIs
- [ ] Content quality scoring
- [ ] A/B testing per city
- [ ] Dynamic city data widgets
- [ ] Enhanced California Block with search/filters

### Planned Features
- Market stats block (live data)
- Recent sales widget
- Neighborhood explorer
- School district information
- Automated content calendar

---

## 💡 Tips for Success

1. **Start Small**: Test with 5-10 cities first
2. **Review Quality**: Manually check first few generated posts
3. **Monitor SEO**: Watch Search Console for duplicate content issues
4. **Iterate Prompts**: Refine AI prompts based on results
5. **Update Data**: Keep city data fresh (monthly updates)
6. **Track ROI**: Monitor which cities generate most leads
7. **Premium Content**: Give tier 1 cities custom photos/videos

---

## 📞 Support

For questions or issues:
1. Check this README first
2. Review code comments in `/src/utilities/`
3. Test with `--dry-run` flag before making changes
4. Monitor console output for detailed logs

---

## ✅ Checklist: Before First Syndication

- [ ] City data added for target cities
- [ ] Template post created and marked as template
- [ ] City data tokens selected
- [ ] Tested with `--dry-run` flag
- [ ] Reviewed generated content samples
- [ ] Agents exist for target cities
- [ ] Database backup created
- [ ] Ready to scale!

---

**Happy syndicating! 🚀**
