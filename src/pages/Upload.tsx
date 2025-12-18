import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { usePrompts } from "@/hooks/usePrompts";
import { toast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { addPrompt } = usePrompts();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    promptText: "",
    author: "",
    imageUrl: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "imageUrl" && value) {
      setPreviewImage(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.promptText || !formData.author) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addPrompt({
      title: formData.title,
      description: formData.description || formData.title,
      promptText: formData.promptText,
      author: formData.author,
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    });

    toast({
      title: "Prompt added!",
      description: "Your prompt has been published successfully",
    });

    navigate("/");
  };

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
              <label htmlFor="imageUrl" className="block text-sm font-medium text-foreground mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
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
              <label htmlFor="promptText" className="block text-sm font-medium text-foreground mb-2">
                Full Prompt <span className="text-destructive">*</span>
              </label>
              <textarea
                id="promptText"
                name="promptText"
                value={formData.promptText}
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
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              <Sparkles className="w-5 h-5" />
              Publish Prompt
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Upload;
