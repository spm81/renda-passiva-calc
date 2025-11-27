-- Criar bucket para saves de utilizadores
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('user-saves', 'user-saves', false, 5242880, ARRAY['application/json'])
ON CONFLICT (id) DO NOTHING;

-- RLS policies para o bucket
CREATE POLICY "Users can upload their own saves"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-saves' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read their own saves"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-saves' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own saves"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-saves' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own saves"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-saves' AND
  (storage.foldername(name))[1] = auth.uid()::text
);