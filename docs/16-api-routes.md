# API Routes

## What they do

Provide REST and GraphQL APIs for accessing content.

## REST API

`src/app/(payload)/api/[...slug]/route.ts`

### Endpoints

| Method | Endpoint | Action |
|--------|----------|--------|
| GET | /api/posts | List all posts |
| GET | /api/posts/:id | Get one post |
| POST | /api/posts | Create post |
| PATCH | /api/posts/:id | Update post |
| DELETE | /api/posts/:id | Delete post |

Same pattern for: pages, media, categories, users

### Example

```bash
# Get all published posts
GET /api/posts?where[_status][equals]=published

# Get post by slug
GET /api/posts?where[slug][equals]=my-post
```

## GraphQL API

`src/app/(payload)/api/graphql/route.ts`

### Playground

Visit `/api/graphql-playground` to explore queries.

### Example Query

```graphql
query {
  Posts {
    docs {
      title
      slug
      categories {
        title
      }
    }
  }
}
```

## Preview Routes

| Route | Purpose |
|-------|---------|
| /next/preview | Enable draft mode |
| /next/exit-preview | Exit draft mode |
| /next/seed | Seed database |
