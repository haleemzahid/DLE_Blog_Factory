# Posts Collection

## What it does

Stores blog posts, articles, and news content.

## Location

`src/collections/Posts/index.ts`

## Fields

| Field | Type | Description |
|-------|------|-------------|
| title | text | Post title (voice enabled) |
| heroImage | upload | Featured image |
| content | richText | Main body (Lexical editor) |
| categories | relationship | Linked categories |
| authors | relationship | Post authors |
| publishedAt | date | Publish date |
| slug | text | URL-friendly ID |
| meta | SEO | Title, description, image |

## Features

- **Draft Mode** - Save without publishing
- **Scheduled Publishing** - Set future publish dates
- **Version History** - Up to 50 versions saved
- **Live Preview** - See changes in real-time
- **Related Posts** - Link similar content

## Access Control

- **Create/Update**: Authenticated users only
- **Read**: Anyone (published only) or authenticated (all)

## URL Pattern

Posts are accessible at `/posts/[slug]`
