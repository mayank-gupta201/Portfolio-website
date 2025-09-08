-- Storage policies to allow user uploads and public reads for avatars, projects, and certificates buckets

-- Public read access for avatars
CREATE POLICY "Public read access for avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Users can upload to their own folder in avatars
CREATE POLICY "Users can upload avatars to their own folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public read access for projects
CREATE POLICY "Public read access for projects"
ON storage.objects
FOR SELECT
USING (bucket_id = 'projects');

-- Users can upload to their own folder in projects
CREATE POLICY "Users can upload projects to their own folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'projects'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own project files
CREATE POLICY "Users can update their own project files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'projects'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'projects'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own project files
CREATE POLICY "Users can delete their own project files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'projects'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public read access for certificates
CREATE POLICY "Public read access for certificates"
ON storage.objects
FOR SELECT
USING (bucket_id = 'certificates');

-- Users can upload to their own folder in certificates
CREATE POLICY "Users can upload certificates to their own folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'certificates'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own certificate files
CREATE POLICY "Users can update their own certificate files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'certificates'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'certificates'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own certificate files
CREATE POLICY "Users can delete their own certificate files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'certificates'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);