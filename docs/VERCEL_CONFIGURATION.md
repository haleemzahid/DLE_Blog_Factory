# Vercel Configuration Guide

This document explains the Vercel-specific configuration for this Payload CMS project.

## Build Configuration

### Build Command
In your Vercel project settings, ensure the build command is set to:
```
pnpm build
```

This will execute the script defined in `package.json`:
```json
"build": "cross-env NODE_ENV=production NODE_OPTIONS=--no-deprecation payload migrate --force-accept-warning && next build"
```

### Install Command
Vercel should automatically use:
```
pnpm install --frozen-lockfile
```

### Output Directory
```
.next
```

### Node.js Version
The project is configured to use Node.js 20.x or later (see `engines` in `package.json`).

## Environment Variables

All environment variables must be configured in the Vercel dashboard under:
**Project Settings > Environment Variables**

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Set to `production` for production builds | `production` |
| `POSTGRES_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PAYLOAD_SECRET` | Secret key for Payload CMS | Generate with `openssl rand -base64 32` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | From Vercel dashboard |
| `NEXT_PUBLIC_SERVER_URL` | Public URL of your application | `https://your-app.vercel.app` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CRON_SECRET` | Secret for Vercel Cron authentication | Generate with `openssl rand -base64 32` |

## Cron Jobs

This project includes a cron job configuration in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/payload-jobs/run",
      "schedule": "0 0 * * *"
    }
  ]
}
```

This runs Payload's job queue daily at midnight UTC. Make sure `CRON_SECRET` is set for authentication.

## Database Configuration

### Vercel Postgres
If using Vercel Postgres:
1. Create a Postgres database in your Vercel project
2. Vercel automatically sets `POSTGRES_URL` and related variables
3. Use these in your environment variables

### External Database
If using an external database (e.g., Neon, Railway, Supabase):
1. Manually add `POSTGRES_URL` in Vercel environment variables
2. Ensure the database is accessible from Vercel's deployment regions

## Deployment Workflow

1. **Local Development**: Use `pnpm dev` - auto-push is enabled
2. **Create Migration**: Use `pnpm payload migrate:create` before deploying schema changes
3. **Push to GitHub**: Vercel automatically deploys
4. **Migration Runs**: `payload migrate` runs before build
5. **Build Succeeds**: Next.js builds and deploys

## Important Notes

### First Deployment
- Migrations will create all tables in your database
- Ensure database is empty or clean before first deployment

### Subsequent Deployments
- Migrations run automatically before each build
- Only new migrations are applied
- Existing data is preserved

### Build Time
- Initial build may take 3-5 minutes
- Subsequent builds are typically faster (1-3 minutes)
- Most time is spent on migrations and Next.js build

## Troubleshooting

### Build Timeout
If builds timeout during migrations:
- Check database connection string is correct
- Verify database is accessible from Vercel
- Increase build timeout in Vercel project settings (if available)

### Failed Migrations
If migrations fail:
1. Check build logs for specific error messages
2. Verify database schema matches migration state
3. See [Migration Guide](./MIGRATION_GUIDE.md) for solutions

### Environment Variable Issues
- Ensure all required variables are set
- Check for typos in variable names
- Verify values don't contain trailing spaces or special characters

## Monitoring

### Build Logs
View detailed build logs in the Vercel dashboard:
- Navigate to Deployments
- Click on a deployment
- View build logs

### Runtime Logs
View application logs:
- Navigate to Deployments
- Click on a deployment
- View runtime logs

## Security Considerations

1. **Never commit secrets** to the repository
2. **Use different secrets** for development and production
3. **Rotate secrets regularly**, especially after team member changes
4. **Use strong secrets**: At least 32 characters of random data

## Performance Optimization

### Database Connection Pool
The project is configured with:
- `max: 10` connections
- `connectionTimeoutMillis: 30000` (30 seconds)
- `idleTimeoutMillis: 30000` (30 seconds)

These settings are optimized for Vercel's serverless environment and cold starts.

### Build Cache
Vercel automatically caches:
- `node_modules` (based on `pnpm-lock.yaml`)
- `.next` build artifacts (when possible)

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
