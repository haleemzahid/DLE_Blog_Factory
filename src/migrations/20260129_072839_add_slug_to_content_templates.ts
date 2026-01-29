import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Add slug column to content_templates table
  await db.execute(sql`
    DO $$
    BEGIN
      -- Add slug column if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates'
        AND column_name = 'slug'
      ) THEN
        ALTER TABLE "content_templates"
        ADD COLUMN "slug" varchar;
      END IF;
    END $$;
  `)

  // Add unique constraint on slug
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'content_templates_slug_idx'
      ) THEN
        CREATE UNIQUE INDEX "content_templates_slug_idx"
        ON "content_templates" ("slug");
      END IF;
    END $$;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Remove slug column
  await db.execute(sql`
    DROP INDEX IF EXISTS "content_templates_slug_idx";
    ALTER TABLE "content_templates" DROP COLUMN IF EXISTS "slug";
  `)
}
