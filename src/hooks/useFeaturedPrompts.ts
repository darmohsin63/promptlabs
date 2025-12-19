import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FeaturedPrompt {
  id: string;
  prompt_id: string;
  feature_type: "prompt_of_day" | "trending" | "creators_choice";
  display_order: number;
  is_active: boolean;
  prompt: {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    image_urls: string[] | null;
    author: string;
  };
}

export function useFeaturedPrompts() {
  const [featuredPrompts, setFeaturedPrompts] = useState<FeaturedPrompt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("featured_prompts")
        .select(`
          id,
          prompt_id,
          feature_type,
          display_order,
          is_active,
          prompt:prompts(id, title, description, image_url, image_urls, author)
        `)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      // Filter out any entries where prompt is null (deleted prompts)
      const validData = (data || []).filter(item => item.prompt !== null) as FeaturedPrompt[];
      setFeaturedPrompts(validData);
    } catch (error) {
      console.error("Error fetching featured prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFeaturedPrompt = async (
    promptId: string,
    featureType: "prompt_of_day" | "trending" | "creators_choice"
  ) => {
    try {
      // Get current max display_order for this type
      const { data: existing } = await supabase
        .from("featured_prompts")
        .select("display_order")
        .eq("feature_type", featureType)
        .order("display_order", { ascending: false })
        .limit(1);

      const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

      const { error } = await supabase
        .from("featured_prompts")
        .insert({
          prompt_id: promptId,
          feature_type: featureType,
          display_order: nextOrder,
        });

      if (error) throw error;
      await fetchFeaturedPrompts();
      return true;
    } catch (error) {
      console.error("Error adding featured prompt:", error);
      return false;
    }
  };

  const removeFeaturedPrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from("featured_prompts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchFeaturedPrompts();
      return true;
    } catch (error) {
      console.error("Error removing featured prompt:", error);
      return false;
    }
  };

  const updateDisplayOrder = async (id: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from("featured_prompts")
        .update({ display_order: newOrder })
        .eq("id", id);

      if (error) throw error;
      await fetchFeaturedPrompts();
      return true;
    } catch (error) {
      console.error("Error updating display order:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchFeaturedPrompts();
  }, []);

  const promptOfDay = featuredPrompts.filter(p => p.feature_type === "prompt_of_day");
  const trending = featuredPrompts.filter(p => p.feature_type === "trending");
  const creatorsChoice = featuredPrompts.filter(p => p.feature_type === "creators_choice");

  return {
    featuredPrompts,
    promptOfDay,
    trending,
    creatorsChoice,
    loading,
    addFeaturedPrompt,
    removeFeaturedPrompt,
    updateDisplayOrder,
    refetch: fetchFeaturedPrompts,
  };
}
