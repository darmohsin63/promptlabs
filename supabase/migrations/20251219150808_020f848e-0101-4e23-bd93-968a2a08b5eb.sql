-- Change category column from text to text array
ALTER TABLE public.prompts 
ALTER COLUMN category TYPE text[] 
USING CASE 
  WHEN category IS NOT NULL THEN ARRAY[category] 
  ELSE NULL 
END;