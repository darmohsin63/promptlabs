import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CATEGORIES = [
  "Art & Illustration",
  "Photography & Images",
  "Digital Art & 3D",
  "Character Design",
  "Landscape & Nature",
  "Portrait & People",
  "Abstract & Conceptual",
  "Product & Commercial",
  "Architecture & Interior",
  "Fashion & Style",
  "Food & Lifestyle",
  "Animals & Wildlife",
  "Fantasy & Sci-Fi",
  "Anime & Manga",
  "Logo & Branding",
  "UI/UX Design",
  "Writing & Content",
  "Code & Development",
  "Other"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, description, imageUrls } = await req.json();
    
    if (!content && !title && (!imageUrls || imageUrls.length === 0)) {
      return new Response(
        JSON.stringify({ error: "Title, content, or images are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ categories: ["Other"] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the message content with images if available
    const messageContent: any[] = [];
    
    // Determine if we have images
    const hasImages = imageUrls && imageUrls.length > 0;
    
    // Add text prompt - prioritize image analysis
    const textPrompt = hasImages 
      ? `You are an expert at categorizing AI-generated images and artwork. Analyze the provided image(s) carefully and categorize them.

Available categories: ${CATEGORIES.join(", ")}

FOCUS ON THE VISUAL CONTENT OF THE IMAGES:
- What is the main subject? (person, landscape, object, abstract shapes, character, animal, etc.)
- What is the art style? (realistic photo, digital painting, 3D render, anime/manga, illustration, etc.)
- What is the mood/theme? (fantasy, sci-fi, nature, urban, commercial, etc.)

Context (secondary importance):
Title: ${title || "N/A"}
Description: ${description || "N/A"}

Rules:
1. ONLY look at the images to determine categories - ignore text if it contradicts what you see
2. Choose 1-3 categories that BEST describe the visual content
3. Be specific - "Portrait & People" for faces, "Landscape & Nature" for scenery, "Character Design" for stylized characters
4. For photorealistic images use "Photography & Images", for painted/illustrated use "Art & Illustration" or more specific categories
5. Respond with ONLY category names separated by commas, nothing else`
      : `Categorize this prompt into 1-3 categories from: ${CATEGORIES.join(", ")}

Title: ${title || "N/A"}
Description: ${description || "N/A"}  
Content: ${content?.substring(0, 500) || "N/A"}

Respond with ONLY category names separated by commas.`;

    messageContent.push({ type: "text", text: textPrompt });

    // Add images for vision analysis (limit to first 4 images)
    if (hasImages) {
      const imagesToAnalyze = imageUrls.slice(0, 4);
      for (const imageUrl of imagesToAnalyze) {
        if (imageUrl && typeof imageUrl === 'string') {
          messageContent.push({
            type: "image_url",
            image_url: { url: imageUrl }
          });
        }
      }
      console.log(`Analyzing ${imagesToAnalyze.length} images for categorization`);
    }

    console.log("Categorizing prompt:", title, "hasImages:", hasImages);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are an image categorization expert. Your primary task is to analyze images and categorize them based on their visual content. Always prioritize what you SEE in the image over any text description. Be precise and specific in your categorization."
          },
          { role: "user", content: messageContent }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ categories: ["Other"] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const rawCategories = data.choices?.[0]?.message?.content?.trim() || "Other";
    
    console.log("Raw AI response:", rawCategories);
    
    // Parse and validate categories
    const parsedCategories = rawCategories
      .split(",")
      .map((c: string) => c.trim().replace(/['"]/g, ''))
      .filter((c: string) => c.length > 0)
      .map((c: string) => {
        // Direct match
        if (CATEGORIES.includes(c)) return c;
        // Case-insensitive match
        const exactMatch = CATEGORIES.find(cat => cat.toLowerCase() === c.toLowerCase());
        if (exactMatch) return exactMatch;
        // Partial match
        const partialMatch = CATEGORIES.find(cat => 
          c.toLowerCase().includes(cat.toLowerCase()) || 
          cat.toLowerCase().includes(c.toLowerCase())
        );
        return partialMatch || null;
      })
      .filter((c: string | null): c is string => c !== null)
      .slice(0, 3); // Max 3 categories

    // Remove duplicates
    const uniqueCategories = [...new Set(parsedCategories)];
    const categories = uniqueCategories.length > 0 ? uniqueCategories : ["Other"];

    console.log("Final categories:", categories);

    return new Response(
      JSON.stringify({ categories }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error categorizing prompt:", error);
    return new Response(
      JSON.stringify({ categories: ["Other"] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
