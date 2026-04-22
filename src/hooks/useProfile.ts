import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Json } from "@/integrations/supabase/types";

export type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  markets: string[];
  quiz_data: Json | null;
  traject_stage: number | null;
  next_action: string | null;
  next_action_date: string | null;
};

export const useProfile = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("id,user_id,full_name,avatar_url,phone,markets,quiz_data,traject_stage,next_action,next_action_date")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
  });

  return {
    profile: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refresh: query.refetch,
  };
};