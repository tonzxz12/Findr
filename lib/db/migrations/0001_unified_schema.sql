-- Migration: Unified Schema Setup for QFindr App
-- Single database with central authentication + multi-tenant schemas

-- ====== CENTRAL SCHEMA - Authentication & Company Management ======

-- Create central schema
CREATE SCHEMA IF NOT EXISTS central;

-- Companies Table - Stores tenant company information
CREATE TABLE IF NOT EXISTS central.companies (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    db_schema TEXT NOT NULL UNIQUE, -- Schema name for this tenant (e.g., 'tenant_company1')
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
    role TEXT DEFAULT 'user', -- 'admin', 'user', 'viewer'
    is_active TEXT DEFAULT 'true',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for central schema
CREATE INDEX IF NOT EXISTS idx_companies_name ON central.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_db_schema ON central.companies(db_schema);
CREATE INDEX IF NOT EXISTS idx_users_email ON central.users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON central.users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON central.users(role);

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

-- ====== TENANT SCHEMA TEMPLATE ======
-- This function creates a complete tenant schema for a company

CREATE OR REPLACE FUNCTION create_tenant_schema(schema_name TEXT)
RETURNS VOID AS $$
BEGIN
    -- Create the schema
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);
    
    -- Projects Table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.projects (
            id BIGSERIAL PRIMARY KEY,
            project_id TEXT,
            ref_id TEXT,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            procuring_entity TEXT,
            area_of_delivery TEXT,
            procurement_summary TEXT,
            key_requirements TEXT,
            budget_abc TEXT,
            deadline TEXT,
            ai_confidence_score INTEGER DEFAULT 0,
            processing_method TEXT DEFAULT ''gpt-4o-mini'',
            status TEXT DEFAULT ''completed'',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )', schema_name);
    
    -- Bidding Documents Table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.bidding_documents (
            id BIGSERIAL PRIMARY KEY,
            project_id BIGINT REFERENCES %I.projects(id) ON DELETE CASCADE,
            document_content TEXT NOT NULL,
            document_title TEXT,
            document_type TEXT,
            generated_by TEXT DEFAULT ''gpt-4o-mini'',
            generation_prompt TEXT,
            document_length INTEGER,
            generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )', schema_name, schema_name);
    
    -- Settings Table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.settings (
            id BIGSERIAL PRIMARY KEY,
            setting_key TEXT NOT NULL UNIQUE,
            setting_value TEXT,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )', schema_name);
    
    -- Clients Table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.clients (
            id BIGSERIAL PRIMARY KEY,
            client_name TEXT NOT NULL,
            contact_email TEXT,
            contact_phone TEXT,
            address TEXT,
            company_type TEXT,
            registration_number TEXT,
            is_active TEXT DEFAULT ''true'',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )', schema_name);
    
    -- AI Jobs Table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.ai_jobs (
            id BIGSERIAL PRIMARY KEY,
            project_id BIGINT REFERENCES %I.projects(id) ON DELETE CASCADE,
            job_type TEXT NOT NULL,
            status TEXT DEFAULT ''pending'',
            input_data TEXT,
            output_data TEXT,
            error_message TEXT,
            processing_method TEXT DEFAULT ''gpt-4o-mini'',
            started_at TIMESTAMP WITH TIME ZONE,
            completed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )', schema_name, schema_name);
    
    -- Create indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_projects_project_id ON %I.projects(project_id)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_projects_ref_id ON %I.projects(ref_id)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_projects_procuring_entity ON %I.projects(procuring_entity)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_projects_created_at ON %I.projects(created_at)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_projects_status ON %I.projects(status)', schema_name, schema_name);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_bidding_documents_project_id ON %I.bidding_documents(project_id)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_bidding_documents_generated_at ON %I.bidding_documents(generated_at)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_bidding_documents_document_type ON %I.bidding_documents(document_type)', schema_name, schema_name);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_settings_setting_key ON %I.settings(setting_key)', schema_name, schema_name);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_clients_client_name ON %I.clients(client_name)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_clients_contact_email ON %I.clients(contact_email)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_clients_company_type ON %I.clients(company_type)', schema_name, schema_name);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_ai_jobs_project_id ON %I.ai_jobs(project_id)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_ai_jobs_status ON %I.ai_jobs(status)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_ai_jobs_job_type ON %I.ai_jobs(job_type)', schema_name, schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_ai_jobs_created_at ON %I.ai_jobs(created_at)', schema_name, schema_name);
    
    -- Enable RLS on all tables
    EXECUTE format('ALTER TABLE %I.projects ENABLE ROW LEVEL SECURITY', schema_name);
    EXECUTE format('ALTER TABLE %I.bidding_documents ENABLE ROW LEVEL SECURITY', schema_name);
    EXECUTE format('ALTER TABLE %I.settings ENABLE ROW LEVEL SECURITY', schema_name);
    EXECUTE format('ALTER TABLE %I.clients ENABLE ROW LEVEL SECURITY', schema_name);
    EXECUTE format('ALTER TABLE %I.ai_jobs ENABLE ROW LEVEL SECURITY', schema_name);
    
    -- Create policies (allow all for now, can be restricted later)
    EXECUTE format('DROP POLICY IF EXISTS "Allow all operations on projects" ON %I.projects', schema_name);
    EXECUTE format('CREATE POLICY "Allow all operations on projects" ON %I.projects FOR ALL USING (true)', schema_name);
    
    EXECUTE format('DROP POLICY IF EXISTS "Allow all operations on bidding_documents" ON %I.bidding_documents', schema_name);
    EXECUTE format('CREATE POLICY "Allow all operations on bidding_documents" ON %I.bidding_documents FOR ALL USING (true)', schema_name);
    
    EXECUTE format('DROP POLICY IF EXISTS "Allow all operations on settings" ON %I.settings', schema_name);
    EXECUTE format('CREATE POLICY "Allow all operations on settings" ON %I.settings FOR ALL USING (true)', schema_name);
    
    EXECUTE format('DROP POLICY IF EXISTS "Allow all operations on clients" ON %I.clients', schema_name);
    EXECUTE format('CREATE POLICY "Allow all operations on clients" ON %I.clients FOR ALL USING (true)', schema_name);
    
    EXECUTE format('DROP POLICY IF EXISTS "Allow all operations on ai_jobs" ON %I.ai_jobs', schema_name);
    EXECUTE format('CREATE POLICY "Allow all operations on ai_jobs" ON %I.ai_jobs FOR ALL USING (true)', schema_name);
    
    -- Create update triggers
    EXECUTE format('
        CREATE TRIGGER update_%s_projects_updated_at 
            BEFORE UPDATE ON %I.projects 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column()', schema_name, schema_name);
    
    EXECUTE format('
        CREATE TRIGGER update_%s_settings_updated_at 
            BEFORE UPDATE ON %I.settings 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column()', schema_name, schema_name);
    
    EXECUTE format('
        CREATE TRIGGER update_%s_clients_updated_at 
            BEFORE UPDATE ON %I.clients 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column()', schema_name, schema_name);
    
END;
$$ LANGUAGE plpgsql;

-- ====== UTILITY FUNCTIONS ======

-- Trigger Function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create tenant schema name from company name
CREATE OR REPLACE FUNCTION get_tenant_schema_name(company_name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN 'tenant_' || lower(regexp_replace(company_name, '[^a-zA-Z0-9]', '_', 'g'));
END;
$$ LANGUAGE plpgsql;

-- ====== SAMPLE DATA (Optional for Development) ======

-- Insert sample company
INSERT INTO central.companies (name, db_schema, project_url, anon_key) 
VALUES (
    'Sample Construction Co.',
    'tenant_sample_construction_co',
    'https://your-supabase-project.supabase.co',
    'your-anon-key-here'
) ON CONFLICT (name) DO NOTHING;

-- Create sample tenant schema
SELECT create_tenant_schema('tenant_sample_construction_co');

-- Insert sample user (password is 'password123' - hash this in production!)
INSERT INTO central.users (email, password_hash, company_id, role) 
VALUES (
    'admin@sample-construction.com',
    '$2b$10$rI3QG1YEqLHzK6Qj5KQqK.K5zTz1z1z1z1z1z1z1z1z1z1z1z1z1z1', -- Replace with actual hash
    (SELECT id FROM central.companies WHERE name = 'Sample Construction Co.' LIMIT 1),
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- ====== USAGE EXAMPLES ======

-- To create a new tenant schema for a company:
-- 1. Insert company into central.companies
-- 2. Call: SELECT create_tenant_schema('tenant_company_name');

-- Example:
-- INSERT INTO central.companies (name, db_schema, project_url, anon_key) 
-- VALUES ('New Company Inc.', 'tenant_new_company_inc', 'https://...', 'key...');
-- 
-- SELECT create_tenant_schema('tenant_new_company_inc');
