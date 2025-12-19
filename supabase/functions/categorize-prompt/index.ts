import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CATEGORIES = [
  "Art & Design",
  "Writing & Content",
  "Code & Development", 
  "Business & Marketing",
  "Education & Learning",
  "Photography",
  "Music & Audio",
  "Video & Animation",
  "Gaming",
  "Social Media",
  "Productivity",
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
    
    // Add text prompt
    const textPrompt = `Analyze this prompt and its images to categorize it into 1-3 most relevant categories from this list: ${CATEGORIES.join(", ")}.

Title: ${title || "N/A"}
Description: ${description || "N/A"}
Content: ${content?.substring(0, 500) || "N/A"}

IMPORTANT: If images are provided, analyze the IMAGE CONTENT to determine the category. For example:
- Images of nature, landscapes, portraits → Photography
- Images of artwork, illustrations, designs → Art & Design
- Images of UI/app screenshots → Code & Development
- Images of charts, presentations → Business & Marketing
- Images of game screenshots → Gaming
- Images of video thumbnails → Video & Animation

Respond with ONLY the category names separated by commas (e.g., "Art & Design, Photography"). Choose 1-3 categories that best fit based primarily on the IMAGES if provided.`;

    messageContent.push({ type: "text", text: textPrompt });

    // Add images for vision analysis (limit to first 3 images)
    if (imageUrls && imageUrls.length > 0) {
      const imagesToAnalyze = imageUrls.slice(0, 3);
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

    console.log("Categorizing prompt:", title);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a prompt categorization assistant. Analyze both text and images to determine the best categories. Respond with only category names separated by commas." },
          { role: "user", content: messageContent }
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ categories: ["Other"] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const rawCategories = data.choices?.[0]?.message?.content?.trim() || "Other";
    
    // Parse and validate categories
    const parsedCategories = rawCategories
      .split(",")
      .map((c: string) => c.trim())
      .filter((c: string) => {
        if (CATEGORIES.includes(c)) return true;
        // Try to find a close match
        const match = CATEGORIES.find(cat => 
          c.toLowerCase().includes(cat.toLowerCase()) || 
          cat.toLowerCase().includes(c.toLowerCase())
        );
        return !!match;
      })
      .map((c: string) => {
        if (CATEGORIES.includes(c)) return c;
        return CATEGORIES.find(cat => 
          c.toLowerCase().includes(cat.toLowerCase()) || 
          cat.toLowerCase().includes(c.toLowerCase())
        ) || c;
      })
      .slice(0, 3); // Max 3 categories

    const categories = parsedCategories.length > 0 ? parsedCategories : ["Other"];

    console.log("Categorized as:", categories);

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
