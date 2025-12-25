import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.88.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Server-side authentication and authorization
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user token and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError?.message || "No user found");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin, pro, or super_admin role
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) {
      console.error("Roles fetch error:", rolesError.message);
      return new Response(
        JSON.stringify({ error: "Failed to verify permissions" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const allowedRoles = ['admin', 'pro', 'super_admin'];
    const hasPermission = roles?.some(r => allowedRoles.includes(r.role));
    
    if (!hasPermission) {
      console.error("User lacks required role:", user.id);
      return new Response(
        JSON.stringify({ error: "Forbidden - insufficient permissions" }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
        JSON.stringify({ categories: ["AI Generated"] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the message content with images if available
    const messageContent: any[] = [];
    
    // Determine if we have images
    const hasImages = imageUrls && imageUrls.length > 0;
    
    // Dynamic AI categorization prompt - no predefined categories
    const textPrompt = hasImages 
      ? `You are an expert at analyzing AI-generated images and artwork. Look at the provided image(s) carefully and generate 1-3 descriptive category tags that best describe what you SEE.

ANALYZE THE IMAGE AND CREATE CATEGORIES BASED ON:
1. **Subject/Content**: What is the main subject? (e.g., "Portrait", "Landscape", "Animal", "Fantasy Creature", "Product", "Food", "Architecture")
2. **Art Style**: What is the visual style? (e.g., "Photorealistic", "Anime", "Oil Painting", "Digital Art", "3D Render", "Watercolor", "Pixel Art")
3. **Theme/Mood**: What is the atmosphere or genre? (e.g., "Dark Fantasy", "Cyberpunk", "Vintage", "Minimalist", "Surreal", "Cinematic")

RULES:
- Generate 1-3 SHORT, descriptive category names (2-3 words max each)
- Categories should be SPECIFIC to what you see in the image
- Make categories useful for users searching/filtering similar images
- Focus on VISUAL content, not the text description
- Each category should be Title Case

Context (secondary, only if image is unclear):
Title: ${title || "N/A"}
Description: ${description || "N/A"}

Respond with ONLY the category names separated by commas (e.g., "Portrait Photography, Cinematic Lighting, Dark Mood")`
      : `Analyze this AI image prompt and generate 1-3 descriptive category tags.

Title: ${title || "N/A"}
Description: ${description || "N/A"}  
Prompt: ${content?.substring(0, 800) || "N/A"}

GENERATE CATEGORIES BASED ON:
1. What the prompt will generate (subject matter)
2. The art/image style being requested
3. The theme or mood

RULES:
- Generate 1-3 SHORT category names (2-3 words max each)
- Categories should be SPECIFIC and descriptive
- Make categories useful for filtering/searching
- Each category should be Title Case

Respond with ONLY the category names separated by commas.`;

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

    console.log("Categorizing prompt:", title, "hasImages:", hasImages, "userId:", user.id);

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
            content: "You are an image analysis expert specializing in AI-generated art. Your task is to create precise, descriptive category tags based on visual content. Always prioritize what you SEE in images. Generate short, useful categories that would help users find similar content. Never use generic categories like 'Other' or 'Miscellaneous'."
          },
          { role: "user", content: messageContent }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ categories: ["AI Generated"] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const rawCategories = data.choices?.[0]?.message?.content?.trim() || "AI Generated";
    
    console.log("Raw AI response:", rawCategories);
    
    // Parse and clean categories
    const parsedCategories = rawCategories
      .split(",")
      .map((c: string) => c.trim().replace(/['"]/g, '').replace(/^\d+\.\s*/, ''))
      .filter((c: string) => c.length > 0 && c.length <= 30) // Max 30 chars per category
      .map((c: string) => {
        // Convert to Title Case
        return c.split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      })
      .slice(0, 3); // Max 3 categories

    // Remove duplicates
    const uniqueCategories = [...new Set(parsedCategories)];
    const categories = uniqueCategories.length > 0 ? uniqueCategories : ["AI Generated"];

    console.log("Final categories:", categories);

    return new Response(
      JSON.stringify({ categories }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error categorizing prompt:", error);
    return new Response(
      JSON.stringify({ categories: ["AI Generated"] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
