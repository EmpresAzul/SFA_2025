import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('AuthProvider: Component rendering...');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Session timeout (30 minutes of inactivity)
  useEffect(() => {
    if (!user || !session) return;

    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log('Session expired due to inactivity');
        supabase.auth.signOut();
      }, SESSION_TIMEOUT);
    };

    const handleActivity = () => {
      setLastActivity(new Date());
      resetTimeout();
      
      // Update session activity in database
      if (user?.id) {
        supabase.rpc('cleanup_expired_sessions').then(() => {}, console.error);
      }
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, session]);

  useEffect(() => {
    console.log('AuthContext: Initializing authentication...');
    
    // Production optimized timeout - faster for better UX
    const timeoutId = setTimeout(() => {
      console.log('AuthContext: Timeout reached, forcing loading to false');
      setLoading(false);
    }, 8000); // Otimizado para 8 segundos para domínio customizado

    // Initialize auth with error handling
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Starting auth initialization...');
        
        // Check if we're online
        if (!navigator.onLine) {
          console.warn('AuthContext: Offline - skipping auth check');
          clearTimeout(timeoutId);
          setLoading(false);
          return;
        }

        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 3000)
        );

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
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
        clearTimeout(timeoutId);
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
      clearTimeout(timeoutId);
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
        // Enforce session limits
        supabase.rpc('enforce_session_limit', { 
          user_uuid: data.user.id 
        }).then(() => {}, console.error);
        
        // Track active session
        if (data.session?.access_token) {
          const sessionHash = btoa(data.session.access_token.substring(0, 20));
          supabase.from('active_sessions').insert({
            user_id: data.user.id,
            session_token_hash: sessionHash,
            user_agent: navigator.userAgent,
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          }).then(() => {}, console.error);
        }
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
      if (user?.id && session?.access_token) {
        // Mark current session as inactive
        const sessionHash = btoa(session.access_token.substring(0, 20));
        supabase.from('active_sessions')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('session_token_hash', sessionHash)
          .then(() => {}, console.error);
      }
      
      // Clear profile data
      if (user?.id) {
        const profileKey = `fluxoazul_profile_${user.id}`;
        const hasStoredData = localStorage.getItem(profileKey);
        
        if (hasStoredData) {
          console.log('🧹 Limpando dados do perfil do localStorage no logout...');
        }
      }
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};