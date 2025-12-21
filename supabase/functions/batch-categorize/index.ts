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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch prompts without category (null or empty array) - include image_url for analysis
    const { data: prompts, error: fetchError } = await supabase
      .from('prompts')
      .select('id, title, content, description, image_url, image_urls')
      .or('category.is.null,category.eq.{}')
      .limit(50);

    if (fetchError) {
      throw fetchError;
    }

    if (!prompts || prompts.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No prompts to categorize',
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${prompts.length} prompts to categorize`);

    let processed = 0;
    const errors: string[] = [];

    for (const prompt of prompts) {
      try {
        // Gather all available images
        const imageUrls: string[] = [];
        if (prompt.image_url) imageUrls.push(prompt.image_url);
        if (prompt.image_urls && Array.isArray(prompt.image_urls)) {
          imageUrls.push(...prompt.image_urls.slice(0, 3));
        }

        const hasImages = imageUrls.length > 0;

        // Build message content with images for vision analysis
        const messageContent: any[] = [];

        const textPrompt = hasImages 
          ? `You are an expert at analyzing AI-generated images. Look at the provided image(s) and generate 1-3 descriptive category tags.

ANALYZE THE IMAGE AND CREATE CATEGORIES BASED ON:
1. Subject/Content: What is the main subject? (e.g., "Portrait", "Landscape", "Fantasy Creature")
2. Art Style: What is the visual style? (e.g., "Photorealistic", "Anime", "Digital Art", "3D Render")
3. Theme/Mood: What is the atmosphere? (e.g., "Dark Fantasy", "Cyberpunk", "Cinematic")

Context (secondary):
Title: ${prompt.title}
Description: ${prompt.description || 'N/A'}

RULES:
- Generate 1-3 SHORT category names (2-3 words max each)
- Focus on VISUAL content
- Each category should be Title Case

Respond with ONLY the category names separated by commas.`
          : `Analyze this AI image prompt and generate 1-3 descriptive category tags.

Title: ${prompt.title}
Description: ${prompt.description || 'N/A'}  
Prompt: ${prompt.content?.substring(0, 600) || 'N/A'}

GENERATE CATEGORIES BASED ON:
1. What the prompt will generate (subject matter)
2. The art/image style being requested
3. The theme or mood

RULES:
- Generate 1-3 SHORT category names (2-3 words max each)
- Each category should be Title Case

Respond with ONLY the category names separated by commas.`;

        messageContent.push({ type: "text", text: textPrompt });

        // Add images for vision analysis
        if (hasImages) {
          for (const imageUrl of imageUrls.slice(0, 2)) {
            if (imageUrl && typeof imageUrl === 'string') {
              messageContent.push({
                type: "image_url",
                image_url: { url: imageUrl }
              });
            }
          }
        }

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { 
                role: 'system', 
                content: 'You are an image analysis expert. Generate precise, descriptive category tags based on visual content. Create short, useful categories that help users find similar content.'
              },
              { role: 'user', content: messageContent }
            ],
          }),
        });

        if (!response.ok) {
          console.error(`AI API error for prompt ${prompt.id}: ${response.status}`);
          errors.push(`Failed to categorize prompt ${prompt.id}`);
          continue;
        }

        const data = await response.json();
        const rawCategories = data.choices?.[0]?.message?.content?.trim() || 'AI Generated';

        // Parse and clean categories
        const parsedCategories = rawCategories
          .split(',')
          .map((c: string) => c.trim().replace(/['"]/g, '').replace(/^\d+\.\s*/, ''))
          .filter((c: string) => c.length > 0 && c.length <= 30)
          .map((c: string) => {
            return c.split(' ')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
          })
          .slice(0, 3);

        const categories = parsedCategories.length > 0 ? parsedCategories : ['AI Generated'];

        // Update prompt with categories array
        const { error: updateError } = await supabase
          .from('prompts')
          .update({ category: categories })
          .eq('id', prompt.id);

        if (updateError) {
          console.error(`Update error for prompt ${prompt.id}:`, updateError);
          errors.push(`Failed to update prompt ${prompt.id}`);
        } else {
          processed++;
          console.log(`Categorized prompt ${prompt.id} as: ${categories.join(', ')}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error(`Error processing prompt ${prompt.id}:`, err);
        errors.push(`Error with prompt ${prompt.id}`);
      }
    }

    return new Response(JSON.stringify({ 
      message: `Categorized ${processed} prompts`,
      processed,
      total: prompts.length,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Batch categorize error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
