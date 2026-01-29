import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Add value column to content_templates_required_city_data table
  // This is needed for select hasMany fields
  await db.execute(sql`
    DO $$
    BEGIN
      -- Add value column if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates_required_city_data'
        AND column_name = 'value'
      ) THEN
        ALTER TABLE "content_templates_required_city_data"
        ADD COLUMN "value" varchar;
      END IF;
    END $$;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Remove value column
  await db.execute(sql`
    ALTER TABLE "content_templates_required_city_data" DROP COLUMN IF EXISTS "value";
  `)
}
