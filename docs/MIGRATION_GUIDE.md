# Database Migration Guide for Vercel Deployment

This document explains the database migration setup for this Payload CMS project and how to avoid common issues when deploying to Vercel.

## Problem Overview

Payload CMS supports two modes for managing database schema changes:

1. **Development Mode (Auto-Push)**: Schema changes are automatically synced to the database. This is convenient for local development but creates migration records with `batch = -1`.

2. **Production Mode (Migrations)**: Schema changes are managed through formal migration files. This ensures safe, trackable deployments.

**The Issue**: If you run Payload in dev mode and then try to deploy to production, Payload will detect the mismatch and prompt you with: *"It looks like you've run Payload in dev mode, meaning you've dynamically pushed changes to your database. If you'd like to run migrations, data loss will occur. Would you like to proceed?"*

Since Vercel's build environment is non-interactive, this prompt causes the build to hang and eventually timeout.

## Solution Implemented

This project has been configured to prevent this issue:

### 1. Production-Safe Database Configuration

The `payload.config.ts` has been updated to:
- Disable auto-push in production (`push: false` when `NODE_ENV=production`)
- Use formal migrations via `prodMigrations`
- Point to the migrations directory

```typescript
db: vercelPostgresAdapter({
  pool: {
    connectionString: process.env.POSTGRES_URL || '',
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 10,
  },
  push: process.env.NODE_ENV !== 'production',
  migrationDir: path.resolve(dirname, './migrations'),
  prodMigrations: migrations,
}),
```

### 2. Updated Build Scripts

The build scripts now explicitly set `NODE_ENV=production`:

```json
{
  "build": "cross-env NODE_ENV=production NODE_OPTIONS=--no-deprecation payload migrate --force-accept-warning && next build",
  "ci": "cross-env NODE_ENV=production payload migrate --yes && pnpm build"
}
```

### 3. Cleanup Script for Dev Mode Migrations

A script has been added to remove dev mode migration records from the database:

```bash
pnpm run clean:dev-migrations
```

This script:
- Connects to your database using `POSTGRES_URL`
- Finds and removes all migration records with `batch = -1`
- Reports what was cleaned

## Best Practices Workflow

### For Local Development

1. **Start in Dev Mode** (auto-push enabled):
   ```bash
   pnpm dev
   ```
   Schema changes will be automatically synced to your local database.

2. **Before Deploying**: Create a formal migration:
   ```bash
   pnpm payload migrate:create
   ```
   This creates a migration file in `src/migrations/` that captures your schema changes.

3. **Update the Migration Index**: The migration should be automatically added to `src/migrations/index.ts`. Verify this.

4. **Commit Your Migration**:
   ```bash
   git add src/migrations/
   git commit -m "Add migration for [feature]"
   ```

### For Production Deployment

1. **Set Environment Variables** in Vercel:
   - `NODE_ENV=production` (recommended to set explicitly)
   - `POSTGRES_URL` (your production database connection string)
   - `PAYLOAD_SECRET`
   - `BLOB_READ_WRITE_TOKEN`
   - `CRON_SECRET`

2. **If Switching from Dev to Production Database**:
   If your production database was previously used in dev mode, clean it before deploying:
   
   ```bash
   # Set POSTGRES_URL to your production database
   export POSTGRES_URL="your-production-db-url"
   pnpm run clean:dev-migrations
   ```

3. **Deploy**:
   Push your code to trigger a Vercel deployment. The build will:
   - Run migrations non-interactively
   - Build the Next.js application

## Manual Database Cleanup (Alternative)

If you prefer to manually clean dev mode migrations, you can connect to your database and run:

```sql
DELETE FROM payload_migrations WHERE batch = -1;
```

This removes all dev mode migration records.

## Troubleshooting

### Build Hangs on Vercel

**Symptom**: Build process times out during the migration step.

**Cause**: Database has dev mode migration records.

**Solution**: 
1. Run `pnpm run clean:dev-migrations` with `POSTGRES_URL` set to your production database
2. Trigger a new deployment

### "Table already exists" Errors

**Symptom**: Migration fails saying tables already exist.

**Cause**: Database schema doesn't match migration state.

**Solution**: 
1. If starting fresh: Drop all tables and run migrations from scratch
2. If existing data: Create a baseline migration that matches current schema

### Dev Mode Warning in Production

**Symptom**: Payload logs warnings about running in dev mode even with `NODE_ENV=production`.

**Cause**: Environment variable not properly set.

**Solution**: 
1. Verify `NODE_ENV=production` in Vercel environment variables
2. Check that the build command includes `cross-env NODE_ENV=production`

## Migration Commands Reference

```bash
# Create a new migration
pnpm payload migrate:create

# Run migrations (production)
NODE_ENV=production pnpm payload migrate

# Clean dev mode migrations
pnpm run clean:dev-migrations

# Check migration status
pnpm payload migrate:status
```

## Additional Resources

- [Payload CMS Migration Documentation](https://payloadcms.com/docs/database/migrations)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Payload CMS Database Configuration](https://payloadcms.com/docs/database/overview)
