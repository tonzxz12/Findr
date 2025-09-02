import { eq, desc, and, count } from 'drizzle-orm';
import { db } from './index';
import { companies, users, createTenantSchema, getTenantSchemaName } from './unified-schema';
import type { 
  Company, NewCompany, User, NewUser,
  Project, NewProject, BiddingDocument, NewBiddingDocument,
  Setting, NewSetting, Client, NewClient, AiJob, NewAiJob
} from './unified-schema';

// ====== CENTRAL DATABASE OPERATIONS ======

// Company operations
export const companyOperations = {
  // Create a new company
  async create(company: NewCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  },

  // Get company by ID
  async getById(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  },

  // Get company by name
  async getByName(name: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.name, name));
    return company;
  },

  // Get company by database schema name
  async getByDbSchema(dbSchema: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.dbSchema, dbSchema));
    return company;
  },

  // List all companies
  async list(): Promise<Company[]> {
    return await db.select().from(companies).orderBy(desc(companies.createdAt));
  },

  // Update company
  async update(id: number, updates: Partial<NewCompany>): Promise<Company | undefined> {
    const [updatedCompany] = await db
      .update(companies)
      .set(updates)
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany;
  },

  // Delete company
  async delete(id: number): Promise<void> {
    await db.delete(companies).where(eq(companies.id, id));
  },
};

// User operations
export const userOperations = {
  // Create a new user
  async create(user: NewUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  },

  // Get user by ID
  async getById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  // Get user by email
  async getByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  // Get user by email and company
  async getByEmailAndCompany(email: string, companyId: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.companyId, companyId)));
    return user;
  },

  // Get users by company
  async getByCompany(companyId: number): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.companyId, companyId))
      .orderBy(desc(users.createdAt));
  },

  // Update user
  async update(id: number, updates: Partial<NewUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  },

  // Update last login
  async updateLastLogin(id: number): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  },

  // Delete user
  async delete(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  },
};

// ====== TENANT DATABASE OPERATIONS ======

// Helper function to get tenant schema
function getTenantSchema(schemaName: string) {
  return createTenantSchema(schemaName);
}

// Project operations factory
export function createProjectOperations(schemaName: string) {
  const tenantSchema = getTenantSchema(schemaName);
  const { projects } = tenantSchema;

  return {
    // Create a new project
    async create(project: NewProject): Promise<Project> {
      const [newProject] = await db.insert(projects).values(project).returning();
      return newProject;
    },

    // Get project by ID
    async getById(id: number): Promise<Project | undefined> {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      return project;
    },

    // Get project by PhilGEPS project ID
    async getByProjectId(projectId: string): Promise<Project | undefined> {
      const [project] = await db.select().from(projects).where(eq(projects.projectId, projectId));
      return project;
    },

    // List projects with pagination
    async list(limit = 20, offset = 0): Promise<Project[]> {
      return await db
        .select()
        .from(projects)
        .orderBy(desc(projects.createdAt))
        .limit(limit)
        .offset(offset);
    },

    // Get projects by status
    async getByStatus(status: string, limit = 20, offset = 0): Promise<Project[]> {
      return await db
        .select()
        .from(projects)
        .where(eq(projects.status, status))
        .orderBy(desc(projects.createdAt))
        .limit(limit)
        .offset(offset);
    },

    // Update project
    async update(id: number, updates: Partial<NewProject>): Promise<Project | undefined> {
      const [updatedProject] = await db
        .update(projects)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      return updatedProject;
    },

    // Delete project
    async delete(id: number): Promise<void> {
      await db.delete(projects).where(eq(projects.id, id));
    },
  };
}

// Bidding document operations factory
export function createBiddingDocumentOperations(schemaName: string) {
  const tenantSchema = getTenantSchema(schemaName);
  const { biddingDocuments, projects } = tenantSchema;

  return {
    // Create a new bidding document
    async create(document: NewBiddingDocument): Promise<BiddingDocument> {
      const [newDocument] = await db.insert(biddingDocuments).values(document).returning();
      return newDocument;
    },

    // Get document by ID
    async getById(id: number): Promise<BiddingDocument | undefined> {
      const [document] = await db.select().from(biddingDocuments).where(eq(biddingDocuments.id, id));
      return document;
    },

    // Get documents by project
    async getByProject(projectId: number): Promise<BiddingDocument[]> {
      return await db
        .select()
        .from(biddingDocuments)
        .where(eq(biddingDocuments.projectId, projectId))
        .orderBy(desc(biddingDocuments.generatedAt));
    },

    // List documents with pagination
    async list(limit = 20, offset = 0): Promise<BiddingDocument[]> {
      return await db
        .select()
        .from(biddingDocuments)
        .orderBy(desc(biddingDocuments.generatedAt))
        .limit(limit)
        .offset(offset);
    },

    // Get documents by type
    async getByType(documentType: string): Promise<BiddingDocument[]> {
      return await db
        .select()
        .from(biddingDocuments)
        .where(eq(biddingDocuments.documentType, documentType))
        .orderBy(desc(biddingDocuments.generatedAt));
    },

    // Update document
    async update(id: number, updates: Partial<NewBiddingDocument>): Promise<BiddingDocument | undefined> {
      const [updatedDocument] = await db
        .update(biddingDocuments)
        .set(updates)
        .where(eq(biddingDocuments.id, id))
        .returning();
      return updatedDocument;
    },

    // Delete document
    async delete(id: number): Promise<void> {
      await db.delete(biddingDocuments).where(eq(biddingDocuments.id, id));
    },
  };
}

// Settings operations factory
export function createSettingsOperations(schemaName: string) {
  const tenantSchema = getTenantSchema(schemaName);
  const { settings } = tenantSchema;

  return {
    // Set a setting
    async set(key: string, value: string): Promise<Setting> {
      const [setting] = await db
        .insert(settings)
        .values({ settingKey: key, settingValue: value })
        .onConflictDoUpdate({
          target: [settings.settingKey],
          set: { settingValue: value, updatedAt: new Date() },
        })
        .returning();
      return setting;
    },

    // Get a setting
    async get(key: string): Promise<string | undefined> {
      const [setting] = await db
        .select()
        .from(settings)
        .where(eq(settings.settingKey, key));
      return setting?.settingValue ?? undefined;
    },

    // Get all settings
    async getAll(): Promise<Record<string, string>> {
      const allSettings = await db.select().from(settings);
      
      return allSettings.reduce((acc, setting) => {
        acc[setting.settingKey] = setting.settingValue || '';
        return acc;
      }, {} as Record<string, string>);
    },

    // Delete a setting
    async delete(key: string): Promise<void> {
      await db.delete(settings).where(eq(settings.settingKey, key));
    },
  };
}

// Client operations factory
export function createClientOperations(schemaName: string) {
  const tenantSchema = getTenantSchema(schemaName);
  const { clients } = tenantSchema;

  return {
    // Create a new client
    async create(client: NewClient): Promise<Client> {
      const [newClient] = await db.insert(clients).values(client).returning();
      return newClient;
    },

    // Get client by ID
    async getById(id: number): Promise<Client | undefined> {
      const [client] = await db.select().from(clients).where(eq(clients.id, id));
      return client;
    },

    // List clients
    async list(): Promise<Client[]> {
      return await db
        .select()
        .from(clients)
        .orderBy(desc(clients.createdAt));
    },

    // Get active clients
    async getActive(): Promise<Client[]> {
      return await db
        .select()
        .from(clients)
        .where(eq(clients.isActive, 'true'))
        .orderBy(desc(clients.createdAt));
    },

    // Update client
    async update(id: number, updates: Partial<NewClient>): Promise<Client | undefined> {
      const [updatedClient] = await db
        .update(clients)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(clients.id, id))
        .returning();
      return updatedClient;
    },

    // Delete client
    async delete(id: number): Promise<void> {
      await db.delete(clients).where(eq(clients.id, id));
    },
  };
}

// AI Job operations factory
export function createAiJobOperations(schemaName: string) {
  const tenantSchema = getTenantSchema(schemaName);
  const { aiJobs } = tenantSchema;

  return {
    // Create a new AI job
    async create(job: NewAiJob): Promise<AiJob> {
      const [newJob] = await db.insert(aiJobs).values(job).returning();
      return newJob;
    },

    // Get job by ID
    async getById(id: number): Promise<AiJob | undefined> {
      const [job] = await db.select().from(aiJobs).where(eq(aiJobs.id, id));
      return job;
    },

    // Get jobs by project
    async getByProject(projectId: number): Promise<AiJob[]> {
      return await db
        .select()
        .from(aiJobs)
        .where(eq(aiJobs.projectId, projectId))
        .orderBy(desc(aiJobs.createdAt));
    },

    // Get jobs by status
    async getByStatus(status: string): Promise<AiJob[]> {
      return await db
        .select()
        .from(aiJobs)
        .where(eq(aiJobs.status, status))
        .orderBy(desc(aiJobs.createdAt));
    },

    // Update job status
    async updateStatus(id: number, status: string, outputData?: string, errorMessage?: string): Promise<AiJob | undefined> {
      const updates: Partial<NewAiJob> = { status };
      
      if (status === 'processing') {
        updates.startedAt = new Date();
      } else if (status === 'completed' || status === 'failed') {
        updates.completedAt = new Date();
        if (outputData) updates.outputData = outputData;
        if (errorMessage) updates.errorMessage = errorMessage;
      }

      const [updatedJob] = await db
        .update(aiJobs)
        .set(updates)
        .where(eq(aiJobs.id, id))
        .returning();
      return updatedJob;
    },

    // Delete job
    async delete(id: number): Promise<void> {
      await db.delete(aiJobs).where(eq(aiJobs.id, id));
    },
  };
}

// ====== TENANT OPERATIONS FACTORY ======

// Create all operations for a specific tenant
export function createTenantOperations(companyName: string) {
  const schemaName = getTenantSchemaName(companyName);
  
  return {
    schemaName,
    projects: createProjectOperations(schemaName),
    documents: createBiddingDocumentOperations(schemaName),
    settings: createSettingsOperations(schemaName),
    clients: createClientOperations(schemaName),
    aiJobs: createAiJobOperations(schemaName),
  };
}
