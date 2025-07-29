import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

// Create context with proper error handling
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Debug log para verificar se o contexto está sendo criado
console.log('AuthContext: Context created successfully', { 
  AuthContext: !!AuthContext,
  createContext: !!createContext 
});

export const useAuth = () => {
  console.log('useAuth: Hook called');
  const context = useContext(AuthContext);
  console.log('useAuth: Context value:', { context: !!context });
  
  if (context === undefined) {
    console.error('useAuth: Context is undefined! AuthProvider not found in component tree');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  console.log('AuthProvider: Component rendering...');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Session management without aggressive timeout
  useEffect(() => {
    if (!user || !session) return;

    const handleActivity = () => {
      setLastActivity(new Date());
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, session]);

  useEffect(() => {
    console.log('AuthContext: Initializing authentication...');
    
    // Initialize auth with error handling
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Starting auth initialization...');
        
        // Check if we're online
        if (!navigator.onLine) {
          console.warn('AuthContext: Offline - skipping auth check');
          setLoading(false);
          return;
        }

        // Get initial session without aggressive timeout
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Error getting initial session:', error);
        } else {
          console.log('AuthContext: Initial session check successful:', { session: !!session });
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('AuthContext: Failed to initialize auth:', error);
        // In case of error, assume no session and continue
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with error handling
    let subscription: any;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('AuthContext: Auth state changed:', event, !!session);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      subscription = data.subscription;
    } catch (error) {
      console.error('AuthContext: Error setting up auth listener:', error);
      setLoading(false);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.user) {
        console.log('AuthContext: User signed in successfully:', data.user.email);
      }
      
      setLoading(false);
      return { error };
    } catch (err) {
      setLoading(false);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    
    try {
      console.log('AuthContext: User signing out...');
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
    }
    
    await supabase.auth.signOut();
    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};