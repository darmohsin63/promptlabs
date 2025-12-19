-- Add scheduled publishing support
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add multiple images support (array of URLs)
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT NULL;

-- Add date of birth to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE DEFAULT NULL;

-- Create index for scheduled prompts
CREATE INDEX IF NOT EXISTS idx_prompts_scheduled_at ON public.prompts(scheduled_at) WHERE scheduled_at IS NOT NULL;

-- Add UPDATE policy for profiles (users can update their own profile)
-- First drop if exists to avoid duplicates
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);