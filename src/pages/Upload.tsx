import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ImagePlus, Sparkles, Upload as UploadIcon, X } from "lucide-react";
import { Header } from "@/components/Header";
import { usePrompts } from "@/hooks/usePrompts";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { uploadPromptImage } from "@/lib/uploadImage";

const UploadPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  
  const { addPrompt, updatePrompt, getPromptById } = usePrompts();
  const { user, isAdmin, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    image_url: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
          });
          if (data.image_url) {
            setPreviewImage(data.image_url);
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
      setPreviewImage(value);
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setFormData((prev) => ({ ...prev, image_url: "" }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewImage("");
    setFormData((prev) => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

    // Upload file if selected
    if (selectedFile) {
      const uploadedUrl = await uploadPromptImage(selectedFile, user.id);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        toast({
          title: "Image upload failed",
          description: "Failed to upload image, but you can still save the prompt",
          variant: "destructive",
        });
      }
    }

    const promptData = {
      title: formData.title,
      description: formData.description || formData.title,
      content: formData.content,
      author: formData.author,
      image_url: imageUrl,
    };

    let error;
    
    if (editId) {
      // Update existing prompt
      const result = await updatePrompt(editId, promptData);
      error = result.error;
    } else {
      // Create new prompt
      const result = await addPrompt(promptData, user.id);
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
      title: editId ? "Prompt updated!" : "Prompt added!",
      description: editId 
        ? "Your prompt has been updated successfully" 
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
            {/* Image Preview */}
            <div className="glass-panel !p-0 overflow-hidden">
              <div className="relative aspect-video flex items-center justify-center bg-muted/30">
                {previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewImage("")}
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground p-8">
                    <ImagePlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Upload an image or enter a URL</p>
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <UploadIcon className="w-4 h-4" />
                    Choose File
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : "No file chosen"}
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
                  disabled={!!selectedFile}
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
                  {editId ? "Update Prompt" : "Publish Prompt"}
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
