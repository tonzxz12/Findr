-- Migration: Initial schema setup for QFindr App
-- This file contains the complete database schema based on the n8n multi-tenant structure

-- ====== CENTRAL DATABASE SCHEMA ======

-- Create central schema
CREATE SCHEMA IF NOT EXISTS central;

-- Companies Table - Stores tenant company information
CREATE TABLE IF NOT EXISTS central.companies (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    db_name TEXT NOT NULL UNIQUE, -- This will be the tenant database name
    project_url TEXT NOT NULL,
    anon_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table - Stores user authentication information
CREATE TABLE IF NOT EXISTS central.users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Store hashed password
    company_id BIGINT REFERENCES central.companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for central schema
CREATE INDEX IF NOT EXISTS idx_companies_name ON central.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_db_name ON central.companies(db_name);
CREATE INDEX IF NOT EXISTS idx_users_email ON central.users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON central.users(company_id);

-- Row-Level Security for central schema
ALTER TABLE central.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE central.users ENABLE ROW LEVEL SECURITY;

-- Policies for central schema
DROP POLICY IF EXISTS "Allow all operations on companies" ON central.companies;
CREATE POLICY "Allow all operations on companies" 
    ON central.companies FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on users" ON central.users;
CREATE POLICY "Allow all operations on users" 
    ON central.users FOR ALL USING (true);

-- ====== TENANT DATABASE SCHEMA ======

-- Create tenant schema
CREATE SCHEMA IF NOT EXISTS tenant;

-- Drop existing objects if they exist
DROP VIEW IF EXISTS tenant.projects_with_documents;
DROP VIEW IF EXISTS tenant.project_summary;
DROP TABLE IF EXISTS tenant.bidding_documents;
DROP TABLE IF EXISTS tenant.projects;
DROP TABLE IF EXISTS tenant.settings;
DROP TABLE IF EXISTS tenant.clients;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Projects Table - Stores PhilGEPS project information
CREATE TABLE tenant.projects (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    project_id TEXT, -- e.g., "25-08-912"
    ref_id TEXT, -- PhilGEPS reference ID
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    procuring_entity TEXT,
    area_of_delivery TEXT,
    procurement_summary TEXT,
    key_requirements TEXT,
    budget_abc TEXT,
    deadline TEXT,
    ai_confidence_score INTEGER DEFAULT 0,
    processing_method TEXT DEFAULT 'gpt-4o-mini',
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bidding Documents Table - Stores AI-generated bidding documents
CREATE TABLE tenant.bidding_documents (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    project_id BIGINT REFERENCES tenant.projects(id) ON DELETE CASCADE,
    document_content TEXT NOT NULL,
    document_title TEXT,
    generated_by TEXT DEFAULT 'gpt-4o-mini',
    generation_prompt TEXT,
    document_length INTEGER,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings Table - Stores tenant-specific configuration
CREATE TABLE tenant.settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    setting_key TEXT NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, setting_key)
);

-- Clients Table - Stores client information for each tenant
CREATE TABLE tenant.clients (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    client_name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for tenant schema
CREATE INDEX idx_projects_project_id ON tenant.projects(project_id);
CREATE INDEX idx_projects_ref_id ON tenant.projects(ref_id);
CREATE INDEX idx_projects_procuring_entity ON tenant.projects(procuring_entity);
CREATE INDEX idx_projects_created_at ON tenant.projects(created_at);
CREATE INDEX idx_projects_tenant_id ON tenant.projects(tenant_id);

CREATE INDEX idx_bidding_documents_project_id ON tenant.bidding_documents(project_id);
CREATE INDEX idx_bidding_documents_tenant_id ON tenant.bidding_documents(tenant_id);
CREATE INDEX idx_bidding_documents_generated_at ON tenant.bidding_documents(generated_at);

CREATE INDEX idx_settings_setting_key ON tenant.settings(setting_key);
CREATE INDEX idx_settings_tenant_id ON tenant.settings(tenant_id);

CREATE INDEX idx_clients_client_name ON tenant.clients(client_name);
CREATE INDEX idx_clients_tenant_id ON tenant.clients(tenant_id);
CREATE INDEX idx_clients_contact_email ON tenant.clients(contact_email);

-- Row-Level Security for tenant schema
ALTER TABLE tenant.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant.bidding_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant.clients ENABLE ROW LEVEL SECURITY;

-- Policies for tenant schema
CREATE POLICY "Allow all operations on projects" 
    ON tenant.projects FOR ALL USING (true);

CREATE POLICY "Allow all operations on bidding_documents" 
    ON tenant.bidding_documents FOR ALL USING (true);

CREATE POLICY "Allow all operations on settings" 
    ON tenant.settings FOR ALL USING (true);

CREATE POLICY "Allow all operations on clients" 
    ON tenant.clients FOR ALL USING (true);

-- Trigger Function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON tenant.projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at 
    BEFORE UPDATE ON tenant.settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON tenant.clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Views for better data access
CREATE VIEW tenant.project_summary AS
SELECT 
    p.id,
    p.project_id,
    p.title,
    p.procuring_entity,
    p.budget_abc,
    p.deadline,
    p.ai_confidence_score,
    p.status,
    COUNT(bd.id) AS bidding_documents_count,
    p.created_at
FROM tenant.projects p
LEFT JOIN tenant.bidding_documents bd ON p.id = bd.project_id
GROUP BY p.id, p.project_id, p.title, p.procuring_entity, 
         p.budget_abc, p.deadline, p.ai_confidence_score, p.status, p.created_at
ORDER BY p.created_at DESC;

CREATE VIEW tenant.projects_with_documents AS
SELECT 
    p.id AS project_id,
    p.project_id AS philgeps_project_id,
    p.title,
    p.procuring_entity,
    p.budget_abc,
    p.status,
    bd.id AS document_id,
    bd.document_title,
    bd.document_length,
    bd.generated_by,
    bd.generated_at,
    p.created_at AS project_created_at
FROM tenant.projects p
LEFT JOIN tenant.bidding_documents bd ON p.id = bd.project_id
ORDER BY p.created_at DESC, bd.generated_at DESC;

-- ====== SAMPLE DATA (Optional) ======

-- Insert sample company (for development)
INSERT INTO central.companies (name, db_name, project_url, anon_key) 
VALUES (
    'Sample Construction Co.',
    'sample_construction_db',
    'https://your-supabase-project.supabase.co',
    'your-anon-key-here'
) ON CONFLICT (name) DO NOTHING;

-- Insert sample user (for development)
-- Note: Password is 'password123' hashed with bcrypt
INSERT INTO central.users (email, password_hash, company_id) 
VALUES (
    'admin@sampleconstruction.com',
    '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', -- Replace with actual hash
    (SELECT id FROM central.companies WHERE name = 'Sample Construction Co.' LIMIT 1)
) ON CONFLICT (email) DO NOTHING;
