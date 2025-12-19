import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ImagePlus, Sparkles, Upload as UploadIcon, X, Calendar, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { usePrompts } from "@/hooks/usePrompts";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { uploadPromptImage } from "@/lib/uploadImage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UploadPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  
  const { addPrompt, updatePrompt, getPromptById } = usePrompts();
  const { user, isAdmin, loading } = useAuth();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    image_url: "",
    scheduled_at: "",
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);

  // Load existing prompt data if editing
  useEffect(() => {
    if (editId && user && isAdmin) {
      setIsLoadingPrompt(true);
      getPromptById(editId).then(({ data }) => {
        if (data) {
          setFormData({
            title: data.title,
            description: data.description || "",
            content: data.content,
            author: data.author,
            image_url: data.image_url || "",
            scheduled_at: "",
          });
          if (data.image_url) {
            setPreviewImages([data.image_url]);
          }
        }
        setIsLoadingPrompt(false);
      });
    }
  }, [editId, user, isAdmin, getPromptById]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({
        title: "Admin access required",
        description: "Only admins can add prompts",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "image_url" && value) {
      setPreviewImages([value]);
      setSelectedFiles([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select image files only",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is over 5MB limit`,
          variant: "destructive",
        });
        return;
      }

      newFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === newFiles.length) {
          setPreviewImages((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (newFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setFormData((prev) => ({ ...prev, image_url: "" }));
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add prompts",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.content || !formData.author) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    let imageUrl = formData.image_url || null;
    const imageUrls: string[] = [];

    // Upload all selected files
    for (const file of selectedFiles) {
      const uploadedUrl = await uploadPromptImage(file, user.id);
      if (uploadedUrl) {
        imageUrls.push(uploadedUrl);
        if (!imageUrl) imageUrl = uploadedUrl; // Set first as main image
      }
    }

    const promptData: Record<string, unknown> = {
      title: formData.title,
      description: formData.description || formData.title,
      content: formData.content,
      author: formData.author,
      image_url: imageUrl,
      image_urls: imageUrls.length > 0 ? imageUrls : null,
    };

    // Add scheduled_at if provided
    if (formData.scheduled_at) {
      promptData.scheduled_at = new Date(formData.scheduled_at).toISOString();
    }

    let error;
    
    if (editId) {
      const result = await updatePrompt(editId, promptData as Parameters<typeof updatePrompt>[1]);
      error = result.error;
    } else {
      const result = await addPrompt(promptData as Parameters<typeof addPrompt>[0], user.id);
      error = result.error;
    }

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: editId ? "Prompt updated!" : formData.scheduled_at ? "Prompt scheduled!" : "Prompt added!",
      description: editId 
        ? "Your prompt has been updated successfully" 
        : formData.scheduled_at 
          ? `Will be published on ${new Date(formData.scheduled_at).toLocaleDateString()}`
          : "Your prompt has been published successfully",
    });

    navigate("/");
  };

  if (loading || isLoadingPrompt) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container pt-24 pb-12 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container pt-24 pb-12 px-4 text-center">
          <div className="glass-panel max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-4">Admin Access Required</h1>
            <p className="text-muted-foreground mb-8">
              Only administrators can add new prompts.
            </p>
            <Link to="/" className="btn-primary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 animate-fade-up">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center mb-6 shadow-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {editId ? "Edit Prompt" : "Share Your Prompt"}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {editId 
                ? "Update the prompt details below."
                : "Add a new prompt to the collection and help others create amazing content."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up stagger-1">
            {/* Image Gallery Preview */}
            <div className="glass-panel !p-0 overflow-hidden">
              {previewImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4">
                  {previewImages.map((img, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden group">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => {
                          setPreviewImages((prev) => prev.filter((_, i) => i !== index));
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                  {/* Add more button */}
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[0]?.click()}
                    className="aspect-video rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                  </button>
                </div>
              ) : (
                <div className="relative aspect-video flex items-center justify-center bg-muted/30">
                  <div className="text-center text-muted-foreground p-8">
                    <ImagePlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Upload images or enter a URL</p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Upload Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Images (multiple allowed)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={(el) => (fileInputRefs.current[0] = el)}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[0]?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <UploadIcon className="w-4 h-4" />
                    Choose Files
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "No files chosen"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-foreground mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                  disabled={selectedFiles.length > 0}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Prompt Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Cinematic Portrait Photography"
                className="input-field"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Short Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of what this prompt creates"
                className="input-field"
              />
            </div>

            {/* Prompt Text */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
                Full Prompt <span className="text-destructive">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter the complete prompt text..."
                rows={6}
                className="input-field resize-none"
                required
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-foreground mb-2">
                Author Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Your name"
                className="input-field"
                required
              />
            </div>

            {/* Scheduled Publishing */}
            <div className="glass-card p-4 !rounded-2xl border border-primary/20">
              <Label htmlFor="scheduled_at" className="flex items-center gap-2 text-sm font-medium mb-3">
                <Calendar className="w-4 h-4 text-primary" />
                Schedule Publishing (Optional)
              </Label>
              <Input
                type="datetime-local"
                id="scheduled_at"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleChange}
                className="input-field"
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Leave empty to publish immediately
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {editId ? "Updating..." : "Publishing..."}
                </span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {editId ? "Update Prompt" : formData.scheduled_at ? "Schedule Prompt" : "Publish Prompt"}
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
