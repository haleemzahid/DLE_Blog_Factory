import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Remove logo fields and add video fields to pages_blocks_branding_hero
  await db.execute(sql`
    ALTER TABLE "pages_blocks_branding_hero"
    DROP COLUMN IF EXISTS "logo_id",
    DROP COLUMN IF EXISTS "logo_width",
    ADD COLUMN IF NOT EXISTS "video_url" varchar,
    ADD COLUMN IF NOT EXISTS "video_title" varchar DEFAULT 'Video';
  `)

  // Remove logo fields and add video fields to versioned table
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_branding_hero"
    DROP COLUMN IF EXISTS "logo_id",
    DROP COLUMN IF EXISTS "logo_width",
    ADD COLUMN IF NOT EXISTS "video_url" varchar,
    ADD COLUMN IF NOT EXISTS "video_title" varchar DEFAULT 'Video';
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Restore logo fields and remove video fields
  await db.execute(sql`
    ALTER TABLE "pages_blocks_branding_hero"
    DROP COLUMN IF EXISTS "video_url",
    DROP COLUMN IF EXISTS "video_title",
    ADD COLUMN IF NOT EXISTS "logo_id" integer,
    ADD COLUMN IF NOT EXISTS "logo_width" numeric DEFAULT 250;
  `)

  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_branding_hero"
    DROP COLUMN IF EXISTS "video_url",
    DROP COLUMN IF EXISTS "video_title",
    ADD COLUMN IF NOT EXISTS "logo_id" integer,
    ADD COLUMN IF NOT EXISTS "logo_width" numeric DEFAULT 250;
  `)
}
