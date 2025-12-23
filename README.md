# Blog factory for meta DLE
<!-- Deployment trigger: 2025-12-22 -->

This is a Payload CMS project configured for deployment on Vercel with Next.js.

## Getting Started

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

### Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Database Migrations

This project uses Payload CMS migrations for safe database schema management in production. 

**Important**: Before deploying to Vercel, please read the [Migration Guide](./docs/MIGRATION_GUIDE.md) to avoid common deployment issues.

### Quick Reference

```bash
# Create a new migration
pnpm payload migrate:create

# Run migrations
NODE_ENV=production pnpm payload migrate

# Clean dev mode migrations (if needed)
pnpm run clean:dev-migrations
```

## Deployment

This project is configured for deployment on Vercel. Make sure to:

1. Set the required environment variables in Vercel:
   - `NODE_ENV=production`
   - `POSTGRES_URL`
   - `PAYLOAD_SECRET`
   - `BLOB_READ_WRITE_TOKEN`
   - `CRON_SECRET`

2. If your database was previously used in dev mode, run the cleanup script before deploying (see [Migration Guide](./docs/MIGRATION_GUIDE.md))

## Documentation

- [Migration Guide](./docs/MIGRATION_GUIDE.md) - Comprehensive guide for database migrations and Vercel deployment
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter
- `pnpm lint:fix` - Fix linting issues
- `pnpm clean:dev-migrations` - Remove dev mode migration records from database
- `pnpm payload migrate:create` - Create a new migration

