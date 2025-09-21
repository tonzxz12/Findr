import { pgTable, index, unique, uuid, text, boolean, timestamp, foreignKey, check, date, jsonb, numeric, time, bigint, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const userRole = pgEnum("user_role", ['admin', 'client'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	passwordHash: text("password_hash"),
	fullName: text("full_name"),
	phone: text(),
	role: userRole().default('client').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	lastLoginAt: timestamp("last_login_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_users_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("idx_users_email_trgm").using("gin", table.email.asc().nullsLast().op("gin_trgm_ops")),
	index("idx_users_role").using("btree", table.role.asc().nullsLast().op("enum_ops")),
	unique("users_email_key").on(table.email),
]);

export const clients = pgTable("clients", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyName: text("company_name").notNull(),
	keywords: text().array().default([""]).notNull(),
	ownerUserId: uuid("owner_user_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_clients_company_name_trgm").using("gin", table.companyName.asc().nullsLast().op("gin_trgm_ops")),
	index("idx_clients_keywords_gin").using("gin", table.keywords.asc().nullsLast().op("array_ops")),
	index("idx_clients_owner_user_id").using("btree", table.ownerUserId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ownerUserId],
			foreignColumns: [users.id],
			name: "clients_owner_user_id_fkey"
		}).onDelete("set null"),
]);

export const clientRepositories = pgTable("client_repositories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clientId: uuid("client_id").notNull(),
	itemName: text("item_name").notNull(),
	category: text(),
	subtype: text(),
	tags: text().array().default([""]).notNull(),
	vendor: text(),
	model: text(),
	version: text(),
	firmware: text(),
	environment: text(),
	status: text().default('active'),
	location: text(),
	serialNumber: text("serial_number"),
	assetTag: text("asset_tag"),
	purchaseDate: date("purchase_date"),
	warrantyExpiry: date("warranty_expiry"),
	spec: jsonb().default({}).notNull(),
	integrations: jsonb().default([]).notNull(),
	licenses: jsonb().default([]).notNull(),
	contacts: jsonb().default([]).notNull(),
	compliance: jsonb().default([]).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_client_repos_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("idx_client_repos_client_id").using("btree", table.clientId.asc().nullsLast().op("uuid_ops")),
	index("idx_client_repos_env").using("btree", table.environment.asc().nullsLast().op("text_ops")),
	index("idx_client_repos_item_trgm").using("gin", table.itemName.asc().nullsLast().op("gin_trgm_ops")),
	index("idx_client_repos_model").using("btree", table.model.asc().nullsLast().op("text_ops")),
	index("idx_client_repos_spec_gin").using("gin", table.spec.asc().nullsLast().op("jsonb_ops")),
	index("idx_client_repos_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_client_repos_subtype").using("btree", table.subtype.asc().nullsLast().op("text_ops")),
	index("idx_client_repos_tags_gin").using("gin", table.tags.asc().nullsLast().op("array_ops")),
	index("idx_client_repos_vendor").using("btree", table.vendor.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "client_repositories_client_id_fkey"
		}).onDelete("cascade"),
	check("chk_repo_compliance_array", sql`jsonb_typeof(compliance) = 'array'::text`),
	check("chk_repo_contacts_array", sql`jsonb_typeof(contacts) = 'array'::text`),
	check("chk_repo_env_valid", sql`(environment IS NULL) OR (lower(environment) = ANY (ARRAY['prod'::text, 'staging'::text, 'test'::text, 'dev'::text, 'dr'::text, 'sandbox'::text]))`),
	check("chk_repo_integrations_array", sql`jsonb_typeof(integrations) = 'array'::text`),
	check("chk_repo_licenses_array", sql`jsonb_typeof(licenses) = 'array'::text`),
	check("chk_repo_spec_object", sql`jsonb_typeof(spec) = 'object'::text`),
	check("chk_repo_status_valid", sql`(status IS NULL) OR (lower(status) = ANY (ARRAY['active'::text, 'planned'::text, 'deprecated'::text, 'retired'::text]))`),
]);

export const projects = pgTable("projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clientId: uuid("client_id").notNull(),
	publishAt: timestamp("publish_at", { withTimezone: true, mode: 'string' }),
	closingAt: timestamp("closing_at", { withTimezone: true, mode: 'string' }),
	title: text(),
	referenceNumber: text("reference_number"),
	procuringEntity: text("procuring_entity"),
	philgepsTitle: text("philgeps_title"),
	areaOfDelivery: text("area_of_delivery"),
	solicitationNumber: text("solicitation_number"),
	tradeAgreement: text("trade_agreement"),
	procurementMode: text("procurement_mode"),
	classification: text(),
	category: text(),
	abc: numeric({ precision: 14, scale:  2 }),
	deliveryPeriod: text("delivery_period"),
	bidSupplements: jsonb("bid_supplements").default([]),
	documentRequestList: jsonb("document_request_list").default([]),
	datePublished: timestamp("date_published", { withTimezone: true, mode: 'string' }),
	lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true, mode: 'string' }),
	parsedClosingAt: timestamp("parsed_closing_at", { withTimezone: true, mode: 'string' }),
	description: text(),
	prebidConferences: jsonb("prebid_conferences").default([]),
	prebidFirstDate: date("prebid_first_date"),
	prebidFirstTime: time("prebid_first_time"),
	prebidFirstVenue: text("prebid_first_venue"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_projects_bidsupp_gin").using("gin", table.bidSupplements.asc().nullsLast().op("jsonb_ops")),
	index("idx_projects_client_id").using("btree", table.clientId.asc().nullsLast().op("uuid_ops")),
	index("idx_projects_closing_at").using("btree", table.closingAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_projects_docreq_gin").using("gin", table.documentRequestList.asc().nullsLast().op("jsonb_ops")),
	index("idx_projects_parsed_closing_at").using("btree", table.parsedClosingAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_projects_prebid_first_date").using("btree", table.prebidFirstDate.asc().nullsLast().op("date_ops")),
	index("idx_projects_prebid_first_time").using("btree", table.prebidFirstTime.asc().nullsLast().op("time_ops")),
	index("idx_projects_prebid_gin").using("gin", table.prebidConferences.asc().nullsLast().op("jsonb_ops")),
	index("idx_projects_ref_no").using("btree", table.referenceNumber.asc().nullsLast().op("text_ops")),
	index("idx_projects_solicitation_no").using("btree", table.solicitationNumber.asc().nullsLast().op("text_ops")),
	index("idx_projects_title_trgm").using("gin", table.title.asc().nullsLast().op("gin_trgm_ops")),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "projects_client_id_fkey"
		}).onDelete("restrict"),
	check("chk_bid_supplements_array", sql`(bid_supplements IS NULL) OR (jsonb_typeof(bid_supplements) = 'array'::text)`),
	check("chk_docreq_array", sql`(document_request_list IS NULL) OR (jsonb_typeof(document_request_list) = 'array'::text)`),
	check("chk_prebid_array", sql`(prebid_conferences IS NULL) OR (jsonb_typeof(prebid_conferences) = 'array'::text)`),
	check("projects_abc_check", sql`(abc IS NULL) OR (abc >= (0)::numeric)`),
]);

export const projectAttachments = pgTable("project_attachments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	fileUrl: text("file_url"),
	filename: text(),
	mimeType: text("mime_type"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sizeBytes: bigint("size_bytes", { mode: "number" }),
	metadata: jsonb().default({}),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_proj_attachments_mime").using("btree", table.mimeType.asc().nullsLast().op("text_ops")),
	index("idx_proj_attachments_project_id").using("btree", table.projectId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "project_attachments_project_id_fkey"
		}).onDelete("cascade"),
	check("project_attachments_size_bytes_check", sql`(size_bytes IS NULL) OR (size_bytes >= 0)`),
]);
