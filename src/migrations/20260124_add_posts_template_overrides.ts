import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // ===== POSTS SECTION OVERRIDES TABLE =====
  // For the sectionOverrides array field on Posts

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "posts_section_overrides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_id" varchar,
      "override_type" varchar,
      "custom_content" jsonb
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'posts_section_overrides_parent_id_fk'
      ) THEN
        ALTER TABLE "posts_section_overrides"
        ADD CONSTRAINT "posts_section_overrides_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "posts_section_overrides_order_idx" ON "posts_section_overrides" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "posts_section_overrides_parent_id_idx" ON "posts_section_overrides" ("_parent_id");
  `)

  // ===== TENANT OVERRIDES TABLE (tenant_ovr) =====
  // For the tenantOverrides array field on Posts with dbName: 'tenant_ovr'

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "tenant_ovr" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "tenant_id" integer,
      "agent_id" integer,
      "city_data_id" integer
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tenant_ovr_parent_id_fk'
      ) THEN
        ALTER TABLE "tenant_ovr"
        ADD CONSTRAINT "tenant_ovr_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tenant_ovr_tenant_id_fk'
      ) THEN
        ALTER TABLE "tenant_ovr"
        ADD CONSTRAINT "tenant_ovr_tenant_id_fk"
        FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tenant_ovr_agent_id_fk'
      ) THEN
        ALTER TABLE "tenant_ovr"
        ADD CONSTRAINT "tenant_ovr_agent_id_fk"
        FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tenant_ovr_city_data_id_fk'
      ) THEN
        ALTER TABLE "tenant_ovr"
        ADD CONSTRAINT "tenant_ovr_city_data_id_fk"
        FOREIGN KEY ("city_data_id") REFERENCES "city_data"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tenant_ovr_order_idx" ON "tenant_ovr" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tenant_ovr_parent_id_idx" ON "tenant_ovr" ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tenant_ovr_tenant_id_idx" ON "tenant_ovr" ("tenant_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tenant_ovr_agent_id_idx" ON "tenant_ovr" ("agent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tenant_ovr_city_data_id_idx" ON "tenant_ovr" ("city_data_id");
  `)

  // ===== SECTION OVERRIDES NESTED TABLE (sec_ovr) =====
  // For the sections array nested inside tenantOverrides with dbName: 'sec_ovr'

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "sec_ovr" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "sec_id" varchar,
      "type" varchar,
      "content" text
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'sec_ovr_parent_id_fk'
      ) THEN
        ALTER TABLE "sec_ovr"
        ADD CONSTRAINT "sec_ovr_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "tenant_ovr"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "sec_ovr_order_idx" ON "sec_ovr" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "sec_ovr_parent_id_idx" ON "sec_ovr" ("_parent_id");
  `)

  // ===== CUSTOM TOKENS NESTED TABLE (tokens) =====
  // For the tokens array nested inside tenantOverrides with dbName: 'tokens'

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "tokens" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "value" text
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tokens_parent_id_fk'
      ) THEN
        ALTER TABLE "tokens"
        ADD CONSTRAINT "tokens_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "tenant_ovr"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tokens_order_idx" ON "tokens" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tokens_parent_id_idx" ON "tokens" ("_parent_id");
  `)

  // ===== ADD NEW COLUMNS TO POSTS TABLE =====
  // Add any missing columns for template functionality

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'use_template') THEN
        ALTER TABLE "posts" ADD COLUMN "use_template" boolean DEFAULT false;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'content_template_id') THEN
        ALTER TABLE "posts" ADD COLUMN "content_template_id" integer;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'template_topic') THEN
        ALTER TABLE "posts" ADD COLUMN "template_topic" varchar;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'target_city_data_id') THEN
        ALTER TABLE "posts" ADD COLUMN "target_city_data_id" integer;
      END IF;
    END $$;
  `)

  // Add foreign key for content_template_id if not exists
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'posts_content_template_id_fk'
      ) THEN
        ALTER TABLE "posts"
        ADD CONSTRAINT "posts_content_template_id_fk"
        FOREIGN KEY ("content_template_id") REFERENCES "content_templates"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Add foreign key for target_city_data_id if not exists
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'posts_target_city_data_id_fk'
      ) THEN
        ALTER TABLE "posts"
        ADD CONSTRAINT "posts_target_city_data_id_fk"
        FOREIGN KEY ("target_city_data_id") REFERENCES "city_data"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Create indexes for new foreign keys
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "posts_content_template_id_idx" ON "posts" ("content_template_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "posts_target_city_data_id_idx" ON "posts" ("target_city_data_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Drop tables in reverse order (nested first, then parent)
  await db.execute(sql`DROP TABLE IF EXISTS "tokens" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "sec_ovr" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "tenant_ovr" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "posts_section_overrides" CASCADE;`)

  // Remove columns from posts table
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "use_template";`)
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "content_template_id";`)
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "template_topic";`)
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "target_city_data_id";`)
}
