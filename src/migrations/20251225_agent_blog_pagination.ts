import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_agent_blog"
    ADD COLUMN IF NOT EXISTS "enable_pagination" boolean DEFAULT true;

    ALTER TABLE "pages_blocks_agent_blog"
    ADD COLUMN IF NOT EXISTS "posts_per_page" numeric DEFAULT 6;

    ALTER TABLE "_pages_v_blocks_agent_blog"
    ADD COLUMN IF NOT EXISTS "enable_pagination" boolean DEFAULT true;

    ALTER TABLE "_pages_v_blocks_agent_blog"
    ADD COLUMN IF NOT EXISTS "posts_per_page" numeric DEFAULT 6;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_agent_blog"
    DROP COLUMN IF EXISTS "enable_pagination";

    ALTER TABLE "pages_blocks_agent_blog"
    DROP COLUMN IF EXISTS "posts_per_page";

    ALTER TABLE "_pages_v_blocks_agent_blog"
    DROP COLUMN IF EXISTS "enable_pagination";

    ALTER TABLE "_pages_v_blocks_agent_blog"
    DROP COLUMN IF EXISTS "posts_per_page";
  `)
}
