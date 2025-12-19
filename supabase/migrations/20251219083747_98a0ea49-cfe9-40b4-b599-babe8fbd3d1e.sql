-- Add length constraints to prompts table to prevent oversized content
-- Using CHECK constraints for content length validation

-- Add length constraint for title (max 200 chars)
ALTER TABLE public.prompts 
  ADD CONSTRAINT prompts_title_length CHECK (length(title) <= 200);

-- Add length constraint for author (max 100 chars)
ALTER TABLE public.prompts 
  ADD CONSTRAINT prompts_author_length CHECK (length(author) <= 100);

-- Add length constraint for description (max 500 chars)
ALTER TABLE public.prompts 
  ADD CONSTRAINT prompts_description_length CHECK (description IS NULL OR length(description) <= 500);

-- Add length constraint for content (max 10000 chars)
ALTER TABLE public.prompts 
  ADD CONSTRAINT prompts_content_length CHECK (length(content) <= 10000);

-- Add length constraint for image_url (max 2000 chars for URLs)
ALTER TABLE public.prompts 
  ADD CONSTRAINT prompts_image_url_length CHECK (image_url IS NULL OR length(image_url) <= 2000);

-- Add length constraints to feedback table
ALTER TABLE public.feedback
  ADD CONSTRAINT feedback_email_length CHECK (length(email) <= 255);

ALTER TABLE public.feedback
  ADD CONSTRAINT feedback_message_length CHECK (length(message) <= 2000);

-- Add length constraints to profiles table
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_display_name_length CHECK (display_name IS NULL OR length(display_name) <= 100);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_email_length CHECK (email IS NULL OR length(email) <= 255);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_avatar_url_length CHECK (avatar_url IS NULL OR length(avatar_url) <= 2000);