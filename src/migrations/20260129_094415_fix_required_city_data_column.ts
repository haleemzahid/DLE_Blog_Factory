import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Fix column name mismatch in content_templates_required_city_data table
  // The table has "_parent_id" but Payload expects "parent_id" for select hasMany fields

  await db.execute(sql`
    DO $$
    BEGIN
      -- Check if _parent_id exists and parent_id doesn't
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates_required_city_data'
        AND column_name = '_parent_id'
      ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates_required_city_data'
        AND column_name = 'parent_id'
      ) THEN
        -- Rename _parent_id to parent_id
        ALTER TABLE "content_templates_required_city_data"
        RENAME COLUMN "_parent_id" TO "parent_id";
      END IF;
    END $$;
  `)

  // Also fix the order column name if needed (should be "order" not "_order" for select hasMany)
  await db.execute(sql`
    DO $$
    BEGIN
      -- Check if _order exists and order doesn't exist
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates_required_city_data'
        AND column_name = '_order'
      ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_templates_required_city_data'
        AND column_name = 'order'
      ) THEN
        -- Rename _order to order
        ALTER TABLE "content_templates_required_city_data"
        RENAME COLUMN "_order" TO "order";
      END IF;
    END $$;
  `)

  // Update foreign key constraint if it exists with old name
  await db.execute(sql`
    DO $$
    BEGIN
      -- Drop old constraint if exists
      IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'content_templates_required_city_data__parent_id_fk'
      ) THEN
        ALTER TABLE "content_templates_required_city_data"
        DROP CONSTRAINT "content_templates_required_city_data__parent_id_fk";
      END IF;

      -- Add new constraint with correct column name
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'content_templates_required_city_data_parent_id_fk'
      ) THEN
        ALTER TABLE "content_templates_required_city_data"
        ADD CONSTRAINT "content_templates_required_city_data_parent_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "content_templates"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Update indexes
  await db.execute(sql`
    DROP INDEX IF EXISTS "content_templates_required_city_data__order_idx";
    DROP INDEX IF EXISTS "content_templates_required_city_data__parent_id_idx";
    CREATE INDEX IF NOT EXISTS "content_templates_required_city_data_order_idx"
      ON "content_templates_required_city_data" ("order");
    CREATE INDEX IF NOT EXISTS "content_templates_required_city_data_parent_id_idx"
      ON "content_templates_required_city_data" ("parent_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Revert column names back to underscore prefix
  await db.execute(sql`
    ALTER TABLE "content_templates_required_city_data"
    RENAME COLUMN "parent_id" TO "_parent_id";
  `)

  await db.execute(sql`
    ALTER TABLE "content_templates_required_city_data"
    RENAME COLUMN "order" TO "_order";
  `)
}
