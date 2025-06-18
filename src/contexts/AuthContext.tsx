
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Log de evento de segurança
  const logSecurityEvent = async (eventType: string, details?: any) => {
    try {
      await supabase
        .from('security_logs')
        .insert({
          user_id: user?.id,
          event_type: eventType,
          details,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      // Log silencioso para não afetar a experiência do usuário
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Log eventos de autenticação
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            logSecurityEvent('login_success', {
              login_method: 'email_password',
              timestamp: new Date().toISOString()
            });
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          setTimeout(() => {
            logSecurityEvent('logout', {
              logout_time: new Date().toISOString()
            });
          }, 100);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Log failed login attempt
        await supabase
          .from('security_logs')
          .insert({
            user_id: null,
            event_type: 'login_failed',
            details: {
              email,
              error: error.message,
              timestamp: new Date().toISOString()
            },
            created_at: new Date().toISOString()
          });
        return false;
      }

      return !!data.user;
    } catch (error) {
      return false;
    }
  };

  const updateUser = async (userData: any): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) throw error;
      
      // Atualizar estado local
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            ...userData
          }
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Log logout antes de fazer logout
      if (user) {
        await logSecurityEvent('logout', {
          logout_time: new Date().toISOString()
        });
      }
      
      await supabase.auth.signOut();
    } catch (error) {
      // Log silencioso
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        logout,
        updateUser,
        updatePassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
