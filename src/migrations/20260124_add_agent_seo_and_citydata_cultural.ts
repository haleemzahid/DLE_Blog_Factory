import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // ===== AGENT SEO KEYWORDS TABLES =====

  // Primary keywords
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_meta_keywords_primary" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "keyword" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_meta_keywords_primary_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_meta_keywords_primary"
        ADD CONSTRAINT "agents_meta_keywords_primary_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_keywords_primary_order_idx" ON "agents_meta_keywords_primary" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_keywords_primary_parent_id_idx" ON "agents_meta_keywords_primary" ("_parent_id");
  `)

  // Secondary keywords
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_meta_keywords_secondary" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "keyword" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_meta_keywords_secondary_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_meta_keywords_secondary"
        ADD CONSTRAINT "agents_meta_keywords_secondary_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_keywords_secondary_order_idx" ON "agents_meta_keywords_secondary" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_keywords_secondary_parent_id_idx" ON "agents_meta_keywords_secondary" ("_parent_id");
  `)

  // Geographic keywords
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_meta_keywords_geographic" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "keyword" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_meta_keywords_geographic_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_meta_keywords_geographic"
        ADD CONSTRAINT "agents_meta_keywords_geographic_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_keywords_geographic_order_idx" ON "agents_meta_keywords_geographic" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_keywords_geographic_parent_id_idx" ON "agents_meta_keywords_geographic" ("_parent_id");
  `)

  // Services keywords
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_meta_keywords_services" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "keyword" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_meta_keywords_services_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_meta_keywords_services"
        ADD CONSTRAINT "agents_meta_keywords_services_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_keywords_services_order_idx" ON "agents_meta_keywords_services" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_keywords_services_parent_id_idx" ON "agents_meta_keywords_services" ("_parent_id");
  `)

  // ===== AGENT JSON-LD TABLES =====

  // Add JSON-LD columns to agents table
  await db.execute(sql`
    ALTER TABLE "agents"
    ADD COLUMN IF NOT EXISTS "meta_json_ld_enabled" boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS "meta_json_ld_geo_coordinates_latitude" numeric,
    ADD COLUMN IF NOT EXISTS "meta_json_ld_geo_coordinates_longitude" numeric,
    ADD COLUMN IF NOT EXISTS "meta_json_ld_price_range" varchar,
    ADD COLUMN IF NOT EXISTS "meta_json_ld_aggregate_rating_rating_value" numeric,
    ADD COLUMN IF NOT EXISTS "meta_json_ld_aggregate_rating_review_count" integer,
    ADD COLUMN IF NOT EXISTS "meta_json_ld_aggregate_rating_best_rating" numeric DEFAULT 5;
  `)

  // Schema types (select multiple)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_meta_json_ld_schema_types" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" varchar,
      "id" serial PRIMARY KEY NOT NULL
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_meta_json_ld_schema_types_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_meta_json_ld_schema_types"
        ADD CONSTRAINT "agents_meta_json_ld_schema_types_parent_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_json_ld_schema_types_order_idx" ON "agents_meta_json_ld_schema_types" ("order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_json_ld_schema_types_parent_id_idx" ON "agents_meta_json_ld_schema_types" ("parent_id");
  `)

  // Area served array
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_meta_json_ld_area_served" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "type" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_meta_json_ld_area_served_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_meta_json_ld_area_served"
        ADD CONSTRAINT "agents_meta_json_ld_area_served_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_json_ld_area_served_order_idx" ON "agents_meta_json_ld_area_served" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_json_ld_area_served_parent_id_idx" ON "agents_meta_json_ld_area_served" ("_parent_id");
  `)

  // Knows about array
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_meta_json_ld_knows_about" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "topic" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_meta_json_ld_knows_about_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_meta_json_ld_knows_about"
        ADD CONSTRAINT "agents_meta_json_ld_knows_about_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_json_ld_knows_about_order_idx" ON "agents_meta_json_ld_knows_about" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_json_ld_knows_about_parent_id_idx" ON "agents_meta_json_ld_knows_about" ("_parent_id");
  `)

  // SameAs array
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_meta_json_ld_same_as" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_meta_json_ld_same_as_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_meta_json_ld_same_as"
        ADD CONSTRAINT "agents_meta_json_ld_same_as_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_json_ld_same_as_order_idx" ON "agents_meta_json_ld_same_as" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_meta_json_ld_same_as_parent_id_idx" ON "agents_meta_json_ld_same_as" ("_parent_id");
  `)

  // ===== AGENT CULTURAL EXPERTISE TABLES =====

  // Languages spoken
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_cultural_expertise_languages_spoken" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "language" varchar,
      "proficiency" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_cultural_expertise_languages_spoken_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_cultural_expertise_languages_spoken"
        ADD CONSTRAINT "agents_cultural_expertise_languages_spoken_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_cultural_expertise_languages_spoken_order_idx" ON "agents_cultural_expertise_languages_spoken" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_cultural_expertise_languages_spoken_parent_id_idx" ON "agents_cultural_expertise_languages_spoken" ("_parent_id");
  `)

  // Cultural specializations
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_cultural_expertise_cultural_specializations" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "community" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_cultural_expertise_cultural_specializations_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_cultural_expertise_cultural_specializations"
        ADD CONSTRAINT "agents_cultural_expertise_cultural_specializations_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_cultural_expertise_cultural_specializations_order_idx" ON "agents_cultural_expertise_cultural_specializations" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_cultural_expertise_cultural_specializations_parent_id_idx" ON "agents_cultural_expertise_cultural_specializations" ("_parent_id");
  `)

  // Community involvement
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "agents_cultural_expertise_community_involvement" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "organization" varchar,
      "role" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agents_cultural_expertise_community_involvement_parent_id_fk'
      ) THEN
        ALTER TABLE "agents_cultural_expertise_community_involvement"
        ADD CONSTRAINT "agents_cultural_expertise_community_involvement_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_cultural_expertise_community_involvement_order_idx" ON "agents_cultural_expertise_community_involvement" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "agents_cultural_expertise_community_involvement_parent_id_idx" ON "agents_cultural_expertise_community_involvement" ("_parent_id");
  `)

  // ===== CITY DATA CULTURAL FIELDS =====

  // Add demographic columns to city_data
  await db.execute(sql`
    ALTER TABLE "city_data"
    ADD COLUMN IF NOT EXISTS "demographics_diversity_index" numeric,
    ADD COLUMN IF NOT EXISTS "demographics_median_age" numeric,
    ADD COLUMN IF NOT EXISTS "demographics_family_households" numeric;
  `)

  // Places of worship
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "city_data_places_of_worship" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "religion" varchar,
      "address" varchar,
      "website" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'city_data_places_of_worship_parent_id_fk'
      ) THEN
        ALTER TABLE "city_data_places_of_worship"
        ADD CONSTRAINT "city_data_places_of_worship_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "city_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_places_of_worship_order_idx" ON "city_data_places_of_worship" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_places_of_worship_parent_id_idx" ON "city_data_places_of_worship" ("_parent_id");
  `)

  // Cultural centers
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "city_data_cultural_centers" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "type" varchar,
      "description" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'city_data_cultural_centers_parent_id_fk'
      ) THEN
        ALTER TABLE "city_data_cultural_centers"
        ADD CONSTRAINT "city_data_cultural_centers_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "city_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_cultural_centers_order_idx" ON "city_data_cultural_centers" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_cultural_centers_parent_id_idx" ON "city_data_cultural_centers" ("_parent_id");
  `)

  // Ethnic cuisine
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "city_data_ethnic_cuisine" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "cuisine_type" varchar,
      "popular_spots" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'city_data_ethnic_cuisine_parent_id_fk'
      ) THEN
        ALTER TABLE "city_data_ethnic_cuisine"
        ADD CONSTRAINT "city_data_ethnic_cuisine_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "city_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_ethnic_cuisine_order_idx" ON "city_data_ethnic_cuisine" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_ethnic_cuisine_parent_id_idx" ON "city_data_ethnic_cuisine" ("_parent_id");
  `)

  // Cultural events
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "city_data_cultural_events" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "timing" varchar,
      "description" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'city_data_cultural_events_parent_id_fk'
      ) THEN
        ALTER TABLE "city_data_cultural_events"
        ADD CONSTRAINT "city_data_cultural_events_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "city_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_cultural_events_order_idx" ON "city_data_cultural_events" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_cultural_events_parent_id_idx" ON "city_data_cultural_events" ("_parent_id");
  `)

  // Languages spoken in city
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "city_data_languages_spoken" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "language" varchar,
      "percentage_of_population" numeric
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'city_data_languages_spoken_parent_id_fk'
      ) THEN
        ALTER TABLE "city_data_languages_spoken"
        ADD CONSTRAINT "city_data_languages_spoken_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "city_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_languages_spoken_order_idx" ON "city_data_languages_spoken" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_languages_spoken_parent_id_idx" ON "city_data_languages_spoken" ("_parent_id");
  `)

  // Ethnic breakdown
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "city_data_demographics_ethnic_breakdown" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "ethnicity" varchar,
      "percentage" numeric
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'city_data_demographics_ethnic_breakdown_parent_id_fk'
      ) THEN
        ALTER TABLE "city_data_demographics_ethnic_breakdown"
        ADD CONSTRAINT "city_data_demographics_ethnic_breakdown_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "city_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_demographics_ethnic_breakdown_order_idx" ON "city_data_demographics_ethnic_breakdown" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_demographics_ethnic_breakdown_parent_id_idx" ON "city_data_demographics_ethnic_breakdown" ("_parent_id");
  `)

  // Community amenities
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "city_data_community_amenities" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "type" varchar,
      "description" varchar
    );
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'city_data_community_amenities_parent_id_fk'
      ) THEN
        ALTER TABLE "city_data_community_amenities"
        ADD CONSTRAINT "city_data_community_amenities_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "city_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_community_amenities_order_idx" ON "city_data_community_amenities" ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "city_data_community_amenities_parent_id_idx" ON "city_data_community_amenities" ("_parent_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Drop CityData cultural tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "city_data_community_amenities";
    DROP TABLE IF EXISTS "city_data_demographics_ethnic_breakdown";
    DROP TABLE IF EXISTS "city_data_languages_spoken";
    DROP TABLE IF EXISTS "city_data_cultural_events";
    DROP TABLE IF EXISTS "city_data_ethnic_cuisine";
    DROP TABLE IF EXISTS "city_data_cultural_centers";
    DROP TABLE IF EXISTS "city_data_places_of_worship";
  `)

  // Drop CityData demographic columns
  await db.execute(sql`
    ALTER TABLE "city_data"
    DROP COLUMN IF EXISTS "demographics_diversity_index",
    DROP COLUMN IF EXISTS "demographics_median_age",
    DROP COLUMN IF EXISTS "demographics_family_households";
  `)

  // Drop Agent cultural expertise tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "agents_cultural_expertise_community_involvement";
    DROP TABLE IF EXISTS "agents_cultural_expertise_cultural_specializations";
    DROP TABLE IF EXISTS "agents_cultural_expertise_languages_spoken";
  `)

  // Drop Agent JSON-LD tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "agents_meta_json_ld_same_as";
    DROP TABLE IF EXISTS "agents_meta_json_ld_knows_about";
    DROP TABLE IF EXISTS "agents_meta_json_ld_area_served";
    DROP TABLE IF EXISTS "agents_meta_json_ld_schema_types";
  `)

  // Drop Agent JSON-LD columns
  await db.execute(sql`
    ALTER TABLE "agents"
    DROP COLUMN IF EXISTS "meta_json_ld_enabled",
    DROP COLUMN IF EXISTS "meta_json_ld_geo_coordinates_latitude",
    DROP COLUMN IF EXISTS "meta_json_ld_geo_coordinates_longitude",
    DROP COLUMN IF EXISTS "meta_json_ld_price_range",
    DROP COLUMN IF EXISTS "meta_json_ld_aggregate_rating_rating_value",
    DROP COLUMN IF EXISTS "meta_json_ld_aggregate_rating_review_count",
    DROP COLUMN IF EXISTS "meta_json_ld_aggregate_rating_best_rating";
  `)

  // Drop Agent SEO keyword tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "agents_meta_keywords_services";
    DROP TABLE IF EXISTS "agents_meta_keywords_geographic";
    DROP TABLE IF EXISTS "agents_meta_keywords_secondary";
    DROP TABLE IF EXISTS "agents_meta_keywords_primary";
  `)
}
