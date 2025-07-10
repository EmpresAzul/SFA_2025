import React, { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Simplified version without hooks for testing
  const value = {
    user: null,
    session: null,
    loading: false,
    signIn: async (email: string, password: string) => {
      return { error: null };
    },
    signUp: async (email: string, password: string) => {
      return { error: null };
    },
    signOut: async () => {
      // Empty implementation for testing
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};