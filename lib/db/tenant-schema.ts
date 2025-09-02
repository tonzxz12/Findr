// Tenant Database Schema - PhilGEPS Project Management System
import { pgTable, serial, text, timestamp, bigint, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';

// Projects Table - Stores PhilGEPS project information
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  projectId: text('project_id'), // e.g., "25-08-912"
  refId: text('ref_id'), // PhilGEPS reference ID
  title: text('title').notNull(),
  url: text('url').notNull(),
  procuringEntity: text('procuring_entity'),
  areaOfDelivery: text('area_of_delivery'),
  procurementSummary: text('procurement_summary'),
  keyRequirements: text('key_requirements'),
  budgetAbc: text('budget_abc'),
  deadline: text('deadline'),
  aiConfidenceScore: integer('ai_confidence_score').default(0),
  processingMethod: text('processing_method').default('gpt-4o-mini'),
  status: text('status').default('completed'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  projectIdIdx: index('idx_projects_project_id').on(table.projectId),
  refIdIdx: index('idx_projects_ref_id').on(table.refId),
  procuringEntityIdx: index('idx_projects_procuring_entity').on(table.procuringEntity),
  createdAtIdx: index('idx_projects_created_at').on(table.createdAt),
  tenantIdIdx: index('idx_projects_tenant_id').on(table.tenantId),
}));

// Bidding Documents Table - Stores AI-generated bidding documents
export const biddingDocuments = pgTable('bidding_documents', {
  id: serial('id').primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  projectId: bigint('project_id', { mode: 'number' }).references(() => projects.id, { onDelete: 'cascade' }),
  documentContent: text('document_content').notNull(),
  documentTitle: text('document_title'),
  generatedBy: text('generated_by').default('gpt-4o-mini'),
  generationPrompt: text('generation_prompt'),
  documentLength: integer('document_length'),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  projectIdIdx: index('idx_bidding_documents_project_id').on(table.projectId),
  tenantIdIdx: index('idx_bidding_documents_tenant_id').on(table.tenantId),
  generatedAtIdx: index('idx_bidding_documents_generated_at').on(table.generatedAt),
}));

// Settings Table - Stores tenant-specific configuration
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  settingKey: text('setting_key').notNull(),
  settingValue: text('setting_value'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  settingKeyIdx: index('idx_settings_setting_key').on(table.settingKey),
  tenantIdIdx: index('idx_settings_tenant_id').on(table.tenantId),
  uniqueTenantSetting: uniqueIndex('unique_tenant_setting').on(table.tenantId, table.settingKey),
}));

// Clients Table - Stores client information for each tenant
export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  clientName: text('client_name').notNull(),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  address: text('address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  clientNameIdx: index('idx_clients_client_name').on(table.clientName),
  tenantIdIdx: index('idx_clients_tenant_id').on(table.tenantId),
  contactEmailIdx: index('idx_clients_contact_email').on(table.contactEmail),
}));

// Type definitions for TypeScript
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type BiddingDocument = typeof biddingDocuments.$inferSelect;
export type NewBiddingDocument = typeof biddingDocuments.$inferInsert;

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

// Project status enum
export const ProjectStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type ProjectStatusType = typeof ProjectStatus[keyof typeof ProjectStatus];

// Processing method enum
export const ProcessingMethod = {
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_4O: 'gpt-4o',
  GPT_4: 'gpt-4',
  CLAUDE_3_SONNET: 'claude-3-sonnet',
  CLAUDE_3_HAIKU: 'claude-3-haiku',
} as const;

export type ProcessingMethodType = typeof ProcessingMethod[keyof typeof ProcessingMethod];
