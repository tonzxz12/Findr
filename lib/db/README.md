# QFindr App - Unified Database Schema

This document describes the unified database schema for the QFindr application, designed as a **single database with multi-tenant architecture**.

## Overview

The application uses a **unified multi-tenant architecture** with:

1. **Central Schema** (`central`) - Manages companies and users across all tenants
2. **Dynamic Tenant Schemas** (`tenant_*`) - Each company gets its own schema with identical structure

## Architecture Benefits

- ✅ **Single Database** - Easier management and deployment
- ✅ **Complete Data Isolation** - Each tenant has their own schema
- ✅ **Shared Authentication** - Central user management
- ✅ **Scalable** - Unlimited tenants without database proliferation
- ✅ **Type Safe** - Full TypeScript support with Drizzle ORM

## Central Schema (`central`)

### Tables

#### `companies`
Stores information about tenant companies.

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `name` | TEXT | Company name (unique) |
| `db_schema` | TEXT | Schema name for tenant (e.g., 'tenant_company1') |
| `project_url` | TEXT | Supabase project URL |
| `anon_key` | TEXT | Supabase anonymous key |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

#### `users`
Stores user authentication information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `email` | TEXT | User email (unique) |
| `password_hash` | TEXT | Hashed password |
| `company_id` | BIGINT | Reference to companies table |
| `role` | TEXT | User role ('admin', 'user', 'viewer') |
| `is_active` | TEXT | Account status |
| `last_login_at` | TIMESTAMPTZ | Last login timestamp |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

## Tenant Schema Template (`tenant_*`)

Each tenant gets an identical schema with these tables:

### Tables

#### `projects`
Stores PhilGEPS project information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `project_id` | TEXT | PhilGEPS project ID (e.g., "25-08-912") |
| `ref_id` | TEXT | PhilGEPS reference ID |
| `title` | TEXT | Project title |
| `url` | TEXT | Project URL |
| `procuring_entity` | TEXT | Government entity |
| `area_of_delivery` | TEXT | Delivery location |
| `procurement_summary` | TEXT | Project summary |
| `key_requirements` | TEXT | Key requirements |
| `budget_abc` | TEXT | Approved budget for contract |
| `deadline` | TEXT | Submission deadline |
| `ai_confidence_score` | INTEGER | AI processing confidence (0-100) |
| `processing_method` | TEXT | AI model used |
| `status` | TEXT | Processing status |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

#### `bidding_documents`
Stores AI-generated bidding documents.

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `project_id` | BIGINT | Reference to projects table |
| `document_content` | TEXT | Generated document content |
| `document_title` | TEXT | Document title |
| `document_type` | TEXT | Document type |
| `generated_by` | TEXT | AI model used for generation |
| `generation_prompt` | TEXT | Prompt used for generation |
| `document_length` | INTEGER | Character count |
| `generated_at` | TIMESTAMPTZ | Generation timestamp |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

#### `settings`
Stores tenant-specific configuration.

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `setting_key` | TEXT | Setting name (unique per tenant) |
| `setting_value` | TEXT | Setting value |
| `description` | TEXT | Setting description |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

#### `clients`
Stores client information for each tenant.

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `client_name` | TEXT | Client name |
| `contact_email` | TEXT | Client email |
| `contact_phone` | TEXT | Client phone |
| `address` | TEXT | Client address |
| `company_type` | TEXT | Type of company |
| `registration_number` | TEXT | Business registration number |
| `is_active` | TEXT | Client status |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

#### `ai_jobs`
Tracks AI processing tasks and their status.

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `project_id` | BIGINT | Reference to projects table |
| `job_type` | TEXT | Type of AI job |
| `status` | TEXT | Job status |
| `input_data` | TEXT | Input parameters (JSON) |
| `output_data` | TEXT | Results (JSON) |
| `error_message` | TEXT | Error details if failed |
| `processing_method` | TEXT | AI model used |
| `started_at` | TIMESTAMPTZ | Job start time |
| `completed_at` | TIMESTAMPTZ | Job completion time |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

## File Structure

```
lib/db/
├── unified-schema.ts          # Complete unified schema with factory functions
├── index.ts                   # Database connections and exports
├── queries.ts                 # Database operations (factories for each tenant)
├── validations.ts             # Zod validation schemas
├── README.md                  # This documentation
└── migrations/
    └── 0001_unified_schema.sql # Complete database setup
```

## Usage

### 1. Database Setup

Run the unified migration:

```sql
-- Execute the migration file
\i lib/db/migrations/0001_unified_schema.sql
```

### 2. Creating New Tenants

```sql
-- Add company
INSERT INTO central.companies (name, db_schema, project_url, anon_key) 
VALUES ('New Company', 'tenant_new_company', 'https://...', 'key...');

-- Create tenant schema
SELECT create_tenant_schema('tenant_new_company');
```

### 3. Application Usage

```typescript
import { createTenantOperations, companyOperations } from '@/lib/db/queries';

// Work with central data
const companies = await companyOperations.list();

// Work with tenant-specific data
const tenantOps = createTenantOperations('New Company');
const projects = await tenantOps.projects.list();
const documents = await tenantOps.documents.getByProject(projectId);
```

### 4. Schema Factory

```typescript
import { createTenantSchema, getTenantSchemaName } from '@/lib/db/unified-schema';

// Create schema for a company
const companySchema = createTenantSchema('tenant_construction_corp');
const { projects, biddingDocuments, settings, clients, aiJobs } = companySchema;
```

### 5. Type Safety

```typescript
import type { Project, NewProject, Company } from '@/lib/db/unified-schema';

// All operations are fully typed
const newProject: NewProject = {
  title: "Road Construction",
  url: "https://philgeps.gov.ph/project/123",
  // TypeScript ensures all required fields
};
```

## Multi-Tenant Flow

1. **Company Registration**: Add to `central.companies`
2. **Schema Creation**: Call `create_tenant_schema(schema_name)`
3. **User Creation**: Add users to `central.users` with `company_id`
4. **Data Isolation**: Each company's data lives in their own schema
5. **Operations**: Use factory functions to work with tenant-specific data

## Security Features

- **Row-Level Security** enabled on all tables
- **Data Isolation** through separate schemas
- **Password Hashing** for user authentication
- **Role-Based Access** (admin, user, viewer)
- **Active Status** tracking for users and clients

## Benefits Over Separate Databases

1. **Simpler Management** - One database to maintain
2. **Easier Backups** - Single backup strategy
3. **Better Resource Usage** - Shared connection pooling
4. **Cross-Tenant Analytics** - Possible when needed
5. **Unified Monitoring** - Single database to monitor

## API Integration

The schema is designed to work seamlessly with:
- Next.js API routes
- Drizzle ORM operations
- Type-safe database queries
- Multi-tenant context switching

This unified approach provides enterprise-grade multi-tenancy while maintaining simplicity and type safety throughout your application.
