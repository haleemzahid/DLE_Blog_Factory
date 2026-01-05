import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_home_value_form_style" AS ENUM('centered', 'left', 'sidebar');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_block_layout" AS ENUM('grid', 'carousel', 'list');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_services_link_type" AS ENUM('none', 'internal', 'external');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_layout" AS ENUM('twoColumn', 'threeColumn', 'fourColumn', 'alternating');
  CREATE TYPE "public"."enum_pages_blocks_agent_gallery_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_agent_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_faq_block_layout" AS ENUM('accordion', 'twoColumn', 'list');
  CREATE TYPE "public"."enum_pages_blocks_agent_blog_layout" AS ENUM('grid', 'list', 'featured');
  CREATE TYPE "public"."enum_pages_blocks_agent_contact_layout" AS ENUM('twoColumn', 'sidebar', 'fullWidth');
  CREATE TYPE "public"."enum_pages_blocks_agent_contact_background_color" AS ENUM('white', 'gray', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_directory_listing_listing_type" AS ENUM('agents', 'states', 'designations');
  CREATE TYPE "public"."enum_pages_blocks_directory_listing_filter_by_country" AS ENUM('all', 'usa', 'canada', 'uk', 'australia', 'new-zealand', 'uae');
  CREATE TYPE "public"."enum_pages_blocks_directory_listing_layout" AS ENUM('multiColumn', 'grid', 'alphabetical');
  CREATE TYPE "public"."enum_pages_blocks_directory_listing_columns" AS ENUM('2', '3', '4', '5');
  CREATE TYPE "public"."enum_pages_blocks_homepage_blog_layout" AS ENUM('grid', 'list', 'featured');
  CREATE TYPE "public"."enum_pages_blocks_video_embed_aspect_ratio" AS ENUM('16:9', '4:3', '1:1');
  CREATE TYPE "public"."enum_pages_blocks_video_embed_max_width" AS ENUM('small', 'medium', 'large', 'full');
  CREATE TYPE "public"."enum_pages_blocks_partners_logos_style" AS ENUM('carousel', 'grid', 'inline');
  CREATE TYPE "public"."enum_pages_blocks_featured_agents_display_mode" AS ENUM('auto', 'manual', 'designation');
  CREATE TYPE "public"."enum_pages_blocks_featured_agents_layout" AS ENUM('carousel', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_page_blog_display_mode" AS ENUM('auto', 'category', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_page_blog_layout" AS ENUM('grid', 'list', 'compact');
  CREATE TYPE "public"."enum__pages_v_blocks_home_value_form_style" AS ENUM('centered', 'left', 'sidebar');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_block_layout" AS ENUM('grid', 'carousel', 'list');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_services_link_type" AS ENUM('none', 'internal', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_layout" AS ENUM('twoColumn', 'threeColumn', 'fourColumn', 'alternating');
  CREATE TYPE "public"."enum__pages_v_blocks_agent_gallery_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_agent_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_block_layout" AS ENUM('accordion', 'twoColumn', 'list');
  CREATE TYPE "public"."enum__pages_v_blocks_agent_blog_layout" AS ENUM('grid', 'list', 'featured');
  CREATE TYPE "public"."enum__pages_v_blocks_agent_contact_layout" AS ENUM('twoColumn', 'sidebar', 'fullWidth');
  CREATE TYPE "public"."enum__pages_v_blocks_agent_contact_background_color" AS ENUM('white', 'gray', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_directory_listing_listing_type" AS ENUM('agents', 'states', 'designations');
  CREATE TYPE "public"."enum__pages_v_blocks_directory_listing_filter_by_country" AS ENUM('all', 'usa', 'canada', 'uk', 'australia', 'new-zealand', 'uae');
  CREATE TYPE "public"."enum__pages_v_blocks_directory_listing_layout" AS ENUM('multiColumn', 'grid', 'alphabetical');
  CREATE TYPE "public"."enum__pages_v_blocks_directory_listing_columns" AS ENUM('2', '3', '4', '5');
  CREATE TYPE "public"."enum__pages_v_blocks_homepage_blog_layout" AS ENUM('grid', 'list', 'featured');
  CREATE TYPE "public"."enum__pages_v_blocks_video_embed_aspect_ratio" AS ENUM('16:9', '4:3', '1:1');
  CREATE TYPE "public"."enum__pages_v_blocks_video_embed_max_width" AS ENUM('small', 'medium', 'large', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_partners_logos_style" AS ENUM('carousel', 'grid', 'inline');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_agents_display_mode" AS ENUM('auto', 'manual', 'designation');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_agents_layout" AS ENUM('carousel', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_page_blog_display_mode" AS ENUM('auto', 'category', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_page_blog_layout" AS ENUM('grid', 'list', 'compact');
  CREATE TYPE "public"."enum_posts_post_type" AS ENUM('main', 'agent', 'syndicated');
  CREATE TYPE "public"."enum__posts_v_version_post_type" AS ENUM('main', 'agent', 'syndicated');
  CREATE TYPE "public"."enum_agents_working_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_agents_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_states_country" AS ENUM('usa', 'canada', 'uk', 'australia', 'new-zealand', 'uae');
  CREATE TYPE "public"."enum_designations_prefix" AS ENUM('mr', 'mrs', 'ms');
  CREATE TYPE "public"."enum_designations_category" AS ENUM('city', 'seo', 'luxury', 'listings', 'new-build', 'title', 'mobile-home', 'appraisal', 'fix-flip', 'marketing', 'open-house', 'offers', 'nationwide', 'efficiency', 'other');
  CREATE TYPE "public"."enum_testimonials_source" AS ENUM('google', 'yelp', 'zillow', 'realtor', 'facebook', 'direct', 'other');
  CREATE TYPE "public"."enum_plugin_ai_instructions_field_type" AS ENUM('text', 'textarea', 'upload', 'richText');
  CREATE TYPE "public"."enum_plugin_ai_instructions_model_id" AS ENUM('Oai-text', 'dall-e', 'gpt-image-1', 'tts', 'Oai-object');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_text_settings_model" AS ENUM('gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini', 'gpt-3.5-turbo');
  CREATE TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_version" AS ENUM('dall-e-3', 'dall-e-2');
  CREATE TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_size" AS ENUM('256x256', '512x512', '1024x1024', '1792x1024', '1024x1792');
  CREATE TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_style" AS ENUM('vivid', 'natural');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_version" AS ENUM('gpt-image-1');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_size" AS ENUM('1024x1024', '1024x1536', '1536x1024', 'auto');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_quality" AS ENUM('low', 'medium', 'high', 'auto');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_output_format" AS ENUM('png', 'jpeg', 'webp');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_background" AS ENUM('white', 'transparent');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_moderation" AS ENUM('auto', 'low');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_voice" AS ENUM('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_model" AS ENUM('tts-1', 'tts-1-hd');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_response_format" AS ENUM('mp3', 'opus', 'aac', 'flac', 'wav', 'pcm');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_object_settings_model" AS ENUM('gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini', 'gpt-3.5-turbo');
  CREATE TYPE "public"."enum_header_nav_items_dropdown_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_nav_items_type" AS ENUM('link', 'dropdown');
  CREATE TABLE "pages_blocks_home_value_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'What''s My Home Worth?',
  	"description" varchar DEFAULT 'Get instant access to all the homes that sold in your neighborhood from the most Exclusive Real Estate Network.',
  	"input_placeholder" varchar DEFAULT 'Enter Your Home Address',
  	"button_text" varchar DEFAULT 'CONTINUE',
  	"widget_url" varchar,
  	"background_image_id" integer,
  	"style" "enum_pages_blocks_home_value_form_style" DEFAULT 'centered',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'What People Say',
  	"subtitle" varchar DEFAULT 'Client Testimonials',
  	"agent_id" integer,
  	"limit" numeric DEFAULT 6,
  	"layout" "enum_pages_blocks_testimonials_block_layout" DEFAULT 'grid',
  	"show_ratings" boolean DEFAULT true,
  	"show_photos" boolean DEFAULT true,
  	"show_source" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_grid_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"icon_id" integer,
  	"link_type" "enum_pages_blocks_services_grid_services_link_type" DEFAULT 'none',
  	"link_url" varchar,
  	"link_page_id" integer,
  	"link_label" varchar DEFAULT 'Learn More'
  );
  
  CREATE TABLE "pages_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Our Services',
  	"layout" "enum_pages_blocks_services_grid_layout" DEFAULT 'twoColumn',
  	"show_icons" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_agent_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_agent_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Gallery',
  	"agent_id" integer,
  	"layout" "enum_pages_blocks_agent_gallery_layout" DEFAULT 'grid',
  	"columns" "enum_pages_blocks_agent_gallery_columns" DEFAULT '3',
  	"enable_lightbox" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_block_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Frequently Asked Questions',
  	"agent_id" integer,
  	"layout" "enum_pages_blocks_faq_block_layout" DEFAULT 'accordion',
  	"default_open" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_agent_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Latest Articles',
  	"agent_id" integer,
  	"limit" numeric DEFAULT 6,
  	"layout" "enum_pages_blocks_agent_blog_layout" DEFAULT 'grid',
  	"show_load_more" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_author" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_agent_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"agent_id" integer,
  	"title" varchar DEFAULT 'Contact',
  	"show_bio" boolean DEFAULT true,
  	"show_photo" boolean DEFAULT true,
  	"show_social_links" boolean DEFAULT true,
  	"show_working_hours" boolean DEFAULT true,
  	"show_contact_form" boolean DEFAULT true,
  	"layout" "enum_pages_blocks_agent_contact_layout" DEFAULT 'twoColumn',
  	"background_color" "enum_pages_blocks_agent_contact_background_color" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_directory_listing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Designation Directory',
  	"listing_type" "enum_pages_blocks_directory_listing_listing_type" DEFAULT 'agents',
  	"filter_by_state_id" integer,
  	"filter_by_designation_id" integer,
  	"filter_by_country" "enum_pages_blocks_directory_listing_filter_by_country",
  	"layout" "enum_pages_blocks_directory_listing_layout" DEFAULT 'multiColumn',
  	"columns" "enum_pages_blocks_directory_listing_columns" DEFAULT '4',
  	"show_apply_button" boolean DEFAULT true,
  	"show_inquire_button" boolean DEFAULT true,
  	"apply_button_url" varchar DEFAULT '/apply',
  	"inquire_button_url" varchar DEFAULT '/member-relations',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_homepage_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'DLE Network Blog',
  	"subtitle" varchar,
  	"limit" numeric DEFAULT 6,
  	"show_main_blog" boolean DEFAULT true,
  	"show_syndicated_on_homepage" boolean DEFAULT true,
  	"show_featured_only" boolean DEFAULT false,
  	"layout" "enum_pages_blocks_homepage_blog_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_url" varchar,
  	"title" varchar,
  	"aspect_ratio" "enum_pages_blocks_video_embed_aspect_ratio" DEFAULT '16:9',
  	"max_width" "enum_pages_blocks_video_embed_max_width" DEFAULT 'large',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_section_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"photo_id" integer,
  	"bio" varchar,
  	"linked_in" varchar
  );
  
  CREATE TABLE "pages_blocks_team_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Our Visionary Founders',
  	"title" varchar DEFAULT 'The Faces Behind Our Success',
  	"cta_label" varchar DEFAULT 'Meet The Team',
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partners_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_partners_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Our Partners',
  	"title" varchar DEFAULT 'Achieve Business Growth Together',
  	"style" "enum_pages_blocks_partners_logos_style" DEFAULT 'carousel',
  	"grayscale" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_agents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Our Members',
  	"title" varchar DEFAULT 'Meet Our Featured Members',
  	"subtitle" varchar,
  	"display_mode" "enum_pages_blocks_featured_agents_display_mode" DEFAULT 'auto',
  	"designation_id" integer,
  	"limit" numeric DEFAULT 6,
  	"layout" "enum_pages_blocks_featured_agents_layout" DEFAULT 'carousel',
  	"show_designation" boolean DEFAULT true,
  	"cta_label" varchar DEFAULT 'View All Members',
  	"cta_link" varchar DEFAULT '/agents',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Latest Articles',
  	"subtitle" varchar,
  	"display_mode" "enum_pages_blocks_page_blog_display_mode" DEFAULT 'auto',
  	"limit" numeric DEFAULT 6,
  	"layout" "enum_pages_blocks_page_blog_layout" DEFAULT 'grid',
  	"show_read_more" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"cta_label" varchar DEFAULT 'Learn More',
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_value_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'What''s My Home Worth?',
  	"description" varchar DEFAULT 'Get instant access to all the homes that sold in your neighborhood from the most Exclusive Real Estate Network.',
  	"input_placeholder" varchar DEFAULT 'Enter Your Home Address',
  	"button_text" varchar DEFAULT 'CONTINUE',
  	"widget_url" varchar,
  	"background_image_id" integer,
  	"style" "enum__pages_v_blocks_home_value_form_style" DEFAULT 'centered',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'What People Say',
  	"subtitle" varchar DEFAULT 'Client Testimonials',
  	"agent_id" integer,
  	"limit" numeric DEFAULT 6,
  	"layout" "enum__pages_v_blocks_testimonials_block_layout" DEFAULT 'grid',
  	"show_ratings" boolean DEFAULT true,
  	"show_photos" boolean DEFAULT true,
  	"show_source" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"icon_id" integer,
  	"link_type" "enum__pages_v_blocks_services_grid_services_link_type" DEFAULT 'none',
  	"link_url" varchar,
  	"link_page_id" integer,
  	"link_label" varchar DEFAULT 'Learn More',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Our Services',
  	"layout" "enum__pages_v_blocks_services_grid_layout" DEFAULT 'twoColumn',
  	"show_icons" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_agent_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_agent_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Gallery',
  	"agent_id" integer,
  	"layout" "enum__pages_v_blocks_agent_gallery_layout" DEFAULT 'grid',
  	"columns" "enum__pages_v_blocks_agent_gallery_columns" DEFAULT '3',
  	"enable_lightbox" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_block_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Frequently Asked Questions',
  	"agent_id" integer,
  	"layout" "enum__pages_v_blocks_faq_block_layout" DEFAULT 'accordion',
  	"default_open" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_agent_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Latest Articles',
  	"agent_id" integer,
  	"limit" numeric DEFAULT 6,
  	"layout" "enum__pages_v_blocks_agent_blog_layout" DEFAULT 'grid',
  	"show_load_more" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_author" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_agent_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"agent_id" integer,
  	"title" varchar DEFAULT 'Contact',
  	"show_bio" boolean DEFAULT true,
  	"show_photo" boolean DEFAULT true,
  	"show_social_links" boolean DEFAULT true,
  	"show_working_hours" boolean DEFAULT true,
  	"show_contact_form" boolean DEFAULT true,
  	"layout" "enum__pages_v_blocks_agent_contact_layout" DEFAULT 'twoColumn',
  	"background_color" "enum__pages_v_blocks_agent_contact_background_color" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_directory_listing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Designation Directory',
  	"listing_type" "enum__pages_v_blocks_directory_listing_listing_type" DEFAULT 'agents',
  	"filter_by_state_id" integer,
  	"filter_by_designation_id" integer,
  	"filter_by_country" "enum__pages_v_blocks_directory_listing_filter_by_country",
  	"layout" "enum__pages_v_blocks_directory_listing_layout" DEFAULT 'multiColumn',
  	"columns" "enum__pages_v_blocks_directory_listing_columns" DEFAULT '4',
  	"show_apply_button" boolean DEFAULT true,
  	"show_inquire_button" boolean DEFAULT true,
  	"apply_button_url" varchar DEFAULT '/apply',
  	"inquire_button_url" varchar DEFAULT '/member-relations',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_homepage_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'DLE Network Blog',
  	"subtitle" varchar,
  	"limit" numeric DEFAULT 6,
  	"show_main_blog" boolean DEFAULT true,
  	"show_syndicated_on_homepage" boolean DEFAULT true,
  	"show_featured_only" boolean DEFAULT false,
  	"layout" "enum__pages_v_blocks_homepage_blog_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_url" varchar,
  	"title" varchar,
  	"aspect_ratio" "enum__pages_v_blocks_video_embed_aspect_ratio" DEFAULT '16:9',
  	"max_width" "enum__pages_v_blocks_video_embed_max_width" DEFAULT 'large',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_section_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"photo_id" integer,
  	"bio" varchar,
  	"linked_in" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Our Visionary Founders',
  	"title" varchar DEFAULT 'The Faces Behind Our Success',
  	"cta_label" varchar DEFAULT 'Meet The Team',
  	"cta_link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partners_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partners_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Our Partners',
  	"title" varchar DEFAULT 'Achieve Business Growth Together',
  	"style" "enum__pages_v_blocks_partners_logos_style" DEFAULT 'carousel',
  	"grayscale" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_agents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Our Members',
  	"title" varchar DEFAULT 'Meet Our Featured Members',
  	"subtitle" varchar,
  	"display_mode" "enum__pages_v_blocks_featured_agents_display_mode" DEFAULT 'auto',
  	"designation_id" integer,
  	"limit" numeric DEFAULT 6,
  	"layout" "enum__pages_v_blocks_featured_agents_layout" DEFAULT 'carousel',
  	"show_designation" boolean DEFAULT true,
  	"cta_label" varchar DEFAULT 'View All Members',
  	"cta_link" varchar DEFAULT '/agents',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Latest Articles',
  	"subtitle" varchar,
  	"display_mode" "enum__pages_v_blocks_page_blog_display_mode" DEFAULT 'auto',
  	"limit" numeric DEFAULT 6,
  	"layout" "enum__pages_v_blocks_page_blog_layout" DEFAULT 'grid',
  	"show_read_more" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"cta_label" varchar DEFAULT 'Learn More',
  	"cta_link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "agents_working_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_agents_working_hours_day",
  	"hours" varchar
  );
  
  CREATE TABLE "agents_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"abbreviation" varchar
  );
  
  CREATE TABLE "agents_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"icon_id" integer
  );
  
  CREATE TABLE "agents_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "agents_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL
  );
  
  CREATE TABLE "agents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"display_name" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"state_id" integer NOT NULL,
  	"profile_photo_id" integer NOT NULL,
  	"hero_image_id" integer,
  	"logo_id" integer,
  	"tagline" varchar,
  	"bio" jsonb,
  	"short_bio" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"address_street" varchar,
  	"address_city" varchar,
  	"address_state" varchar,
  	"address_zip" varchar,
  	"social_links_facebook" varchar,
  	"social_links_instagram" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_youtube" varchar,
  	"social_links_twitter" varchar,
  	"social_links_pinterest" varchar,
  	"social_links_tiktok" varchar,
  	"social_links_google_maps" varchar,
  	"dre_license" varchar,
  	"brokerage_name" varchar,
  	"brokerage_logo_id" integer,
  	"experience" numeric,
  	"member_since" timestamp(3) with time zone,
  	"home_value_widget_url" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"_status" "enum_agents_status" DEFAULT 'draft',
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "agents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"designations_id" integer
  );
  
  CREATE TABLE "states" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"abbreviation" varchar NOT NULL,
  	"country" "enum_states_country" DEFAULT 'usa' NOT NULL,
  	"is_unincorporated" boolean DEFAULT false,
  	"description" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"header_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "designations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"prefix" "enum_designations_prefix" NOT NULL,
  	"category" "enum_designations_category" NOT NULL,
  	"description" jsonb,
  	"short_description" varchar,
  	"icon_id" integer,
  	"parent_designation_id" integer,
  	"header_image_id" integer,
  	"home_value_form_title" varchar DEFAULT 'What''s My Home Worth?',
  	"home_value_form_description" varchar DEFAULT 'Get instant access to all the homes that sold in your neighborhood from the most Exclusive Real Estate Network.',
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"client_photo_id" integer,
  	"is_local_guide" boolean DEFAULT false,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"review" varchar NOT NULL,
  	"agent_id" integer NOT NULL,
  	"source" "enum_testimonials_source" DEFAULT 'google',
  	"source_url" varchar,
  	"date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"approved" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "plugin_ai_instructions_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "plugin_ai_instructions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"schema_path" varchar,
  	"field_type" "enum_plugin_ai_instructions_field_type" DEFAULT 'text',
  	"relation_to" varchar,
  	"model_id" "enum_plugin_ai_instructions_model_id",
  	"disabled" boolean DEFAULT false,
  	"prompt" varchar,
  	"system" varchar DEFAULT 'INSTRUCTIONS:
  You are a highly skilled and professional blog writer,
  renowned for crafting engaging and well-organized articles.
  When given a title, you meticulously create blogs that are not only
  informative and accurate but also captivating and beautifully structured.',
  	"layout" varchar DEFAULT '[paragraph] - Write a concise introduction (2-3 sentences) that outlines the main topic.
  [horizontalrule] - Insert a horizontal rule to separate the introduction from the main content.
  [list] - Create a list with 3-5 items. Each list item should contain:
     a. [heading] - A brief, descriptive heading (up to 5 words)
     b. [paragraph] - A short explanation or elaboration (1-2 sentences)
  [horizontalrule] - Insert another horizontal rule to separate the main content from the conclusion.
  [paragraph] - Compose a brief conclusion (2-3 sentences) summarizing the key points.
  [quote] - Include a relevant quote from a famous person, directly related to the topic. Format: "Quote text." - Author Name',
  	"oai_text_settings_model" "enum_plugin_ai_instructions_oai_text_settings_model" DEFAULT 'gpt-4o-mini',
  	"oai_text_settings_max_tokens" numeric DEFAULT 5000,
  	"oai_text_settings_temperature" numeric DEFAULT 0.7,
  	"oai_text_settings_extract_attachments" boolean,
  	"dalle_e_settings_version" "enum_plugin_ai_instructions_dalle_e_settings_version" DEFAULT 'dall-e-3',
  	"dalle_e_settings_size" "enum_plugin_ai_instructions_dalle_e_settings_size" DEFAULT '1024x1024',
  	"dalle_e_settings_style" "enum_plugin_ai_instructions_dalle_e_settings_style" DEFAULT 'natural',
  	"dalle_e_settings_enable_prompt_optimization" boolean,
  	"gpt_image_1_settings_version" "enum_plugin_ai_instructions_gpt_image_1_settings_version" DEFAULT 'gpt-image-1',
  	"gpt_image_1_settings_size" "enum_plugin_ai_instructions_gpt_image_1_settings_size" DEFAULT 'auto',
  	"gpt_image_1_settings_quality" "enum_plugin_ai_instructions_gpt_image_1_settings_quality" DEFAULT 'auto',
  	"gpt_image_1_settings_output_format" "enum_plugin_ai_instructions_gpt_image_1_settings_output_format" DEFAULT 'png',
  	"gpt_image_1_settings_output_compression" numeric DEFAULT 100,
  	"gpt_image_1_settings_background" "enum_plugin_ai_instructions_gpt_image_1_settings_background" DEFAULT 'white',
  	"gpt_image_1_settings_moderation" "enum_plugin_ai_instructions_gpt_image_1_settings_moderation" DEFAULT 'auto',
  	"oai_tts_settings_voice" "enum_plugin_ai_instructions_oai_tts_settings_voice" DEFAULT 'alloy',
  	"oai_tts_settings_model" "enum_plugin_ai_instructions_oai_tts_settings_model" DEFAULT 'tts-1',
  	"oai_tts_settings_response_format" "enum_plugin_ai_instructions_oai_tts_settings_response_format" DEFAULT 'mp3',
  	"oai_tts_settings_speed" numeric DEFAULT 1,
  	"oai_object_settings_model" "enum_plugin_ai_instructions_oai_object_settings_model" DEFAULT 'gpt-4o',
  	"oai_object_settings_max_tokens" numeric DEFAULT 5000,
  	"oai_object_settings_temperature" numeric DEFAULT 0.7,
  	"oai_object_settings_extract_attachments" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items_dropdown_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_header_nav_items_dropdown_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "agents_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "agents_id" integer;
  ALTER TABLE "posts" ADD COLUMN "post_type" "enum_posts_post_type" DEFAULT 'main';
  ALTER TABLE "posts" ADD COLUMN "show_on_homepage" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "agent_id" integer;
  ALTER TABLE "posts" ADD COLUMN "is_featured" boolean DEFAULT false;
  ALTER TABLE "posts_rels" ADD COLUMN "agents_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_post_type" "enum__posts_v_version_post_type" DEFAULT 'main';
  ALTER TABLE "_posts_v" ADD COLUMN "version_show_on_homepage" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_agent_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_is_featured" boolean DEFAULT false;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "agents_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "categories" ADD COLUMN "description" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "agents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "states_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "designations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "plugin_ai_instructions_id" integer;
  ALTER TABLE "header_nav_items" ADD COLUMN "type" "enum_header_nav_items_type" DEFAULT 'link';
  ALTER TABLE "header_nav_items" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "header_nav_items" ADD COLUMN "include_designations" boolean;
  ALTER TABLE "header_nav_items" ADD COLUMN "include_states" boolean;
  ALTER TABLE "pages_blocks_home_value_form" ADD CONSTRAINT "pages_blocks_home_value_form_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_value_form" ADD CONSTRAINT "pages_blocks_home_value_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_block" ADD CONSTRAINT "pages_blocks_testimonials_block_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_block" ADD CONSTRAINT "pages_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid_services" ADD CONSTRAINT "pages_blocks_services_grid_services_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid_services" ADD CONSTRAINT "pages_blocks_services_grid_services_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid_services" ADD CONSTRAINT "pages_blocks_services_grid_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid" ADD CONSTRAINT "pages_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_agent_gallery_images" ADD CONSTRAINT "pages_blocks_agent_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_agent_gallery_images" ADD CONSTRAINT "pages_blocks_agent_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_agent_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_agent_gallery" ADD CONSTRAINT "pages_blocks_agent_gallery_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_agent_gallery" ADD CONSTRAINT "pages_blocks_agent_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block_faqs" ADD CONSTRAINT "pages_blocks_faq_block_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block" ADD CONSTRAINT "pages_blocks_faq_block_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block" ADD CONSTRAINT "pages_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_agent_blog" ADD CONSTRAINT "pages_blocks_agent_blog_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_agent_blog" ADD CONSTRAINT "pages_blocks_agent_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_agent_contact" ADD CONSTRAINT "pages_blocks_agent_contact_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_agent_contact" ADD CONSTRAINT "pages_blocks_agent_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_directory_listing" ADD CONSTRAINT "pages_blocks_directory_listing_filter_by_state_id_states_id_fk" FOREIGN KEY ("filter_by_state_id") REFERENCES "public"."states"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_directory_listing" ADD CONSTRAINT "pages_blocks_directory_listing_filter_by_designation_id_designations_id_fk" FOREIGN KEY ("filter_by_designation_id") REFERENCES "public"."designations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_directory_listing" ADD CONSTRAINT "pages_blocks_directory_listing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_homepage_blog" ADD CONSTRAINT "pages_blocks_homepage_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_embed" ADD CONSTRAINT "pages_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_section_members" ADD CONSTRAINT "pages_blocks_team_section_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_section_members" ADD CONSTRAINT "pages_blocks_team_section_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_section" ADD CONSTRAINT "pages_blocks_team_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_logos_logos" ADD CONSTRAINT "pages_blocks_partners_logos_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_logos_logos" ADD CONSTRAINT "pages_blocks_partners_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partners_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_logos" ADD CONSTRAINT "pages_blocks_partners_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_agents" ADD CONSTRAINT "pages_blocks_featured_agents_designation_id_designations_id_fk" FOREIGN KEY ("designation_id") REFERENCES "public"."designations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_agents" ADD CONSTRAINT "pages_blocks_featured_agents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_blog" ADD CONSTRAINT "pages_blocks_page_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_value_form" ADD CONSTRAINT "_pages_v_blocks_home_value_form_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_value_form" ADD CONSTRAINT "_pages_v_blocks_home_value_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_block" ADD CONSTRAINT "_pages_v_blocks_testimonials_block_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_block" ADD CONSTRAINT "_pages_v_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid_services" ADD CONSTRAINT "_pages_v_blocks_services_grid_services_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid_services" ADD CONSTRAINT "_pages_v_blocks_services_grid_services_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid_services" ADD CONSTRAINT "_pages_v_blocks_services_grid_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD CONSTRAINT "_pages_v_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agent_gallery_images" ADD CONSTRAINT "_pages_v_blocks_agent_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agent_gallery_images" ADD CONSTRAINT "_pages_v_blocks_agent_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_agent_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agent_gallery" ADD CONSTRAINT "_pages_v_blocks_agent_gallery_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agent_gallery" ADD CONSTRAINT "_pages_v_blocks_agent_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_block_faqs" ADD CONSTRAINT "_pages_v_blocks_faq_block_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_block" ADD CONSTRAINT "_pages_v_blocks_faq_block_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_block" ADD CONSTRAINT "_pages_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agent_blog" ADD CONSTRAINT "_pages_v_blocks_agent_blog_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agent_blog" ADD CONSTRAINT "_pages_v_blocks_agent_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agent_contact" ADD CONSTRAINT "_pages_v_blocks_agent_contact_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agent_contact" ADD CONSTRAINT "_pages_v_blocks_agent_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_directory_listing" ADD CONSTRAINT "_pages_v_blocks_directory_listing_filter_by_state_id_states_id_fk" FOREIGN KEY ("filter_by_state_id") REFERENCES "public"."states"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_directory_listing" ADD CONSTRAINT "_pages_v_blocks_directory_listing_filter_by_designation_id_designations_id_fk" FOREIGN KEY ("filter_by_designation_id") REFERENCES "public"."designations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_directory_listing" ADD CONSTRAINT "_pages_v_blocks_directory_listing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_homepage_blog" ADD CONSTRAINT "_pages_v_blocks_homepage_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_embed" ADD CONSTRAINT "_pages_v_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_section_members" ADD CONSTRAINT "_pages_v_blocks_team_section_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_section_members" ADD CONSTRAINT "_pages_v_blocks_team_section_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_section" ADD CONSTRAINT "_pages_v_blocks_team_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_logos_logos" ADD CONSTRAINT "_pages_v_blocks_partners_logos_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_logos_logos" ADD CONSTRAINT "_pages_v_blocks_partners_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partners_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_logos" ADD CONSTRAINT "_pages_v_blocks_partners_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_agents" ADD CONSTRAINT "_pages_v_blocks_featured_agents_designation_id_designations_id_fk" FOREIGN KEY ("designation_id") REFERENCES "public"."designations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_agents" ADD CONSTRAINT "_pages_v_blocks_featured_agents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_blog" ADD CONSTRAINT "_pages_v_blocks_page_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_working_hours" ADD CONSTRAINT "agents_working_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_certifications" ADD CONSTRAINT "agents_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_services" ADD CONSTRAINT "agents_services_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents_services" ADD CONSTRAINT "agents_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_gallery" ADD CONSTRAINT "agents_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents_gallery" ADD CONSTRAINT "agents_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_faqs" ADD CONSTRAINT "agents_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents" ADD CONSTRAINT "agents_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents" ADD CONSTRAINT "agents_profile_photo_id_media_id_fk" FOREIGN KEY ("profile_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents" ADD CONSTRAINT "agents_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents" ADD CONSTRAINT "agents_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents" ADD CONSTRAINT "agents_brokerage_logo_id_media_id_fk" FOREIGN KEY ("brokerage_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents" ADD CONSTRAINT "agents_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents_rels" ADD CONSTRAINT "agents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_rels" ADD CONSTRAINT "agents_rels_designations_fk" FOREIGN KEY ("designations_id") REFERENCES "public"."designations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "states" ADD CONSTRAINT "states_header_image_id_media_id_fk" FOREIGN KEY ("header_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "designations" ADD CONSTRAINT "designations_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "designations" ADD CONSTRAINT "designations_parent_designation_id_designations_id_fk" FOREIGN KEY ("parent_designation_id") REFERENCES "public"."designations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "designations" ADD CONSTRAINT "designations_header_image_id_media_id_fk" FOREIGN KEY ("header_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_client_photo_id_media_id_fk" FOREIGN KEY ("client_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "plugin_ai_instructions_images" ADD CONSTRAINT "plugin_ai_instructions_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "plugin_ai_instructions_images" ADD CONSTRAINT "plugin_ai_instructions_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plugin_ai_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_dropdown_items" ADD CONSTRAINT "header_nav_items_dropdown_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_home_value_form_order_idx" ON "pages_blocks_home_value_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_value_form_parent_id_idx" ON "pages_blocks_home_value_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_value_form_path_idx" ON "pages_blocks_home_value_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_home_value_form_background_image_idx" ON "pages_blocks_home_value_form" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_testimonials_block_order_idx" ON "pages_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_block_parent_id_idx" ON "pages_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_block_path_idx" ON "pages_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_block_agent_idx" ON "pages_blocks_testimonials_block" USING btree ("agent_id");
  CREATE INDEX "pages_blocks_services_grid_services_order_idx" ON "pages_blocks_services_grid_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_services_parent_id_idx" ON "pages_blocks_services_grid_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_services_icon_idx" ON "pages_blocks_services_grid_services" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_services_grid_services_link_link_page_idx" ON "pages_blocks_services_grid_services" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_services_grid_order_idx" ON "pages_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_parent_id_idx" ON "pages_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_path_idx" ON "pages_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_agent_gallery_images_order_idx" ON "pages_blocks_agent_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_agent_gallery_images_parent_id_idx" ON "pages_blocks_agent_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_agent_gallery_images_image_idx" ON "pages_blocks_agent_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_agent_gallery_order_idx" ON "pages_blocks_agent_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_agent_gallery_parent_id_idx" ON "pages_blocks_agent_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_agent_gallery_path_idx" ON "pages_blocks_agent_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_agent_gallery_agent_idx" ON "pages_blocks_agent_gallery" USING btree ("agent_id");
  CREATE INDEX "pages_blocks_faq_block_faqs_order_idx" ON "pages_blocks_faq_block_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_block_faqs_parent_id_idx" ON "pages_blocks_faq_block_faqs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_block_order_idx" ON "pages_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_block_parent_id_idx" ON "pages_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_block_path_idx" ON "pages_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_block_agent_idx" ON "pages_blocks_faq_block" USING btree ("agent_id");
  CREATE INDEX "pages_blocks_agent_blog_order_idx" ON "pages_blocks_agent_blog" USING btree ("_order");
  CREATE INDEX "pages_blocks_agent_blog_parent_id_idx" ON "pages_blocks_agent_blog" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_agent_blog_path_idx" ON "pages_blocks_agent_blog" USING btree ("_path");
  CREATE INDEX "pages_blocks_agent_blog_agent_idx" ON "pages_blocks_agent_blog" USING btree ("agent_id");
  CREATE INDEX "pages_blocks_agent_contact_order_idx" ON "pages_blocks_agent_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_agent_contact_parent_id_idx" ON "pages_blocks_agent_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_agent_contact_path_idx" ON "pages_blocks_agent_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_agent_contact_agent_idx" ON "pages_blocks_agent_contact" USING btree ("agent_id");
  CREATE INDEX "pages_blocks_directory_listing_order_idx" ON "pages_blocks_directory_listing" USING btree ("_order");
  CREATE INDEX "pages_blocks_directory_listing_parent_id_idx" ON "pages_blocks_directory_listing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_directory_listing_path_idx" ON "pages_blocks_directory_listing" USING btree ("_path");
  CREATE INDEX "pages_blocks_directory_listing_filter_by_state_idx" ON "pages_blocks_directory_listing" USING btree ("filter_by_state_id");
  CREATE INDEX "pages_blocks_directory_listing_filter_by_designation_idx" ON "pages_blocks_directory_listing" USING btree ("filter_by_designation_id");
  CREATE INDEX "pages_blocks_homepage_blog_order_idx" ON "pages_blocks_homepage_blog" USING btree ("_order");
  CREATE INDEX "pages_blocks_homepage_blog_parent_id_idx" ON "pages_blocks_homepage_blog" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_homepage_blog_path_idx" ON "pages_blocks_homepage_blog" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_embed_order_idx" ON "pages_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_embed_parent_id_idx" ON "pages_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_embed_path_idx" ON "pages_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_section_members_order_idx" ON "pages_blocks_team_section_members" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_section_members_parent_id_idx" ON "pages_blocks_team_section_members" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_section_members_photo_idx" ON "pages_blocks_team_section_members" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_team_section_order_idx" ON "pages_blocks_team_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_section_parent_id_idx" ON "pages_blocks_team_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_section_path_idx" ON "pages_blocks_team_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_partners_logos_logos_order_idx" ON "pages_blocks_partners_logos_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_partners_logos_logos_parent_id_idx" ON "pages_blocks_partners_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partners_logos_logos_logo_idx" ON "pages_blocks_partners_logos_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_partners_logos_order_idx" ON "pages_blocks_partners_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_partners_logos_parent_id_idx" ON "pages_blocks_partners_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partners_logos_path_idx" ON "pages_blocks_partners_logos" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_agents_order_idx" ON "pages_blocks_featured_agents" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_agents_parent_id_idx" ON "pages_blocks_featured_agents" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_agents_path_idx" ON "pages_blocks_featured_agents" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_agents_designation_idx" ON "pages_blocks_featured_agents" USING btree ("designation_id");
  CREATE INDEX "pages_blocks_page_blog_order_idx" ON "pages_blocks_page_blog" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_blog_parent_id_idx" ON "pages_blocks_page_blog" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_blog_path_idx" ON "pages_blocks_page_blog" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_home_value_form_order_idx" ON "_pages_v_blocks_home_value_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_value_form_parent_id_idx" ON "_pages_v_blocks_home_value_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_value_form_path_idx" ON "_pages_v_blocks_home_value_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_home_value_form_background_image_idx" ON "_pages_v_blocks_home_value_form" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_testimonials_block_order_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_block_parent_id_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_block_path_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_block_agent_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("agent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_services_order_idx" ON "_pages_v_blocks_services_grid_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_grid_services_parent_id_idx" ON "_pages_v_blocks_services_grid_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_services_icon_idx" ON "_pages_v_blocks_services_grid_services" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_services_grid_services_link_link_page_idx" ON "_pages_v_blocks_services_grid_services" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_services_grid_order_idx" ON "_pages_v_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_grid_parent_id_idx" ON "_pages_v_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_path_idx" ON "_pages_v_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_agent_gallery_images_order_idx" ON "_pages_v_blocks_agent_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_agent_gallery_images_parent_id_idx" ON "_pages_v_blocks_agent_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_agent_gallery_images_image_idx" ON "_pages_v_blocks_agent_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_agent_gallery_order_idx" ON "_pages_v_blocks_agent_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_agent_gallery_parent_id_idx" ON "_pages_v_blocks_agent_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_agent_gallery_path_idx" ON "_pages_v_blocks_agent_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_agent_gallery_agent_idx" ON "_pages_v_blocks_agent_gallery" USING btree ("agent_id");
  CREATE INDEX "_pages_v_blocks_faq_block_faqs_order_idx" ON "_pages_v_blocks_faq_block_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_block_faqs_parent_id_idx" ON "_pages_v_blocks_faq_block_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_block_order_idx" ON "_pages_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_block_parent_id_idx" ON "_pages_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_block_path_idx" ON "_pages_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_block_agent_idx" ON "_pages_v_blocks_faq_block" USING btree ("agent_id");
  CREATE INDEX "_pages_v_blocks_agent_blog_order_idx" ON "_pages_v_blocks_agent_blog" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_agent_blog_parent_id_idx" ON "_pages_v_blocks_agent_blog" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_agent_blog_path_idx" ON "_pages_v_blocks_agent_blog" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_agent_blog_agent_idx" ON "_pages_v_blocks_agent_blog" USING btree ("agent_id");
  CREATE INDEX "_pages_v_blocks_agent_contact_order_idx" ON "_pages_v_blocks_agent_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_agent_contact_parent_id_idx" ON "_pages_v_blocks_agent_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_agent_contact_path_idx" ON "_pages_v_blocks_agent_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_agent_contact_agent_idx" ON "_pages_v_blocks_agent_contact" USING btree ("agent_id");
  CREATE INDEX "_pages_v_blocks_directory_listing_order_idx" ON "_pages_v_blocks_directory_listing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_directory_listing_parent_id_idx" ON "_pages_v_blocks_directory_listing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_directory_listing_path_idx" ON "_pages_v_blocks_directory_listing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_directory_listing_filter_by_state_idx" ON "_pages_v_blocks_directory_listing" USING btree ("filter_by_state_id");
  CREATE INDEX "_pages_v_blocks_directory_listing_filter_by_designation_idx" ON "_pages_v_blocks_directory_listing" USING btree ("filter_by_designation_id");
  CREATE INDEX "_pages_v_blocks_homepage_blog_order_idx" ON "_pages_v_blocks_homepage_blog" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_homepage_blog_parent_id_idx" ON "_pages_v_blocks_homepage_blog" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_homepage_blog_path_idx" ON "_pages_v_blocks_homepage_blog" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_embed_order_idx" ON "_pages_v_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_embed_parent_id_idx" ON "_pages_v_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_embed_path_idx" ON "_pages_v_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_section_members_order_idx" ON "_pages_v_blocks_team_section_members" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_section_members_parent_id_idx" ON "_pages_v_blocks_team_section_members" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_section_members_photo_idx" ON "_pages_v_blocks_team_section_members" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_team_section_order_idx" ON "_pages_v_blocks_team_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_section_parent_id_idx" ON "_pages_v_blocks_team_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_section_path_idx" ON "_pages_v_blocks_team_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_partners_logos_logos_order_idx" ON "_pages_v_blocks_partners_logos_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partners_logos_logos_parent_id_idx" ON "_pages_v_blocks_partners_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_logos_logos_logo_idx" ON "_pages_v_blocks_partners_logos_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_partners_logos_order_idx" ON "_pages_v_blocks_partners_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partners_logos_parent_id_idx" ON "_pages_v_blocks_partners_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_logos_path_idx" ON "_pages_v_blocks_partners_logos" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_agents_order_idx" ON "_pages_v_blocks_featured_agents" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_agents_parent_id_idx" ON "_pages_v_blocks_featured_agents" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_agents_path_idx" ON "_pages_v_blocks_featured_agents" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_agents_designation_idx" ON "_pages_v_blocks_featured_agents" USING btree ("designation_id");
  CREATE INDEX "_pages_v_blocks_page_blog_order_idx" ON "_pages_v_blocks_page_blog" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_blog_parent_id_idx" ON "_pages_v_blocks_page_blog" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_blog_path_idx" ON "_pages_v_blocks_page_blog" USING btree ("_path");
  CREATE INDEX "agents_working_hours_order_idx" ON "agents_working_hours" USING btree ("_order");
  CREATE INDEX "agents_working_hours_parent_id_idx" ON "agents_working_hours" USING btree ("_parent_id");
  CREATE INDEX "agents_certifications_order_idx" ON "agents_certifications" USING btree ("_order");
  CREATE INDEX "agents_certifications_parent_id_idx" ON "agents_certifications" USING btree ("_parent_id");
  CREATE INDEX "agents_services_order_idx" ON "agents_services" USING btree ("_order");
  CREATE INDEX "agents_services_parent_id_idx" ON "agents_services" USING btree ("_parent_id");
  CREATE INDEX "agents_services_icon_idx" ON "agents_services" USING btree ("icon_id");
  CREATE INDEX "agents_gallery_order_idx" ON "agents_gallery" USING btree ("_order");
  CREATE INDEX "agents_gallery_parent_id_idx" ON "agents_gallery" USING btree ("_parent_id");
  CREATE INDEX "agents_gallery_image_idx" ON "agents_gallery" USING btree ("image_id");
  CREATE INDEX "agents_faqs_order_idx" ON "agents_faqs" USING btree ("_order");
  CREATE INDEX "agents_faqs_parent_id_idx" ON "agents_faqs" USING btree ("_parent_id");
  CREATE INDEX "agents_state_idx" ON "agents" USING btree ("state_id");
  CREATE INDEX "agents_profile_photo_idx" ON "agents" USING btree ("profile_photo_id");
  CREATE INDEX "agents_hero_image_idx" ON "agents" USING btree ("hero_image_id");
  CREATE INDEX "agents_logo_idx" ON "agents" USING btree ("logo_id");
  CREATE INDEX "agents_brokerage_brokerage_logo_idx" ON "agents" USING btree ("brokerage_logo_id");
  CREATE INDEX "agents_meta_meta_image_idx" ON "agents" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "agents_slug_idx" ON "agents" USING btree ("slug");
  CREATE INDEX "agents_updated_at_idx" ON "agents" USING btree ("updated_at");
  CREATE INDEX "agents_created_at_idx" ON "agents" USING btree ("created_at");
  CREATE INDEX "agents_rels_order_idx" ON "agents_rels" USING btree ("order");
  CREATE INDEX "agents_rels_parent_idx" ON "agents_rels" USING btree ("parent_id");
  CREATE INDEX "agents_rels_path_idx" ON "agents_rels" USING btree ("path");
  CREATE INDEX "agents_rels_designations_id_idx" ON "agents_rels" USING btree ("designations_id");
  CREATE UNIQUE INDEX "states_slug_idx" ON "states" USING btree ("slug");
  CREATE INDEX "states_header_image_idx" ON "states" USING btree ("header_image_id");
  CREATE INDEX "states_updated_at_idx" ON "states" USING btree ("updated_at");
  CREATE INDEX "states_created_at_idx" ON "states" USING btree ("created_at");
  CREATE INDEX "designations_icon_idx" ON "designations" USING btree ("icon_id");
  CREATE INDEX "designations_parent_designation_idx" ON "designations" USING btree ("parent_designation_id");
  CREATE INDEX "designations_header_image_idx" ON "designations" USING btree ("header_image_id");
  CREATE UNIQUE INDEX "designations_slug_idx" ON "designations" USING btree ("slug");
  CREATE INDEX "designations_updated_at_idx" ON "designations" USING btree ("updated_at");
  CREATE INDEX "designations_created_at_idx" ON "designations" USING btree ("created_at");
  CREATE INDEX "testimonials_client_photo_idx" ON "testimonials" USING btree ("client_photo_id");
  CREATE INDEX "testimonials_agent_idx" ON "testimonials" USING btree ("agent_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "plugin_ai_instructions_images_order_idx" ON "plugin_ai_instructions_images" USING btree ("_order");
  CREATE INDEX "plugin_ai_instructions_images_parent_id_idx" ON "plugin_ai_instructions_images" USING btree ("_parent_id");
  CREATE INDEX "plugin_ai_instructions_images_image_idx" ON "plugin_ai_instructions_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "plugin_ai_instructions_schema_path_idx" ON "plugin_ai_instructions" USING btree ("schema_path");
  CREATE INDEX "plugin_ai_instructions_updated_at_idx" ON "plugin_ai_instructions" USING btree ("updated_at");
  CREATE INDEX "plugin_ai_instructions_created_at_idx" ON "plugin_ai_instructions" USING btree ("created_at");
  CREATE INDEX "header_nav_items_dropdown_items_order_idx" ON "header_nav_items_dropdown_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_dropdown_items_parent_id_idx" ON "header_nav_items_dropdown_items" USING btree ("_parent_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_agents_fk" FOREIGN KEY ("agents_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_agents_fk" FOREIGN KEY ("agents_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_agents_fk" FOREIGN KEY ("agents_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_agent_id_agents_id_fk" FOREIGN KEY ("version_agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_agents_fk" FOREIGN KEY ("agents_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_agents_fk" FOREIGN KEY ("agents_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_states_fk" FOREIGN KEY ("states_id") REFERENCES "public"."states"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_designations_fk" FOREIGN KEY ("designations_id") REFERENCES "public"."designations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plugin_ai_instructions_fk" FOREIGN KEY ("plugin_ai_instructions_id") REFERENCES "public"."plugin_ai_instructions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "pages_rels_agents_id_idx" ON "pages_rels" USING btree ("agents_id");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "_pages_v_rels_agents_id_idx" ON "_pages_v_rels" USING btree ("agents_id");
  CREATE INDEX "posts_agent_idx" ON "posts" USING btree ("agent_id");
  CREATE INDEX "posts_rels_agents_id_idx" ON "posts_rels" USING btree ("agents_id");
  CREATE INDEX "posts_rels_pages_id_idx" ON "posts_rels" USING btree ("pages_id");
  CREATE INDEX "_posts_v_version_version_agent_idx" ON "_posts_v" USING btree ("version_agent_id");
  CREATE INDEX "_posts_v_rels_agents_id_idx" ON "_posts_v_rels" USING btree ("agents_id");
  CREATE INDEX "_posts_v_rels_pages_id_idx" ON "_posts_v_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_agents_id_idx" ON "payload_locked_documents_rels" USING btree ("agents_id");
  CREATE INDEX "payload_locked_documents_rels_states_id_idx" ON "payload_locked_documents_rels" USING btree ("states_id");
  CREATE INDEX "payload_locked_documents_rels_designations_id_idx" ON "payload_locked_documents_rels" USING btree ("designations_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_plugin_ai_instructions_id_idx" ON "payload_locked_documents_rels" USING btree ("plugin_ai_instructions_id");
  ALTER TABLE "header_nav_items" DROP COLUMN "link_label";`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_home_value_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_services_grid_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_services_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_agent_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_agent_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_block_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_agent_blog" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_agent_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_directory_listing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_homepage_blog" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_section_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_partners_logos_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_partners_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_featured_agents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_page_blog" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_home_value_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_services_grid_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_services_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_agent_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_agent_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_block_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_agent_blog" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_agent_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_directory_listing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_homepage_blog" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_video_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_team_section_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_team_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_partners_logos_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_partners_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_featured_agents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_blog" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_working_hours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_certifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "states" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "designations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plugin_ai_instructions_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plugin_ai_instructions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_dropdown_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_home_value_form" CASCADE;
  DROP TABLE "pages_blocks_testimonials_block" CASCADE;
  DROP TABLE "pages_blocks_services_grid_services" CASCADE;
  DROP TABLE "pages_blocks_services_grid" CASCADE;
  DROP TABLE "pages_blocks_agent_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_agent_gallery" CASCADE;
  DROP TABLE "pages_blocks_faq_block_faqs" CASCADE;
  DROP TABLE "pages_blocks_faq_block" CASCADE;
  DROP TABLE "pages_blocks_agent_blog" CASCADE;
  DROP TABLE "pages_blocks_agent_contact" CASCADE;
  DROP TABLE "pages_blocks_directory_listing" CASCADE;
  DROP TABLE "pages_blocks_homepage_blog" CASCADE;
  DROP TABLE "pages_blocks_video_embed" CASCADE;
  DROP TABLE "pages_blocks_team_section_members" CASCADE;
  DROP TABLE "pages_blocks_team_section" CASCADE;
  DROP TABLE "pages_blocks_partners_logos_logos" CASCADE;
  DROP TABLE "pages_blocks_partners_logos" CASCADE;
  DROP TABLE "pages_blocks_featured_agents" CASCADE;
  DROP TABLE "pages_blocks_page_blog" CASCADE;
  DROP TABLE "_pages_v_blocks_home_value_form" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_block" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid_services" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_agent_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_agent_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block_faqs" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block" CASCADE;
  DROP TABLE "_pages_v_blocks_agent_blog" CASCADE;
  DROP TABLE "_pages_v_blocks_agent_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_directory_listing" CASCADE;
  DROP TABLE "_pages_v_blocks_homepage_blog" CASCADE;
  DROP TABLE "_pages_v_blocks_video_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_team_section_members" CASCADE;
  DROP TABLE "_pages_v_blocks_team_section" CASCADE;
  DROP TABLE "_pages_v_blocks_partners_logos_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_partners_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_agents" CASCADE;
  DROP TABLE "_pages_v_blocks_page_blog" CASCADE;
  DROP TABLE "agents_working_hours" CASCADE;
  DROP TABLE "agents_certifications" CASCADE;
  DROP TABLE "agents_services" CASCADE;
  DROP TABLE "agents_gallery" CASCADE;
  DROP TABLE "agents_faqs" CASCADE;
  DROP TABLE "agents" CASCADE;
  DROP TABLE "agents_rels" CASCADE;
  DROP TABLE "states" CASCADE;
  DROP TABLE "designations" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "plugin_ai_instructions_images" CASCADE;
  DROP TABLE "plugin_ai_instructions" CASCADE;
  DROP TABLE "header_nav_items_dropdown_items" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_testimonials_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_agents_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_testimonials_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_agents_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_agent_id_agents_id_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_agents_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_pages_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_agent_id_agents_id_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_agents_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_agents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_states_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_designations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_plugin_ai_instructions_fk";
  
  DROP INDEX "pages_rels_testimonials_id_idx";
  DROP INDEX "pages_rels_agents_id_idx";
  DROP INDEX "_pages_v_rels_testimonials_id_idx";
  DROP INDEX "_pages_v_rels_agents_id_idx";
  DROP INDEX "posts_agent_idx";
  DROP INDEX "posts_rels_agents_id_idx";
  DROP INDEX "posts_rels_pages_id_idx";
  DROP INDEX "_posts_v_version_version_agent_idx";
  DROP INDEX "_posts_v_rels_agents_id_idx";
  DROP INDEX "_posts_v_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_agents_id_idx";
  DROP INDEX "payload_locked_documents_rels_states_id_idx";
  DROP INDEX "payload_locked_documents_rels_designations_id_idx";
  DROP INDEX "payload_locked_documents_rels_testimonials_id_idx";
  DROP INDEX "payload_locked_documents_rels_plugin_ai_instructions_id_idx";
  ALTER TABLE "header_nav_items" ADD COLUMN "link_label" varchar NOT NULL;
  ALTER TABLE "pages_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "pages_rels" DROP COLUMN "agents_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "agents_id";
  ALTER TABLE "posts" DROP COLUMN "post_type";
  ALTER TABLE "posts" DROP COLUMN "show_on_homepage";
  ALTER TABLE "posts" DROP COLUMN "agent_id";
  ALTER TABLE "posts" DROP COLUMN "is_featured";
  ALTER TABLE "posts_rels" DROP COLUMN "agents_id";
  ALTER TABLE "posts_rels" DROP COLUMN "pages_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_post_type";
  ALTER TABLE "_posts_v" DROP COLUMN "version_show_on_homepage";
  ALTER TABLE "_posts_v" DROP COLUMN "version_agent_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_is_featured";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "agents_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "pages_id";
  ALTER TABLE "categories" DROP COLUMN "description";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "agents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "states_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "designations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "plugin_ai_instructions_id";
  ALTER TABLE "header_nav_items" DROP COLUMN "type";
  ALTER TABLE "header_nav_items" DROP COLUMN "label";
  ALTER TABLE "header_nav_items" DROP COLUMN "include_designations";
  ALTER TABLE "header_nav_items" DROP COLUMN "include_states";
  DROP TYPE "public"."enum_pages_blocks_home_value_form_style";
  DROP TYPE "public"."enum_pages_blocks_testimonials_block_layout";
  DROP TYPE "public"."enum_pages_blocks_services_grid_services_link_type";
  DROP TYPE "public"."enum_pages_blocks_services_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_agent_gallery_layout";
  DROP TYPE "public"."enum_pages_blocks_agent_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_faq_block_layout";
  DROP TYPE "public"."enum_pages_blocks_agent_blog_layout";
  DROP TYPE "public"."enum_pages_blocks_agent_contact_layout";
  DROP TYPE "public"."enum_pages_blocks_agent_contact_background_color";
  DROP TYPE "public"."enum_pages_blocks_directory_listing_listing_type";
  DROP TYPE "public"."enum_pages_blocks_directory_listing_filter_by_country";
  DROP TYPE "public"."enum_pages_blocks_directory_listing_layout";
  DROP TYPE "public"."enum_pages_blocks_directory_listing_columns";
  DROP TYPE "public"."enum_pages_blocks_homepage_blog_layout";
  DROP TYPE "public"."enum_pages_blocks_video_embed_aspect_ratio";
  DROP TYPE "public"."enum_pages_blocks_video_embed_max_width";
  DROP TYPE "public"."enum_pages_blocks_partners_logos_style";
  DROP TYPE "public"."enum_pages_blocks_featured_agents_display_mode";
  DROP TYPE "public"."enum_pages_blocks_featured_agents_layout";
  DROP TYPE "public"."enum_pages_blocks_page_blog_display_mode";
  DROP TYPE "public"."enum_pages_blocks_page_blog_layout";
  DROP TYPE "public"."enum__pages_v_blocks_home_value_form_style";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_block_layout";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_services_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_agent_gallery_layout";
  DROP TYPE "public"."enum__pages_v_blocks_agent_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_faq_block_layout";
  DROP TYPE "public"."enum__pages_v_blocks_agent_blog_layout";
  DROP TYPE "public"."enum__pages_v_blocks_agent_contact_layout";
  DROP TYPE "public"."enum__pages_v_blocks_agent_contact_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_directory_listing_listing_type";
  DROP TYPE "public"."enum__pages_v_blocks_directory_listing_filter_by_country";
  DROP TYPE "public"."enum__pages_v_blocks_directory_listing_layout";
  DROP TYPE "public"."enum__pages_v_blocks_directory_listing_columns";
  DROP TYPE "public"."enum__pages_v_blocks_homepage_blog_layout";
  DROP TYPE "public"."enum__pages_v_blocks_video_embed_aspect_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_video_embed_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_partners_logos_style";
  DROP TYPE "public"."enum__pages_v_blocks_featured_agents_display_mode";
  DROP TYPE "public"."enum__pages_v_blocks_featured_agents_layout";
  DROP TYPE "public"."enum__pages_v_blocks_page_blog_display_mode";
  DROP TYPE "public"."enum__pages_v_blocks_page_blog_layout";
  DROP TYPE "public"."enum_posts_post_type";
  DROP TYPE "public"."enum__posts_v_version_post_type";
  DROP TYPE "public"."enum_agents_working_hours_day";
  DROP TYPE "public"."enum_agents_status";
  DROP TYPE "public"."enum_states_country";
  DROP TYPE "public"."enum_designations_prefix";
  DROP TYPE "public"."enum_designations_category";
  DROP TYPE "public"."enum_testimonials_source";
  DROP TYPE "public"."enum_plugin_ai_instructions_field_type";
  DROP TYPE "public"."enum_plugin_ai_instructions_model_id";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_text_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_version";
  DROP TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_size";
  DROP TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_style";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_version";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_size";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_quality";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_output_format";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_background";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_moderation";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_voice";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_response_format";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_object_settings_model";
  DROP TYPE "public"."enum_header_nav_items_dropdown_items_link_type";
  DROP TYPE "public"."enum_header_nav_items_type";`)
}
