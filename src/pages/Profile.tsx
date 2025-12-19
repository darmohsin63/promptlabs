import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, Mail, Camera, Save, ArrowLeft, Bookmark, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptCard } from "@/components/PromptCard";
import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { Prompt } from "@/hooks/usePrompts";

interface ProfileData {
  display_name: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  email: string | null;
}

export default function Profile() {
  const { user, loading: authLoading, isPro, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "saved">("profile");
  
  const [formData, setFormData] = useState({
    display_name: "",
    date_of_birth: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSavedPrompts();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, date_of_birth, avatar_url, email")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        display_name: data.display_name || "",
        date_of_birth: data.date_of_birth || "",
      });
    }
    setLoading(false);
  };

  const fetchSavedPrompts = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("saved_prompts")
      .select("prompt_id, prompts(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      const prompts = data
        .map(s => s.prompts as unknown as Prompt)
        .filter((p): p is Prompt => p !== null);
      setSavedPrompts(prompts);
    }
    setSavedLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("prompt-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("prompt-images")
      .getPublicUrl(fileName);

    const avatarUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    if (updateError) {
      toast({
        title: "Update failed",
        description: updateError.message,
        variant: "destructive",
      });
    } else {
      setProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : null);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated",
      });
    }

    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    const updates: Partial<ProfileData> = {
      display_name: formData.display_name || null,
      date_of_birth: formData.date_of_birth || null,
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your changes have been saved",
      });
      setProfile((prev) => prev ? { ...prev, ...updates } : null);
    }

    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container pt-24 pb-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="glass-panel space-y-6">
              <div className="flex justify-center">
                <Skeleton className="w-24 h-24 rounded-full" />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center mb-8 animate-fade-up">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and saved prompts
            </p>
            {/* Role badge */}
            {(isPro || isAdmin) && (
              <div className="flex justify-center gap-2 mt-3">
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Star className="w-3 h-3" />
                    Admin
                  </span>
                )}
                {isPro && !isAdmin && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    <Star className="w-3 h-3" />
                    Pro
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 justify-center animate-fade-up stagger-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "profile"
                  ? "btn-primary !py-2.5"
                  : "glass-card !rounded-xl text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "saved"
                  ? "btn-primary !py-2.5"
                  : "glass-card !rounded-xl text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Prompts
              <span className="text-xs opacity-70">({savedPrompts.length})</span>
            </button>
          </div>

          {activeTab === "profile" ? (
            <div className="max-w-md mx-auto glass-panel animate-fade-up stagger-2">
              {/* Avatar section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-glow">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (profile?.display_name || profile?.email || "?")[0].toUpperCase()
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-foreground" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Click to change photo
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="display_name" className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Display Name
                  </Label>
                  <Input
                    id="display_name"
                    type="text"
                    placeholder="Your name"
                    value={formData.display_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, display_name: e.target.value }))}
                    className="input-field"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Date of Birth
                  </Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                    className="input-field"
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email
                    <span className="text-xs text-muted-foreground">(cannot be changed)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || user?.email || ""}
                    disabled
                    className="input-field opacity-60 cursor-not-allowed"
                  />
                </div>

                {/* Save Button */}
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full btn-primary h-12 text-base"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </span>
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="animate-fade-up stagger-2">
              {savedLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <PromptCardSkeleton key={i} />
                  ))}
                </div>
              ) : savedPrompts.length === 0 ? (
                <div className="text-center py-16 glass-panel">
                  <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No saved prompts yet</h3>
                  <p className="text-muted-foreground">
                    Click the bookmark icon on any prompt to save it here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPrompts.map((prompt, index) => (
                    <PromptCard key={prompt.id} prompt={prompt} index={index} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
