-- QFindr Database Migration
-- This file sets up the database structure for the multi-tenant QFindr application

-- Create central schema for shared data
CREATE SCHEMA IF NOT EXISTS central;

-- Companies table (central schema)
CREATE TABLE IF NOT EXISTS central.companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    db_schema VARCHAR(255) NOT NULL UNIQUE,
    project_url TEXT NOT NULL,
    anon_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table (central schema)
CREATE TABLE IF NOT EXISTS central.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    company_id INTEGER REFERENCES central.companies(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user',
    is_active VARCHAR(10) DEFAULT 'true',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to create tenant schema
CREATE OR REPLACE FUNCTION create_tenant_schema(schema_name TEXT)
RETURNS VOID AS $$
BEGIN
    -- Create the schema
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);
    
    -- Create projects table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.projects (
            id SERIAL PRIMARY KEY,
            philgeps_id VARCHAR(255),
            title TEXT NOT NULL,
            description TEXT,
            budget DECIMAL(15,2),
            deadline DATE,
            status VARCHAR(50) DEFAULT ''pending'',
            source_url TEXT,
            requirements TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )', schema_name);
    
    -- Create bidding_documents table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.bidding_documents (
            id SERIAL PRIMARY KEY,
            project_id INTEGER REFERENCES %I.projects(id) ON DELETE CASCADE,
            document_type VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            file_path VARCHAR(500),
            status VARCHAR(50) DEFAULT ''draft'',
            version INTEGER DEFAULT 1,
            ai_generated BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )', schema_name, schema_name);
    
    -- Create settings table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.settings (
            id SERIAL PRIMARY KEY,
            key VARCHAR(255) NOT NULL UNIQUE,
            value TEXT,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )', schema_name);
    
    -- Create clients table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.clients (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            phone VARCHAR(50),
            address TEXT,
            contact_person VARCHAR(255),
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )', schema_name);
    
    -- Create ai_jobs table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.ai_jobs (
            id SERIAL PRIMARY KEY,
            project_id INTEGER REFERENCES %I.projects(id) ON DELETE CASCADE,
            job_type VARCHAR(100) NOT NULL,
            input_data JSONB,
            output_data JSONB,
            status VARCHAR(50) DEFAULT ''pending'',
            error_message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )', schema_name, schema_name);
    
    -- Insert default settings
    EXECUTE format('
        INSERT INTO %I.settings (key, value, description) VALUES
        (''ai_model'', ''gpt-4'', ''Default AI model for document generation''),
        (''max_projects'', ''50'', ''Maximum number of projects''),
        (''notification_email'', ''admin@company.com'', ''Default notification email'')
        ON CONFLICT (key) DO NOTHING
    ', schema_name);
    
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON central.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_db_schema ON central.companies(db_schema);
CREATE INDEX IF NOT EXISTS idx_users_email ON central.users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON central.users(company_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers for central tables
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON central.companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON central.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional - remove in production)
-- INSERT INTO central.companies (name, schema_name) VALUES 
-- ('Demo Company', 'tenant_demo'),
-- ('Test Corp', 'tenant_test');

-- SELECT create_tenant_schema('tenant_demo');
-- SELECT create_tenant_schema('tenant_test');

COMMENT ON SCHEMA central IS 'Central schema containing shared company and user data';
COMMENT ON FUNCTION create_tenant_schema(TEXT) IS 'Creates a new tenant schema with all required tables';
