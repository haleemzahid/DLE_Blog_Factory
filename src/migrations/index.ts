import * as migration_20251107_183848_initial from './20251107_183848_initial';
import * as migration_20251214_160005_header_label_migration from './20251214_160005_header_label_migration';
import * as migration_20251225_agent_blog_pagination from './20251225_agent_blog_pagination';
import * as migration_20260114_add_agent_to_headers_footers from './20260114_add_agent_to_headers_footers';
import * as migration_20260124_add_agent_seo_and_citydata_cultural from './20260124_add_agent_seo_and_citydata_cultural';
import * as migration_20260124_add_posts_template_overrides from './20260124_add_posts_template_overrides';
import * as migration_20260126_add_branding_hero_block from './20260126_add_branding_hero_block';
import * as migration_20260126_update_branding_hero_video from './20260126_update_branding_hero_video';
import * as migration_20260127_add_presentation_embed_block from './20260127_add_presentation_embed_block';
import * as migration_20260129_051113 from './20260129_051113';
import * as migration_20260129_072839_add_slug_to_content_templates from './20260129_072839_add_slug_to_content_templates';
import * as migration_20260129_073056_fix_required_city_data_value_column from './20260129_073056_fix_required_city_data_value_column';
import * as migration_20260129_093005_add_content_templates_tables from './20260129_093005_add_content_templates_tables';
import * as migration_20260129_094415_fix_required_city_data_column from './20260129_094415_fix_required_city_data_column';
import * as migration_20260129_124315_add_missing_content_templates_columns from './20260129_124315_add_missing_content_templates_columns';

export const migrations = [
  {
    up: migration_20251107_183848_initial.up,
    down: migration_20251107_183848_initial.down,
    name: '20251107_183848_initial',
  },
  {
    up: migration_20251214_160005_header_label_migration.up,
    down: migration_20251214_160005_header_label_migration.down,
    name: '20251214_160005_header_label_migration',
  },
  {
    up: migration_20251225_agent_blog_pagination.up,
    down: migration_20251225_agent_blog_pagination.down,
    name: '20251225_agent_blog_pagination',
  },
  {
    up: migration_20260114_add_agent_to_headers_footers.up,
    down: migration_20260114_add_agent_to_headers_footers.down,
    name: '20260114_add_agent_to_headers_footers',
  },
  {
    up: migration_20260124_add_agent_seo_and_citydata_cultural.up,
    down: migration_20260124_add_agent_seo_and_citydata_cultural.down,
    name: '20260124_add_agent_seo_and_citydata_cultural',
  },
  {
    up: migration_20260124_add_posts_template_overrides.up,
    down: migration_20260124_add_posts_template_overrides.down,
    name: '20260124_add_posts_template_overrides',
  },
  {
    up: migration_20260126_add_branding_hero_block.up,
    down: migration_20260126_add_branding_hero_block.down,
    name: '20260126_add_branding_hero_block',
  },
  {
    up: migration_20260126_update_branding_hero_video.up,
    down: migration_20260126_update_branding_hero_video.down,
    name: '20260126_update_branding_hero_video',
  },
  {
    up: migration_20260127_add_presentation_embed_block.up,
    down: migration_20260127_add_presentation_embed_block.down,
    name: '20260127_add_presentation_embed_block',
  },
  {
    up: migration_20260129_051113.up,
    down: migration_20260129_051113.down,
    name: '20260129_051113',
  },
  {
    up: migration_20260129_072839_add_slug_to_content_templates.up,
    down: migration_20260129_072839_add_slug_to_content_templates.down,
    name: '20260129_072839_add_slug_to_content_templates',
  },
  {
    up: migration_20260129_073056_fix_required_city_data_value_column.up,
    down: migration_20260129_073056_fix_required_city_data_value_column.down,
    name: '20260129_073056_fix_required_city_data_value_column',
  },
  {
    up: migration_20260129_093005_add_content_templates_tables.up,
    down: migration_20260129_093005_add_content_templates_tables.down,
    name: '20260129_093005_add_content_templates_tables',
  },
  {
    up: migration_20260129_094415_fix_required_city_data_column.up,
    down: migration_20260129_094415_fix_required_city_data_column.down,
    name: '20260129_094415_fix_required_city_data_column'
  },
  {
    up: migration_20260129_124315_add_missing_content_templates_columns.up,
    down: migration_20260129_124315_add_missing_content_templates_columns.down,
    name: '20260129_124315_add_missing_content_templates_columns'
  },
];
