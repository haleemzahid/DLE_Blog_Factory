import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_services_grid_header_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_header_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_button_style" AS ENUM('red', 'dark', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_about_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_about_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_about_section_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_pages_blocks_about_section_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_solutions_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_solutions_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_solutions_section_button_style" AS ENUM('dark', 'red', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_solutions_section_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_svc_items_service_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_svc_items_service_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_svcSec_header_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_svcSec_header_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_svcSec_button_style" AS ENUM('red', 'dark', 'outline');
  CREATE TYPE "public"."enum_svcSec_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_featTest_photo_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_articles_section_display_mode" AS ENUM('latest', 'category', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_articles_section_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_articles_sidebar_display_mode" AS ENUM('latest', 'category', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_articles_sidebar_columns" AS ENUM('1', '2');
  CREATE TYPE "public"."enum_pages_blocks_mission_vision_layout" AS ENUM('sideBySide', 'stacked', 'cards');
  CREATE TYPE "public"."enum_pages_blocks_mission_vision_mission_icon" AS ENUM('target', 'rocket', 'star', 'flag', 'compass', 'lightning');
  CREATE TYPE "public"."enum_pages_blocks_mission_vision_vision_icon" AS ENUM('eye', 'lightbulb', 'globe', 'mountain', 'sparkle', 'sun');
  CREATE TYPE "public"."enum_pages_blocks_mission_vision_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_mission_vision_cta_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_video_layout_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_video_layout_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_branding_hero_heading_size" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum_pages_blocks_branding_hero_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_branding_hero_cta_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_presentation_embed_aspect_ratio" AS ENUM('16:9', '4:3', '16:10');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_header_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_header_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_button_style" AS ENUM('red', 'dark', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_about_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_about_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_about_section_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_about_section_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_solutions_section_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_solutions_section_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_solutions_section_button_style" AS ENUM('dark', 'red', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_solutions_section_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__svc_items_v_service_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__svc_items_v_service_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__svcSec_v_header_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__svcSec_v_header_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__svcSec_v_button_style" AS ENUM('red', 'dark', 'outline');
  CREATE TYPE "public"."enum__svcSec_v_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__featTest_v_photo_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_articles_section_display_mode" AS ENUM('latest', 'category', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_articles_section_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_articles_sidebar_display_mode" AS ENUM('latest', 'category', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_articles_sidebar_columns" AS ENUM('1', '2');
  CREATE TYPE "public"."enum__pages_v_blocks_mission_vision_layout" AS ENUM('sideBySide', 'stacked', 'cards');
  CREATE TYPE "public"."enum__pages_v_blocks_mission_vision_mission_icon" AS ENUM('target', 'rocket', 'star', 'flag', 'compass', 'lightning');
  CREATE TYPE "public"."enum__pages_v_blocks_mission_vision_vision_icon" AS ENUM('eye', 'lightbulb', 'globe', 'mountain', 'sparkle', 'sun');
  CREATE TYPE "public"."enum__pages_v_blocks_mission_vision_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_mission_vision_cta_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_video_layout_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_video_layout_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_branding_hero_heading_size" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum__pages_v_blocks_branding_hero_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_branding_hero_cta_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_presentation_embed_aspect_ratio" AS ENUM('16:9', '4:3', '16:10');
  CREATE TYPE "public"."enum_posts_display_locations_locations" AS ENUM('homepage', 'blog-listing', 'sidebar');
  CREATE TYPE "public"."enum_posts_section_overrides_section_id" AS ENUM('intro', 'market_stats', 'neighborhoods', 'schools', 'local_facts', 'employers', 'places_of_worship', 'cultural_centers', 'cultural_events', 'diversity_overview', 'community_amenities', 'languages_spoken', 'agent_expertise', 'agent_reviews', 'agent_languages', 'areas_served', 'agent_cta', 'faq');
  CREATE TYPE "public"."enum_posts_section_overrides_override_type" AS ENUM('replace', 'prepend', 'append', 'hide');
  CREATE TYPE "public"."enum_sec_ovr_sec_id" AS ENUM('intro', 'market_stats', 'neighborhoods', 'schools', 'local_facts', 'employers', 'places_of_worship', 'cultural_centers', 'cultural_events', 'diversity_overview', 'community_amenities', 'languages_spoken', 'agent_expertise', 'agent_reviews', 'agent_languages', 'areas_served', 'agent_cta', 'faq');
  CREATE TYPE "public"."enum_sec_ovr_type" AS ENUM('replace', 'prepend', 'append', 'hide');
  CREATE TYPE "public"."enum_posts_related_posts_mode" AS ENUM('auto', 'manual', 'hybrid');
  CREATE TYPE "public"."enum_posts_template_category" AS ENUM('market-report', 'neighborhood-guide', 'home-valuation', 'buyer-guide', 'seller-guide', 'investment-guide');
  CREATE TYPE "public"."enum__posts_v_version_display_locations_locations" AS ENUM('homepage', 'blog-listing', 'sidebar');
  CREATE TYPE "public"."enum__posts_v_version_section_overrides_section_id" AS ENUM('intro', 'market_stats', 'neighborhoods', 'schools', 'local_facts', 'employers', 'places_of_worship', 'cultural_centers', 'cultural_events', 'diversity_overview', 'community_amenities', 'languages_spoken', 'agent_expertise', 'agent_reviews', 'agent_languages', 'areas_served', 'agent_cta', 'faq');
  CREATE TYPE "public"."enum__posts_v_version_section_overrides_override_type" AS ENUM('replace', 'prepend', 'append', 'hide');
  CREATE TYPE "public"."enum__sec_ovr_v_sec_id" AS ENUM('intro', 'market_stats', 'neighborhoods', 'schools', 'local_facts', 'employers', 'places_of_worship', 'cultural_centers', 'cultural_events', 'diversity_overview', 'community_amenities', 'languages_spoken', 'agent_expertise', 'agent_reviews', 'agent_languages', 'areas_served', 'agent_cta', 'faq');
  CREATE TYPE "public"."enum__sec_ovr_v_type" AS ENUM('replace', 'prepend', 'append', 'hide');
  CREATE TYPE "public"."enum__posts_v_version_related_posts_mode" AS ENUM('auto', 'manual', 'hybrid');
  CREATE TYPE "public"."enum__posts_v_version_template_category" AS ENUM('market-report', 'neighborhood-guide', 'home-valuation', 'buyer-guide', 'seller-guide', 'investment-guide');
  CREATE TYPE "public"."enum_agents_meta_json_ld_schema_types" AS ENUM('RealEstateAgent', 'LocalBusiness', 'Person', 'Organization');
  CREATE TYPE "public"."enum_agents_meta_json_ld_area_served_type" AS ENUM('City', 'AdministrativeArea', 'Neighborhood', 'State');
  CREATE TYPE "public"."enum_agents_cultural_expertise_languages_spoken_proficiency" AS ENUM('native', 'fluent', 'conversational', 'basic');
  CREATE TYPE "public"."enum_agents_designation_prefix" AS ENUM('Mr.', 'Ms.', 'Mrs.');
  CREATE TYPE "public"."enum_agents_json_ld_import_import_method" AS ENUM('url', 'raw');
  CREATE TYPE "public"."enum_tenants_type" AS ENUM('main', 'agent');
  CREATE TYPE "public"."enum_tenants_status" AS ENUM('active', 'inactive', 'pending');
  CREATE TYPE "public"."enum_tenant_headers_nav_items_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_tenant_headers_cta_button_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_tenant_headers_cta_button_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_tenant_footers_columns_links_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_tenant_footers_legal_links_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_city_data_top_schools_type" AS ENUM('elementary', 'middle', 'high', 'k12');
  CREATE TYPE "public"."enum_city_data_places_of_worship_religion" AS ENUM('catholic', 'protestant', 'orthodox', 'jewish', 'muslim', 'hindu', 'buddhist', 'sikh', 'lds', 'non-denominational', 'other');
  CREATE TYPE "public"."enum_city_data_cultural_centers_type" AS ENUM('cultural-center', 'community-center', 'ethnic-association', 'senior-center', 'youth-center', 'arts-center');
  CREATE TYPE "public"."enum_city_data_community_amenities_type" AS ENUM('park', 'recreation', 'library', 'museum', 'sports', 'nature', 'golf', 'aquatic');
  CREATE TYPE "public"."enum_city_data_region" AS ENUM('northern', 'central', 'southern');
  CREATE TYPE "public"."enum_city_data_inventory_level" AS ENUM('very-low', 'low', 'balanced', 'high', 'very-high');
  CREATE TYPE "public"."enum_city_data_market_trend" AS ENUM('hot-seller', 'moderate-seller', 'balanced', 'moderate-buyer', 'hot-buyer');
  CREATE TYPE "public"."enum_city_data_data_source" AS ENUM('manual', 'zillow', 'realtor', 'census', 'multiple');
  CREATE TYPE "public"."enum_content_templates_sections_section_type" AS ENUM('static', 'token', 'dynamic');
  CREATE TYPE "public"."enum_content_templates_sections_generator" AS ENUM('market_stats', 'neighborhoods', 'schools', 'agent_cta', 'local_facts', 'employers', 'price_comparison', 'faq', 'places_of_worship', 'cultural_centers', 'cultural_events', 'diversity_overview', 'community_amenities', 'languages_spoken', 'agent_expertise', 'agent_reviews', 'agent_languages', 'areas_served');
  CREATE TYPE "public"."enum_content_templates_required_city_data" AS ENUM('cityName', 'population', 'medianHomePrice', 'medianRent', 'priceChange12Month', 'avgDaysOnMarket', 'salesCount30Days', 'inventoryLevel', 'marketTrend', 'neighborhoods', 'topSchools', 'uniqueFacts', 'keyEmployers', 'nearbyCity', 'region', 'placesOfWorship', 'culturalCenters', 'culturalEvents', 'demographics', 'communityAmenities', 'languagesSpoken');
  CREATE TYPE "public"."enum_content_templates_category" AS ENUM('buyer-guides', 'seller-guides', 'market-reports', 'neighborhood', 'lifestyle', 'legal-finance', 'school-guide', 'investment-guide', 'moving-guide', 'luxury-homes', 'city-comparison');
  CREATE TYPE "public"."enum_content_templates_target_city_tier" AS ENUM('all', 'tier1', 'tier2', 'tier3', 'tier1-2');
  CREATE TYPE "public"."enum_analytics_events_event" AS ENUM('page_view', 'scroll_depth', 'time_on_page', 'link_click', 'form_submission', 'video_play', 'cta_click', 'core_web_vitals', 'page_exit', 'download', 'share', 'lead_magnet_download', 'email_click', 'phone_click', 'demo_scheduled', 'comment_submitted');
  CREATE TYPE "public"."enum_analytics_events_device_type" AS ENUM('desktop', 'mobile', 'tablet');
  CREATE TYPE "public"."enum_keyword_rankings_search_engine" AS ENUM('google', 'bing', 'yahoo');
  CREATE TYPE "public"."enum_keyword_rankings_device" AS ENUM('desktop', 'mobile', 'tablet');
  CREATE TYPE "public"."enum_ab_tests_status" AS ENUM('draft', 'running', 'paused', 'completed');
  CREATE TYPE "public"."enum_ab_tests_target_audience" AS ENUM('all', 'new', 'returning', 'mobile', 'desktop');
  CREATE TYPE "public"."enum_header_nav_items_dropdown_items_sub_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_legal_links_link_type" AS ENUM('reference', 'custom');
  ALTER TYPE "public"."enum_pages_blocks_featured_agents_display_mode" ADD VALUE 'custom';
  ALTER TYPE "public"."enum__pages_v_blocks_featured_agents_display_mode" ADD VALUE 'custom';
  CREATE TABLE "agent_gal_imgs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_agents_custom_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"photo_id" integer,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_about_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_color" varchar DEFAULT '#dc2626',
  	"heading" varchar DEFAULT 'About Us',
  	"content" jsonb,
  	"enable_button" boolean DEFAULT true,
  	"link_type" "enum_pages_blocks_about_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_about_section_link_appearance" DEFAULT 'default',
  	"link_hover_color" varchar,
  	"media_type" "enum_pages_blocks_about_section_media_type" DEFAULT 'image',
  	"image_id" integer,
  	"video_url" varchar,
  	"video_title" varchar DEFAULT 'Video',
  	"image_position" "enum_pages_blocks_about_section_image_position" DEFAULT 'right',
  	"background_color" varchar DEFAULT '#f3f4f6',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_solutions_section_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_solutions_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar DEFAULT 'Overcoming Realtor Challenges With DLE''s AI + LLM Solutions',
  	"enable_button" boolean DEFAULT true,
  	"link_type" "enum_pages_blocks_solutions_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_solutions_section_link_appearance" DEFAULT 'default',
  	"link_hover_color" varchar,
  	"button_style" "enum_pages_blocks_solutions_section_button_style" DEFAULT 'dark',
  	"image_position" "enum_pages_blocks_solutions_section_image_position" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "svc_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"title_color" varchar DEFAULT '#dc2626',
  	"description" varchar,
  	"enable_link" boolean DEFAULT false,
  	"service_link_type" "enum_svc_items_service_link_type" DEFAULT 'reference',
  	"service_link_new_tab" boolean,
  	"service_link_url" varchar,
  	"service_link_label" varchar,
  	"service_link_appearance" "enum_svc_items_service_link_appearance" DEFAULT 'default',
  	"service_link_hover_color" varchar
  );
  
  CREATE TABLE "svcSec" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Our Services',
  	"eyebrow_color" varchar DEFAULT '#dc2626',
  	"title" varchar DEFAULT 'Our Real Estate SEO Services',
  	"subtitle" varchar,
  	"enable_button" boolean DEFAULT true,
  	"header_link_type" "enum_svcSec_header_link_type" DEFAULT 'reference',
  	"header_link_new_tab" boolean,
  	"header_link_url" varchar,
  	"header_link_label" varchar,
  	"header_link_appearance" "enum_svcSec_header_link_appearance" DEFAULT 'default',
  	"header_link_hover_color" varchar,
  	"button_style" "enum_svcSec_button_style" DEFAULT 'red',
  	"columns" "enum_svcSec_columns" DEFAULT '3',
  	"card_border_radius" numeric DEFAULT 16,
  	"background_color" varchar DEFAULT '#ffffff',
  	"block_name" varchar
  );
  
  CREATE TABLE "feat_test_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"quote" varchar,
  	"client_name" varchar,
  	"client_title" varchar
  );
  
  CREATE TABLE "featTest" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'We Love Them',
  	"eyebrow_color" varchar DEFAULT '#dc2626',
  	"title" varchar DEFAULT 'What Our Clients Have To Say',
  	"name_color" varchar DEFAULT '#dc2626',
  	"photo_position" "enum_featTest_photo_position" DEFAULT 'left',
  	"background_color" varchar DEFAULT '#ffffff',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_articles_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Articles',
  	"display_mode" "enum_pages_blocks_articles_section_display_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 4,
  	"columns" "enum_pages_blocks_articles_section_columns" DEFAULT '2',
  	"show_author" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"show_read_more" boolean DEFAULT true,
  	"enable_pagination" boolean DEFAULT false,
  	"posts_per_page" numeric DEFAULT 4,
  	"title_color" varchar DEFAULT '#1a1a1a',
  	"read_more_color" varchar DEFAULT '#dc2626',
  	"background_color" varchar DEFAULT '#ffffff',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_articles_sidebar_featured_on_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"name" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_articles_sidebar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_about" boolean DEFAULT true,
  	"about_title" varchar DEFAULT 'About',
  	"about_content" jsonb,
  	"title" varchar DEFAULT 'Articles',
  	"display_mode" "enum_pages_blocks_articles_sidebar_display_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 6,
  	"columns" "enum_pages_blocks_articles_sidebar_columns" DEFAULT '2',
  	"show_author" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"show_read_more" boolean DEFAULT true,
  	"enable_pagination" boolean DEFAULT true,
  	"posts_per_page" numeric DEFAULT 6,
  	"show_sidebar" boolean DEFAULT true,
  	"sidebar_agent_id" integer,
  	"show_contact_info" boolean DEFAULT true,
  	"show_social_links" boolean DEFAULT true,
  	"show_featured_on" boolean DEFAULT true,
  	"title_color" varchar DEFAULT '#1a1a1a',
  	"title_bg_color" varchar DEFAULT '#fde047',
  	"accent_color" varchar DEFAULT '#dc2626',
  	"background_color" varchar DEFAULT '#ffffff',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_mission_vision" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_mission_vision_layout" DEFAULT 'sideBySide',
  	"background_color" varchar DEFAULT '#f5f5f5',
  	"mission_icon" "enum_pages_blocks_mission_vision_mission_icon" DEFAULT 'target',
  	"mission_icon_color" varchar DEFAULT '#B40000',
  	"mission_title" varchar DEFAULT 'Mission Statement',
  	"mission_title_color" varchar DEFAULT '#000000',
  	"mission_content" jsonb,
  	"vision_icon" "enum_pages_blocks_mission_vision_vision_icon" DEFAULT 'eye',
  	"vision_icon_color" varchar DEFAULT '#B40000',
  	"vision_title" varchar DEFAULT 'Vision Statement',
  	"vision_title_color" varchar DEFAULT '#000000',
  	"vision_content" jsonb,
  	"enable_cta" boolean DEFAULT false,
  	"cta_link_type" "enum_pages_blocks_mission_vision_cta_link_type" DEFAULT 'reference',
  	"cta_link_new_tab" boolean,
  	"cta_link_url" varchar,
  	"cta_link_label" varchar,
  	"cta_link_appearance" "enum_pages_blocks_mission_vision_cta_link_appearance" DEFAULT 'default',
  	"cta_link_hover_color" varchar,
  	"cta_button_color" varchar DEFAULT '#dc2626',
  	"cta_text_color" varchar DEFAULT '#ffffff',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_designation_directory_mr_designations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_designation_directory_ms_designations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_designation_directory" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Designation Directory',
  	"subtitle" varchar DEFAULT 'Agent Designations™',
  	"header_background_color" varchar DEFAULT '#2B7CB3',
  	"video_url" varchar,
  	"show_video" boolean DEFAULT true,
  	"state_id" integer,
  	"show_map_background" boolean DEFAULT true,
  	"map_background_image_id" integer,
  	"show_c_t_a" boolean DEFAULT true,
  	"cta_title" varchar DEFAULT 'Claim Your Designation',
  	"cta_description" varchar DEFAULT 'Become the exclusive Designated Local Expert for your city. Get trademark-protected branding and SEO dominance.',
  	"cta_button_text" varchar DEFAULT 'Apply for DLE Membership',
  	"cta_button_link" varchar DEFAULT '/apply',
  	"cta_secondary_text" varchar DEFAULT 'Inquire About Availability',
  	"cta_secondary_link" varchar DEFAULT '/member-relations',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_california_mr_designations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_california_ms_designations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_california" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'California',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_layout_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_video_layout_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_video_layout_links_link_appearance" DEFAULT 'default',
  	"link_hover_color" varchar
  );
  
  CREATE TABLE "pages_blocks_video_layout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_branding_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_color" varchar DEFAULT '#1E699B',
  	"video_url" varchar,
  	"video_title" varchar DEFAULT 'Video',
  	"heading" varchar DEFAULT 'The Most Powerful Personal Branding in the Real Estate Industry',
  	"heading_color" varchar DEFAULT '#ffffff',
  	"heading_size" "enum_pages_blocks_branding_hero_heading_size" DEFAULT 'large',
  	"content" jsonb,
  	"enable_cta" boolean DEFAULT false,
  	"cta_link_type" "enum_pages_blocks_branding_hero_cta_link_type" DEFAULT 'reference',
  	"cta_link_new_tab" boolean,
  	"cta_link_url" varchar,
  	"cta_link_label" varchar,
  	"cta_link_appearance" "enum_pages_blocks_branding_hero_cta_link_appearance" DEFAULT 'default',
  	"cta_link_hover_color" varchar,
  	"cta_button_color" varchar DEFAULT '#ffffff',
  	"cta_text_color" varchar DEFAULT '#000000',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_presentation_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_color" varchar DEFAULT '#1E699B',
  	"heading" varchar,
  	"heading_color" varchar DEFAULT '#ffffff',
  	"presentation_url" varchar,
  	"presentation_title" varchar,
  	"aspect_ratio" "enum_pages_blocks_presentation_embed_aspect_ratio" DEFAULT '16:9',
  	"download_link" varchar,
  	"download_button_text" varchar DEFAULT 'Download BA PowerPoint Introduction to DLE',
  	"download_button_color" varchar DEFAULT '#dc2626',
  	"download_button_text_color" varchar DEFAULT '#ffffff',
  	"block_name" varchar
  );
  
  CREATE TABLE "_agent_gal_imgs_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_agents_custom_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"photo_id" integer,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_color" varchar DEFAULT '#dc2626',
  	"heading" varchar DEFAULT 'About Us',
  	"content" jsonb,
  	"enable_button" boolean DEFAULT true,
  	"link_type" "enum__pages_v_blocks_about_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_about_section_link_appearance" DEFAULT 'default',
  	"link_hover_color" varchar,
  	"media_type" "enum__pages_v_blocks_about_section_media_type" DEFAULT 'image',
  	"image_id" integer,
  	"video_url" varchar,
  	"video_title" varchar DEFAULT 'Video',
  	"image_position" "enum__pages_v_blocks_about_section_image_position" DEFAULT 'right',
  	"background_color" varchar DEFAULT '#f3f4f6',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_solutions_section_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_solutions_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar DEFAULT 'Overcoming Realtor Challenges With DLE''s AI + LLM Solutions',
  	"enable_button" boolean DEFAULT true,
  	"link_type" "enum__pages_v_blocks_solutions_section_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_solutions_section_link_appearance" DEFAULT 'default',
  	"link_hover_color" varchar,
  	"button_style" "enum__pages_v_blocks_solutions_section_button_style" DEFAULT 'dark',
  	"image_position" "enum__pages_v_blocks_solutions_section_image_position" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_svc_items_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"title_color" varchar DEFAULT '#dc2626',
  	"description" varchar,
  	"enable_link" boolean DEFAULT false,
  	"service_link_type" "enum__svc_items_v_service_link_type" DEFAULT 'reference',
  	"service_link_new_tab" boolean,
  	"service_link_url" varchar,
  	"service_link_label" varchar,
  	"service_link_appearance" "enum__svc_items_v_service_link_appearance" DEFAULT 'default',
  	"service_link_hover_color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_svcSec_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Our Services',
  	"eyebrow_color" varchar DEFAULT '#dc2626',
  	"title" varchar DEFAULT 'Our Real Estate SEO Services',
  	"subtitle" varchar,
  	"enable_button" boolean DEFAULT true,
  	"header_link_type" "enum__svcSec_v_header_link_type" DEFAULT 'reference',
  	"header_link_new_tab" boolean,
  	"header_link_url" varchar,
  	"header_link_label" varchar,
  	"header_link_appearance" "enum__svcSec_v_header_link_appearance" DEFAULT 'default',
  	"header_link_hover_color" varchar,
  	"button_style" "enum__svcSec_v_button_style" DEFAULT 'red',
  	"columns" "enum__svcSec_v_columns" DEFAULT '3',
  	"card_border_radius" numeric DEFAULT 16,
  	"background_color" varchar DEFAULT '#ffffff',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_feat_test_items_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"quote" varchar,
  	"client_name" varchar,
  	"client_title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_featTest_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'We Love Them',
  	"eyebrow_color" varchar DEFAULT '#dc2626',
  	"title" varchar DEFAULT 'What Our Clients Have To Say',
  	"name_color" varchar DEFAULT '#dc2626',
  	"photo_position" "enum__featTest_v_photo_position" DEFAULT 'left',
  	"background_color" varchar DEFAULT '#ffffff',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_articles_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Articles',
  	"display_mode" "enum__pages_v_blocks_articles_section_display_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 4,
  	"columns" "enum__pages_v_blocks_articles_section_columns" DEFAULT '2',
  	"show_author" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"show_read_more" boolean DEFAULT true,
  	"enable_pagination" boolean DEFAULT false,
  	"posts_per_page" numeric DEFAULT 4,
  	"title_color" varchar DEFAULT '#1a1a1a',
  	"read_more_color" varchar DEFAULT '#dc2626',
  	"background_color" varchar DEFAULT '#ffffff',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_articles_sidebar_featured_on_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"name" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_articles_sidebar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_about" boolean DEFAULT true,
  	"about_title" varchar DEFAULT 'About',
  	"about_content" jsonb,
  	"title" varchar DEFAULT 'Articles',
  	"display_mode" "enum__pages_v_blocks_articles_sidebar_display_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 6,
  	"columns" "enum__pages_v_blocks_articles_sidebar_columns" DEFAULT '2',
  	"show_author" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"show_read_more" boolean DEFAULT true,
  	"enable_pagination" boolean DEFAULT true,
  	"posts_per_page" numeric DEFAULT 6,
  	"show_sidebar" boolean DEFAULT true,
  	"sidebar_agent_id" integer,
  	"show_contact_info" boolean DEFAULT true,
  	"show_social_links" boolean DEFAULT true,
  	"show_featured_on" boolean DEFAULT true,
  	"title_color" varchar DEFAULT '#1a1a1a',
  	"title_bg_color" varchar DEFAULT '#fde047',
  	"accent_color" varchar DEFAULT '#dc2626',
  	"background_color" varchar DEFAULT '#ffffff',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mission_vision" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__pages_v_blocks_mission_vision_layout" DEFAULT 'sideBySide',
  	"background_color" varchar DEFAULT '#f5f5f5',
  	"mission_icon" "enum__pages_v_blocks_mission_vision_mission_icon" DEFAULT 'target',
  	"mission_icon_color" varchar DEFAULT '#B40000',
  	"mission_title" varchar DEFAULT 'Mission Statement',
  	"mission_title_color" varchar DEFAULT '#000000',
  	"mission_content" jsonb,
  	"vision_icon" "enum__pages_v_blocks_mission_vision_vision_icon" DEFAULT 'eye',
  	"vision_icon_color" varchar DEFAULT '#B40000',
  	"vision_title" varchar DEFAULT 'Vision Statement',
  	"vision_title_color" varchar DEFAULT '#000000',
  	"vision_content" jsonb,
  	"enable_cta" boolean DEFAULT false,
  	"cta_link_type" "enum__pages_v_blocks_mission_vision_cta_link_type" DEFAULT 'reference',
  	"cta_link_new_tab" boolean,
  	"cta_link_url" varchar,
  	"cta_link_label" varchar,
  	"cta_link_appearance" "enum__pages_v_blocks_mission_vision_cta_link_appearance" DEFAULT 'default',
  	"cta_link_hover_color" varchar,
  	"cta_button_color" varchar DEFAULT '#dc2626',
  	"cta_text_color" varchar DEFAULT '#ffffff',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_designation_directory_mr_designations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_designation_directory_ms_designations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_designation_directory" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Designation Directory',
  	"subtitle" varchar DEFAULT 'Agent Designations™',
  	"header_background_color" varchar DEFAULT '#2B7CB3',
  	"video_url" varchar,
  	"show_video" boolean DEFAULT true,
  	"state_id" integer,
  	"show_map_background" boolean DEFAULT true,
  	"map_background_image_id" integer,
  	"show_c_t_a" boolean DEFAULT true,
  	"cta_title" varchar DEFAULT 'Claim Your Designation',
  	"cta_description" varchar DEFAULT 'Become the exclusive Designated Local Expert for your city. Get trademark-protected branding and SEO dominance.',
  	"cta_button_text" varchar DEFAULT 'Apply for DLE Membership',
  	"cta_button_link" varchar DEFAULT '/apply',
  	"cta_secondary_text" varchar DEFAULT 'Inquire About Availability',
  	"cta_secondary_link" varchar DEFAULT '/member-relations',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_california_mr_designations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_california_ms_designations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_california" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'California',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_layout_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_video_layout_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_video_layout_links_link_appearance" DEFAULT 'default',
  	"link_hover_color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_layout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_branding_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_color" varchar DEFAULT '#1E699B',
  	"video_url" varchar,
  	"video_title" varchar DEFAULT 'Video',
  	"heading" varchar DEFAULT 'The Most Powerful Personal Branding in the Real Estate Industry',
  	"heading_color" varchar DEFAULT '#ffffff',
  	"heading_size" "enum__pages_v_blocks_branding_hero_heading_size" DEFAULT 'large',
  	"content" jsonb,
  	"enable_cta" boolean DEFAULT false,
  	"cta_link_type" "enum__pages_v_blocks_branding_hero_cta_link_type" DEFAULT 'reference',
  	"cta_link_new_tab" boolean,
  	"cta_link_url" varchar,
  	"cta_link_label" varchar,
  	"cta_link_appearance" "enum__pages_v_blocks_branding_hero_cta_link_appearance" DEFAULT 'default',
  	"cta_link_hover_color" varchar,
  	"cta_button_color" varchar DEFAULT '#ffffff',
  	"cta_text_color" varchar DEFAULT '#000000',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_presentation_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_color" varchar DEFAULT '#1E699B',
  	"heading" varchar,
  	"heading_color" varchar DEFAULT '#ffffff',
  	"presentation_url" varchar,
  	"presentation_title" varchar,
  	"aspect_ratio" "enum__pages_v_blocks_presentation_embed_aspect_ratio" DEFAULT '16:9',
  	"download_link" varchar,
  	"download_button_text" varchar DEFAULT 'Download BA PowerPoint Introduction to DLE',
  	"download_button_color" varchar DEFAULT '#dc2626',
  	"download_button_text_color" varchar DEFAULT '#ffffff',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_tenant_seo_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title_override" varchar,
  	"description_override" varchar,
  	"intro_override" jsonb,
  	"custom_slug" varchar
  );
  
  CREATE TABLE "posts_display_locations_locations" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_posts_display_locations_locations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts_display_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer
  );
  
  CREATE TABLE "posts_section_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_id" "enum_posts_section_overrides_section_id",
  	"override_type" "enum_posts_section_overrides_override_type" DEFAULT 'replace',
  	"custom_content" jsonb
  );
  
  CREATE TABLE "sec_ovr" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"sec_id" "enum_sec_ovr_sec_id",
  	"type" "enum_sec_ovr_type" DEFAULT 'replace',
  	"content" varchar
  );
  
  CREATE TABLE "tokens" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "tenant_ovr" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"agent_id" integer,
  	"city_data_id" integer
  );
  
  CREATE TABLE "_posts_v_version_tenant_seo_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title_override" varchar,
  	"description_override" varchar,
  	"intro_override" jsonb,
  	"custom_slug" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_display_locations_locations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__posts_v_version_display_locations_locations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_posts_v_version_display_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_section_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_id" "enum__posts_v_version_section_overrides_section_id",
  	"override_type" "enum__posts_v_version_section_overrides_override_type" DEFAULT 'replace',
  	"custom_content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_sec_ovr_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"sec_id" "enum__sec_ovr_v_sec_id",
  	"type" "enum__sec_ovr_v_type" DEFAULT 'replace',
  	"content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tokens_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tenant_ovr_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"agent_id" integer,
  	"city_data_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "agents_meta_keywords_primary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "agents_meta_keywords_secondary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar
  );
  
  CREATE TABLE "agents_meta_keywords_geographic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar
  );
  
  CREATE TABLE "agents_meta_keywords_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar
  );
  
  CREATE TABLE "agents_meta_json_ld_schema_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_agents_meta_json_ld_schema_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "agents_meta_json_ld_area_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_agents_meta_json_ld_area_served_type" DEFAULT 'City'
  );
  
  CREATE TABLE "agents_meta_json_ld_knows_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar
  );
  
  CREATE TABLE "agents_meta_json_ld_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "agents_cultural_expertise_languages_spoken" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" varchar NOT NULL,
  	"proficiency" "enum_agents_cultural_expertise_languages_spoken_proficiency" DEFAULT 'fluent'
  );
  
  CREATE TABLE "agents_cultural_expertise_cultural_specializations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"community" varchar
  );
  
  CREATE TABLE "agents_cultural_expertise_community_involvement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"organization" varchar,
  	"role" varchar
  );
  
  CREATE TABLE "states_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city_name" varchar NOT NULL,
  	"city_slug" varchar NOT NULL,
  	"population" numeric,
  	"mr_agent_id" integer,
  	"ms_agent_id" integer,
  	"is_available" boolean DEFAULT true
  );
  
  CREATE TABLE "tenants_domains" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"domain" varchar NOT NULL,
  	"is_primary" boolean DEFAULT false,
  	"is_verified" boolean DEFAULT false
  );
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_tenants_type" DEFAULT 'agent' NOT NULL,
  	"status" "enum_tenants_status" DEFAULT 'pending' NOT NULL,
  	"linked_agent_id" integer,
  	"branding_logo_id" integer,
  	"branding_favicon_id" integer,
  	"branding_primary_color" varchar,
  	"branding_secondary_color" varchar,
  	"branding_accent_color" varchar,
  	"seo_defaults_site_name" varchar,
  	"seo_defaults_default_description" varchar,
  	"seo_defaults_default_image_id" integer,
  	"analytics_google_analytics_id" varchar,
  	"analytics_google_tag_manager_id" varchar,
  	"analytics_facebook_pixel_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tenant_headers_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_tenant_headers_nav_items_link_type" DEFAULT 'internal',
  	"custom_url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "tenant_headers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"agent_id" integer,
  	"logo_id" integer,
  	"cta_button_show" boolean DEFAULT true,
  	"cta_button_text" varchar DEFAULT 'Contact Agent',
  	"cta_button_link_type" "enum_tenant_headers_cta_button_link_type" DEFAULT 'custom',
  	"cta_button_custom_url" varchar,
  	"cta_button_style" "enum_tenant_headers_cta_button_style" DEFAULT 'primary',
  	"show_search" boolean DEFAULT true,
  	"sticky" boolean DEFAULT true,
  	"transparent" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tenant_headers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "tenant_footers_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_tenant_footers_columns_links_link_type" DEFAULT 'internal',
  	"custom_url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "tenant_footers_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "tenant_footers_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_tenant_footers_legal_links_link_type" DEFAULT 'internal',
  	"custom_url" varchar
  );
  
  CREATE TABLE "tenant_footers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"agent_id" integer,
  	"social_links_facebook" varchar,
  	"social_links_instagram" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_youtube" varchar,
  	"social_links_twitter" varchar,
  	"social_links_tiktok" varchar,
  	"social_links_pinterest" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_email" varchar,
  	"contact_info_address" varchar,
  	"copyright_text" varchar,
  	"show_dle_badge" boolean DEFAULT true,
  	"additional_text" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tenant_footers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "city_data_neighborhoods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"avg_price" numeric,
  	"description" varchar
  );
  
  CREATE TABLE "city_data_top_schools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"rating" numeric,
  	"type" "enum_city_data_top_schools_type"
  );
  
  CREATE TABLE "city_data_unique_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fact" varchar NOT NULL
  );
  
  CREATE TABLE "city_data_key_employers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"industry" varchar
  );
  
  CREATE TABLE "city_data_places_of_worship" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"religion" "enum_city_data_places_of_worship_religion",
  	"address" varchar,
  	"website" varchar
  );
  
  CREATE TABLE "city_data_cultural_centers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_city_data_cultural_centers_type",
  	"description" varchar
  );
  
  CREATE TABLE "city_data_ethnic_cuisine" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cuisine_type" varchar NOT NULL,
  	"popular_spots" varchar
  );
  
  CREATE TABLE "city_data_cultural_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"timing" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "city_data_languages_spoken" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" varchar NOT NULL,
  	"percentage_of_population" numeric
  );
  
  CREATE TABLE "city_data_demographics_ethnic_breakdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ethnicity" varchar NOT NULL,
  	"percentage" numeric
  );
  
  CREATE TABLE "city_data_community_amenities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_city_data_community_amenities_type",
  	"description" varchar
  );
  
  CREATE TABLE "city_data" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"city_name" varchar NOT NULL,
  	"state_id" integer NOT NULL,
  	"region" "enum_city_data_region",
  	"population" numeric,
  	"median_home_price" numeric,
  	"median_rent" numeric,
  	"price_change12_month" numeric,
  	"sales_count30_days" numeric,
  	"avg_days_on_market" numeric,
  	"inventory_level" "enum_city_data_inventory_level",
  	"market_trend" "enum_city_data_market_trend",
  	"nearby_city" varchar,
  	"demographics_diversity_index" numeric,
  	"demographics_median_age" numeric,
  	"demographics_family_households" numeric,
  	"last_updated" timestamp(3) with time zone,
  	"data_source" "enum_city_data_data_source",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "content_templates_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_id" varchar NOT NULL,
  	"section_name" varchar NOT NULL,
  	"section_type" "enum_content_templates_sections_section_type" DEFAULT 'token' NOT NULL,
  	"default_content" jsonb,
  	"token_template" jsonb,
  	"generator" "enum_content_templates_sections_generator",
  	"condition" varchar,
  	"allow_post_override" boolean DEFAULT true,
  	"allow_tenant_override" boolean DEFAULT true
  );
  
  CREATE TABLE "content_templates_required_city_data" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_content_templates_required_city_data",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "content_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"category" "enum_content_templates_category" NOT NULL,
  	"seo_templates_title_template" varchar,
  	"seo_templates_description_template" varchar,
  	"base_post_id" integer,
  	"customization_instructions" varchar,
  	"ai_prompt" varchar,
  	"content_uniqueness_target" numeric DEFAULT 30,
  	"priority" numeric DEFAULT 50,
  	"is_active" boolean DEFAULT true,
  	"target_city_tier" "enum_content_templates_target_city_tier" DEFAULT 'all',
  	"estimated_read_time" numeric,
  	"usage_count" numeric DEFAULT 0,
  	"generated_count" numeric DEFAULT 0,
  	"last_generated" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "analytics_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event" "enum_analytics_events_event" NOT NULL,
  	"session_id" varchar NOT NULL,
  	"post_id_id" integer,
  	"page_id_id" integer,
  	"agent_id_id" integer,
  	"tenant_id_id" integer,
  	"event_data" jsonb,
  	"ip_address" varchar,
  	"country" varchar,
  	"region" varchar,
  	"city" varchar,
  	"timezone" varchar,
  	"device_type" "enum_analytics_events_device_type",
  	"browser" varchar,
  	"os" varchar,
  	"screen_size" varchar,
  	"user_agent" varchar,
  	"referrer" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"client_timestamp" timestamp(3) with time zone,
  	"server_timestamp" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "post_analytics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"post_id" integer NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"pageviews" numeric DEFAULT 0,
  	"unique_visitors" numeric DEFAULT 0,
  	"sessions" numeric DEFAULT 0,
  	"new_visitors" numeric DEFAULT 0,
  	"returning_visitors" numeric DEFAULT 0,
  	"avg_time_on_page" numeric,
  	"avg_scroll_depth" numeric,
  	"bounce_rate" numeric,
  	"exit_rate" numeric,
  	"pages_per_session" numeric,
  	"organic_traffic" numeric DEFAULT 0,
  	"direct_traffic" numeric DEFAULT 0,
  	"referral_traffic" numeric DEFAULT 0,
  	"social_traffic" numeric DEFAULT 0,
  	"email_traffic" numeric DEFAULT 0,
  	"paid_traffic" numeric DEFAULT 0,
  	"impressions" numeric DEFAULT 0,
  	"clicks" numeric DEFAULT 0,
  	"ctr" numeric,
  	"avg_position" numeric,
  	"form_submissions" numeric DEFAULT 0,
  	"downloads" numeric DEFAULT 0,
  	"video_plays" numeric DEFAULT 0,
  	"link_clicks" numeric DEFAULT 0,
  	"cta_clicks" numeric DEFAULT 0,
  	"leads_generated" numeric DEFAULT 0,
  	"qualified_leads" numeric DEFAULT 0,
  	"agents_signed" numeric DEFAULT 0,
  	"revenue_attributed" numeric,
  	"shares" numeric DEFAULT 0,
  	"likes" numeric DEFAULT 0,
  	"comments" numeric DEFAULT 0,
  	"avg_page_load_time" numeric,
  	"avg_lcp" numeric,
  	"avg_fid" numeric,
  	"avg_cls" numeric,
  	"errors" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "agent_analytics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"agent_id" integer NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"total_pageviews" numeric DEFAULT 0,
  	"unique_visitors" numeric DEFAULT 0,
  	"sessions" numeric DEFAULT 0,
  	"avg_session_duration" numeric,
  	"bounce_rate" numeric,
  	"organic_traffic" numeric DEFAULT 0,
  	"direct_traffic" numeric DEFAULT 0,
  	"referral_traffic" numeric DEFAULT 0,
  	"social_traffic" numeric DEFAULT 0,
  	"leads_generated" numeric DEFAULT 0,
  	"form_submissions" numeric DEFAULT 0,
  	"phone_calls" numeric DEFAULT 0,
  	"email_clicks" numeric DEFAULT 0,
  	"top_post_id" integer,
  	"top_post_views" numeric DEFAULT 0,
  	"total_impressions" numeric DEFAULT 0,
  	"total_clicks" numeric DEFAULT 0,
  	"avg_ctr" numeric,
  	"avg_position" numeric,
  	"keywords_ranking" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "network_analytics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"total_pageviews" numeric DEFAULT 0,
  	"total_unique_visitors" numeric DEFAULT 0,
  	"total_sessions" numeric DEFAULT 0,
  	"total_posts" numeric DEFAULT 0,
  	"posts_published_today" numeric DEFAULT 0,
  	"avg_pageviews_per_post" numeric,
  	"total_agents" numeric DEFAULT 0,
  	"active_agents" numeric DEFAULT 0,
  	"total_leads" numeric DEFAULT 0,
  	"total_agents_signed" numeric DEFAULT 0,
  	"total_revenue" numeric,
  	"conversion_rate" numeric,
  	"total_keywords_ranking" numeric DEFAULT 0,
  	"keywords_top10" numeric DEFAULT 0,
  	"keywords_top3" numeric DEFAULT 0,
  	"featured_snippets" numeric DEFAULT 0,
  	"total_backlinks" numeric DEFAULT 0,
  	"domain_authority" numeric,
  	"youtube_subscribers" numeric DEFAULT 0,
  	"youtube_views" numeric DEFAULT 0,
  	"linkedin_followers" numeric DEFAULT 0,
  	"twitter_followers" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "conversion_funnels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar NOT NULL,
  	"step1_visitor" timestamp(3) with time zone,
  	"step2_engaged" timestamp(3) with time zone,
  	"step3_lead" timestamp(3) with time zone,
  	"step4_qualified" timestamp(3) with time zone,
  	"step5_demo" timestamp(3) with time zone,
  	"step6_signed" timestamp(3) with time zone,
  	"first_post_id" integer,
  	"last_post_id" integer,
  	"total_posts_viewed" numeric DEFAULT 0,
  	"total_sessions" numeric DEFAULT 0,
  	"time_to_convert" numeric,
  	"touchpoints" jsonb,
  	"tenant_id" integer,
  	"agent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "keyword_rankings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"post_id" integer,
  	"keyword" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"position" numeric NOT NULL,
  	"impressions" numeric DEFAULT 0,
  	"clicks" numeric DEFAULT 0,
  	"ctr" numeric,
  	"search_engine" "enum_keyword_rankings_search_engine" DEFAULT 'google',
  	"country" varchar DEFAULT 'US',
  	"device" "enum_keyword_rankings_device" DEFAULT 'desktop',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ab_tests_test_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"config" jsonb,
  	"weight" numeric DEFAULT 50
  );
  
  CREATE TABLE "ab_tests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"status" "enum_ab_tests_status" DEFAULT 'draft' NOT NULL,
  	"control_variant_name" varchar DEFAULT 'Control',
  	"control_variant_config" jsonb,
  	"winning_variant" varchar,
  	"confidence_level" numeric,
  	"sample_size" numeric,
  	"results" jsonb,
  	"target_audience" "enum_ab_tests_target_audience" DEFAULT 'all',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ab_tests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"pages_id" integer
  );
  
  CREATE TABLE "header_nav_items_dropdown_items_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_header_nav_items_dropdown_items_sub_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_footer_legal_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  ALTER TABLE "pages_blocks_agent_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_agent_gallery_images" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_agent_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_agent_gallery_images" CASCADE;
  ALTER TABLE "agents" ALTER COLUMN "profile_photo_id" DROP NOT NULL;
  ALTER TABLE "pages_hero_links" ADD COLUMN "link_hover_color" varchar;
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN "link_hover_color" varchar;
  ALTER TABLE "pages_blocks_content_columns" ADD COLUMN "link_hover_color" varchar;
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "enable_button" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "header_link_type" "enum_pages_blocks_services_grid_header_link_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "header_link_new_tab" boolean;
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "header_link_url" varchar;
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "header_link_label" varchar;
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "header_link_appearance" "enum_pages_blocks_services_grid_header_link_appearance" DEFAULT 'default';
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "header_link_hover_color" varchar;
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "button_style" "enum_pages_blocks_services_grid_button_style" DEFAULT 'red';
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "card_border_radius" numeric DEFAULT 8;
  ALTER TABLE "pages_blocks_agent_blog" ADD COLUMN "enable_pagination" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_agent_blog" ADD COLUMN "posts_per_page" numeric DEFAULT 6;
  ALTER TABLE "pages_blocks_homepage_blog" ADD COLUMN "enable_pagination" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_homepage_blog" ADD COLUMN "posts_per_page" numeric DEFAULT 6;
  ALTER TABLE "pages_blocks_featured_agents" ADD COLUMN "background_color" varchar DEFAULT '#f9fafb';
  ALTER TABLE "pages_blocks_featured_agents" ADD COLUMN "eyebrow_color" varchar DEFAULT '#dc2626';
  ALTER TABLE "pages" ADD COLUMN "hero_heading_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "pages" ADD COLUMN "hero_subtitle_color" varchar DEFAULT '#e8b44a';
  ALTER TABLE "pages" ADD COLUMN "hero_paragraph_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "pages" ADD COLUMN "hero_logo_id" integer;
  ALTER TABLE "_pages_v_version_hero_links" ADD COLUMN "link_hover_color" varchar;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN "link_hover_color" varchar;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN "link_hover_color" varchar;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "enable_button" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "header_link_type" "enum__pages_v_blocks_services_grid_header_link_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "header_link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "header_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "header_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "header_link_appearance" "enum__pages_v_blocks_services_grid_header_link_appearance" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "header_link_hover_color" varchar;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "button_style" "enum__pages_v_blocks_services_grid_button_style" DEFAULT 'red';
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "card_border_radius" numeric DEFAULT 8;
  ALTER TABLE "_pages_v_blocks_agent_blog" ADD COLUMN "enable_pagination" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_agent_blog" ADD COLUMN "posts_per_page" numeric DEFAULT 6;
  ALTER TABLE "_pages_v_blocks_homepage_blog" ADD COLUMN "enable_pagination" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_homepage_blog" ADD COLUMN "posts_per_page" numeric DEFAULT 6;
  ALTER TABLE "_pages_v_blocks_featured_agents" ADD COLUMN "background_color" varchar DEFAULT '#f9fafb';
  ALTER TABLE "_pages_v_blocks_featured_agents" ADD COLUMN "eyebrow_color" varchar DEFAULT '#dc2626';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_heading_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_subtitle_color" varchar DEFAULT '#e8b44a';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_paragraph_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_logo_id" integer;
  ALTER TABLE "posts" ADD COLUMN "show_on_all_agents" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "primary_tenant_id" integer;
  ALTER TABLE "posts" ADD COLUMN "related_posts_mode" "enum_posts_related_posts_mode" DEFAULT 'hybrid';
  ALTER TABLE "posts" ADD COLUMN "is_template" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "city_data_tokens_use_city_name" boolean DEFAULT true;
  ALTER TABLE "posts" ADD COLUMN "city_data_tokens_use_median_price" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "city_data_tokens_use_price_change" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "city_data_tokens_use_schools" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "city_data_tokens_use_neighborhoods" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "city_data_tokens_use_unique_facts" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "city_data_tokens_use_market_stats" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "template_category" "enum_posts_template_category";
  ALTER TABLE "posts" ADD COLUMN "use_template" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "content_template_id" integer;
  ALTER TABLE "posts" ADD COLUMN "template_topic" varchar;
  ALTER TABLE "posts" ADD COLUMN "target_city_data_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_show_on_all_agents" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_primary_tenant_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_related_posts_mode" "enum__posts_v_version_related_posts_mode" DEFAULT 'hybrid';
  ALTER TABLE "_posts_v" ADD COLUMN "version_is_template" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_city_data_tokens_use_city_name" boolean DEFAULT true;
  ALTER TABLE "_posts_v" ADD COLUMN "version_city_data_tokens_use_median_price" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_city_data_tokens_use_price_change" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_city_data_tokens_use_schools" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_city_data_tokens_use_neighborhoods" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_city_data_tokens_use_unique_facts" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_city_data_tokens_use_market_stats" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_template_category" "enum__posts_v_version_template_category";
  ALTER TABLE "_posts_v" ADD COLUMN "version_use_template" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content_template_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_template_topic" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_target_city_data_id" integer;
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "agents" ADD COLUMN "website" varchar;
  ALTER TABLE "agents" ADD COLUMN "meta_json_ld_enabled" boolean DEFAULT true;
  ALTER TABLE "agents" ADD COLUMN "meta_json_ld_geo_coordinates_latitude" numeric;
  ALTER TABLE "agents" ADD COLUMN "meta_json_ld_geo_coordinates_longitude" numeric;
  ALTER TABLE "agents" ADD COLUMN "meta_json_ld_price_range" varchar;
  ALTER TABLE "agents" ADD COLUMN "meta_json_ld_aggregate_rating_rating_value" numeric;
  ALTER TABLE "agents" ADD COLUMN "meta_json_ld_aggregate_rating_review_count" numeric;
  ALTER TABLE "agents" ADD COLUMN "meta_json_ld_aggregate_rating_best_rating" numeric DEFAULT 5;
  ALTER TABLE "agents" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "agents" ADD COLUMN "designation_prefix" "enum_agents_designation_prefix";
  ALTER TABLE "agents" ADD COLUMN "full_designation" varchar;
  ALTER TABLE "agents" ADD COLUMN "auto_create_tenant" boolean DEFAULT false;
  ALTER TABLE "agents" ADD COLUMN "designation_city" varchar;
  ALTER TABLE "agents" ADD COLUMN "territory_exclusive" boolean DEFAULT true;
  ALTER TABLE "agents" ADD COLUMN "show_in_directory" boolean DEFAULT true;
  ALTER TABLE "agents" ADD COLUMN "directory_order" numeric;
  ALTER TABLE "agents" ADD COLUMN "json_ld_import_import_method" "enum_agents_json_ld_import_import_method";
  ALTER TABLE "agents" ADD COLUMN "json_ld_import_import_url" varchar;
  ALTER TABLE "agents" ADD COLUMN "json_ld_import_raw_json_ld" varchar;
  ALTER TABLE "agents" ADD COLUMN "json_ld_import_last_imported" timestamp(3) with time zone;
  ALTER TABLE "agents" ADD COLUMN "json_ld_import_import_source" varchar;
  ALTER TABLE "states" ADD COLUMN "featured_video" varchar;
  ALTER TABLE "states" ADD COLUMN "agent_count" numeric;
  ALTER TABLE "states" ADD COLUMN "show_in_navigation" boolean DEFAULT true;
  ALTER TABLE "states" ADD COLUMN "navigation_order" numeric;
  ALTER TABLE "states" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "states" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "states" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "designations" ADD COLUMN "badge_color" varchar DEFAULT '#dc2626';
  ALTER TABLE "designations" ADD COLUMN "is_active" boolean DEFAULT true;
  ALTER TABLE "designations" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "designations" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "designations" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tenants_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tenant_headers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tenant_footers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "city_data_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "content_templates_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "analytics_events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "post_analytics_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "agent_analytics_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "network_analytics_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "conversion_funnels_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "keyword_rankings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ab_tests_id" integer;
  ALTER TABLE "header_nav_items_dropdown_items" ADD COLUMN "has_submenu" boolean;
  ALTER TABLE "footer" ADD COLUMN "copyright_text" varchar DEFAULT 'Designated Local Expert Network';
  ALTER TABLE "footer" ADD COLUMN "social_links_facebook" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_twitter" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_instagram" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_linkedin" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_youtube" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_pinterest" varchar;
  ALTER TABLE "footer" ADD COLUMN "disclaimer" varchar DEFAULT 'Designated Local Expert is an Equal Opportunity Employer and supports the Fair Housing Act and equal opportunity housing. If you have a disability that is preventing you from experiencing this website, call';
  ALTER TABLE "footer" ADD COLUMN "disclaimer_phone" varchar;
  ALTER TABLE "agent_gal_imgs" ADD CONSTRAINT "agent_gal_imgs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agent_gal_imgs" ADD CONSTRAINT "agent_gal_imgs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_agent_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_agents_custom_members" ADD CONSTRAINT "pages_blocks_featured_agents_custom_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_agents_custom_members" ADD CONSTRAINT "pages_blocks_featured_agents_custom_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_featured_agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_section" ADD CONSTRAINT "pages_blocks_about_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_section" ADD CONSTRAINT "pages_blocks_about_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solutions_section_solutions" ADD CONSTRAINT "pages_blocks_solutions_section_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_solutions_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solutions_section" ADD CONSTRAINT "pages_blocks_solutions_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_solutions_section" ADD CONSTRAINT "pages_blocks_solutions_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "svc_items" ADD CONSTRAINT "svc_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "svc_items" ADD CONSTRAINT "svc_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."svcSec"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "svcSec" ADD CONSTRAINT "svcSec_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "feat_test_items" ADD CONSTRAINT "feat_test_items_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "feat_test_items" ADD CONSTRAINT "feat_test_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."featTest"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "featTest" ADD CONSTRAINT "featTest_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_articles_section" ADD CONSTRAINT "pages_blocks_articles_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_articles_sidebar_featured_on_logos" ADD CONSTRAINT "pages_blocks_articles_sidebar_featured_on_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_articles_sidebar_featured_on_logos" ADD CONSTRAINT "pages_blocks_articles_sidebar_featured_on_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_articles_sidebar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_articles_sidebar" ADD CONSTRAINT "pages_blocks_articles_sidebar_sidebar_agent_id_agents_id_fk" FOREIGN KEY ("sidebar_agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_articles_sidebar" ADD CONSTRAINT "pages_blocks_articles_sidebar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission_vision" ADD CONSTRAINT "pages_blocks_mission_vision_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_designation_directory_mr_designations" ADD CONSTRAINT "pages_blocks_designation_directory_mr_designations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_designation_directory"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_designation_directory_ms_designations" ADD CONSTRAINT "pages_blocks_designation_directory_ms_designations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_designation_directory"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_designation_directory" ADD CONSTRAINT "pages_blocks_designation_directory_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_designation_directory" ADD CONSTRAINT "pages_blocks_designation_directory_map_background_image_id_media_id_fk" FOREIGN KEY ("map_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_designation_directory" ADD CONSTRAINT "pages_blocks_designation_directory_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_california_mr_designations" ADD CONSTRAINT "pages_blocks_california_mr_designations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_california"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_california_ms_designations" ADD CONSTRAINT "pages_blocks_california_ms_designations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_california"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_california" ADD CONSTRAINT "pages_blocks_california_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_layout_links" ADD CONSTRAINT "pages_blocks_video_layout_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_layout" ADD CONSTRAINT "pages_blocks_video_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_branding_hero" ADD CONSTRAINT "pages_blocks_branding_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_presentation_embed" ADD CONSTRAINT "pages_blocks_presentation_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_agent_gal_imgs_v" ADD CONSTRAINT "_agent_gal_imgs_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_agent_gal_imgs_v" ADD CONSTRAINT "_agent_gal_imgs_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_agent_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_agents_custom_members" ADD CONSTRAINT "_pages_v_blocks_featured_agents_custom_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_agents_custom_members" ADD CONSTRAINT "_pages_v_blocks_featured_agents_custom_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_featured_agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_section" ADD CONSTRAINT "_pages_v_blocks_about_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_section" ADD CONSTRAINT "_pages_v_blocks_about_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solutions_section_solutions" ADD CONSTRAINT "_pages_v_blocks_solutions_section_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_solutions_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solutions_section" ADD CONSTRAINT "_pages_v_blocks_solutions_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solutions_section" ADD CONSTRAINT "_pages_v_blocks_solutions_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_svc_items_v" ADD CONSTRAINT "_svc_items_v_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_svc_items_v" ADD CONSTRAINT "_svc_items_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_svcSec_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_svcSec_v" ADD CONSTRAINT "_svcSec_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_feat_test_items_v" ADD CONSTRAINT "_feat_test_items_v_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_feat_test_items_v" ADD CONSTRAINT "_feat_test_items_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_featTest_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_featTest_v" ADD CONSTRAINT "_featTest_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_articles_section" ADD CONSTRAINT "_pages_v_blocks_articles_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_articles_sidebar_featured_on_logos" ADD CONSTRAINT "_pages_v_blocks_articles_sidebar_featured_on_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_articles_sidebar_featured_on_logos" ADD CONSTRAINT "_pages_v_blocks_articles_sidebar_featured_on_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_articles_sidebar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_articles_sidebar" ADD CONSTRAINT "_pages_v_blocks_articles_sidebar_sidebar_agent_id_agents_id_fk" FOREIGN KEY ("sidebar_agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_articles_sidebar" ADD CONSTRAINT "_pages_v_blocks_articles_sidebar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mission_vision" ADD CONSTRAINT "_pages_v_blocks_mission_vision_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_designation_directory_mr_designations" ADD CONSTRAINT "_pages_v_blocks_designation_directory_mr_designations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_designation_directory"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_designation_directory_ms_designations" ADD CONSTRAINT "_pages_v_blocks_designation_directory_ms_designations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_designation_directory"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_designation_directory" ADD CONSTRAINT "_pages_v_blocks_designation_directory_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_designation_directory" ADD CONSTRAINT "_pages_v_blocks_designation_directory_map_background_image_id_media_id_fk" FOREIGN KEY ("map_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_designation_directory" ADD CONSTRAINT "_pages_v_blocks_designation_directory_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_california_mr_designations" ADD CONSTRAINT "_pages_v_blocks_california_mr_designations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_california"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_california_ms_designations" ADD CONSTRAINT "_pages_v_blocks_california_ms_designations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_california"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_california" ADD CONSTRAINT "_pages_v_blocks_california_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_layout_links" ADD CONSTRAINT "_pages_v_blocks_video_layout_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_layout" ADD CONSTRAINT "_pages_v_blocks_video_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_branding_hero" ADD CONSTRAINT "_pages_v_blocks_branding_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_presentation_embed" ADD CONSTRAINT "_pages_v_blocks_presentation_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_tenant_seo_overrides" ADD CONSTRAINT "posts_tenant_seo_overrides_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_tenant_seo_overrides" ADD CONSTRAINT "posts_tenant_seo_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_display_locations_locations" ADD CONSTRAINT "posts_display_locations_locations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts_display_locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_display_locations" ADD CONSTRAINT "posts_display_locations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_display_locations" ADD CONSTRAINT "posts_display_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_section_overrides" ADD CONSTRAINT "posts_section_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sec_ovr" ADD CONSTRAINT "sec_ovr_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_ovr"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tokens" ADD CONSTRAINT "tokens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_ovr"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_ovr" ADD CONSTRAINT "tenant_ovr_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_ovr" ADD CONSTRAINT "tenant_ovr_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_ovr" ADD CONSTRAINT "tenant_ovr_city_data_id_city_data_id_fk" FOREIGN KEY ("city_data_id") REFERENCES "public"."city_data"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_ovr" ADD CONSTRAINT "tenant_ovr_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_tenant_seo_overrides" ADD CONSTRAINT "_posts_v_version_tenant_seo_overrides_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_tenant_seo_overrides" ADD CONSTRAINT "_posts_v_version_tenant_seo_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_display_locations_locations" ADD CONSTRAINT "_posts_v_version_display_locations_locations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v_version_display_locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_display_locations" ADD CONSTRAINT "_posts_v_version_display_locations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_display_locations" ADD CONSTRAINT "_posts_v_version_display_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_section_overrides" ADD CONSTRAINT "_posts_v_version_section_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sec_ovr_v" ADD CONSTRAINT "_sec_ovr_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tenant_ovr_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tokens_v" ADD CONSTRAINT "_tokens_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tenant_ovr_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenant_ovr_v" ADD CONSTRAINT "_tenant_ovr_v_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_ovr_v" ADD CONSTRAINT "_tenant_ovr_v_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_ovr_v" ADD CONSTRAINT "_tenant_ovr_v_city_data_id_city_data_id_fk" FOREIGN KEY ("city_data_id") REFERENCES "public"."city_data"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_ovr_v" ADD CONSTRAINT "_tenant_ovr_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_meta_keywords_primary" ADD CONSTRAINT "agents_meta_keywords_primary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_meta_keywords_secondary" ADD CONSTRAINT "agents_meta_keywords_secondary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_meta_keywords_geographic" ADD CONSTRAINT "agents_meta_keywords_geographic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_meta_keywords_services" ADD CONSTRAINT "agents_meta_keywords_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_meta_json_ld_schema_types" ADD CONSTRAINT "agents_meta_json_ld_schema_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_meta_json_ld_area_served" ADD CONSTRAINT "agents_meta_json_ld_area_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_meta_json_ld_knows_about" ADD CONSTRAINT "agents_meta_json_ld_knows_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_meta_json_ld_same_as" ADD CONSTRAINT "agents_meta_json_ld_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_cultural_expertise_languages_spoken" ADD CONSTRAINT "agents_cultural_expertise_languages_spoken_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_cultural_expertise_cultural_specializations" ADD CONSTRAINT "agents_cultural_expertise_cultural_specializations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_cultural_expertise_community_involvement" ADD CONSTRAINT "agents_cultural_expertise_community_involvement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "states_cities" ADD CONSTRAINT "states_cities_mr_agent_id_agents_id_fk" FOREIGN KEY ("mr_agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "states_cities" ADD CONSTRAINT "states_cities_ms_agent_id_agents_id_fk" FOREIGN KEY ("ms_agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "states_cities" ADD CONSTRAINT "states_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."states"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenants_domains" ADD CONSTRAINT "tenants_domains_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_linked_agent_id_agents_id_fk" FOREIGN KEY ("linked_agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_branding_logo_id_media_id_fk" FOREIGN KEY ("branding_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_branding_favicon_id_media_id_fk" FOREIGN KEY ("branding_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_seo_defaults_default_image_id_media_id_fk" FOREIGN KEY ("seo_defaults_default_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_headers_nav_items" ADD CONSTRAINT "tenant_headers_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_headers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_headers" ADD CONSTRAINT "tenant_headers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_headers" ADD CONSTRAINT "tenant_headers_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_headers" ADD CONSTRAINT "tenant_headers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_headers_rels" ADD CONSTRAINT "tenant_headers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tenant_headers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_headers_rels" ADD CONSTRAINT "tenant_headers_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_headers_rels" ADD CONSTRAINT "tenant_headers_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_footers_columns_links" ADD CONSTRAINT "tenant_footers_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_footers_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_footers_columns" ADD CONSTRAINT "tenant_footers_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_footers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_footers_legal_links" ADD CONSTRAINT "tenant_footers_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_footers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_footers" ADD CONSTRAINT "tenant_footers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_footers" ADD CONSTRAINT "tenant_footers_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_footers_rels" ADD CONSTRAINT "tenant_footers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tenant_footers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_footers_rels" ADD CONSTRAINT "tenant_footers_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_footers_rels" ADD CONSTRAINT "tenant_footers_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_neighborhoods" ADD CONSTRAINT "city_data_neighborhoods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_top_schools" ADD CONSTRAINT "city_data_top_schools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_unique_facts" ADD CONSTRAINT "city_data_unique_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_key_employers" ADD CONSTRAINT "city_data_key_employers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_places_of_worship" ADD CONSTRAINT "city_data_places_of_worship_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_cultural_centers" ADD CONSTRAINT "city_data_cultural_centers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_ethnic_cuisine" ADD CONSTRAINT "city_data_ethnic_cuisine_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_cultural_events" ADD CONSTRAINT "city_data_cultural_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_languages_spoken" ADD CONSTRAINT "city_data_languages_spoken_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_demographics_ethnic_breakdown" ADD CONSTRAINT "city_data_demographics_ethnic_breakdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data_community_amenities" ADD CONSTRAINT "city_data_community_amenities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "city_data" ADD CONSTRAINT "city_data_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_templates_sections" ADD CONSTRAINT "content_templates_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_templates_required_city_data" ADD CONSTRAINT "content_templates_required_city_data_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."content_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_templates" ADD CONSTRAINT "content_templates_base_post_id_posts_id_fk" FOREIGN KEY ("base_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_post_id_id_posts_id_fk" FOREIGN KEY ("post_id_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_page_id_id_pages_id_fk" FOREIGN KEY ("page_id_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_agent_id_id_agents_id_fk" FOREIGN KEY ("agent_id_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_analytics" ADD CONSTRAINT "post_analytics_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agent_analytics" ADD CONSTRAINT "agent_analytics_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agent_analytics" ADD CONSTRAINT "agent_analytics_top_post_id_posts_id_fk" FOREIGN KEY ("top_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conversion_funnels" ADD CONSTRAINT "conversion_funnels_first_post_id_posts_id_fk" FOREIGN KEY ("first_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conversion_funnels" ADD CONSTRAINT "conversion_funnels_last_post_id_posts_id_fk" FOREIGN KEY ("last_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conversion_funnels" ADD CONSTRAINT "conversion_funnels_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conversion_funnels" ADD CONSTRAINT "conversion_funnels_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "keyword_rankings" ADD CONSTRAINT "keyword_rankings_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ab_tests_test_variants" ADD CONSTRAINT "ab_tests_test_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ab_tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ab_tests_rels" ADD CONSTRAINT "ab_tests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ab_tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ab_tests_rels" ADD CONSTRAINT "ab_tests_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ab_tests_rels" ADD CONSTRAINT "ab_tests_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_dropdown_items_sub_items" ADD CONSTRAINT "header_nav_items_dropdown_items_sub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_dropdown_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "agent_gal_imgs_order_idx" ON "agent_gal_imgs" USING btree ("_order");
  CREATE INDEX "agent_gal_imgs_parent_id_idx" ON "agent_gal_imgs" USING btree ("_parent_id");
  CREATE INDEX "agent_gal_imgs_image_idx" ON "agent_gal_imgs" USING btree ("image_id");
  CREATE INDEX "pages_blocks_featured_agents_custom_members_order_idx" ON "pages_blocks_featured_agents_custom_members" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_agents_custom_members_parent_id_idx" ON "pages_blocks_featured_agents_custom_members" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_agents_custom_members_photo_idx" ON "pages_blocks_featured_agents_custom_members" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_about_section_order_idx" ON "pages_blocks_about_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_section_parent_id_idx" ON "pages_blocks_about_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_section_path_idx" ON "pages_blocks_about_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_section_image_idx" ON "pages_blocks_about_section" USING btree ("image_id");
  CREATE INDEX "pages_blocks_solutions_section_solutions_order_idx" ON "pages_blocks_solutions_section_solutions" USING btree ("_order");
  CREATE INDEX "pages_blocks_solutions_section_solutions_parent_id_idx" ON "pages_blocks_solutions_section_solutions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solutions_section_order_idx" ON "pages_blocks_solutions_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_solutions_section_parent_id_idx" ON "pages_blocks_solutions_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solutions_section_path_idx" ON "pages_blocks_solutions_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_solutions_section_image_idx" ON "pages_blocks_solutions_section" USING btree ("image_id");
  CREATE INDEX "svc_items_order_idx" ON "svc_items" USING btree ("_order");
  CREATE INDEX "svc_items_parent_id_idx" ON "svc_items" USING btree ("_parent_id");
  CREATE INDEX "svc_items_icon_idx" ON "svc_items" USING btree ("icon_id");
  CREATE INDEX "svcSec_order_idx" ON "svcSec" USING btree ("_order");
  CREATE INDEX "svcSec_parent_id_idx" ON "svcSec" USING btree ("_parent_id");
  CREATE INDEX "svcSec_path_idx" ON "svcSec" USING btree ("_path");
  CREATE INDEX "feat_test_items_order_idx" ON "feat_test_items" USING btree ("_order");
  CREATE INDEX "feat_test_items_parent_id_idx" ON "feat_test_items" USING btree ("_parent_id");
  CREATE INDEX "feat_test_items_photo_idx" ON "feat_test_items" USING btree ("photo_id");
  CREATE INDEX "featTest_order_idx" ON "featTest" USING btree ("_order");
  CREATE INDEX "featTest_parent_id_idx" ON "featTest" USING btree ("_parent_id");
  CREATE INDEX "featTest_path_idx" ON "featTest" USING btree ("_path");
  CREATE INDEX "pages_blocks_articles_section_order_idx" ON "pages_blocks_articles_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_articles_section_parent_id_idx" ON "pages_blocks_articles_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_articles_section_path_idx" ON "pages_blocks_articles_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_articles_sidebar_featured_on_logos_order_idx" ON "pages_blocks_articles_sidebar_featured_on_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_articles_sidebar_featured_on_logos_parent_id_idx" ON "pages_blocks_articles_sidebar_featured_on_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_articles_sidebar_featured_on_logos_logo_idx" ON "pages_blocks_articles_sidebar_featured_on_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_articles_sidebar_order_idx" ON "pages_blocks_articles_sidebar" USING btree ("_order");
  CREATE INDEX "pages_blocks_articles_sidebar_parent_id_idx" ON "pages_blocks_articles_sidebar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_articles_sidebar_path_idx" ON "pages_blocks_articles_sidebar" USING btree ("_path");
  CREATE INDEX "pages_blocks_articles_sidebar_sidebar_agent_idx" ON "pages_blocks_articles_sidebar" USING btree ("sidebar_agent_id");
  CREATE INDEX "pages_blocks_mission_vision_order_idx" ON "pages_blocks_mission_vision" USING btree ("_order");
  CREATE INDEX "pages_blocks_mission_vision_parent_id_idx" ON "pages_blocks_mission_vision" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mission_vision_path_idx" ON "pages_blocks_mission_vision" USING btree ("_path");
  CREATE INDEX "pages_blocks_designation_directory_mr_designations_order_idx" ON "pages_blocks_designation_directory_mr_designations" USING btree ("_order");
  CREATE INDEX "pages_blocks_designation_directory_mr_designations_parent_id_idx" ON "pages_blocks_designation_directory_mr_designations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_designation_directory_ms_designations_order_idx" ON "pages_blocks_designation_directory_ms_designations" USING btree ("_order");
  CREATE INDEX "pages_blocks_designation_directory_ms_designations_parent_id_idx" ON "pages_blocks_designation_directory_ms_designations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_designation_directory_order_idx" ON "pages_blocks_designation_directory" USING btree ("_order");
  CREATE INDEX "pages_blocks_designation_directory_parent_id_idx" ON "pages_blocks_designation_directory" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_designation_directory_path_idx" ON "pages_blocks_designation_directory" USING btree ("_path");
  CREATE INDEX "pages_blocks_designation_directory_state_idx" ON "pages_blocks_designation_directory" USING btree ("state_id");
  CREATE INDEX "pages_blocks_designation_directory_map_background_image_idx" ON "pages_blocks_designation_directory" USING btree ("map_background_image_id");
  CREATE INDEX "pages_blocks_california_mr_designations_order_idx" ON "pages_blocks_california_mr_designations" USING btree ("_order");
  CREATE INDEX "pages_blocks_california_mr_designations_parent_id_idx" ON "pages_blocks_california_mr_designations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_california_ms_designations_order_idx" ON "pages_blocks_california_ms_designations" USING btree ("_order");
  CREATE INDEX "pages_blocks_california_ms_designations_parent_id_idx" ON "pages_blocks_california_ms_designations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_california_order_idx" ON "pages_blocks_california" USING btree ("_order");
  CREATE INDEX "pages_blocks_california_parent_id_idx" ON "pages_blocks_california" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_california_path_idx" ON "pages_blocks_california" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_layout_links_order_idx" ON "pages_blocks_video_layout_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_layout_links_parent_id_idx" ON "pages_blocks_video_layout_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_layout_order_idx" ON "pages_blocks_video_layout" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_layout_parent_id_idx" ON "pages_blocks_video_layout" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_layout_path_idx" ON "pages_blocks_video_layout" USING btree ("_path");
  CREATE INDEX "pages_blocks_branding_hero_order_idx" ON "pages_blocks_branding_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_branding_hero_parent_id_idx" ON "pages_blocks_branding_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_branding_hero_path_idx" ON "pages_blocks_branding_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_presentation_embed_order_idx" ON "pages_blocks_presentation_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_presentation_embed_parent_id_idx" ON "pages_blocks_presentation_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_presentation_embed_path_idx" ON "pages_blocks_presentation_embed" USING btree ("_path");
  CREATE INDEX "_agent_gal_imgs_v_order_idx" ON "_agent_gal_imgs_v" USING btree ("_order");
  CREATE INDEX "_agent_gal_imgs_v_parent_id_idx" ON "_agent_gal_imgs_v" USING btree ("_parent_id");
  CREATE INDEX "_agent_gal_imgs_v_image_idx" ON "_agent_gal_imgs_v" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_featured_agents_custom_members_order_idx" ON "_pages_v_blocks_featured_agents_custom_members" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_agents_custom_members_parent_id_idx" ON "_pages_v_blocks_featured_agents_custom_members" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_agents_custom_members_photo_idx" ON "_pages_v_blocks_featured_agents_custom_members" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_about_section_order_idx" ON "_pages_v_blocks_about_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_section_parent_id_idx" ON "_pages_v_blocks_about_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_section_path_idx" ON "_pages_v_blocks_about_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_section_image_idx" ON "_pages_v_blocks_about_section" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_solutions_section_solutions_order_idx" ON "_pages_v_blocks_solutions_section_solutions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_solutions_section_solutions_parent_id_idx" ON "_pages_v_blocks_solutions_section_solutions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_solutions_section_order_idx" ON "_pages_v_blocks_solutions_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_solutions_section_parent_id_idx" ON "_pages_v_blocks_solutions_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_solutions_section_path_idx" ON "_pages_v_blocks_solutions_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_solutions_section_image_idx" ON "_pages_v_blocks_solutions_section" USING btree ("image_id");
  CREATE INDEX "_svc_items_v_order_idx" ON "_svc_items_v" USING btree ("_order");
  CREATE INDEX "_svc_items_v_parent_id_idx" ON "_svc_items_v" USING btree ("_parent_id");
  CREATE INDEX "_svc_items_v_icon_idx" ON "_svc_items_v" USING btree ("icon_id");
  CREATE INDEX "_svcSec_v_order_idx" ON "_svcSec_v" USING btree ("_order");
  CREATE INDEX "_svcSec_v_parent_id_idx" ON "_svcSec_v" USING btree ("_parent_id");
  CREATE INDEX "_svcSec_v_path_idx" ON "_svcSec_v" USING btree ("_path");
  CREATE INDEX "_feat_test_items_v_order_idx" ON "_feat_test_items_v" USING btree ("_order");
  CREATE INDEX "_feat_test_items_v_parent_id_idx" ON "_feat_test_items_v" USING btree ("_parent_id");
  CREATE INDEX "_feat_test_items_v_photo_idx" ON "_feat_test_items_v" USING btree ("photo_id");
  CREATE INDEX "_featTest_v_order_idx" ON "_featTest_v" USING btree ("_order");
  CREATE INDEX "_featTest_v_parent_id_idx" ON "_featTest_v" USING btree ("_parent_id");
  CREATE INDEX "_featTest_v_path_idx" ON "_featTest_v" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_articles_section_order_idx" ON "_pages_v_blocks_articles_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_articles_section_parent_id_idx" ON "_pages_v_blocks_articles_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_articles_section_path_idx" ON "_pages_v_blocks_articles_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_articles_sidebar_featured_on_logos_order_idx" ON "_pages_v_blocks_articles_sidebar_featured_on_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_articles_sidebar_featured_on_logos_parent_id_idx" ON "_pages_v_blocks_articles_sidebar_featured_on_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_articles_sidebar_featured_on_logos_logo_idx" ON "_pages_v_blocks_articles_sidebar_featured_on_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_articles_sidebar_order_idx" ON "_pages_v_blocks_articles_sidebar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_articles_sidebar_parent_id_idx" ON "_pages_v_blocks_articles_sidebar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_articles_sidebar_path_idx" ON "_pages_v_blocks_articles_sidebar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_articles_sidebar_sidebar_agent_idx" ON "_pages_v_blocks_articles_sidebar" USING btree ("sidebar_agent_id");
  CREATE INDEX "_pages_v_blocks_mission_vision_order_idx" ON "_pages_v_blocks_mission_vision" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mission_vision_parent_id_idx" ON "_pages_v_blocks_mission_vision" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mission_vision_path_idx" ON "_pages_v_blocks_mission_vision" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_designation_directory_mr_designations_order_idx" ON "_pages_v_blocks_designation_directory_mr_designations" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_designation_directory_mr_designations_parent_id_idx" ON "_pages_v_blocks_designation_directory_mr_designations" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_designation_directory_ms_designations_order_idx" ON "_pages_v_blocks_designation_directory_ms_designations" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_designation_directory_ms_designations_parent_id_idx" ON "_pages_v_blocks_designation_directory_ms_designations" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_designation_directory_order_idx" ON "_pages_v_blocks_designation_directory" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_designation_directory_parent_id_idx" ON "_pages_v_blocks_designation_directory" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_designation_directory_path_idx" ON "_pages_v_blocks_designation_directory" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_designation_directory_state_idx" ON "_pages_v_blocks_designation_directory" USING btree ("state_id");
  CREATE INDEX "_pages_v_blocks_designation_directory_map_background_ima_idx" ON "_pages_v_blocks_designation_directory" USING btree ("map_background_image_id");
  CREATE INDEX "_pages_v_blocks_california_mr_designations_order_idx" ON "_pages_v_blocks_california_mr_designations" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_california_mr_designations_parent_id_idx" ON "_pages_v_blocks_california_mr_designations" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_california_ms_designations_order_idx" ON "_pages_v_blocks_california_ms_designations" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_california_ms_designations_parent_id_idx" ON "_pages_v_blocks_california_ms_designations" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_california_order_idx" ON "_pages_v_blocks_california" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_california_parent_id_idx" ON "_pages_v_blocks_california" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_california_path_idx" ON "_pages_v_blocks_california" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_layout_links_order_idx" ON "_pages_v_blocks_video_layout_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_layout_links_parent_id_idx" ON "_pages_v_blocks_video_layout_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_layout_order_idx" ON "_pages_v_blocks_video_layout" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_layout_parent_id_idx" ON "_pages_v_blocks_video_layout" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_layout_path_idx" ON "_pages_v_blocks_video_layout" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_branding_hero_order_idx" ON "_pages_v_blocks_branding_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_branding_hero_parent_id_idx" ON "_pages_v_blocks_branding_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_branding_hero_path_idx" ON "_pages_v_blocks_branding_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_presentation_embed_order_idx" ON "_pages_v_blocks_presentation_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_presentation_embed_parent_id_idx" ON "_pages_v_blocks_presentation_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_presentation_embed_path_idx" ON "_pages_v_blocks_presentation_embed" USING btree ("_path");
  CREATE INDEX "posts_tenant_seo_overrides_order_idx" ON "posts_tenant_seo_overrides" USING btree ("_order");
  CREATE INDEX "posts_tenant_seo_overrides_parent_id_idx" ON "posts_tenant_seo_overrides" USING btree ("_parent_id");
  CREATE INDEX "posts_tenant_seo_overrides_tenant_idx" ON "posts_tenant_seo_overrides" USING btree ("tenant_id");
  CREATE INDEX "posts_display_locations_locations_order_idx" ON "posts_display_locations_locations" USING btree ("order");
  CREATE INDEX "posts_display_locations_locations_parent_idx" ON "posts_display_locations_locations" USING btree ("parent_id");
  CREATE INDEX "posts_display_locations_order_idx" ON "posts_display_locations" USING btree ("_order");
  CREATE INDEX "posts_display_locations_parent_id_idx" ON "posts_display_locations" USING btree ("_parent_id");
  CREATE INDEX "posts_display_locations_tenant_idx" ON "posts_display_locations" USING btree ("tenant_id");
  CREATE INDEX "posts_section_overrides_order_idx" ON "posts_section_overrides" USING btree ("_order");
  CREATE INDEX "posts_section_overrides_parent_id_idx" ON "posts_section_overrides" USING btree ("_parent_id");
  CREATE INDEX "sec_ovr_order_idx" ON "sec_ovr" USING btree ("_order");
  CREATE INDEX "sec_ovr_parent_id_idx" ON "sec_ovr" USING btree ("_parent_id");
  CREATE INDEX "tokens_order_idx" ON "tokens" USING btree ("_order");
  CREATE INDEX "tokens_parent_id_idx" ON "tokens" USING btree ("_parent_id");
  CREATE INDEX "tenant_ovr_order_idx" ON "tenant_ovr" USING btree ("_order");
  CREATE INDEX "tenant_ovr_parent_id_idx" ON "tenant_ovr" USING btree ("_parent_id");
  CREATE INDEX "tenant_ovr_tenant_idx" ON "tenant_ovr" USING btree ("tenant_id");
  CREATE INDEX "tenant_ovr_agent_idx" ON "tenant_ovr" USING btree ("agent_id");
  CREATE INDEX "tenant_ovr_city_data_idx" ON "tenant_ovr" USING btree ("city_data_id");
  CREATE INDEX "_posts_v_version_tenant_seo_overrides_order_idx" ON "_posts_v_version_tenant_seo_overrides" USING btree ("_order");
  CREATE INDEX "_posts_v_version_tenant_seo_overrides_parent_id_idx" ON "_posts_v_version_tenant_seo_overrides" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_tenant_seo_overrides_tenant_idx" ON "_posts_v_version_tenant_seo_overrides" USING btree ("tenant_id");
  CREATE INDEX "_posts_v_version_display_locations_locations_order_idx" ON "_posts_v_version_display_locations_locations" USING btree ("order");
  CREATE INDEX "_posts_v_version_display_locations_locations_parent_idx" ON "_posts_v_version_display_locations_locations" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_display_locations_order_idx" ON "_posts_v_version_display_locations" USING btree ("_order");
  CREATE INDEX "_posts_v_version_display_locations_parent_id_idx" ON "_posts_v_version_display_locations" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_display_locations_tenant_idx" ON "_posts_v_version_display_locations" USING btree ("tenant_id");
  CREATE INDEX "_posts_v_version_section_overrides_order_idx" ON "_posts_v_version_section_overrides" USING btree ("_order");
  CREATE INDEX "_posts_v_version_section_overrides_parent_id_idx" ON "_posts_v_version_section_overrides" USING btree ("_parent_id");
  CREATE INDEX "_sec_ovr_v_order_idx" ON "_sec_ovr_v" USING btree ("_order");
  CREATE INDEX "_sec_ovr_v_parent_id_idx" ON "_sec_ovr_v" USING btree ("_parent_id");
  CREATE INDEX "_tokens_v_order_idx" ON "_tokens_v" USING btree ("_order");
  CREATE INDEX "_tokens_v_parent_id_idx" ON "_tokens_v" USING btree ("_parent_id");
  CREATE INDEX "_tenant_ovr_v_order_idx" ON "_tenant_ovr_v" USING btree ("_order");
  CREATE INDEX "_tenant_ovr_v_parent_id_idx" ON "_tenant_ovr_v" USING btree ("_parent_id");
  CREATE INDEX "_tenant_ovr_v_tenant_idx" ON "_tenant_ovr_v" USING btree ("tenant_id");
  CREATE INDEX "_tenant_ovr_v_agent_idx" ON "_tenant_ovr_v" USING btree ("agent_id");
  CREATE INDEX "_tenant_ovr_v_city_data_idx" ON "_tenant_ovr_v" USING btree ("city_data_id");
  CREATE INDEX "agents_meta_keywords_primary_order_idx" ON "agents_meta_keywords_primary" USING btree ("_order");
  CREATE INDEX "agents_meta_keywords_primary_parent_id_idx" ON "agents_meta_keywords_primary" USING btree ("_parent_id");
  CREATE INDEX "agents_meta_keywords_secondary_order_idx" ON "agents_meta_keywords_secondary" USING btree ("_order");
  CREATE INDEX "agents_meta_keywords_secondary_parent_id_idx" ON "agents_meta_keywords_secondary" USING btree ("_parent_id");
  CREATE INDEX "agents_meta_keywords_geographic_order_idx" ON "agents_meta_keywords_geographic" USING btree ("_order");
  CREATE INDEX "agents_meta_keywords_geographic_parent_id_idx" ON "agents_meta_keywords_geographic" USING btree ("_parent_id");
  CREATE INDEX "agents_meta_keywords_services_order_idx" ON "agents_meta_keywords_services" USING btree ("_order");
  CREATE INDEX "agents_meta_keywords_services_parent_id_idx" ON "agents_meta_keywords_services" USING btree ("_parent_id");
  CREATE INDEX "agents_meta_json_ld_schema_types_order_idx" ON "agents_meta_json_ld_schema_types" USING btree ("order");
  CREATE INDEX "agents_meta_json_ld_schema_types_parent_idx" ON "agents_meta_json_ld_schema_types" USING btree ("parent_id");
  CREATE INDEX "agents_meta_json_ld_area_served_order_idx" ON "agents_meta_json_ld_area_served" USING btree ("_order");
  CREATE INDEX "agents_meta_json_ld_area_served_parent_id_idx" ON "agents_meta_json_ld_area_served" USING btree ("_parent_id");
  CREATE INDEX "agents_meta_json_ld_knows_about_order_idx" ON "agents_meta_json_ld_knows_about" USING btree ("_order");
  CREATE INDEX "agents_meta_json_ld_knows_about_parent_id_idx" ON "agents_meta_json_ld_knows_about" USING btree ("_parent_id");
  CREATE INDEX "agents_meta_json_ld_same_as_order_idx" ON "agents_meta_json_ld_same_as" USING btree ("_order");
  CREATE INDEX "agents_meta_json_ld_same_as_parent_id_idx" ON "agents_meta_json_ld_same_as" USING btree ("_parent_id");
  CREATE INDEX "agents_cultural_expertise_languages_spoken_order_idx" ON "agents_cultural_expertise_languages_spoken" USING btree ("_order");
  CREATE INDEX "agents_cultural_expertise_languages_spoken_parent_id_idx" ON "agents_cultural_expertise_languages_spoken" USING btree ("_parent_id");
  CREATE INDEX "agents_cultural_expertise_cultural_specializations_order_idx" ON "agents_cultural_expertise_cultural_specializations" USING btree ("_order");
  CREATE INDEX "agents_cultural_expertise_cultural_specializations_parent_id_idx" ON "agents_cultural_expertise_cultural_specializations" USING btree ("_parent_id");
  CREATE INDEX "agents_cultural_expertise_community_involvement_order_idx" ON "agents_cultural_expertise_community_involvement" USING btree ("_order");
  CREATE INDEX "agents_cultural_expertise_community_involvement_parent_id_idx" ON "agents_cultural_expertise_community_involvement" USING btree ("_parent_id");
  CREATE INDEX "states_cities_order_idx" ON "states_cities" USING btree ("_order");
  CREATE INDEX "states_cities_parent_id_idx" ON "states_cities" USING btree ("_parent_id");
  CREATE INDEX "states_cities_mr_agent_idx" ON "states_cities" USING btree ("mr_agent_id");
  CREATE INDEX "states_cities_ms_agent_idx" ON "states_cities" USING btree ("ms_agent_id");
  CREATE INDEX "tenants_domains_order_idx" ON "tenants_domains" USING btree ("_order");
  CREATE INDEX "tenants_domains_parent_id_idx" ON "tenants_domains" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE INDEX "tenants_linked_agent_idx" ON "tenants" USING btree ("linked_agent_id");
  CREATE INDEX "tenants_branding_branding_logo_idx" ON "tenants" USING btree ("branding_logo_id");
  CREATE INDEX "tenants_branding_branding_favicon_idx" ON "tenants" USING btree ("branding_favicon_id");
  CREATE INDEX "tenants_seo_defaults_seo_defaults_default_image_idx" ON "tenants" USING btree ("seo_defaults_default_image_id");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "tenant_headers_nav_items_order_idx" ON "tenant_headers_nav_items" USING btree ("_order");
  CREATE INDEX "tenant_headers_nav_items_parent_id_idx" ON "tenant_headers_nav_items" USING btree ("_parent_id");
  CREATE INDEX "tenant_headers_tenant_idx" ON "tenant_headers" USING btree ("tenant_id");
  CREATE INDEX "tenant_headers_agent_idx" ON "tenant_headers" USING btree ("agent_id");
  CREATE INDEX "tenant_headers_logo_idx" ON "tenant_headers" USING btree ("logo_id");
  CREATE INDEX "tenant_headers_updated_at_idx" ON "tenant_headers" USING btree ("updated_at");
  CREATE INDEX "tenant_headers_created_at_idx" ON "tenant_headers" USING btree ("created_at");
  CREATE INDEX "tenant_headers_rels_order_idx" ON "tenant_headers_rels" USING btree ("order");
  CREATE INDEX "tenant_headers_rels_parent_idx" ON "tenant_headers_rels" USING btree ("parent_id");
  CREATE INDEX "tenant_headers_rels_path_idx" ON "tenant_headers_rels" USING btree ("path");
  CREATE INDEX "tenant_headers_rels_pages_id_idx" ON "tenant_headers_rels" USING btree ("pages_id");
  CREATE INDEX "tenant_headers_rels_posts_id_idx" ON "tenant_headers_rels" USING btree ("posts_id");
  CREATE INDEX "tenant_footers_columns_links_order_idx" ON "tenant_footers_columns_links" USING btree ("_order");
  CREATE INDEX "tenant_footers_columns_links_parent_id_idx" ON "tenant_footers_columns_links" USING btree ("_parent_id");
  CREATE INDEX "tenant_footers_columns_order_idx" ON "tenant_footers_columns" USING btree ("_order");
  CREATE INDEX "tenant_footers_columns_parent_id_idx" ON "tenant_footers_columns" USING btree ("_parent_id");
  CREATE INDEX "tenant_footers_legal_links_order_idx" ON "tenant_footers_legal_links" USING btree ("_order");
  CREATE INDEX "tenant_footers_legal_links_parent_id_idx" ON "tenant_footers_legal_links" USING btree ("_parent_id");
  CREATE INDEX "tenant_footers_tenant_idx" ON "tenant_footers" USING btree ("tenant_id");
  CREATE INDEX "tenant_footers_agent_idx" ON "tenant_footers" USING btree ("agent_id");
  CREATE INDEX "tenant_footers_updated_at_idx" ON "tenant_footers" USING btree ("updated_at");
  CREATE INDEX "tenant_footers_created_at_idx" ON "tenant_footers" USING btree ("created_at");
  CREATE INDEX "tenant_footers_rels_order_idx" ON "tenant_footers_rels" USING btree ("order");
  CREATE INDEX "tenant_footers_rels_parent_idx" ON "tenant_footers_rels" USING btree ("parent_id");
  CREATE INDEX "tenant_footers_rels_path_idx" ON "tenant_footers_rels" USING btree ("path");
  CREATE INDEX "tenant_footers_rels_pages_id_idx" ON "tenant_footers_rels" USING btree ("pages_id");
  CREATE INDEX "tenant_footers_rels_posts_id_idx" ON "tenant_footers_rels" USING btree ("posts_id");
  CREATE INDEX "city_data_neighborhoods_order_idx" ON "city_data_neighborhoods" USING btree ("_order");
  CREATE INDEX "city_data_neighborhoods_parent_id_idx" ON "city_data_neighborhoods" USING btree ("_parent_id");
  CREATE INDEX "city_data_top_schools_order_idx" ON "city_data_top_schools" USING btree ("_order");
  CREATE INDEX "city_data_top_schools_parent_id_idx" ON "city_data_top_schools" USING btree ("_parent_id");
  CREATE INDEX "city_data_unique_facts_order_idx" ON "city_data_unique_facts" USING btree ("_order");
  CREATE INDEX "city_data_unique_facts_parent_id_idx" ON "city_data_unique_facts" USING btree ("_parent_id");
  CREATE INDEX "city_data_key_employers_order_idx" ON "city_data_key_employers" USING btree ("_order");
  CREATE INDEX "city_data_key_employers_parent_id_idx" ON "city_data_key_employers" USING btree ("_parent_id");
  CREATE INDEX "city_data_places_of_worship_order_idx" ON "city_data_places_of_worship" USING btree ("_order");
  CREATE INDEX "city_data_places_of_worship_parent_id_idx" ON "city_data_places_of_worship" USING btree ("_parent_id");
  CREATE INDEX "city_data_cultural_centers_order_idx" ON "city_data_cultural_centers" USING btree ("_order");
  CREATE INDEX "city_data_cultural_centers_parent_id_idx" ON "city_data_cultural_centers" USING btree ("_parent_id");
  CREATE INDEX "city_data_ethnic_cuisine_order_idx" ON "city_data_ethnic_cuisine" USING btree ("_order");
  CREATE INDEX "city_data_ethnic_cuisine_parent_id_idx" ON "city_data_ethnic_cuisine" USING btree ("_parent_id");
  CREATE INDEX "city_data_cultural_events_order_idx" ON "city_data_cultural_events" USING btree ("_order");
  CREATE INDEX "city_data_cultural_events_parent_id_idx" ON "city_data_cultural_events" USING btree ("_parent_id");
  CREATE INDEX "city_data_languages_spoken_order_idx" ON "city_data_languages_spoken" USING btree ("_order");
  CREATE INDEX "city_data_languages_spoken_parent_id_idx" ON "city_data_languages_spoken" USING btree ("_parent_id");
  CREATE INDEX "city_data_demographics_ethnic_breakdown_order_idx" ON "city_data_demographics_ethnic_breakdown" USING btree ("_order");
  CREATE INDEX "city_data_demographics_ethnic_breakdown_parent_id_idx" ON "city_data_demographics_ethnic_breakdown" USING btree ("_parent_id");
  CREATE INDEX "city_data_community_amenities_order_idx" ON "city_data_community_amenities" USING btree ("_order");
  CREATE INDEX "city_data_community_amenities_parent_id_idx" ON "city_data_community_amenities" USING btree ("_parent_id");
  CREATE INDEX "city_data_state_idx" ON "city_data" USING btree ("state_id");
  CREATE INDEX "city_data_updated_at_idx" ON "city_data" USING btree ("updated_at");
  CREATE INDEX "city_data_created_at_idx" ON "city_data" USING btree ("created_at");
  CREATE INDEX "content_templates_sections_order_idx" ON "content_templates_sections" USING btree ("_order");
  CREATE INDEX "content_templates_sections_parent_id_idx" ON "content_templates_sections" USING btree ("_parent_id");
  CREATE INDEX "content_templates_required_city_data_order_idx" ON "content_templates_required_city_data" USING btree ("order");
  CREATE INDEX "content_templates_required_city_data_parent_idx" ON "content_templates_required_city_data" USING btree ("parent_id");
  CREATE UNIQUE INDEX "content_templates_slug_idx" ON "content_templates" USING btree ("slug");
  CREATE INDEX "content_templates_base_post_idx" ON "content_templates" USING btree ("base_post_id");
  CREATE INDEX "content_templates_updated_at_idx" ON "content_templates" USING btree ("updated_at");
  CREATE INDEX "content_templates_created_at_idx" ON "content_templates" USING btree ("created_at");
  CREATE INDEX "analytics_events_session_id_idx" ON "analytics_events" USING btree ("session_id");
  CREATE INDEX "analytics_events_post_id_idx" ON "analytics_events" USING btree ("post_id_id");
  CREATE INDEX "analytics_events_page_id_idx" ON "analytics_events" USING btree ("page_id_id");
  CREATE INDEX "analytics_events_agent_id_idx" ON "analytics_events" USING btree ("agent_id_id");
  CREATE INDEX "analytics_events_tenant_id_idx" ON "analytics_events" USING btree ("tenant_id_id");
  CREATE INDEX "analytics_events_server_timestamp_idx" ON "analytics_events" USING btree ("server_timestamp");
  CREATE INDEX "analytics_events_updated_at_idx" ON "analytics_events" USING btree ("updated_at");
  CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");
  CREATE INDEX "post_analytics_post_idx" ON "post_analytics" USING btree ("post_id");
  CREATE INDEX "post_analytics_date_idx" ON "post_analytics" USING btree ("date");
  CREATE INDEX "post_analytics_updated_at_idx" ON "post_analytics" USING btree ("updated_at");
  CREATE INDEX "post_analytics_created_at_idx" ON "post_analytics" USING btree ("created_at");
  CREATE INDEX "agent_analytics_agent_idx" ON "agent_analytics" USING btree ("agent_id");
  CREATE INDEX "agent_analytics_date_idx" ON "agent_analytics" USING btree ("date");
  CREATE INDEX "agent_analytics_top_post_idx" ON "agent_analytics" USING btree ("top_post_id");
  CREATE INDEX "agent_analytics_updated_at_idx" ON "agent_analytics" USING btree ("updated_at");
  CREATE INDEX "agent_analytics_created_at_idx" ON "agent_analytics" USING btree ("created_at");
  CREATE UNIQUE INDEX "network_analytics_date_idx" ON "network_analytics" USING btree ("date");
  CREATE INDEX "network_analytics_updated_at_idx" ON "network_analytics" USING btree ("updated_at");
  CREATE INDEX "network_analytics_created_at_idx" ON "network_analytics" USING btree ("created_at");
  CREATE INDEX "conversion_funnels_session_id_idx" ON "conversion_funnels" USING btree ("session_id");
  CREATE INDEX "conversion_funnels_first_post_idx" ON "conversion_funnels" USING btree ("first_post_id");
  CREATE INDEX "conversion_funnels_last_post_idx" ON "conversion_funnels" USING btree ("last_post_id");
  CREATE INDEX "conversion_funnels_tenant_idx" ON "conversion_funnels" USING btree ("tenant_id");
  CREATE INDEX "conversion_funnels_agent_idx" ON "conversion_funnels" USING btree ("agent_id");
  CREATE INDEX "conversion_funnels_updated_at_idx" ON "conversion_funnels" USING btree ("updated_at");
  CREATE INDEX "conversion_funnels_created_at_idx" ON "conversion_funnels" USING btree ("created_at");
  CREATE INDEX "keyword_rankings_post_idx" ON "keyword_rankings" USING btree ("post_id");
  CREATE INDEX "keyword_rankings_keyword_idx" ON "keyword_rankings" USING btree ("keyword");
  CREATE INDEX "keyword_rankings_date_idx" ON "keyword_rankings" USING btree ("date");
  CREATE INDEX "keyword_rankings_updated_at_idx" ON "keyword_rankings" USING btree ("updated_at");
  CREATE INDEX "keyword_rankings_created_at_idx" ON "keyword_rankings" USING btree ("created_at");
  CREATE INDEX "ab_tests_test_variants_order_idx" ON "ab_tests_test_variants" USING btree ("_order");
  CREATE INDEX "ab_tests_test_variants_parent_id_idx" ON "ab_tests_test_variants" USING btree ("_parent_id");
  CREATE INDEX "ab_tests_updated_at_idx" ON "ab_tests" USING btree ("updated_at");
  CREATE INDEX "ab_tests_created_at_idx" ON "ab_tests" USING btree ("created_at");
  CREATE INDEX "ab_tests_rels_order_idx" ON "ab_tests_rels" USING btree ("order");
  CREATE INDEX "ab_tests_rels_parent_idx" ON "ab_tests_rels" USING btree ("parent_id");
  CREATE INDEX "ab_tests_rels_path_idx" ON "ab_tests_rels" USING btree ("path");
  CREATE INDEX "ab_tests_rels_posts_id_idx" ON "ab_tests_rels" USING btree ("posts_id");
  CREATE INDEX "ab_tests_rels_pages_id_idx" ON "ab_tests_rels" USING btree ("pages_id");
  CREATE INDEX "header_nav_items_dropdown_items_sub_items_order_idx" ON "header_nav_items_dropdown_items_sub_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_dropdown_items_sub_items_parent_id_idx" ON "header_nav_items_dropdown_items_sub_items" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_logo_id_media_id_fk" FOREIGN KEY ("hero_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_logo_id_media_id_fk" FOREIGN KEY ("version_hero_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_primary_tenant_id_tenants_id_fk" FOREIGN KEY ("primary_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_content_template_id_content_templates_id_fk" FOREIGN KEY ("content_template_id") REFERENCES "public"."content_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_target_city_data_id_city_data_id_fk" FOREIGN KEY ("target_city_data_id") REFERENCES "public"."city_data"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_primary_tenant_id_tenants_id_fk" FOREIGN KEY ("version_primary_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_content_template_id_content_templates_id_fk" FOREIGN KEY ("version_content_template_id") REFERENCES "public"."content_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_target_city_data_id_city_data_id_fk" FOREIGN KEY ("version_target_city_data_id") REFERENCES "public"."city_data"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents" ADD CONSTRAINT "agents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "states" ADD CONSTRAINT "states_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "designations" ADD CONSTRAINT "designations_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenant_headers_fk" FOREIGN KEY ("tenant_headers_id") REFERENCES "public"."tenant_headers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenant_footers_fk" FOREIGN KEY ("tenant_footers_id") REFERENCES "public"."tenant_footers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_city_data_fk" FOREIGN KEY ("city_data_id") REFERENCES "public"."city_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_templates_fk" FOREIGN KEY ("content_templates_id") REFERENCES "public"."content_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_events_fk" FOREIGN KEY ("analytics_events_id") REFERENCES "public"."analytics_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_analytics_fk" FOREIGN KEY ("post_analytics_id") REFERENCES "public"."post_analytics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_agent_analytics_fk" FOREIGN KEY ("agent_analytics_id") REFERENCES "public"."agent_analytics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_network_analytics_fk" FOREIGN KEY ("network_analytics_id") REFERENCES "public"."network_analytics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conversion_funnels_fk" FOREIGN KEY ("conversion_funnels_id") REFERENCES "public"."conversion_funnels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_keyword_rankings_fk" FOREIGN KEY ("keyword_rankings_id") REFERENCES "public"."keyword_rankings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ab_tests_fk" FOREIGN KEY ("ab_tests_id") REFERENCES "public"."ab_tests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_logo_idx" ON "pages" USING btree ("hero_logo_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_logo_idx" ON "_pages_v" USING btree ("version_hero_logo_id");
  CREATE INDEX "posts_primary_tenant_idx" ON "posts" USING btree ("primary_tenant_id");
  CREATE INDEX "posts_content_template_idx" ON "posts" USING btree ("content_template_id");
  CREATE INDEX "posts_target_city_data_idx" ON "posts" USING btree ("target_city_data_id");
  CREATE INDEX "_posts_v_version_version_primary_tenant_idx" ON "_posts_v" USING btree ("version_primary_tenant_id");
  CREATE INDEX "_posts_v_version_version_content_template_idx" ON "_posts_v" USING btree ("version_content_template_id");
  CREATE INDEX "_posts_v_version_version_target_city_data_idx" ON "_posts_v" USING btree ("version_target_city_data_id");
  CREATE INDEX "agents_tenant_idx" ON "agents" USING btree ("tenant_id");
  CREATE INDEX "states_seo_seo_image_idx" ON "states" USING btree ("seo_image_id");
  CREATE INDEX "designations_seo_seo_image_idx" ON "designations" USING btree ("seo_image_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_tenant_headers_id_idx" ON "payload_locked_documents_rels" USING btree ("tenant_headers_id");
  CREATE INDEX "payload_locked_documents_rels_tenant_footers_id_idx" ON "payload_locked_documents_rels" USING btree ("tenant_footers_id");
  CREATE INDEX "payload_locked_documents_rels_city_data_id_idx" ON "payload_locked_documents_rels" USING btree ("city_data_id");
  CREATE INDEX "payload_locked_documents_rels_content_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("content_templates_id");
  CREATE INDEX "payload_locked_documents_rels_analytics_events_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_events_id");
  CREATE INDEX "payload_locked_documents_rels_post_analytics_id_idx" ON "payload_locked_documents_rels" USING btree ("post_analytics_id");
  CREATE INDEX "payload_locked_documents_rels_agent_analytics_id_idx" ON "payload_locked_documents_rels" USING btree ("agent_analytics_id");
  CREATE INDEX "payload_locked_documents_rels_network_analytics_id_idx" ON "payload_locked_documents_rels" USING btree ("network_analytics_id");
  CREATE INDEX "payload_locked_documents_rels_conversion_funnels_id_idx" ON "payload_locked_documents_rels" USING btree ("conversion_funnels_id");
  CREATE INDEX "payload_locked_documents_rels_keyword_rankings_id_idx" ON "payload_locked_documents_rels" USING btree ("keyword_rankings_id");
  CREATE INDEX "payload_locked_documents_rels_ab_tests_id_idx" ON "payload_locked_documents_rels" USING btree ("ab_tests_id");
  ALTER TABLE "pages_blocks_agent_blog" DROP COLUMN "show_load_more";
  ALTER TABLE "_pages_v_blocks_agent_blog" DROP COLUMN "show_load_more";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_agent_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_agent_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "agent_gal_imgs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_featured_agents_custom_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_solutions_section_solutions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_solutions_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "svc_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "svcSec" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "feat_test_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "featTest" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_articles_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_articles_sidebar_featured_on_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_articles_sidebar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_mission_vision" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_designation_directory_mr_designations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_designation_directory_ms_designations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_designation_directory" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_california_mr_designations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_california_ms_designations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_california" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video_layout_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video_layout" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_branding_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_presentation_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_agent_gal_imgs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_featured_agents_custom_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_solutions_section_solutions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_solutions_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_svc_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_svcSec_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_feat_test_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_featTest_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_articles_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_articles_sidebar_featured_on_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_articles_sidebar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_mission_vision" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_designation_directory_mr_designations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_designation_directory_ms_designations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_designation_directory" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_california_mr_designations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_california_ms_designations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_california" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_video_layout_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_video_layout" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_branding_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_presentation_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_tenant_seo_overrides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_display_locations_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_display_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_section_overrides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sec_ovr" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tokens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_ovr" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_tenant_seo_overrides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_display_locations_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_display_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_section_overrides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_sec_ovr_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tokens_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tenant_ovr_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_meta_keywords_primary" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_meta_keywords_secondary" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_meta_keywords_geographic" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_meta_keywords_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_meta_json_ld_schema_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_meta_json_ld_area_served" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_meta_json_ld_knows_about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_meta_json_ld_same_as" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_cultural_expertise_languages_spoken" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_cultural_expertise_cultural_specializations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_cultural_expertise_community_involvement" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "states_cities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenants_domains" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_headers_nav_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_headers_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_footers_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_footers_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_footers_legal_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_footers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_footers_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_neighborhoods" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_top_schools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_unique_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_key_employers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_places_of_worship" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_cultural_centers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_ethnic_cuisine" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_cultural_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_languages_spoken" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_demographics_ethnic_breakdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data_community_amenities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "city_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_templates_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_templates_required_city_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "analytics_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_analytics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agent_analytics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "network_analytics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "conversion_funnels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "keyword_rankings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ab_tests_test_variants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ab_tests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ab_tests_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_dropdown_items_sub_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_legal_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "agent_gal_imgs" CASCADE;
  DROP TABLE "pages_blocks_featured_agents_custom_members" CASCADE;
  DROP TABLE "pages_blocks_about_section" CASCADE;
  DROP TABLE "pages_blocks_solutions_section_solutions" CASCADE;
  DROP TABLE "pages_blocks_solutions_section" CASCADE;
  DROP TABLE "svc_items" CASCADE;
  DROP TABLE "svcSec" CASCADE;
  DROP TABLE "feat_test_items" CASCADE;
  DROP TABLE "featTest" CASCADE;
  DROP TABLE "pages_blocks_articles_section" CASCADE;
  DROP TABLE "pages_blocks_articles_sidebar_featured_on_logos" CASCADE;
  DROP TABLE "pages_blocks_articles_sidebar" CASCADE;
  DROP TABLE "pages_blocks_mission_vision" CASCADE;
  DROP TABLE "pages_blocks_designation_directory_mr_designations" CASCADE;
  DROP TABLE "pages_blocks_designation_directory_ms_designations" CASCADE;
  DROP TABLE "pages_blocks_designation_directory" CASCADE;
  DROP TABLE "pages_blocks_california_mr_designations" CASCADE;
  DROP TABLE "pages_blocks_california_ms_designations" CASCADE;
  DROP TABLE "pages_blocks_california" CASCADE;
  DROP TABLE "pages_blocks_video_layout_links" CASCADE;
  DROP TABLE "pages_blocks_video_layout" CASCADE;
  DROP TABLE "pages_blocks_branding_hero" CASCADE;
  DROP TABLE "pages_blocks_presentation_embed" CASCADE;
  DROP TABLE "_agent_gal_imgs_v" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_agents_custom_members" CASCADE;
  DROP TABLE "_pages_v_blocks_about_section" CASCADE;
  DROP TABLE "_pages_v_blocks_solutions_section_solutions" CASCADE;
  DROP TABLE "_pages_v_blocks_solutions_section" CASCADE;
  DROP TABLE "_svc_items_v" CASCADE;
  DROP TABLE "_svcSec_v" CASCADE;
  DROP TABLE "_feat_test_items_v" CASCADE;
  DROP TABLE "_featTest_v" CASCADE;
  DROP TABLE "_pages_v_blocks_articles_section" CASCADE;
  DROP TABLE "_pages_v_blocks_articles_sidebar_featured_on_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_articles_sidebar" CASCADE;
  DROP TABLE "_pages_v_blocks_mission_vision" CASCADE;
  DROP TABLE "_pages_v_blocks_designation_directory_mr_designations" CASCADE;
  DROP TABLE "_pages_v_blocks_designation_directory_ms_designations" CASCADE;
  DROP TABLE "_pages_v_blocks_designation_directory" CASCADE;
  DROP TABLE "_pages_v_blocks_california_mr_designations" CASCADE;
  DROP TABLE "_pages_v_blocks_california_ms_designations" CASCADE;
  DROP TABLE "_pages_v_blocks_california" CASCADE;
  DROP TABLE "_pages_v_blocks_video_layout_links" CASCADE;
  DROP TABLE "_pages_v_blocks_video_layout" CASCADE;
  DROP TABLE "_pages_v_blocks_branding_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_presentation_embed" CASCADE;
  DROP TABLE "posts_tenant_seo_overrides" CASCADE;
  DROP TABLE "posts_display_locations_locations" CASCADE;
  DROP TABLE "posts_display_locations" CASCADE;
  DROP TABLE "posts_section_overrides" CASCADE;
  DROP TABLE "sec_ovr" CASCADE;
  DROP TABLE "tokens" CASCADE;
  DROP TABLE "tenant_ovr" CASCADE;
  DROP TABLE "_posts_v_version_tenant_seo_overrides" CASCADE;
  DROP TABLE "_posts_v_version_display_locations_locations" CASCADE;
  DROP TABLE "_posts_v_version_display_locations" CASCADE;
  DROP TABLE "_posts_v_version_section_overrides" CASCADE;
  DROP TABLE "_sec_ovr_v" CASCADE;
  DROP TABLE "_tokens_v" CASCADE;
  DROP TABLE "_tenant_ovr_v" CASCADE;
  DROP TABLE "agents_meta_keywords_primary" CASCADE;
  DROP TABLE "agents_meta_keywords_secondary" CASCADE;
  DROP TABLE "agents_meta_keywords_geographic" CASCADE;
  DROP TABLE "agents_meta_keywords_services" CASCADE;
  DROP TABLE "agents_meta_json_ld_schema_types" CASCADE;
  DROP TABLE "agents_meta_json_ld_area_served" CASCADE;
  DROP TABLE "agents_meta_json_ld_knows_about" CASCADE;
  DROP TABLE "agents_meta_json_ld_same_as" CASCADE;
  DROP TABLE "agents_cultural_expertise_languages_spoken" CASCADE;
  DROP TABLE "agents_cultural_expertise_cultural_specializations" CASCADE;
  DROP TABLE "agents_cultural_expertise_community_involvement" CASCADE;
  DROP TABLE "states_cities" CASCADE;
  DROP TABLE "tenants_domains" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "tenant_headers_nav_items" CASCADE;
  DROP TABLE "tenant_headers" CASCADE;
  DROP TABLE "tenant_headers_rels" CASCADE;
  DROP TABLE "tenant_footers_columns_links" CASCADE;
  DROP TABLE "tenant_footers_columns" CASCADE;
  DROP TABLE "tenant_footers_legal_links" CASCADE;
  DROP TABLE "tenant_footers" CASCADE;
  DROP TABLE "tenant_footers_rels" CASCADE;
  DROP TABLE "city_data_neighborhoods" CASCADE;
  DROP TABLE "city_data_top_schools" CASCADE;
  DROP TABLE "city_data_unique_facts" CASCADE;
  DROP TABLE "city_data_key_employers" CASCADE;
  DROP TABLE "city_data_places_of_worship" CASCADE;
  DROP TABLE "city_data_cultural_centers" CASCADE;
  DROP TABLE "city_data_ethnic_cuisine" CASCADE;
  DROP TABLE "city_data_cultural_events" CASCADE;
  DROP TABLE "city_data_languages_spoken" CASCADE;
  DROP TABLE "city_data_demographics_ethnic_breakdown" CASCADE;
  DROP TABLE "city_data_community_amenities" CASCADE;
  DROP TABLE "city_data" CASCADE;
  DROP TABLE "content_templates_sections" CASCADE;
  DROP TABLE "content_templates_required_city_data" CASCADE;
  DROP TABLE "content_templates" CASCADE;
  DROP TABLE "analytics_events" CASCADE;
  DROP TABLE "post_analytics" CASCADE;
  DROP TABLE "agent_analytics" CASCADE;
  DROP TABLE "network_analytics" CASCADE;
  DROP TABLE "conversion_funnels" CASCADE;
  DROP TABLE "keyword_rankings" CASCADE;
  DROP TABLE "ab_tests_test_variants" CASCADE;
  DROP TABLE "ab_tests" CASCADE;
  DROP TABLE "ab_tests_rels" CASCADE;
  DROP TABLE "header_nav_items_dropdown_items_sub_items" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_logo_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_logo_id_media_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_primary_tenant_id_tenants_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_content_template_id_content_templates_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_target_city_data_id_city_data_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_primary_tenant_id_tenants_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_content_template_id_content_templates_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_target_city_data_id_city_data_id_fk";
  
  ALTER TABLE "agents" DROP CONSTRAINT "agents_tenant_id_tenants_id_fk";
  
  ALTER TABLE "states" DROP CONSTRAINT "states_seo_image_id_media_id_fk";
  
  ALTER TABLE "designations" DROP CONSTRAINT "designations_seo_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tenants_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tenant_headers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tenant_footers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_city_data_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_content_templates_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_analytics_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_post_analytics_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_agent_analytics_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_network_analytics_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_conversion_funnels_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_keyword_rankings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ab_tests_fk";
  
  ALTER TABLE "pages_blocks_featured_agents" ALTER COLUMN "display_mode" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_featured_agents" ALTER COLUMN "display_mode" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_pages_blocks_featured_agents_display_mode";
  CREATE TYPE "public"."enum_pages_blocks_featured_agents_display_mode" AS ENUM('auto', 'manual', 'designation');
  ALTER TABLE "pages_blocks_featured_agents" ALTER COLUMN "display_mode" SET DEFAULT 'auto'::"public"."enum_pages_blocks_featured_agents_display_mode";
  ALTER TABLE "pages_blocks_featured_agents" ALTER COLUMN "display_mode" SET DATA TYPE "public"."enum_pages_blocks_featured_agents_display_mode" USING "display_mode"::"public"."enum_pages_blocks_featured_agents_display_mode";
  ALTER TABLE "_pages_v_blocks_featured_agents" ALTER COLUMN "display_mode" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_featured_agents" ALTER COLUMN "display_mode" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum__pages_v_blocks_featured_agents_display_mode";
  CREATE TYPE "public"."enum__pages_v_blocks_featured_agents_display_mode" AS ENUM('auto', 'manual', 'designation');
  ALTER TABLE "_pages_v_blocks_featured_agents" ALTER COLUMN "display_mode" SET DEFAULT 'auto'::"public"."enum__pages_v_blocks_featured_agents_display_mode";
  ALTER TABLE "_pages_v_blocks_featured_agents" ALTER COLUMN "display_mode" SET DATA TYPE "public"."enum__pages_v_blocks_featured_agents_display_mode" USING "display_mode"::"public"."enum__pages_v_blocks_featured_agents_display_mode";
  DROP INDEX "pages_hero_hero_logo_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_logo_idx";
  DROP INDEX "posts_primary_tenant_idx";
  DROP INDEX "posts_content_template_idx";
  DROP INDEX "posts_target_city_data_idx";
  DROP INDEX "_posts_v_version_version_primary_tenant_idx";
  DROP INDEX "_posts_v_version_version_content_template_idx";
  DROP INDEX "_posts_v_version_version_target_city_data_idx";
  DROP INDEX "agents_tenant_idx";
  DROP INDEX "states_seo_seo_image_idx";
  DROP INDEX "designations_seo_seo_image_idx";
  DROP INDEX "payload_locked_documents_rels_tenants_id_idx";
  DROP INDEX "payload_locked_documents_rels_tenant_headers_id_idx";
  DROP INDEX "payload_locked_documents_rels_tenant_footers_id_idx";
  DROP INDEX "payload_locked_documents_rels_city_data_id_idx";
  DROP INDEX "payload_locked_documents_rels_content_templates_id_idx";
  DROP INDEX "payload_locked_documents_rels_analytics_events_id_idx";
  DROP INDEX "payload_locked_documents_rels_post_analytics_id_idx";
  DROP INDEX "payload_locked_documents_rels_agent_analytics_id_idx";
  DROP INDEX "payload_locked_documents_rels_network_analytics_id_idx";
  DROP INDEX "payload_locked_documents_rels_conversion_funnels_id_idx";
  DROP INDEX "payload_locked_documents_rels_keyword_rankings_id_idx";
  DROP INDEX "payload_locked_documents_rels_ab_tests_id_idx";
  ALTER TABLE "agents" ALTER COLUMN "profile_photo_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_agent_blog" ADD COLUMN "show_load_more" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_agent_blog" ADD COLUMN "show_load_more" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_agent_gallery_images" ADD CONSTRAINT "pages_blocks_agent_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_agent_gallery_images" ADD CONSTRAINT "pages_blocks_agent_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_agent_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agent_gallery_images" ADD CONSTRAINT "_pages_v_blocks_agent_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agent_gallery_images" ADD CONSTRAINT "_pages_v_blocks_agent_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_agent_gallery"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_agent_gallery_images_order_idx" ON "pages_blocks_agent_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_agent_gallery_images_parent_id_idx" ON "pages_blocks_agent_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_agent_gallery_images_image_idx" ON "pages_blocks_agent_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_agent_gallery_images_order_idx" ON "_pages_v_blocks_agent_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_agent_gallery_images_parent_id_idx" ON "_pages_v_blocks_agent_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_agent_gallery_images_image_idx" ON "_pages_v_blocks_agent_gallery_images" USING btree ("image_id");
  ALTER TABLE "pages_hero_links" DROP COLUMN "link_hover_color";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN "link_hover_color";
  ALTER TABLE "pages_blocks_content_columns" DROP COLUMN "link_hover_color";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "enable_button";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "header_link_type";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "header_link_new_tab";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "header_link_url";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "header_link_label";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "header_link_appearance";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "header_link_hover_color";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "button_style";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "card_border_radius";
  ALTER TABLE "pages_blocks_agent_blog" DROP COLUMN "enable_pagination";
  ALTER TABLE "pages_blocks_agent_blog" DROP COLUMN "posts_per_page";
  ALTER TABLE "pages_blocks_homepage_blog" DROP COLUMN "enable_pagination";
  ALTER TABLE "pages_blocks_homepage_blog" DROP COLUMN "posts_per_page";
  ALTER TABLE "pages_blocks_featured_agents" DROP COLUMN "background_color";
  ALTER TABLE "pages_blocks_featured_agents" DROP COLUMN "eyebrow_color";
  ALTER TABLE "pages" DROP COLUMN "hero_heading_color";
  ALTER TABLE "pages" DROP COLUMN "hero_subtitle_color";
  ALTER TABLE "pages" DROP COLUMN "hero_paragraph_color";
  ALTER TABLE "pages" DROP COLUMN "hero_logo_id";
  ALTER TABLE "_pages_v_version_hero_links" DROP COLUMN "link_hover_color";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN "link_hover_color";
  ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN "link_hover_color";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "subtitle";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "enable_button";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "header_link_type";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "header_link_new_tab";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "header_link_url";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "header_link_label";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "header_link_appearance";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "header_link_hover_color";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "button_style";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "card_border_radius";
  ALTER TABLE "_pages_v_blocks_agent_blog" DROP COLUMN "enable_pagination";
  ALTER TABLE "_pages_v_blocks_agent_blog" DROP COLUMN "posts_per_page";
  ALTER TABLE "_pages_v_blocks_homepage_blog" DROP COLUMN "enable_pagination";
  ALTER TABLE "_pages_v_blocks_homepage_blog" DROP COLUMN "posts_per_page";
  ALTER TABLE "_pages_v_blocks_featured_agents" DROP COLUMN "background_color";
  ALTER TABLE "_pages_v_blocks_featured_agents" DROP COLUMN "eyebrow_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_heading_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_subtitle_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_paragraph_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_logo_id";
  ALTER TABLE "posts" DROP COLUMN "show_on_all_agents";
  ALTER TABLE "posts" DROP COLUMN "primary_tenant_id";
  ALTER TABLE "posts" DROP COLUMN "related_posts_mode";
  ALTER TABLE "posts" DROP COLUMN "is_template";
  ALTER TABLE "posts" DROP COLUMN "city_data_tokens_use_city_name";
  ALTER TABLE "posts" DROP COLUMN "city_data_tokens_use_median_price";
  ALTER TABLE "posts" DROP COLUMN "city_data_tokens_use_price_change";
  ALTER TABLE "posts" DROP COLUMN "city_data_tokens_use_schools";
  ALTER TABLE "posts" DROP COLUMN "city_data_tokens_use_neighborhoods";
  ALTER TABLE "posts" DROP COLUMN "city_data_tokens_use_unique_facts";
  ALTER TABLE "posts" DROP COLUMN "city_data_tokens_use_market_stats";
  ALTER TABLE "posts" DROP COLUMN "template_category";
  ALTER TABLE "posts" DROP COLUMN "use_template";
  ALTER TABLE "posts" DROP COLUMN "content_template_id";
  ALTER TABLE "posts" DROP COLUMN "template_topic";
  ALTER TABLE "posts" DROP COLUMN "target_city_data_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_show_on_all_agents";
  ALTER TABLE "_posts_v" DROP COLUMN "version_primary_tenant_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_related_posts_mode";
  ALTER TABLE "_posts_v" DROP COLUMN "version_is_template";
  ALTER TABLE "_posts_v" DROP COLUMN "version_city_data_tokens_use_city_name";
  ALTER TABLE "_posts_v" DROP COLUMN "version_city_data_tokens_use_median_price";
  ALTER TABLE "_posts_v" DROP COLUMN "version_city_data_tokens_use_price_change";
  ALTER TABLE "_posts_v" DROP COLUMN "version_city_data_tokens_use_schools";
  ALTER TABLE "_posts_v" DROP COLUMN "version_city_data_tokens_use_neighborhoods";
  ALTER TABLE "_posts_v" DROP COLUMN "version_city_data_tokens_use_unique_facts";
  ALTER TABLE "_posts_v" DROP COLUMN "version_city_data_tokens_use_market_stats";
  ALTER TABLE "_posts_v" DROP COLUMN "version_template_category";
  ALTER TABLE "_posts_v" DROP COLUMN "version_use_template";
  ALTER TABLE "_posts_v" DROP COLUMN "version_content_template_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_template_topic";
  ALTER TABLE "_posts_v" DROP COLUMN "version_target_city_data_id";
  ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
  ALTER TABLE "users" DROP COLUMN "api_key";
  ALTER TABLE "users" DROP COLUMN "api_key_index";
  ALTER TABLE "agents" DROP COLUMN "website";
  ALTER TABLE "agents" DROP COLUMN "meta_json_ld_enabled";
  ALTER TABLE "agents" DROP COLUMN "meta_json_ld_geo_coordinates_latitude";
  ALTER TABLE "agents" DROP COLUMN "meta_json_ld_geo_coordinates_longitude";
  ALTER TABLE "agents" DROP COLUMN "meta_json_ld_price_range";
  ALTER TABLE "agents" DROP COLUMN "meta_json_ld_aggregate_rating_rating_value";
  ALTER TABLE "agents" DROP COLUMN "meta_json_ld_aggregate_rating_review_count";
  ALTER TABLE "agents" DROP COLUMN "meta_json_ld_aggregate_rating_best_rating";
  ALTER TABLE "agents" DROP COLUMN "tenant_id";
  ALTER TABLE "agents" DROP COLUMN "designation_prefix";
  ALTER TABLE "agents" DROP COLUMN "full_designation";
  ALTER TABLE "agents" DROP COLUMN "auto_create_tenant";
  ALTER TABLE "agents" DROP COLUMN "designation_city";
  ALTER TABLE "agents" DROP COLUMN "territory_exclusive";
  ALTER TABLE "agents" DROP COLUMN "show_in_directory";
  ALTER TABLE "agents" DROP COLUMN "directory_order";
  ALTER TABLE "agents" DROP COLUMN "json_ld_import_import_method";
  ALTER TABLE "agents" DROP COLUMN "json_ld_import_import_url";
  ALTER TABLE "agents" DROP COLUMN "json_ld_import_raw_json_ld";
  ALTER TABLE "agents" DROP COLUMN "json_ld_import_last_imported";
  ALTER TABLE "agents" DROP COLUMN "json_ld_import_import_source";
  ALTER TABLE "states" DROP COLUMN "featured_video";
  ALTER TABLE "states" DROP COLUMN "agent_count";
  ALTER TABLE "states" DROP COLUMN "show_in_navigation";
  ALTER TABLE "states" DROP COLUMN "navigation_order";
  ALTER TABLE "states" DROP COLUMN "seo_title";
  ALTER TABLE "states" DROP COLUMN "seo_description";
  ALTER TABLE "states" DROP COLUMN "seo_image_id";
  ALTER TABLE "designations" DROP COLUMN "badge_color";
  ALTER TABLE "designations" DROP COLUMN "is_active";
  ALTER TABLE "designations" DROP COLUMN "seo_title";
  ALTER TABLE "designations" DROP COLUMN "seo_description";
  ALTER TABLE "designations" DROP COLUMN "seo_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tenants_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tenant_headers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tenant_footers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "city_data_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "content_templates_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "analytics_events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "post_analytics_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "agent_analytics_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "network_analytics_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "conversion_funnels_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "keyword_rankings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ab_tests_id";
  ALTER TABLE "header_nav_items_dropdown_items" DROP COLUMN "has_submenu";
  ALTER TABLE "footer" DROP COLUMN "copyright_text";
  ALTER TABLE "footer" DROP COLUMN "social_links_facebook";
  ALTER TABLE "footer" DROP COLUMN "social_links_twitter";
  ALTER TABLE "footer" DROP COLUMN "social_links_instagram";
  ALTER TABLE "footer" DROP COLUMN "social_links_linkedin";
  ALTER TABLE "footer" DROP COLUMN "social_links_youtube";
  ALTER TABLE "footer" DROP COLUMN "social_links_pinterest";
  ALTER TABLE "footer" DROP COLUMN "disclaimer";
  ALTER TABLE "footer" DROP COLUMN "disclaimer_phone";
  DROP TYPE "public"."enum_pages_blocks_services_grid_header_link_type";
  DROP TYPE "public"."enum_pages_blocks_services_grid_header_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_services_grid_button_style";
  DROP TYPE "public"."enum_pages_blocks_about_section_link_type";
  DROP TYPE "public"."enum_pages_blocks_about_section_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_about_section_media_type";
  DROP TYPE "public"."enum_pages_blocks_about_section_image_position";
  DROP TYPE "public"."enum_pages_blocks_solutions_section_link_type";
  DROP TYPE "public"."enum_pages_blocks_solutions_section_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_solutions_section_button_style";
  DROP TYPE "public"."enum_pages_blocks_solutions_section_image_position";
  DROP TYPE "public"."enum_svc_items_service_link_type";
  DROP TYPE "public"."enum_svc_items_service_link_appearance";
  DROP TYPE "public"."enum_svcSec_header_link_type";
  DROP TYPE "public"."enum_svcSec_header_link_appearance";
  DROP TYPE "public"."enum_svcSec_button_style";
  DROP TYPE "public"."enum_svcSec_columns";
  DROP TYPE "public"."enum_featTest_photo_position";
  DROP TYPE "public"."enum_pages_blocks_articles_section_display_mode";
  DROP TYPE "public"."enum_pages_blocks_articles_section_columns";
  DROP TYPE "public"."enum_pages_blocks_articles_sidebar_display_mode";
  DROP TYPE "public"."enum_pages_blocks_articles_sidebar_columns";
  DROP TYPE "public"."enum_pages_blocks_mission_vision_layout";
  DROP TYPE "public"."enum_pages_blocks_mission_vision_mission_icon";
  DROP TYPE "public"."enum_pages_blocks_mission_vision_vision_icon";
  DROP TYPE "public"."enum_pages_blocks_mission_vision_cta_link_type";
  DROP TYPE "public"."enum_pages_blocks_mission_vision_cta_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_video_layout_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_video_layout_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_branding_hero_heading_size";
  DROP TYPE "public"."enum_pages_blocks_branding_hero_cta_link_type";
  DROP TYPE "public"."enum_pages_blocks_branding_hero_cta_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_presentation_embed_aspect_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_header_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_header_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_button_style";
  DROP TYPE "public"."enum__pages_v_blocks_about_section_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_about_section_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_about_section_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_about_section_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_solutions_section_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_solutions_section_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_solutions_section_button_style";
  DROP TYPE "public"."enum__pages_v_blocks_solutions_section_image_position";
  DROP TYPE "public"."enum__svc_items_v_service_link_type";
  DROP TYPE "public"."enum__svc_items_v_service_link_appearance";
  DROP TYPE "public"."enum__svcSec_v_header_link_type";
  DROP TYPE "public"."enum__svcSec_v_header_link_appearance";
  DROP TYPE "public"."enum__svcSec_v_button_style";
  DROP TYPE "public"."enum__svcSec_v_columns";
  DROP TYPE "public"."enum__featTest_v_photo_position";
  DROP TYPE "public"."enum__pages_v_blocks_articles_section_display_mode";
  DROP TYPE "public"."enum__pages_v_blocks_articles_section_columns";
  DROP TYPE "public"."enum__pages_v_blocks_articles_sidebar_display_mode";
  DROP TYPE "public"."enum__pages_v_blocks_articles_sidebar_columns";
  DROP TYPE "public"."enum__pages_v_blocks_mission_vision_layout";
  DROP TYPE "public"."enum__pages_v_blocks_mission_vision_mission_icon";
  DROP TYPE "public"."enum__pages_v_blocks_mission_vision_vision_icon";
  DROP TYPE "public"."enum__pages_v_blocks_mission_vision_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_mission_vision_cta_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_video_layout_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_video_layout_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_branding_hero_heading_size";
  DROP TYPE "public"."enum__pages_v_blocks_branding_hero_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_branding_hero_cta_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_presentation_embed_aspect_ratio";
  DROP TYPE "public"."enum_posts_display_locations_locations";
  DROP TYPE "public"."enum_posts_section_overrides_section_id";
  DROP TYPE "public"."enum_posts_section_overrides_override_type";
  DROP TYPE "public"."enum_sec_ovr_sec_id";
  DROP TYPE "public"."enum_sec_ovr_type";
  DROP TYPE "public"."enum_posts_related_posts_mode";
  DROP TYPE "public"."enum_posts_template_category";
  DROP TYPE "public"."enum__posts_v_version_display_locations_locations";
  DROP TYPE "public"."enum__posts_v_version_section_overrides_section_id";
  DROP TYPE "public"."enum__posts_v_version_section_overrides_override_type";
  DROP TYPE "public"."enum__sec_ovr_v_sec_id";
  DROP TYPE "public"."enum__sec_ovr_v_type";
  DROP TYPE "public"."enum__posts_v_version_related_posts_mode";
  DROP TYPE "public"."enum__posts_v_version_template_category";
  DROP TYPE "public"."enum_agents_meta_json_ld_schema_types";
  DROP TYPE "public"."enum_agents_meta_json_ld_area_served_type";
  DROP TYPE "public"."enum_agents_cultural_expertise_languages_spoken_proficiency";
  DROP TYPE "public"."enum_agents_designation_prefix";
  DROP TYPE "public"."enum_agents_json_ld_import_import_method";
  DROP TYPE "public"."enum_tenants_type";
  DROP TYPE "public"."enum_tenants_status";
  DROP TYPE "public"."enum_tenant_headers_nav_items_link_type";
  DROP TYPE "public"."enum_tenant_headers_cta_button_link_type";
  DROP TYPE "public"."enum_tenant_headers_cta_button_style";
  DROP TYPE "public"."enum_tenant_footers_columns_links_link_type";
  DROP TYPE "public"."enum_tenant_footers_legal_links_link_type";
  DROP TYPE "public"."enum_city_data_top_schools_type";
  DROP TYPE "public"."enum_city_data_places_of_worship_religion";
  DROP TYPE "public"."enum_city_data_cultural_centers_type";
  DROP TYPE "public"."enum_city_data_community_amenities_type";
  DROP TYPE "public"."enum_city_data_region";
  DROP TYPE "public"."enum_city_data_inventory_level";
  DROP TYPE "public"."enum_city_data_market_trend";
  DROP TYPE "public"."enum_city_data_data_source";
  DROP TYPE "public"."enum_content_templates_sections_section_type";
  DROP TYPE "public"."enum_content_templates_sections_generator";
  DROP TYPE "public"."enum_content_templates_required_city_data";
  DROP TYPE "public"."enum_content_templates_category";
  DROP TYPE "public"."enum_content_templates_target_city_tier";
  DROP TYPE "public"."enum_analytics_events_event";
  DROP TYPE "public"."enum_analytics_events_device_type";
  DROP TYPE "public"."enum_keyword_rankings_search_engine";
  DROP TYPE "public"."enum_keyword_rankings_device";
  DROP TYPE "public"."enum_ab_tests_status";
  DROP TYPE "public"."enum_ab_tests_target_audience";
  DROP TYPE "public"."enum_header_nav_items_dropdown_items_sub_items_link_type";
  DROP TYPE "public"."enum_footer_legal_links_link_type";`)
}
