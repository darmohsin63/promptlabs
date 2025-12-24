-- Create ad_settings table for managing ad display
CREATE TABLE public.ad_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default ad setting
INSERT INTO public.ad_settings (key, enabled) VALUES ('admaven_ads', true);

-- Enable RLS
ALTER TABLE public.ad_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read ad settings (needed for frontend to check if ads should show)
CREATE POLICY "Anyone can view ad settings"
ON public.ad_settings
FOR SELECT
USING (true);

-- Only admins can update ad settings
CREATE POLICY "Admins can update ad settings"
ON public.ad_settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);