import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSecurityStub } from "@/hooks/useSecurityStub";

export const useSecureAuth = () => {
  const { user, session } = useAuth();
  const { logSecurityEvent } = useSecurityStub();

  useEffect(() => {
    if (user && session) {
      // Log successful login
      logSecurityEvent();

      // Log data access
      logSecurityEvent();
    }
  }, [user, session, logSecurityEvent]);

  useEffect(() => {
    // Monitor for suspicious activity patterns
    const handleVisibilityChange = () => {
      if (document.hidden && user) {
        logSecurityEvent();
      }
    };

    // Monitor for multiple tab usage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "supabase.auth.token" && user) {
        logSecurityEvent();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user, logSecurityEvent]);

  return {
    user,
    session,
    logSecurityEvent,
  };
};
