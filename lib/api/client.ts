// API utility functions for the QFindr App

import { APIResponseType } from '../db/validations';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic API response handler
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponseType & { data?: T }> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    return {
      success: false,
      message: 'API request failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// GET request helper
export async function apiGet<T>(endpoint: string): Promise<APIResponseType & { data?: T }> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

// POST request helper
export async function apiPost<T>(
  endpoint: string,
  body?: any
): Promise<APIResponseType & { data?: T }> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

// PUT request helper
export async function apiPut<T>(
  endpoint: string,
  body?: any
): Promise<APIResponseType & { data?: T }> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

// DELETE request helper
export async function apiDelete<T>(endpoint: string): Promise<APIResponseType & { data?: T }> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// ====== AUTHENTICATION API ======

export const authApi = {
  login: async (email: string, password: string, company: string) => {
    return apiPost('/auth/login', { email, password, company });
  },

  register: async (userData: {
    email: string;
    password: string;
    companyName: string;
  }) => {
    return apiPost('/auth/register', userData);
  },

  logout: async () => {
    return apiPost('/auth/logout');
  },

  me: async () => {
    return apiGet('/auth/me');
  },
};

// ====== COMPANY API ======

export const companyApi = {
  list: async () => {
    return apiGet('/companies');
  },

  getById: async (id: number) => {
    return apiGet(`/companies/${id}`);
  },

  create: async (companyData: any) => {
    return apiPost('/companies', companyData);
  },

  update: async (id: number, updates: any) => {
    return apiPut(`/companies/${id}`, updates);
  },

  delete: async (id: number) => {
    return apiDelete(`/companies/${id}`);
  },
};

// ====== PROJECT API ======

export const projectApi = {
  list: async (params?: { 
    tenantId: number; 
    limit?: number; 
    offset?: number; 
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return apiGet(`/projects?${searchParams.toString()}`);
  },

  getById: async (id: number) => {
    return apiGet(`/projects/${id}`);
  },

  create: async (projectData: any) => {
    return apiPost('/projects', projectData);
  },

  update: async (id: number, updates: any) => {
    return apiPut(`/projects/${id}`, updates);
  },

  delete: async (id: number) => {
    return apiDelete(`/projects/${id}`);
  },

  getSummary: async (tenantId: number) => {
    return apiGet(`/projects/summary?tenantId=${tenantId}`);
  },
};

// ====== BIDDING DOCUMENTS API ======

export const documentApi = {
  list: async (params?: { 
    tenantId?: number; 
    projectId?: number;
    limit?: number; 
    offset?: number; 
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return apiGet(`/documents?${searchParams.toString()}`);
  },

  getById: async (id: number) => {
    return apiGet(`/documents/${id}`);
  },

  generate: async (generationData: {
    projectId: number;
    documentType: string;
    customPrompt?: string;
    processingMethod?: string;
  }) => {
    return apiPost('/documents/generate', generationData);
  },

  update: async (id: number, updates: any) => {
    return apiPut(`/documents/${id}`, updates);
  },

  delete: async (id: number) => {
    return apiDelete(`/documents/${id}`);
  },
};

// ====== SETTINGS API ======

export const settingsApi = {
  get: async (tenantId: number, key: string) => {
    return apiGet(`/settings/${tenantId}/${key}`);
  },

  getAll: async (tenantId: number) => {
    return apiGet(`/settings/${tenantId}`);
  },

  set: async (tenantId: number, key: string, value: string) => {
    return apiPost(`/settings/${tenantId}/${key}`, { value });
  },

  delete: async (tenantId: number, key: string) => {
    return apiDelete(`/settings/${tenantId}/${key}`);
  },
};

// ====== CLIENTS API ======

export const clientApi = {
  list: async (tenantId: number) => {
    return apiGet(`/clients?tenantId=${tenantId}`);
  },

  getById: async (id: number) => {
    return apiGet(`/clients/${id}`);
  },

  create: async (clientData: any) => {
    return apiPost('/clients', clientData);
  },

  update: async (id: number, updates: any) => {
    return apiPut(`/clients/${id}`, updates);
  },

  delete: async (id: number) => {
    return apiDelete(`/clients/${id}`);
  },
};

// ====== PHILGEPS SCRAPING API ======

export const philgepsApi = {
  scrapeProject: async (url: string, tenantId: number) => {
    return apiPost('/philgeps/scrape', { url, tenantId });
  },

  searchProjects: async (query: string, filters?: any) => {
    return apiPost('/philgeps/search', { query, filters });
  },

  getProjectDetails: async (projectId: string) => {
    return apiGet(`/philgeps/project/${projectId}`);
  },
};

// ====== AI PROCESSING API ======

export const aiApi = {
  processProject: async (projectId: number, method: string = 'gpt-4o-mini') => {
    return apiPost('/ai/process', { projectId, method });
  },

  generateDocument: async (params: {
    projectId: number;
    documentType: string;
    customPrompt?: string;
    method?: string;
  }) => {
    return apiPost('/ai/generate-document', params);
  },

  analyzeRequirements: async (projectContent: string) => {
    return apiPost('/ai/analyze-requirements', { content: projectContent });
  },

  improveDocument: async (documentId: number, instructions: string) => {
    return apiPost('/ai/improve-document', { documentId, instructions });
  },
};
