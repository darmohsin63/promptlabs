-- Create prompt_ratings table for storing user ratings
CREATE TABLE public.prompt_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(prompt_id, user_id)
);

-- Enable RLS
ALTER TABLE public.prompt_ratings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view ratings"
ON public.prompt_ratings FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can rate"
ON public.prompt_ratings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
ON public.prompt_ratings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
ON public.prompt_ratings FOR DELETE
USING (auth.uid() = user_id);

-- Add max_stars setting to ad_settings
INSERT INTO public.ad_settings (key, enabled) 
VALUES ('max_rating_stars', true)
ON CONFLICT (key) DO NOTHING;

-- Create a separate table for numeric settings
CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value integer NOT NULL DEFAULT 5,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for app_settings
CREATE POLICY "Anyone can view settings"
ON public.app_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can update settings"
ON public.app_settings FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert settings"
ON public.app_settings FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default max stars setting
INSERT INTO public.app_settings (key, value) VALUES ('max_rating_stars', 5);

-- Trigger to update updated_at
CREATE TRIGGER update_prompt_ratings_updated_at
BEFORE UPDATE ON public.prompt_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();