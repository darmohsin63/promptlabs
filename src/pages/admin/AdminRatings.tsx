import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Save } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useMaxStars } from "@/hooks/useRatings";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { StarRating } from "@/components/StarRating";

export default function AdminRatings() {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const { maxStars, loading, updateMaxStars } = useMaxStars();
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Redirect if not admin
  if (!authLoading && !isAdmin) {
    navigate("/admin");
    return null;
  }

  const currentValue = selectedStars ?? maxStars;

  const handleSave = async () => {
    if (selectedStars === null || selectedStars === maxStars) return;
    
    setSaving(true);
    const { error } = await updateMaxStars(selectedStars);
    setSaving(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update max stars setting",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved!",
        description: `Rating system now uses ${selectedStars} stars`,
      });
      setSelectedStars(null);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container pt-24 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container pt-20 pb-12 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-up">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="glass-card !rounded-full p-2 hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Rating Settings</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-panel animate-fade-up">
            <h2 className="text-lg font-semibold mb-4">Maximum Rating Stars</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Configure how many stars are displayed in the rating system. Users will be able to rate prompts from 1 to this number.
            </p>

            <div className="space-y-6">
              {/* Star options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[3, 5, 7, 10].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setSelectedStars(stars)}
                    className={`glass-card !rounded-xl p-4 text-center transition-all duration-200 ${
                      currentValue === stars
                        ? "ring-2 ring-primary bg-primary/10"
                        : "hover:bg-secondary/80"
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{stars}</div>
                    <div className="text-xs text-muted-foreground">stars</div>
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="p-4 bg-secondary/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-3">Preview:</p>
                <StarRating maxStars={currentValue} rating={Math.ceil(currentValue / 2)} readonly size="lg" showValue />
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving || selectedStars === null || selectedStars === maxStars}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
