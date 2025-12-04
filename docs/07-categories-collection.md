# Categories Collection

## What it does

Organizes posts into topics/categories for easy browsing.

## Location

`src/collections/Categories.ts`

## Fields

| Field | Type | Description |
|-------|------|-------------|
| title | text | Category name (voice enabled) |
| description | textarea | Category description (voice enabled) |
| slug | text | URL-friendly ID |

## Features

- **Nested Categories** - Hierarchical structure (parent/child)
- **Voice Input** - Both title and description support speech
- **Auto Slug** - Generated from title

## Usage

1. Create categories in admin panel
2. Assign categories to posts
3. Filter posts by category on frontend

## Example

```
Technology/
├── Web Development
├── Mobile Apps
└── AI & Machine Learning
```

## Nested Docs Plugin

Uses `@payloadcms/plugin-nested-docs` for:
- Breadcrumb navigation
- Category hierarchies
- Parent-child relationships
