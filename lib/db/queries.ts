import { eq, and } from 'drizzle-orm';
import { db } from './index';
import { users, clients } from './migrations/schema';

export const companyOperations = {
  async getByName(companyName: string) {
    const result = await db
      .select()
      .from(clients)
      .where(eq(clients.companyName, companyName))
      .limit(1);

    return result[0] || null;
  },

  async create(data: {
    companyName: string;
    keywords?: string[];
    ownerUserId?: string;
  }) {
    const result = await db
      .insert(clients)
      .values({
        companyName: data.companyName,
        keywords: data.keywords || [],
        ownerUserId: data.ownerUserId,
      })
      .returning();

    return result[0];
  },
};

export const userOperations = {
  async getByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] || null;
  },

  async getByEmailAndCompany(email: string, companyId: string) {
    // For now, we'll just check if the user exists with the email
    // In a real multi-tenant setup, this would check company association
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] || null;
  },

  async updateLastLogin(userId: string) {
    const result = await db
      .update(users)
      .set({
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))
      .returning();

    return result[0];
  },

  async create(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string;
    role?: 'admin' | 'client';
  }) {
    const result = await db
      .insert(users)
      .values({
        email: data.email,
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        phone: data.phone,
        role: data.role || 'client',
        isActive: true,
      })
      .returning();

    return result[0];
  },
};