import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ===== VERSIONED TENANT_OVR TABLE =====
  // This is the versioned equivalent of the tenant_ovr table
  // Payload uses _tablename_v naming convention for versioned array tables

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_tenant_ovr_v" (
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
        SELECT 1 FROM pg_constraint WHERE conname = '_tenant_ovr_v_parent_id_fk'
      ) THEN
        ALTER TABLE "_tenant_ovr_v"
        ADD CONSTRAINT "_tenant_ovr_v_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_posts_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_tenant_ovr_v_order_idx" ON "_tenant_ovr_v" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_tenant_ovr_v_parent_id_idx" ON "_tenant_ovr_v" ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_tenant_ovr_v_tenant_id_idx" ON "_tenant_ovr_v" ("tenant_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_tenant_ovr_v_agent_id_idx" ON "_tenant_ovr_v" ("agent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_tenant_ovr_v_city_data_id_idx" ON "_tenant_ovr_v" ("city_data_id");
  `)

  // ===== VERSIONED SEC_OVR TABLE =====
  // Nested sections within tenant_ovr

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_sec_ovr_v" (
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
        SELECT 1 FROM pg_constraint WHERE conname = '_sec_ovr_v_parent_id_fk'
      ) THEN
        ALTER TABLE "_sec_ovr_v"
        ADD CONSTRAINT "_sec_ovr_v_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_tenant_ovr_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_sec_ovr_v_order_idx" ON "_sec_ovr_v" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_sec_ovr_v_parent_id_idx" ON "_sec_ovr_v" ("_parent_id");
  `)

  // ===== VERSIONED TOKENS TABLE =====
  // Nested tokens within tenant_ovr

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_tokens_v" (
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
        SELECT 1 FROM pg_constraint WHERE conname = '_tokens_v_parent_id_fk'
      ) THEN
        ALTER TABLE "_tokens_v"
        ADD CONSTRAINT "_tokens_v_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_tenant_ovr_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_tokens_v_order_idx" ON "_tokens_v" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_tokens_v_parent_id_idx" ON "_tokens_v" ("_parent_id");
  `)

  // ===== VERSIONED POSTS_SECTION_OVERRIDES TABLE =====
  // For the sectionOverrides array on posts

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_posts_section_overrides_v" (
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
        SELECT 1 FROM pg_constraint WHERE conname = '_posts_section_overrides_v_parent_id_fk'
      ) THEN
        ALTER TABLE "_posts_section_overrides_v"
        ADD CONSTRAINT "_posts_section_overrides_v_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_posts_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_section_overrides_v_order_idx" ON "_posts_section_overrides_v" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_posts_section_overrides_v_parent_id_idx" ON "_posts_section_overrides_v" ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_tokens_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_sec_ovr_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_tenant_ovr_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_posts_section_overrides_v" CASCADE;`)
}
