# Search System

## What it does

Full-text search across posts and content.

## Location

`src/search/`

## Configuration

### Field Overrides
`src/search/fieldOverrides.ts`

Maps collection fields to search index:

| Field | Indexed |
|-------|---------|
| slug | ✓ |
| meta.title | ✓ |
| meta.description | ✓ |
| meta.image | ✓ |
| categories | ✓ |

### Before Sync Hook
`src/search/beforeSync.ts`

Normalizes data before indexing:
- Extracts text from rich content
- Flattens relationships
- Prepares searchable format

## Indexed Collections

- Posts

## Frontend

Search page at `/search`

### Features

- Real-time results
- Category filtering
- Highlighted matches
- Pagination

## API Usage

```bash
# Search posts
GET /api/search?q=keyword

# With filters
GET /api/search?q=keyword&categories=tech
```

## How it Works

```
Post saved
    ↓
beforeSync hook runs
    ↓
Data normalized
    ↓
Added to search index
    ↓
Available for queries
```
