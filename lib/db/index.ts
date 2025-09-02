import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { companies, users, createTenantSchema, getTenantSchemaName } from './unified-schema';

// Database connection configuration
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create postgres client
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client);

// Central database operations (for authentication)
export const centralDb = db;

// Helper function to create tenant-specific database connection
export function getTenantDb(schemaName: string) {
  const tenantSchema = createTenantSchema(schemaName);
  return {
    db,
    tenantSchema,
    ...tenantSchema,
  };
}

// Helper to get tenant DB by company name
export function getTenantDbByCompany(companyName: string) {
  const schemaName = getTenantSchemaName(companyName);
  return getTenantDb(schemaName);
}

// Export unified schema components
export * from './unified-schema';

// Export types
export type Database = typeof db;
