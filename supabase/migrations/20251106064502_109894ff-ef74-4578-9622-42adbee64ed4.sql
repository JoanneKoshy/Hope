-- Create a storage bucket for memory photos
insert into storage.buckets (id, name, public)
values ('memory-photos', 'memory-photos', true);

-- Create RLS policies for the memory-photos bucket
-- Allow authenticated users to upload their own photos
create policy "Users can upload their own memory photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'memory-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to memory photos
create policy "Memory photos are publicly accessible"
on storage.objects
for select
to public
using (bucket_id = 'memory-photos');

-- Allow users to update their own photos
create policy "Users can update their own memory photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'memory-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own photos
create policy "Users can delete their own memory photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'memory-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);