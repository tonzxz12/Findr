import { z } from 'zod';

// ====== CENTRAL SCHEMA VALIDATIONS ======

// Company validation schemas
export const CompanySchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Company name is required'),
  dbSchema: z.string().min(1, 'Database schema name is required'),
  projectUrl: z.string().url('Must be a valid URL'),
  anonKey: z.string().min(1, 'Anonymous key is required'),
  createdAt: z.date().optional(),
});

export const NewCompanySchema = CompanySchema.omit({ id: true, createdAt: true });

// User validation schemas
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email('Must be a valid email'),
  passwordHash: z.string().min(1, 'Password hash is required'),
  companyId: z.number().positive('Company ID must be positive'),
  role: z.enum(['admin', 'user', 'viewer']).default('user'),
  isActive: z.string().default('true'),
  lastLoginAt: z.date().optional(),
  createdAt: z.date().optional(),
});

export const NewUserSchema = UserSchema.omit({ id: true, createdAt: true, lastLoginAt: true });

// Login/Register schemas
export const LoginSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  company: z.string().min(1, 'Company name is required'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(1, 'Company name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ====== TENANT SCHEMA VALIDATIONS ======

// Project validation schemas
export const ProjectSchema = z.object({
  id: z.number(),
  projectId: z.string().optional(),
  refId: z.string().optional(),
  title: z.string().min(1, 'Project title is required'),
  url: z.string().url('Must be a valid URL'),
  procuringEntity: z.string().optional(),
  areaOfDelivery: z.string().optional(),
  procurementSummary: z.string().optional(),
  keyRequirements: z.string().optional(),
  budgetAbc: z.string().optional(),
  deadline: z.string().optional(),
  aiConfidenceScore: z.number().min(0).max(100).default(0),
  processingMethod: z.enum(['gpt-4o-mini', 'gpt-4o', 'gpt-4', 'claude-3-sonnet', 'claude-3-haiku']).default('gpt-4o-mini'),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).default('completed'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const NewProjectSchema = ProjectSchema.omit({ id: true, createdAt: true, updatedAt: true });

// Bidding document validation schemas
export const BiddingDocumentSchema = z.object({
  id: z.number(),
  projectId: z.number().positive(),
  documentContent: z.string().min(1, 'Document content is required'),
  documentTitle: z.string().optional(),
  documentType: z.enum(['technical_proposal', 'financial_proposal', 'compliance_documents', 'company_profile', 'project_timeline']).optional(),
  generatedBy: z.string().default('gpt-4o-mini'),
  generationPrompt: z.string().optional(),
  documentLength: z.number().optional(),
  generatedAt: z.date().optional(),
  createdAt: z.date().optional(),
});

export const NewBiddingDocumentSchema = BiddingDocumentSchema.omit({ 
  id: true, 
  generatedAt: true, 
  createdAt: true 
});

// Settings validation schemas
export const SettingSchema = z.object({
  id: z.number(),
  settingKey: z.string().min(1, 'Setting key is required'),
  settingValue: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const NewSettingSchema = SettingSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Client validation schemas
export const ClientSchema = z.object({
  id: z.number(),
  clientName: z.string().min(1, 'Client name is required'),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  companyType: z.enum(['government', 'private', 'ngo', 'cooperative']).optional(),
  registrationNumber: z.string().optional(),
  isActive: z.string().default('true'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const NewClientSchema = ClientSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// AI Job validation schemas
export const AiJobSchema = z.object({
  id: z.number(),
  projectId: z.number().positive(),
  jobType: z.enum(['project_analysis', 'document_generation', 'requirement_extraction', 'compliance_check']),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).default('pending'),
  inputData: z.string().optional(), // JSON string
  outputData: z.string().optional(), // JSON string
  errorMessage: z.string().optional(),
  processingMethod: z.enum(['gpt-4o-mini', 'gpt-4o', 'gpt-4', 'claude-3-sonnet', 'claude-3-haiku']).default('gpt-4o-mini'),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date().optional(),
});

export const NewAiJobSchema = AiJobSchema.omit({ 
  id: true, 
  startedAt: true,
  completedAt: true,
  createdAt: true 
});

// ====== API REQUEST/RESPONSE SCHEMAS ======

// Search and filter schemas
export const ProjectFilterSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  procuringEntity: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const DocumentGenerationSchema = z.object({
  projectId: z.number().positive(),
  documentType: z.enum(['technical_proposal', 'financial_proposal', 'compliance_documents']),
  customPrompt: z.string().optional(),
  processingMethod: z.enum(['gpt-4o-mini', 'gpt-4o', 'gpt-4', 'claude-3-sonnet', 'claude-3-haiku']).default('gpt-4o-mini'),
});

// ====== RESPONSE TYPES ======

export const APIResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
});

// Project summary with document count
export const ProjectSummarySchema = z.object({
  id: z.number(),
  projectId: z.string().optional(),
  title: z.string(),
  procuringEntity: z.string().optional(),
  budgetAbc: z.string().optional(),
  deadline: z.string().optional(),
  aiConfidenceScore: z.number(),
  status: z.string(),
  createdAt: z.date(),
  documentCount: z.number(),
});

// Export type definitions
export type CompanyType = z.infer<typeof CompanySchema>;
export type NewCompanyType = z.infer<typeof NewCompanySchema>;
export type UserType = z.infer<typeof UserSchema>;
export type NewUserType = z.infer<typeof NewUserSchema>;
export type LoginType = z.infer<typeof LoginSchema>;
export type RegisterType = z.infer<typeof RegisterSchema>;

export type ProjectType = z.infer<typeof ProjectSchema>;
export type NewProjectType = z.infer<typeof NewProjectSchema>;
export type BiddingDocumentType = z.infer<typeof BiddingDocumentSchema>;
export type NewBiddingDocumentType = z.infer<typeof NewBiddingDocumentSchema>;
export type SettingType = z.infer<typeof SettingSchema>;
export type NewSettingType = z.infer<typeof NewSettingSchema>;
export type ClientType = z.infer<typeof ClientSchema>;
export type NewClientType = z.infer<typeof NewClientSchema>;
export type AiJobType = z.infer<typeof AiJobSchema>;
export type NewAiJobType = z.infer<typeof NewAiJobSchema>;

export type ProjectFilterType = z.infer<typeof ProjectFilterSchema>;
export type DocumentGenerationType = z.infer<typeof DocumentGenerationSchema>;
export type APIResponseType = z.infer<typeof APIResponseSchema>;
export type ProjectSummaryType = z.infer<typeof ProjectSummarySchema>;
