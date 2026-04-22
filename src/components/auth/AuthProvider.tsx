import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearPendingQuizAnswers, getPendingQuizAnswers, saveQuizProfile } from "@/lib/quiz-storage";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  role: "prospect" | "client" | "admin" | null;
  loading: boolean;
  refreshRole: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [role, setRole] = useState<AuthContextValue["role"]>(null);

  const fetchRole = useCallback(async (userId: string) => {
    setRoleLoading(true);
    setRole(null);

    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (error) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    const roles = data?.map((item) => item.role) ?? [];
    if (roles.includes("admin")) setRole("admin");
    else if (roles.includes("client")) setRole("client");
    else if (roles.includes("prospect")) setRole("prospect");
    else setRole(null);

    setRoleLoading(false);
  }, []);

  const refreshRole = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) {
      setRole(null);
      return;
    }
    await fetchRole(userId);
  }, [fetchRole, session?.user?.id]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    void fetchRole(userId);
  }, [fetchRole, session?.user?.id]);

  useEffect(() => {
    if (!session?.user) return;

    const pendingAnswers = getPendingQuizAnswers();
    if (!pendingAnswers) return;

    saveQuizProfile(session.user.id, pendingAnswers)
      .then(clearPendingQuizAnswers)
      .catch(() => undefined);
  }, [session?.user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  const loading = authLoading || roleLoading;

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, role, loading, refreshRole, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
