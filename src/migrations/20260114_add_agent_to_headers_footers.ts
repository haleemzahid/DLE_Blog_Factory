import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Add agent_id column to tenant_headers
  await db.execute(sql`
    ALTER TABLE "tenant_headers"
    ADD COLUMN IF NOT EXISTS "agent_id" integer;
  `)

  // Add foreign key constraint for tenant_headers
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tenant_headers_agent_id_agents_id_fk'
      ) THEN
        ALTER TABLE "tenant_headers"
        ADD CONSTRAINT "tenant_headers_agent_id_agents_id_fk"
        FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Add index for tenant_headers
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tenant_headers_agent_idx" ON "tenant_headers" ("agent_id");
  `)

  // Add agent_id column to tenant_footers
  await db.execute(sql`
    ALTER TABLE "tenant_footers"
    ADD COLUMN IF NOT EXISTS "agent_id" integer;
  `)

  // Add foreign key constraint for tenant_footers
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tenant_footers_agent_id_agents_id_fk'
      ) THEN
        ALTER TABLE "tenant_footers"
        ADD CONSTRAINT "tenant_footers_agent_id_agents_id_fk"
        FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Add index for tenant_footers
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tenant_footers_agent_idx" ON "tenant_footers" ("agent_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Remove agent_id from tenant_headers
    DROP INDEX IF EXISTS "tenant_headers_agent_idx";
    ALTER TABLE "tenant_headers"
    DROP CONSTRAINT IF EXISTS "tenant_headers_agent_id_agents_id_fk";
    ALTER TABLE "tenant_headers"
    DROP COLUMN IF EXISTS "agent_id";

    -- Remove agent_id from tenant_footers
    DROP INDEX IF EXISTS "tenant_footers_agent_idx";
    ALTER TABLE "tenant_footers"
    DROP CONSTRAINT IF EXISTS "tenant_footers_agent_id_agents_id_fk";
    ALTER TABLE "tenant_footers"
    DROP COLUMN IF EXISTS "agent_id";
  `)
}
