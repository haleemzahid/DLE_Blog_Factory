import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Update background_color to blue for all existing branding hero blocks that have white background
  await db.execute(sql`
    UPDATE "pages_blocks_branding_hero"
    SET "background_color" = '#1E699B'
    WHERE "background_color" = '#ffffff' OR "background_color" IS NULL;
  `)

  // Update versioned table as well
  await db.execute(sql`
    UPDATE "_pages_v_blocks_branding_hero"
    SET "background_color" = '#1E699B'
    WHERE "background_color" = '#ffffff' OR "background_color" IS NULL;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Revert background_color to white
  await db.execute(sql`
    UPDATE "pages_blocks_branding_hero"
    SET "background_color" = '#ffffff'
    WHERE "background_color" = '#1E699B';
  `)

  await db.execute(sql`
    UPDATE "_pages_v_blocks_branding_hero"
    SET "background_color" = '#ffffff'
    WHERE "background_color" = '#1E699B';
  `)
}
