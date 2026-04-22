import { supabase } from "@/integrations/supabase/client";
import type { QuizAnswers } from "@/lib/quiz-matching";
import { PENDING_QUIZ_STORAGE_KEY, matchQuizProfile } from "@/lib/quiz-matching";

export const saveQuizProfile = async (userId: string, answers: QuizAnswers) => {
  const result = matchQuizProfile(answers);
  const payload = {
    markets: result.markets,
    quiz_data: {
      answers,
      result,
      saved_at: new Date().toISOString(),
    },
  };

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (data) return;

  const { error: insertError } = await supabase.from("profiles").insert({
    user_id: userId,
    ...payload,
  });

  if (insertError) throw insertError;
};

export const getPendingQuizAnswers = (): QuizAnswers | null => {
  const stored = sessionStorage.getItem(PENDING_QUIZ_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as QuizAnswers;
  } catch {
    sessionStorage.removeItem(PENDING_QUIZ_STORAGE_KEY);
    return null;
  }
};

export const clearPendingQuizAnswers = () => {
  sessionStorage.removeItem(PENDING_QUIZ_STORAGE_KEY);
};
