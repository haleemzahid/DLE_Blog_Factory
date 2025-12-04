# Deployment & Configuration

## What it covers

Setup, environment, and deployment options.

## Environment Variables

Create `.env` from `.env.example`:

| Variable | Purpose |
|----------|---------|
| POSTGRES_URL | Database connection |
| PAYLOAD_SECRET | JWT signing key |
| NEXT_PUBLIC_SERVER_URL | Public site URL |
| BLOB_READ_WRITE_TOKEN | Vercel Blob token |
| CRON_SECRET | Scheduled jobs auth |
| PREVIEW_SECRET | Preview mode auth |

## Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Production server
pnpm generate:importmap  # Payload imports
pnpm test         # Run tests
pnpm ci           # CI/CD (migrate + build)
```

## Local Development

### Database

```bash
# Start local Postgres
docker-compose up -d
```

### Dev Server

```bash
pnpm dev
# Visit http://localhost:3000
```

## Vercel Deployment

1. Connect GitHub repo to Vercel
2. Set environment variables
3. Deploy

### vercel.json

```json
{
  "buildCommand": "pnpm ci",
  "framework": "nextjs"
}
```

## Files

| File | Purpose |
|------|---------|
| next.config.js | Next.js + Payload config |
| payload.config.ts | CMS configuration |
| docker-compose.yml | Local Postgres |
| playwright.config.ts | E2E tests |
| vitest.config.mts | Unit tests |

## Database Migrations

```bash
# Create migration
pnpm payload migrate:create

# Run migrations
pnpm payload migrate
```

Migrations stored in `src/migrations/`
