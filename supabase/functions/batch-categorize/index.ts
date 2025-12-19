import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.88.0";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch prompts without category (null or empty array)
    const { data: prompts, error: fetchError } = await supabase
      .from('prompts')
      .select('id, title, content, description')
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
        const aiPrompt = `Analyze this prompt and categorize it into 1-3 most relevant categories from this list: ${CATEGORIES.join(", ")}.

Title: ${prompt.title}
Content: ${prompt.content?.substring(0, 500) || ''}
Description: ${prompt.description || ''}

Respond with ONLY the category names separated by commas (e.g., "Art & Design, Photography"). Choose 1-3 categories that best fit.`;

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'user', content: aiPrompt }
            ],
          }),
        });

        if (!response.ok) {
          console.error(`AI API error for prompt ${prompt.id}: ${response.status}`);
          errors.push(`Failed to categorize prompt ${prompt.id}`);
          continue;
        }

        const data = await response.json();
        const rawCategories = data.choices?.[0]?.message?.content?.trim() || 'Other';

        // Parse and validate categories
        const parsedCategories = rawCategories
          .split(',')
          .map((c: string) => c.trim())
          .filter((c: string) => {
            if (CATEGORIES.includes(c)) return true;
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
          .slice(0, 3);

        const categories = parsedCategories.length > 0 ? parsedCategories : ['Other'];

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
        await new Promise(resolve => setTimeout(resolve, 200));
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
