// Unified Database Schema - Central + Multi-Tenant in Single Database
import { pgTable, serial, text, timestamp, bigint, integer, index, uniqueIndex, pgSchema } from 'drizzle-orm/pg-core';

// ====== CENTRAL SCHEMA - Authentication & Company Management ======

// Central schema for authentication and company management
export const centralSchema = pgSchema('central');

// Companies Table - Stores tenant company information
const companies = centralSchema.table('companies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  dbSchema: text('db_schema').notNull().unique(), // Schema name for this tenant (e.g., 'tenant_company1')
  projectUrl: text('project_url').notNull(),
  anonKey: text('anon_key').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  nameIdx: index('idx_companies_name').on(table.name),
  dbSchemaIdx: index('idx_companies_db_schema').on(table.dbSchema),
}));

// Users Table - Stores user authentication information
const users = centralSchema.table('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  companyId: bigint('company_id', { mode: 'number' }).references(() => companies.id, { onDelete: 'cascade' }),
  role: text('role').default('user'), // 'admin', 'user', 'viewer'
  isActive: text('is_active').default('true'),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  companyIdIdx: index('idx_users_company_id').on(table.companyId),
  roleIdx: index('idx_users_role').on(table.role),
}));

// ====== TENANT SCHEMA FACTORY - Creates schemas for each tenant ======

// Function to create tenant-specific schema
export function createTenantSchema(schemaName: string) {
  const tenantSchema = pgSchema(schemaName);

  // Projects Table - Stores PhilGEPS project information
  const projects = tenantSchema.table('projects', {
    id: serial('id').primaryKey(),
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
    projectIdIdx: index(`idx_${schemaName}_projects_project_id`).on(table.projectId),
    refIdIdx: index(`idx_${schemaName}_projects_ref_id`).on(table.refId),
    procuringEntityIdx: index(`idx_${schemaName}_projects_procuring_entity`).on(table.procuringEntity),
    createdAtIdx: index(`idx_${schemaName}_projects_created_at`).on(table.createdAt),
    statusIdx: index(`idx_${schemaName}_projects_status`).on(table.status),
  }));

  // Bidding Documents Table - Stores AI-generated bidding documents
  const biddingDocuments = tenantSchema.table('bidding_documents', {
    id: serial('id').primaryKey(),
    projectId: bigint('project_id', { mode: 'number' }).references(() => projects.id, { onDelete: 'cascade' }),
    documentContent: text('document_content').notNull(),
    documentTitle: text('document_title'),
    documentType: text('document_type'), // 'technical_proposal', 'financial_proposal', 'compliance_documents'
    generatedBy: text('generated_by').default('gpt-4o-mini'),
    generationPrompt: text('generation_prompt'),
    documentLength: integer('document_length'),
    generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  }, (table) => ({
    projectIdIdx: index(`idx_${schemaName}_bidding_documents_project_id`).on(table.projectId),
    generatedAtIdx: index(`idx_${schemaName}_bidding_documents_generated_at`).on(table.generatedAt),
    documentTypeIdx: index(`idx_${schemaName}_bidding_documents_document_type`).on(table.documentType),
  }));

  // Settings Table - Stores tenant-specific configuration
  const settings = tenantSchema.table('settings', {
    id: serial('id').primaryKey(),
    settingKey: text('setting_key').notNull(),
    settingValue: text('setting_value'),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  }, (table) => ({
    settingKeyIdx: index(`idx_${schemaName}_settings_setting_key`).on(table.settingKey),
    uniqueSettingKey: uniqueIndex(`unique_${schemaName}_setting_key`).on(table.settingKey),
  }));

  // Clients Table - Stores client information
  const clients = tenantSchema.table('clients', {
    id: serial('id').primaryKey(),
    clientName: text('client_name').notNull(),
    contactEmail: text('contact_email'),
    contactPhone: text('contact_phone'),
    address: text('address'),
    companyType: text('company_type'), // 'government', 'private', 'ngo'
    registrationNumber: text('registration_number'),
    isActive: text('is_active').default('true'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  }, (table) => ({
    clientNameIdx: index(`idx_${schemaName}_clients_client_name`).on(table.clientName),
    contactEmailIdx: index(`idx_${schemaName}_clients_contact_email`).on(table.contactEmail),
    companyTypeIdx: index(`idx_${schemaName}_clients_company_type`).on(table.companyType),
  }));

  // AI Processing Jobs Table - Tracks AI processing tasks
  const aiJobs = tenantSchema.table('ai_jobs', {
    id: serial('id').primaryKey(),
    projectId: bigint('project_id', { mode: 'number' }).references(() => projects.id, { onDelete: 'cascade' }),
    jobType: text('job_type').notNull(), // 'project_analysis', 'document_generation', 'requirement_extraction'
    status: text('status').default('pending'), // 'pending', 'processing', 'completed', 'failed'
    inputData: text('input_data'), // JSON string of input parameters
    outputData: text('output_data'), // JSON string of results
    errorMessage: text('error_message'),
    processingMethod: text('processing_method').default('gpt-4o-mini'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  }, (table) => ({
    projectIdIdx: index(`idx_${schemaName}_ai_jobs_project_id`).on(table.projectId),
    statusIdx: index(`idx_${schemaName}_ai_jobs_status`).on(table.status),
    jobTypeIdx: index(`idx_${schemaName}_ai_jobs_job_type`).on(table.jobType),
    createdAtIdx: index(`idx_${schemaName}_ai_jobs_created_at`).on(table.createdAt),
  }));

  return {
    schema: tenantSchema,
    projects,
    biddingDocuments,
    settings,
    clients,
    aiJobs,
  };
}

// ====== TYPE DEFINITIONS ======

// Central schema types
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Tenant schema types (generic - works for any tenant)
export type Project = ReturnType<typeof createTenantSchema>['projects']['$inferSelect'];
export type NewProject = ReturnType<typeof createTenantSchema>['projects']['$inferInsert'];
export type BiddingDocument = ReturnType<typeof createTenantSchema>['biddingDocuments']['$inferSelect'];
export type NewBiddingDocument = ReturnType<typeof createTenantSchema>['biddingDocuments']['$inferInsert'];
export type Setting = ReturnType<typeof createTenantSchema>['settings']['$inferSelect'];
export type NewSetting = ReturnType<typeof createTenantSchema>['settings']['$inferInsert'];
export type Client = ReturnType<typeof createTenantSchema>['clients']['$inferSelect'];
export type NewClient = ReturnType<typeof createTenantSchema>['clients']['$inferInsert'];
export type AiJob = ReturnType<typeof createTenantSchema>['aiJobs']['$inferSelect'];
export type NewAiJob = ReturnType<typeof createTenantSchema>['aiJobs']['$inferInsert'];

// ====== ENUMS AND CONSTANTS ======

// User roles
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Project status
export const ProjectStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type ProjectStatusType = typeof ProjectStatus[keyof typeof ProjectStatus];

// Document types
export const DocumentType = {
  TECHNICAL_PROPOSAL: 'technical_proposal',
  FINANCIAL_PROPOSAL: 'financial_proposal',
  COMPLIANCE_DOCUMENTS: 'compliance_documents',
  COMPANY_PROFILE: 'company_profile',
  PROJECT_TIMELINE: 'project_timeline',
} as const;

export type DocumentTypeType = typeof DocumentType[keyof typeof DocumentType];

// AI Processing methods
export const ProcessingMethod = {
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_4O: 'gpt-4o',
  GPT_4: 'gpt-4',
  CLAUDE_3_SONNET: 'claude-3-sonnet',
  CLAUDE_3_HAIKU: 'claude-3-haiku',
} as const;

export type ProcessingMethodType = typeof ProcessingMethod[keyof typeof ProcessingMethod];

// AI Job types
export const AiJobType = {
  PROJECT_ANALYSIS: 'project_analysis',
  DOCUMENT_GENERATION: 'document_generation',
  REQUIREMENT_EXTRACTION: 'requirement_extraction',
  COMPLIANCE_CHECK: 'compliance_check',
} as const;

export type AiJobTypeType = typeof AiJobType[keyof typeof AiJobType];

// Job status
export const JobStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type JobStatusType = typeof JobStatus[keyof typeof JobStatus];

// Client company types
export const CompanyType = {
  GOVERNMENT: 'government',
  PRIVATE: 'private',
  NGO: 'ngo',
  COOPERATIVE: 'cooperative',
} as const;

export type CompanyTypeType = typeof CompanyType[keyof typeof CompanyType];

// ====== SCHEMA MANAGEMENT UTILITIES ======

// Helper to get tenant schema name from company
export function getTenantSchemaName(companyName: string): string {
  // Convert company name to valid schema name
  return `tenant_${companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')}`;
}

// Helper to validate schema name
export function isValidSchemaName(schemaName: string): boolean {
  return /^[a-z][a-z0-9_]*$/.test(schemaName) && schemaName.length <= 63;
}

// Pre-defined tenant schemas for common use cases
export const commonTenantSchemas = {
  // You can pre-create schemas for known tenants
  sample: createTenantSchema('tenant_sample'),
  demo: createTenantSchema('tenant_demo'),
};

// Export central schema tables
export { companies, users };
