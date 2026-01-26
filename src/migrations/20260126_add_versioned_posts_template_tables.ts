import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ===== VERSIONED POSTS SECTION OVERRIDES TABLE =====
  // For the sectionOverrides array field on Posts versions

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_posts_v_version_section_overrides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "section_id" varchar,
      "override_type" varchar,
      "custom_content" jsonb
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_posts_v_version_section_overrides_parent_id_fk'
      ) THEN
        ALTER TABLE "_posts_v_version_section_overrides"
        ADD CONSTRAINT "_posts_v_version_section_overrides_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_posts_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_v_version_section_overrides_order_idx" ON "_posts_v_version_section_overrides" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_v_version_section_overrides_parent_id_idx" ON "_posts_v_version_section_overrides" ("_parent_id");
  `)

  // ===== VERSIONED TENANT OVERRIDES TABLE =====
  // For the tenantOverrides array field on Posts versions

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_posts_v_version_tenant_ovr" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "tenant_id" integer,
      "agent_id" integer,
      "city_data_id" integer
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_posts_v_version_tenant_ovr_parent_id_fk'
      ) THEN
        ALTER TABLE "_posts_v_version_tenant_ovr"
        ADD CONSTRAINT "_posts_v_version_tenant_ovr_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_posts_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_v_version_tenant_ovr_order_idx" ON "_posts_v_version_tenant_ovr" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_v_version_tenant_ovr_parent_id_idx" ON "_posts_v_version_tenant_ovr" ("_parent_id");
  `)

  // ===== VERSIONED SECTION OVERRIDES NESTED TABLE =====
  // For the sections array nested inside tenantOverrides on versions

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_posts_v_version_sec_ovr" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "sec_id" varchar,
      "type" varchar,
      "content" text
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_posts_v_version_sec_ovr_parent_id_fk'
      ) THEN
        ALTER TABLE "_posts_v_version_sec_ovr"
        ADD CONSTRAINT "_posts_v_version_sec_ovr_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_posts_v_version_tenant_ovr"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_v_version_sec_ovr_order_idx" ON "_posts_v_version_sec_ovr" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_v_version_sec_ovr_parent_id_idx" ON "_posts_v_version_sec_ovr" ("_parent_id");
  `)

  // ===== VERSIONED CUSTOM TOKENS NESTED TABLE =====
  // For the tokens array nested inside tenantOverrides on versions

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_posts_v_version_tokens" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "name" varchar,
      "value" text
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_posts_v_version_tokens_parent_id_fk'
      ) THEN
        ALTER TABLE "_posts_v_version_tokens"
        ADD CONSTRAINT "_posts_v_version_tokens_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_posts_v_version_tenant_ovr"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_v_version_tokens_order_idx" ON "_posts_v_version_tokens" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_v_version_tokens_parent_id_idx" ON "_posts_v_version_tokens" ("_parent_id");
  `)

  // ===== ADD NEW COLUMNS TO _POSTS_V TABLE =====
  // Add the same columns that were added to posts table

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v' AND column_name = 'version_use_template') THEN
        ALTER TABLE "_posts_v" ADD COLUMN "version_use_template" boolean DEFAULT false;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v' AND column_name = 'version_content_template_id') THEN
        ALTER TABLE "_posts_v" ADD COLUMN "version_content_template_id" integer;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v' AND column_name = 'version_template_topic') THEN
        ALTER TABLE "_posts_v" ADD COLUMN "version_template_topic" varchar;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v' AND column_name = 'version_target_city_data_id') THEN
        ALTER TABLE "_posts_v" ADD COLUMN "version_target_city_data_id" integer;
      END IF;
    END $$;
  `)

  // Create indexes for new columns
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_v_version_content_template_id_idx" ON "_posts_v" ("version_content_template_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_v_version_target_city_data_id_idx" ON "_posts_v" ("version_target_city_data_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop tables in reverse order (nested first, then parent)
  await db.execute(sql`DROP TABLE IF EXISTS "_posts_v_version_tokens" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_posts_v_version_sec_ovr" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_posts_v_version_tenant_ovr" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_posts_v_version_section_overrides" CASCADE;`)

  // Remove columns from _posts_v table
  await db.execute(sql`ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_use_template";`)
  await db.execute(sql`ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_content_template_id";`)
  await db.execute(sql`ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_template_topic";`)
  await db.execute(sql`ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_target_city_data_id";`)
}
