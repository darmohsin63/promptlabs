import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Prompt {
  id: string;
  title: string;
  description: string | null;
  content: string;
  image_url: string | null;
  image_urls: string[] | null;
  author: string;
  created_at: string;
  user_id: string;
  scheduled_at: string | null;
  is_approved: boolean | null;
  approved_at: string | null;
  approved_by: string | null;
  updated_at: string | null;
  category: string[] | null;
}

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPrompts(data);
    }
    setLoading(false);
  };

  const addPrompt = async (
    newPrompt: Omit<Prompt, "id" | "created_at" | "user_id">,
    userId: string
  ) => {
    const { data, error } = await supabase
      .from("prompts")
      .insert({
        ...newPrompt,
        user_id: userId,
      })
      .select()
      .single();

    if (!error && data) {
      setPrompts([data, ...prompts]);
      return { data, error: null };
    }
    return { data: null, error };
  };

  const getPromptById = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    return { data, error };
  }, []);

  const deletePrompt = async (id: string) => {
    const { error } = await supabase.from("prompts").delete().eq("id", id);
    if (!error) {
      setPrompts(prompts.filter((p) => p.id !== id));
    }
    return { error };
  };

  const updatePrompt = async (
    id: string,
    updates: Partial<Omit<Prompt, "id" | "created_at" | "user_id">>
  ) => {
    const { data, error } = await supabase
      .from("prompts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setPrompts(prompts.map((p) => (p.id === id ? data : p)));
      return { data, error: null };
    }
    return { data: null, error };
  };

  return { prompts, loading, addPrompt, getPromptById, deletePrompt, updatePrompt, refetch: fetchPrompts };
}
