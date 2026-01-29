import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // ===== CONTENT TEMPLATES SECTIONS TABLE =====
  // This is the critical missing table causing the error
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "content_templates_sections" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_id" varchar NOT NULL,
      "section_name" varchar NOT NULL,
      "section_type" varchar DEFAULT 'token' NOT NULL,
      "default_content" jsonb,
      "token_template" jsonb,
      "generator" varchar,
      "condition" varchar,
      "allow_post_override" boolean DEFAULT true,
      "allow_tenant_override" boolean DEFAULT true
    );
  `)

  // Add foreign key constraint
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'content_templates_sections_parent_id_fk'
      ) THEN
        ALTER TABLE "content_templates_sections"
        ADD CONSTRAINT "content_templates_sections_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "content_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Create indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_templates_sections_order_idx" ON "content_templates_sections" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_templates_sections_parent_id_idx" ON "content_templates_sections" ("_parent_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "content_templates_sections" CASCADE;`)
}
