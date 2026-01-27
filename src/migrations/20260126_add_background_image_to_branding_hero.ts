import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Add background_image_id field to pages_blocks_branding_hero
  await db.execute(sql`
    ALTER TABLE "pages_blocks_branding_hero"
    ADD COLUMN IF NOT EXISTS "background_image_id" integer;
  `)

  // Add background_image_id field to versioned table
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_branding_hero"
    ADD COLUMN IF NOT EXISTS "background_image_id" integer;
  `)

  // Add foreign key constraint for background image
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'pages_blocks_branding_hero_background_image_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_branding_hero"
        ADD CONSTRAINT "pages_blocks_branding_hero_background_image_id_fk"
        FOREIGN KEY ("background_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Add foreign key constraint for versioned background image
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_blocks_branding_hero_background_image_id_fk'
      ) THEN
        ALTER TABLE "_pages_v_blocks_branding_hero"
        ADD CONSTRAINT "_pages_v_blocks_branding_hero_background_image_id_fk"
        FOREIGN KEY ("background_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Create index for performance
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_branding_hero_background_image_id_idx"
    ON "pages_blocks_branding_hero" ("background_image_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branding_hero_background_image_id_idx"
    ON "_pages_v_blocks_branding_hero" ("background_image_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Remove background_image_id field from pages_blocks_branding_hero
  await db.execute(sql`
    ALTER TABLE "pages_blocks_branding_hero"
    DROP COLUMN IF EXISTS "background_image_id";
  `)

  // Remove background_image_id field from versioned table
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_branding_hero"
    DROP COLUMN IF EXISTS "background_image_id";
  `)
}
