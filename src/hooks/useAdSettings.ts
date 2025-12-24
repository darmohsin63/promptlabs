import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdSettings() {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdSettings = async () => {
      const { data } = await supabase
        .from("ad_settings")
        .select("enabled")
        .eq("key", "admaven_ads")
        .single();

      if (data) {
        setAdsEnabled(data.enabled);
      }
      setLoading(false);
    };

    fetchAdSettings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("ad_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ad_settings",
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'enabled' in payload.new) {
            setAdsEnabled(payload.new.enabled as boolean);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { adsEnabled, loading };
}
