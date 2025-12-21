import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, Mail, Camera, Save, ArrowLeft, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
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
        <div className="max-w-md mx-auto">
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
              Manage your account settings
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

          <div className="glass-panel animate-fade-up stagger-1">
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
        </div>
      </main>
    </div>
  );
}
