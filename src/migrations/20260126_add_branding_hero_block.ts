import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Create the pages_blocks_branding_hero table for the BrandingHero block
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_branding_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "background_color" varchar DEFAULT '#ffffff',
      "logo_id" integer,
      "logo_width" numeric DEFAULT 250,
      "heading" varchar DEFAULT 'The Most Powerful Personal Branding in the Real Estate Industry',
      "heading_color" varchar DEFAULT '#000000',
      "heading_size" varchar DEFAULT 'large',
      "content" jsonb,
      "enable_cta" boolean DEFAULT false,
      "cta_link_type" varchar DEFAULT 'reference',
      "cta_link_new_tab" boolean,
      "cta_link_url" varchar,
      "cta_link_label" varchar,
      "cta_link_appearance" varchar DEFAULT 'default',
      "cta_link_hover_color" varchar,
      "cta_button_color" varchar DEFAULT '#B40000',
      "cta_text_color" varchar DEFAULT '#ffffff',
      "block_name" varchar
    );
  `)

  // Add foreign key constraint for parent pages table
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'pages_blocks_branding_hero_parent_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_branding_hero"
        ADD CONSTRAINT "pages_blocks_branding_hero_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Add foreign key constraint for logo media
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'pages_blocks_branding_hero_logo_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_branding_hero"
        ADD CONSTRAINT "pages_blocks_branding_hero_logo_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Create indexes for performance
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_branding_hero_order_idx" ON "pages_blocks_branding_hero" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_branding_hero_parent_id_idx" ON "pages_blocks_branding_hero" ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_branding_hero_path_idx" ON "pages_blocks_branding_hero" ("_path");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_branding_hero_logo_id_idx" ON "pages_blocks_branding_hero" ("logo_id");
  `)

  // Create the _pages_v_blocks_branding_hero table for versioned content
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_branding_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "background_color" varchar DEFAULT '#ffffff',
      "logo_id" integer,
      "logo_width" numeric DEFAULT 250,
      "heading" varchar DEFAULT 'The Most Powerful Personal Branding in the Real Estate Industry',
      "heading_color" varchar DEFAULT '#000000',
      "heading_size" varchar DEFAULT 'large',
      "content" jsonb,
      "enable_cta" boolean DEFAULT false,
      "cta_link_type" varchar DEFAULT 'reference',
      "cta_link_new_tab" boolean,
      "cta_link_url" varchar,
      "cta_link_label" varchar,
      "cta_link_appearance" varchar DEFAULT 'default',
      "cta_link_hover_color" varchar,
      "cta_button_color" varchar DEFAULT '#B40000',
      "cta_text_color" varchar DEFAULT '#ffffff',
      "block_name" varchar,
      "_uuid" varchar
    );
  `)

  // Add foreign key constraint for versioned parent table
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_blocks_branding_hero_parent_id_fk'
      ) THEN
        ALTER TABLE "_pages_v_blocks_branding_hero"
        ADD CONSTRAINT "_pages_v_blocks_branding_hero_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Add foreign key constraint for versioned logo media
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_blocks_branding_hero_logo_id_fk'
      ) THEN
        ALTER TABLE "_pages_v_blocks_branding_hero"
        ADD CONSTRAINT "_pages_v_blocks_branding_hero_logo_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Create indexes for versioned table
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branding_hero_order_idx" ON "_pages_v_blocks_branding_hero" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branding_hero_parent_id_idx" ON "_pages_v_blocks_branding_hero" ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branding_hero_path_idx" ON "_pages_v_blocks_branding_hero" ("_path");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branding_hero_logo_id_idx" ON "_pages_v_blocks_branding_hero" ("logo_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Drop versioned table first
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_branding_hero" CASCADE;`)

  // Drop main table
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_branding_hero" CASCADE;`)
}
