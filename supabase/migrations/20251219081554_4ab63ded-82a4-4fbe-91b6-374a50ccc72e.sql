-- Add approval status to prompts
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT true;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id);

-- Create saved_prompts table for bookmarking
CREATE TABLE public.saved_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

-- Enable RLS
ALTER TABLE public.saved_prompts ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_prompts
CREATE POLICY "Users can view own saved prompts"
ON public.saved_prompts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can save prompts"
ON public.saved_prompts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave prompts"
ON public.saved_prompts FOR DELETE
USING (auth.uid() = user_id);

-- Update prompts policy to only show approved prompts (or user's own)
DROP POLICY IF EXISTS "Anyone can view prompts" ON public.prompts;
CREATE POLICY "Anyone can view approved prompts or own prompts"
ON public.prompts FOR SELECT
USING (is_approved = true OR auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Pro users can create prompts (pending approval)
DROP POLICY IF EXISTS "Users can create own prompts" ON public.prompts;
CREATE POLICY "Users and Pro can create prompts"
ON public.prompts FOR INSERT
WITH CHECK (auth.uid() = user_id AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pro'::app_role)));

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_prompts_user_id ON public.saved_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_is_approved ON public.prompts(is_approved);