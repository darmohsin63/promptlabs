-- Fix: Require authentication for feedback submissions
-- This prevents unauthenticated database API bypass

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can submit feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);