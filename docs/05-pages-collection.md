# Pages Collection

## What it does

Creates static pages like Home, About, Contact with flexible layouts.

## Location

`src/collections/Pages/index.ts`

## Fields

| Field | Type | Description |
|-------|------|-------------|
| title | text | Page title (voice enabled) |
| hero | group | Hero section config |
| layout | blocks | Page content blocks |
| publishedAt | date | Publish date |
| slug | text | URL path |
| meta | SEO | Meta information |

## Hero Types

| Type | Description |
|------|-------------|
| none | No hero section |
| highImpact | Full-width with media |
| mediumImpact | Medium hero with image |
| lowImpact | Simple text hero |

## Layout Blocks

Build pages with:
- Content blocks (multi-column)
- Archive blocks (post listings)
- Call-to-action blocks
- Media blocks
- Form blocks

## URL Pattern

Pages are at `/[slug]` (e.g., `/about`, `/contact`)
