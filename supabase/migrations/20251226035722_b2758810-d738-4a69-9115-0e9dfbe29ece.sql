-- Add admin rating fields to prompts table
ALTER TABLE public.prompts 
ADD COLUMN admin_rating numeric(3,2) DEFAULT NULL,
ADD COLUMN admin_rating_count integer DEFAULT NULL;