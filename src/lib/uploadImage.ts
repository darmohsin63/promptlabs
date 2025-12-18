import { supabase } from "@/integrations/supabase/client";

export async function uploadPromptImage(file: File, userId: string): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('prompt-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('prompt-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export async function deletePromptImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/prompt-images/');
    if (pathParts.length < 2) return false;
    
    const filePath = pathParts[1];
    
    const { error } = await supabase.storage
      .from('prompt-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
