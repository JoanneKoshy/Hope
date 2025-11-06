-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view shared memories" ON public.shared_memories;
DROP POLICY IF EXISTS "Users can create shared memory links" ON public.shared_memories;
DROP POLICY IF EXISTS "Users can delete their own shared memory links" ON public.shared_memories;

-- Allow anyone to create and view shared memory links
-- The actual memory data is protected in Firebase
CREATE POLICY "Anyone can create shared memory links"
ON public.shared_memories
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view shared memories"
ON public.shared_memories
FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can delete by matching user_id"
ON public.shared_memories
FOR DELETE
TO public
USING (true);