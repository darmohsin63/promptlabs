import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Megaphone } from "lucide-react";
import { toast } from "sonner";

export default function AdminAds() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdSettings();
    }
  }, [isAdmin]);

  const fetchAdSettings = async () => {
    setDataLoading(true);
    const { data, error } = await supabase
      .from("ad_settings")
      .select("*")
      .eq("key", "admaven_ads")
      .single();

    if (data) {
      setAdsEnabled(data.enabled);
    }
    setDataLoading(false);
  };

  const handleToggle = async (enabled: boolean) => {
    setUpdating(true);
    const { error } = await supabase
      .from("ad_settings")
      .update({ 
        enabled, 
        updated_at: new Date().toISOString(),
        updated_by: user?.id 
      })
      .eq("key", "admaven_ads");

    if (error) {
      toast.error("Failed to update ad settings");
    } else {
      setAdsEnabled(enabled);
      toast.success(enabled ? "Ads enabled" : "Ads disabled");
    }
    setUpdating(false);
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-20 pb-12 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-up">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <Megaphone className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Ad Settings</h1>
              <p className="text-muted-foreground text-sm">Manage advertisement display</p>
            </div>
          </div>
        </div>

        {/* Ad Settings Card */}
        <div className="glass-panel max-w-lg animate-fade-up stagger-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">AdMaven Ads</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Toggle to enable or disable all AdMaven advertisements on the website
              </p>
            </div>
            <Switch
              checked={adsEnabled}
              onCheckedChange={handleToggle}
              disabled={updating}
            />
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Status: <span className={adsEnabled ? "text-primary" : "text-destructive"}>
                {adsEnabled ? "Ads are currently displayed" : "Ads are currently hidden"}
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
