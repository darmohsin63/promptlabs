-- Add category column to prompts table
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS category TEXT;