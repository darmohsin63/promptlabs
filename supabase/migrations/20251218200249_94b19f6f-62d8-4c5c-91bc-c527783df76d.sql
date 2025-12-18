-- Create feedback table for suggestions/complaints
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can submit feedback (no auth required)
CREATE POLICY "Anyone can submit feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view feedback
CREATE POLICY "Admins can view feedback" 
ON public.feedback 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update feedback (mark as read)
CREATE POLICY "Admins can update feedback" 
ON public.feedback 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete feedback
CREATE POLICY "Admins can delete feedback" 
ON public.feedback 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));