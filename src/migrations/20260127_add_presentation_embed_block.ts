import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Create the pages_blocks_presentation_embed table for the PresentationEmbed block
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_presentation_embed" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "background_color" varchar DEFAULT '#1E699B',
      "heading" varchar,
      "heading_color" varchar DEFAULT '#ffffff',
      "presentation_url" varchar NOT NULL,
      "presentation_title" varchar,
      "aspect_ratio" varchar DEFAULT '16:9',
      "download_link" varchar,
      "download_button_text" varchar DEFAULT 'Download BA PowerPoint Introduction to DLE',
      "download_button_color" varchar DEFAULT '#dc2626',
      "download_button_text_color" varchar DEFAULT '#ffffff',
      "block_name" varchar
    );
  `)

  // Add foreign key constraint for parent pages table
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'pages_blocks_presentation_embed_parent_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_presentation_embed"
        ADD CONSTRAINT "pages_blocks_presentation_embed_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Create index for performance
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_presentation_embed_order_idx" ON "pages_blocks_presentation_embed" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_presentation_embed_parent_id_idx" ON "pages_blocks_presentation_embed" ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_presentation_embed_path_idx" ON "pages_blocks_presentation_embed" ("_path");
  `)

  // Create the _pages_v_blocks_presentation_embed table for versions
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_presentation_embed" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid" varchar,
      "background_color" varchar DEFAULT '#1E699B',
      "heading" varchar,
      "heading_color" varchar DEFAULT '#ffffff',
      "presentation_url" varchar NOT NULL,
      "presentation_title" varchar,
      "aspect_ratio" varchar DEFAULT '16:9',
      "download_link" varchar,
      "download_button_text" varchar DEFAULT 'Download BA PowerPoint Introduction to DLE',
      "download_button_color" varchar DEFAULT '#dc2626',
      "download_button_text_color" varchar DEFAULT '#ffffff',
      "block_name" varchar
    );
  `)

  // Add foreign key constraint for parent pages versions table
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_blocks_presentation_embed_parent_id_fk'
      ) THEN
        ALTER TABLE "_pages_v_blocks_presentation_embed"
        ADD CONSTRAINT "_pages_v_blocks_presentation_embed_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Create indexes for versions table
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_presentation_embed_order_idx" ON "_pages_v_blocks_presentation_embed" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_presentation_embed_parent_id_idx" ON "_pages_v_blocks_presentation_embed" ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_presentation_embed_path_idx" ON "_pages_v_blocks_presentation_embed" ("_path");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Drop the tables in reverse order
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_presentation_embed";`)
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_presentation_embed";`)
}
