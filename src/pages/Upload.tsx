import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ImagePlus, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { usePrompts } from "@/hooks/usePrompts";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { addPrompt } = usePrompts();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    image_url: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add prompts",
      });
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "image_url" && value) {
      setPreviewImage(value);
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

    const { error } = await addPrompt(
      {
        title: formData.title,
        description: formData.description || formData.title,
        content: formData.content,
        author: formData.author,
        image_url: formData.image_url || null,
      },
      user.id
    );

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
      title: "Prompt added!",
      description: "Your prompt has been published successfully",
    });

    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sign in required</h1>
          <p className="text-muted-foreground mb-8">
            You need to sign in to add prompts.
          </p>
          <Link to="/auth" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Share Your Prompt
            </h1>
            <p className="text-muted-foreground">
              Add a new prompt to the collection and help others create amazing content.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preview Image
              </label>
              <div className="relative rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewImage("")}
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImagePlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Enter an image URL below</p>
                  </div>
                )}
              </div>
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
              />
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
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              <Sparkles className="w-5 h-5" />
              {isSubmitting ? "Publishing..." : "Publish Prompt"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Upload;
