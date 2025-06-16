
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  registrationDate: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Auto-logout após 10 minutos de inatividade
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      const tenMinutes = 10 * 60 * 1000; // 10 minutos em milliseconds

      if (inactiveTime > tenMinutes && session) {
        console.log('Auto-logout por inatividade');
        logout();
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Verifica a cada minuto

    // Monitora atividade do usuário
    const updateActivity = () => setLastActivity(Date.now());
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [session, lastActivity]);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            registrationDate: session.user.created_at || '',
            address: '',
            number: '',
            neighborhood: '',
            city: '',
            state: ''
          };
          setUser(authUser);
          setLastActivity(Date.now());
        } else {
          setUser(null);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão existente encontrada:', session);
      setSession(session);
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          registrationDate: session.user.created_at || '',
          address: '',
          number: '',
          neighborhood: '',
          city: '',
          state: ''
        };
        setUser(authUser);
        setLastActivity(Date.now());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Iniciando login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        return false;
      }

      console.log('Login bem-sucedido:', data);
      return !!data.user;
    } catch (error) {
      console.error('Erro durante login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Fazendo logout...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return false;
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!session,
    login,
    logout,
    updateUser,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
