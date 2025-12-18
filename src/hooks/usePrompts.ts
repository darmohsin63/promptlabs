import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Prompt {
  id: string;
  title: string;
  description: string | null;
  content: string;
  image_url: string | null;
  author: string;
  created_at: string;
  user_id: string;
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

  const getPromptById = async (id: string) => {
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    return { data, error };
  };

  const deletePrompt = async (id: string) => {
    const { error } = await supabase.from("prompts").delete().eq("id", id);
    if (!error) {
      setPrompts(prompts.filter((p) => p.id !== id));
    }
    return { error };
  };

  return { prompts, loading, addPrompt, getPromptById, deletePrompt, refetch: fetchPrompts };
}
