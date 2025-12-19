import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useSavedPrompts() {
  const { user } = useAuth();
  const [savedPromptIds, setSavedPromptIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedPrompts();
    } else {
      setSavedPromptIds(new Set());
      setLoading(false);
    }
  }, [user]);

  const fetchSavedPrompts = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("saved_prompts")
      .select("prompt_id")
      .eq("user_id", user.id);

    if (!error && data) {
      setSavedPromptIds(new Set(data.map(s => s.prompt_id)));
    }
    setLoading(false);
  };

  const toggleSave = useCallback(async (promptId: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const isSaved = savedPromptIds.has(promptId);

    if (isSaved) {
      const { error } = await supabase
        .from("saved_prompts")
        .delete()
        .eq("user_id", user.id)
        .eq("prompt_id", promptId);

      if (!error) {
        setSavedPromptIds(prev => {
          const next = new Set(prev);
          next.delete(promptId);
          return next;
        });
      }
      return { error };
    } else {
      const { error } = await supabase
        .from("saved_prompts")
        .insert({ user_id: user.id, prompt_id: promptId });

      if (!error) {
        setSavedPromptIds(prev => new Set([...prev, promptId]));
      }
      return { error };
    }
  }, [user, savedPromptIds]);

  const isSaved = useCallback((promptId: string) => {
    return savedPromptIds.has(promptId);
  }, [savedPromptIds]);

  return { savedPromptIds, loading, toggleSave, isSaved, refetch: fetchSavedPrompts };
}
