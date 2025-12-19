-- Create featured_prompts table to manage Prompt of Day, Trending, Creator's Choice
CREATE TABLE public.featured_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL CHECK (feature_type IN ('prompt_of_day', 'trending', 'creators_choice')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(prompt_id, feature_type)
);

-- Enable RLS
ALTER TABLE public.featured_prompts ENABLE ROW LEVEL SECURITY;

-- Anyone can view active featured prompts
CREATE POLICY "Anyone can view active featured prompts"
ON public.featured_prompts
FOR SELECT
USING (is_active = true);

-- Admins can manage featured prompts
CREATE POLICY "Admins can insert featured prompts"
ON public.featured_prompts
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update featured prompts"
ON public.featured_prompts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete featured prompts"
ON public.featured_prompts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_featured_prompts_updated_at
BEFORE UPDATE ON public.featured_prompts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();