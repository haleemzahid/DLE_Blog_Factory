# Blog factory for meta DLE read me
testing - 2

This is a Blog Factory project configured for deployment on Vercel with Next.js.

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

This project is configured for deployment on Vercel. The build process automatically handles database migrations when the required environment variables are present.

### Required Environment Variables

Set these environment variables in your Vercel project settings:

1. **Required for build and runtime:**
   - `POSTGRES_URL` - PostgreSQL connection string
   - `PAYLOAD_SECRET` - Secret key for Payload CMS (generate with: `openssl rand -base64 32`)
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage token for media uploads

2. **Optional but recommended:**
   - `CRON_SECRET` - Secret for authenticating Vercel Cron requests (generate with: `openssl rand -base64 32`)
   - `NEXT_PUBLIC_SERVER_URL` - Public URL of your application

### Build Process

The build script (`scripts/vercel-build.js`) automatically:
- Checks for required environment variables
- Runs database migrations if environment variables are present
- Skips migrations gracefully if environment variables are missing
- Proceeds with Next.js build

**Important Notes:**
- If your database was previously used in dev mode, run the cleanup script before deploying (see [Migration Guide](./docs/MIGRATION_GUIDE.md))
- Ensure all environment variables are set in Vercel project settings before deployment
- Database migrations run automatically during build if credentials are available
- ESLint warnings are not treated as errors during production builds to prevent deployment failures

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

