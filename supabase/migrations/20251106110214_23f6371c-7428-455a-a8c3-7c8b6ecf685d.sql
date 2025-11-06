-- Allow anyone to upload to memory-photos bucket
CREATE POLICY "Allow public uploads to memory-photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'memory-photos');

-- Allow users to update their own files
CREATE POLICY "Allow users to update their own files"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'memory-photos');

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'memory-photos');