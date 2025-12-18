-- Create a storage bucket for prompt images
INSERT INTO storage.buckets (id, name, public)
VALUES ('prompt-images', 'prompt-images', true);

-- Allow anyone to view prompt images
CREATE POLICY "Anyone can view prompt images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'prompt-images');

-- Allow authenticated users to upload prompt images
CREATE POLICY "Authenticated users can upload prompt images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'prompt-images' AND auth.role() = 'authenticated');

-- Allow users to update their own images or admins to update any
CREATE POLICY "Users can update own images or admins can update any"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'prompt-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));

-- Allow users to delete their own images or admins to delete any
CREATE POLICY "Users can delete own images or admins can delete any"
ON storage.objects
FOR DELETE
USING (bucket_id = 'prompt-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));