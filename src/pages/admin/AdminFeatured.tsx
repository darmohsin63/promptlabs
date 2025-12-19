import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useFeaturedPrompts } from "@/hooks/useFeaturedPrompts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Sparkles, TrendingUp, Star, GripVertical } from "lucide-react";

interface Prompt {
  id: string;
  title: string;
  author: string;
  image_url: string | null;
  image_urls: string[] | null;
}

const FEATURE_TYPES = [
  { id: "prompt_of_day", label: "Prompt of the Day", icon: Sparkles },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "creators_choice", label: "Creator's Choice", icon: Star },
] as const;

export default function AdminFeatured() {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const { 
    promptOfDay, 
    trending, 
    creatorsChoice, 
    loading: featuredLoading,
    addFeaturedPrompt,
    removeFeaturedPrompt,
    refetch
  } = useFeaturedPrompts();
  
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"prompt_of_day" | "trending" | "creators_choice">("prompt_of_day");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("id, title, author, image_url, image_urls")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPrompts(data);
      }
    };

    if (isAdmin) {
      fetchPrompts();
    }
  }, [isAdmin]);

  const handleAddFeatured = async () => {
    if (!selectedPrompt) {
      toast.error("Please select a prompt");
      return;
    }

    setIsAdding(true);
    const success = await addFeaturedPrompt(selectedPrompt, selectedType);
    setIsAdding(false);

    if (success) {
      toast.success("Added to featured prompts");
      setSelectedPrompt("");
    } else {
      toast.error("Failed to add. It might already be featured in this section.");
    }
  };

  const handleRemove = async (id: string) => {
    const success = await removeFeaturedPrompt(id);
    if (success) {
      toast.success("Removed from featured");
    } else {
      toast.error("Failed to remove");
    }
  };

  const getImageUrl = (prompt: { image_url: string | null; image_urls: string[] | null }) => {
    if (prompt.image_urls && prompt.image_urls.length > 0) {
      return prompt.image_urls[0];
    }
    return prompt.image_url || "/placeholder.svg";
  };

  const renderSection = (
    title: string,
    items: typeof promptOfDay,
    Icon: React.ComponentType<{ className?: string }>
  ) => (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg">{title}</CardTitle>
        <span className="ml-auto text-sm text-muted-foreground">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">
            No prompts in this section yet
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                <span className="text-sm font-medium text-muted-foreground w-6">
                  #{index + 1}
                </span>
                <img
                  src={getImageUrl(item.prompt)}
                  alt={item.prompt.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.prompt.title}</p>
                  <p className="text-sm text-muted-foreground">by {item.prompt.author}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (authLoading || featuredLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 container px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-48" />
            <div className="h-64 bg-secondary rounded" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8 container px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-2xl font-bold mb-6">Manage Featured Prompts</h1>

        {/* Add New Featured */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Featured Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedType} onValueChange={(v: any) => setSelectedType(v)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {FEATURE_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a prompt" />
                </SelectTrigger>
                <SelectContent>
                  {prompts.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.title} - by {prompt.author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleAddFeatured} disabled={isAdding || !selectedPrompt}>
                {isAdding ? "Adding..." : "Add"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        {renderSection("Prompt of the Day", promptOfDay, Sparkles)}
        {renderSection("Trending", trending, TrendingUp)}
        {renderSection("Creator's Choice", creatorsChoice, Star)}
      </main>
    </div>
  );
}
