# Claude Instructions for This Project

## CRITICAL - DATABASE SAFETY

**NEVER run these commands without explicit user permission:**

- `pnpm payload migrate:fresh` - DELETES ALL DATA
- `pnpm payload migrate:reset` - DELETES ALL DATA
- Any command with `DROP TABLE` or `DROP DATABASE`

**If there is a database migration error:**

1. STOP and ask the user before running any destructive commands
2. First try to fix the code (e.g., shorten block slugs, fix field names)
3. If manual SQL is needed, ask the user first
4. NEVER assume it's okay to delete data

**Safe migration commands:**

- `pnpm payload migrate` - Safe, only runs pending migrations
- `pnpm payload migrate:status` - Safe, only shows status
- `pnpm payload migrate:create` - Safe, creates new migration file

## Project Notes

- This is a PayloadCMS project with PostgreSQL database
- Block slugs must be short to avoid PostgreSQL constraint name length limits
- Always generate types after schema changes: `pnpm generate:types`
- Always generate importmap after adding blocks: `pnpm generate:importmap`
