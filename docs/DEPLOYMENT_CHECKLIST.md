# Quick Deployment Checklist

Use this checklist before deploying to Vercel to ensure a smooth deployment.

## ✅ Pre-Deployment Checklist

### 1. Environment Variables (Vercel Dashboard)
Make sure these are set in your Vercel project settings:

- [ ] `NODE_ENV` = `production`
- [ ] `POSTGRES_URL` = Your production database URL
- [ ] `PAYLOAD_SECRET` = Your secret key (generate with: `openssl rand -base64 32`)
- [ ] `BLOB_READ_WRITE_TOKEN` = Your Vercel Blob storage token
- [ ] `CRON_SECRET` = Your cron secret (generate with: `openssl rand -base64 32`)
- [ ] `NEXT_PUBLIC_SERVER_URL` = Your production URL (e.g., `https://your-app.vercel.app`)

### 2. Database Migration Status

If your production database was previously used in dev mode:

```bash
# Set your production database URL
export POSTGRES_URL="your-production-database-url"

# Clean dev mode migrations
pnpm run clean:dev-migrations
```

### 3. Local Testing

Before pushing to production:

```bash
# Build locally with production settings
NODE_ENV=production pnpm build

# If successful, push to trigger deployment
git push
```

## 🚀 Deployment Steps

1. **Push your changes to GitHub**
   ```bash
   git push
   ```

2. **Vercel automatically deploys**
   - The build command will run: `pnpm build`
   - This executes: `NODE_ENV=production payload migrate && next build`
   - Migrations run non-interactively
   - Next.js builds the application

3. **Monitor the deployment**
   - Check Vercel dashboard for build logs
   - Watch for migration success messages
   - Verify the deployment completes successfully

## 🔧 Troubleshooting

### Build fails with "dev mode" prompt
- **Cause**: Database has dev mode migration records
- **Fix**: Run `pnpm run clean:dev-migrations` with production `POSTGRES_URL`

### Build fails with "table already exists"
- **Cause**: Database schema doesn't match migration state
- **Fix**: See [Migration Guide](./MIGRATION_GUIDE.md) troubleshooting section

### Migration runs but application errors
- **Cause**: Missing environment variables
- **Fix**: Double-check all environment variables in Vercel dashboard

## 📚 Additional Resources

- [Full Migration Guide](./MIGRATION_GUIDE.md)
- [Payload CMS Docs](https://payloadcms.com/docs)
- [Vercel Docs](https://vercel.com/docs)
