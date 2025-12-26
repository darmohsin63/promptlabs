import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Rating {
  id: string;
  prompt_id: string;
  user_id: string;
  rating: number;
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
}

export function useRatings(promptId?: string) {
  const { user } = useAuth();
  const [stats, setStats] = useState<RatingStats>({
    averageRating: 0,
    totalRatings: 0,
    userRating: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchRatings = useCallback(async () => {
    if (!promptId) return;

    setLoading(true);
    
    // Fetch all ratings for this prompt
    const { data: ratings, error } = await supabase
      .from("prompt_ratings")
      .select("*")
      .eq("prompt_id", promptId);

    if (error) {
      console.error("Error fetching ratings:", error);
      setLoading(false);
      return;
    }

    if (ratings && ratings.length > 0) {
      const totalRatings = ratings.length;
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      const averageRating = sum / totalRatings;
      const userRating = user 
        ? ratings.find(r => r.user_id === user.id)?.rating || null 
        : null;

      setStats({ averageRating, totalRatings, userRating });
    } else {
      setStats({ averageRating: 0, totalRatings: 0, userRating: null });
    }

    setLoading(false);
  }, [promptId, user]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const ratePrompt = async (rating: number) => {
    if (!promptId || !user) return { error: new Error("Not authenticated") };

    // Check if user already rated
    const { data: existing } = await supabase
      .from("prompt_ratings")
      .select("id")
      .eq("prompt_id", promptId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      // Update existing rating
      const { error } = await supabase
        .from("prompt_ratings")
        .update({ rating })
        .eq("id", existing.id);

      if (!error) {
        await fetchRatings();
      }
      return { error };
    } else {
      // Insert new rating
      const { error } = await supabase
        .from("prompt_ratings")
        .insert({ prompt_id: promptId, user_id: user.id, rating });

      if (!error) {
        await fetchRatings();
      }
      return { error };
    }
  };

  return { stats, loading, ratePrompt, refetch: fetchRatings };
}

export function useMaxStars() {
  const [maxStars, setMaxStars] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaxStars();
  }, []);

  const fetchMaxStars = async () => {
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "max_rating_stars")
      .maybeSingle();

    if (!error && data) {
      setMaxStars(data.value);
    }
    setLoading(false);
  };

  const updateMaxStars = async (value: number) => {
    const { error } = await supabase
      .from("app_settings")
      .update({ value })
      .eq("key", "max_rating_stars");

    if (!error) {
      setMaxStars(value);
    }
    return { error };
  };

  return { maxStars, loading, updateMaxStars, refetch: fetchMaxStars };
}
