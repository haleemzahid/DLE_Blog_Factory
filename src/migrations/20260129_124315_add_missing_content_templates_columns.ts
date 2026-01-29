import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Add all missing columns to content_templates table

  await db.execute(sql`
    DO $$
    BEGIN
      -- Add description column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'description'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "description" varchar;
      END IF;

      -- Add customization_instructions column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'customization_instructions'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "customization_instructions" varchar;
      END IF;

      -- Add ai_prompt column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'ai_prompt'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "ai_prompt" varchar;
      END IF;

      -- Add content_uniqueness_target column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'content_uniqueness_target'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "content_uniqueness_target" numeric DEFAULT 30;
      END IF;

      -- Add priority column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'priority'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "priority" numeric DEFAULT 50;
      END IF;

      -- Add is_active column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'is_active'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "is_active" boolean DEFAULT true;
      END IF;

      -- Add target_city_tier column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'target_city_tier'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "target_city_tier" varchar DEFAULT 'all';
      END IF;

      -- Add estimated_read_time column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'estimated_read_time'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "estimated_read_time" numeric;
      END IF;

      -- Add usage_count column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'usage_count'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "usage_count" numeric DEFAULT 0;
      END IF;

      -- Add generated_count column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'generated_count'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "generated_count" numeric DEFAULT 0;
      END IF;

      -- Add last_generated column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'last_generated'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "last_generated" timestamp(3) with time zone;
      END IF;

      -- Add seo_templates_title_template column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'seo_templates_title_template'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "seo_templates_title_template" varchar;
      END IF;

      -- Add seo_templates_description_template column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'seo_templates_description_template'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "seo_templates_description_template" varchar;
      END IF;

      -- Add base_post_id column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates' AND column_name = 'base_post_id'
      ) THEN
        ALTER TABLE "content_templates" ADD COLUMN "base_post_id" integer;
      END IF;
    END $$;
  `)

  // Add foreign key for base_post_id if posts table exists
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'content_templates_base_post_id_fk'
        ) THEN
          ALTER TABLE "content_templates"
          ADD CONSTRAINT "content_templates_base_post_id_fk"
          FOREIGN KEY ("base_post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END IF;
    END $$;
  `)

  // Create index for base_post_id
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_templates_base_post_id_idx"
    ON "content_templates" ("base_post_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "content_templates"
    DROP COLUMN IF EXISTS "description",
    DROP COLUMN IF EXISTS "customization_instructions",
    DROP COLUMN IF EXISTS "ai_prompt",
    DROP COLUMN IF EXISTS "content_uniqueness_target",
    DROP COLUMN IF EXISTS "priority",
    DROP COLUMN IF EXISTS "is_active",
    DROP COLUMN IF EXISTS "target_city_tier",
    DROP COLUMN IF EXISTS "estimated_read_time",
    DROP COLUMN IF EXISTS "usage_count",
    DROP COLUMN IF EXISTS "generated_count",
    DROP COLUMN IF EXISTS "last_generated",
    DROP COLUMN IF EXISTS "seo_templates_title_template",
    DROP COLUMN IF EXISTS "seo_templates_description_template",
    DROP COLUMN IF EXISTS "base_post_id";
  `)
}
