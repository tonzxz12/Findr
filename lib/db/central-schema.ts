// Central Database Schema for Multi-Tenant System
import { pgTable, serial, text, timestamp, bigint, index } from 'drizzle-orm/pg-core';

// Companies Table - Stores tenant company information
export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  dbName: text('db_name').notNull().unique(), // Tenant database name
  projectUrl: text('project_url').notNull(),
  anonKey: text('anon_key').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  nameIdx: index('idx_companies_name').on(table.name),
  dbNameIdx: index('idx_companies_db_name').on(table.dbName),
}));

// Users Table - Stores user authentication information
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  companyId: bigint('company_id', { mode: 'number' }).references(() => companies.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  companyIdIdx: index('idx_users_company_id').on(table.companyId),
}));

// Type definitions for TypeScript
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
