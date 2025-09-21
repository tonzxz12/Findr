CREATE TABLE "client_repositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"item_name" text NOT NULL,
	"category" text,
	"subtype" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"vendor" text,
	"model" text,
	"version" text,
	"firmware" text,
	"environment" text,
	"status" text DEFAULT 'active',
	"location" text,
	"serial_number" text,
	"asset_tag" text,
	"purchase_date" date,
	"warranty_expiry" date,
	"spec" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"integrations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"licenses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"contacts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"compliance" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"keywords" text[] DEFAULT '{}' NOT NULL,
	"owner_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"file_url" text,
	"filename" text,
	"mime_type" text,
	"size_bytes" bigint,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"uploaded_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"publish_at" timestamp with time zone,
	"closing_at" timestamp with time zone,
	"title" text,
	"reference_number" text,
	"procuring_entity" text,
	"philgeps_title" text,
	"area_of_delivery" text,
	"solicitation_number" text,
	"trade_agreement" text,
	"procurement_mode" text,
	"classification" text,
	"category" text,
	"abc" numeric(14, 2),
	"delivery_period" text,
	"bid_supplements" jsonb DEFAULT '[]'::jsonb,
	"document_request_list" jsonb DEFAULT '[]'::jsonb,
	"date_published" timestamp with time zone,
	"last_updated_at" timestamp with time zone,
	"parsed_closing_at" timestamp with time zone,
	"description" text,
	"prebid_conferences" jsonb DEFAULT '[]'::jsonb,
	"prebid_first_date" date,
	"prebid_first_time" time,
	"prebid_first_venue" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid,
	"email" text NOT NULL,
	"password_hash" text,
	"full_name" text,
	"phone" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
