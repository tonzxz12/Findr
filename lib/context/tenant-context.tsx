'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clients, users } from '../db/migrations/schema';
import type { InferSelectModel } from 'drizzle-orm';

type Company = InferSelectModel<typeof clients>;
type User = InferSelectModel<typeof users>;

interface TenantContextType {
  currentCompany: Company | null;
  currentUser: User | null;
  isLoading: boolean;
  setCurrentCompany: (company: Company | null) => void;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to restore session from localStorage
    const restoreSession = () => {
      try {
        const storedCompany = localStorage.getItem('currentCompany');
        const storedUser = localStorage.getItem('currentUser');

        if (storedCompany) {
          setCurrentCompany(JSON.parse(storedCompany));
        }

        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        // Clear corrupted data
        localStorage.removeItem('currentCompany');
        localStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Persist to localStorage when company changes
  useEffect(() => {
    if (currentCompany) {
      localStorage.setItem('currentCompany', JSON.stringify(currentCompany));
    } else {
      localStorage.removeItem('currentCompany');
    }
  }, [currentCompany]);

  // Persist to localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const logout = () => {
    setCurrentCompany(null);
    setCurrentUser(null);
    localStorage.removeItem('currentCompany');
    localStorage.removeItem('currentUser');
  };

  const value: TenantContextType = {
    currentCompany,
    currentUser,
    isLoading,
    setCurrentCompany,
    setCurrentUser,
    logout,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// Custom hook for authenticated operations
export function useRequireAuth() {
  const { currentUser, currentCompany, isLoading } = useTenant();
  
  const isAuthenticated = !!currentUser && !!currentCompany;
  
  return {
    isAuthenticated,
    isLoading,
    currentUser,
    currentCompany,
    tenantId: currentCompany?.id || 0,
  };
}
