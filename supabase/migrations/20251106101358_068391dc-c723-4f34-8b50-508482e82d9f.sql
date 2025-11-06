-- Create shared_memories table to store shareable memory links
CREATE TABLE public.shared_memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id TEXT NOT NULL,
  shared_by_user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_memories ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view shared memories
CREATE POLICY "Authenticated users can view shared memories"
ON public.shared_memories
FOR SELECT
TO authenticated
USING (true);

-- Users can create shared memory links for their own memories
CREATE POLICY "Users can create shared memory links"
ON public.shared_memories
FOR INSERT
TO authenticated
WITH CHECK (shared_by_user_id = auth.uid()::text);

-- Users can delete their own shared memory links
CREATE POLICY "Users can delete their own shared memory links"
ON public.shared_memories
FOR DELETE
TO authenticated
USING (shared_by_user_id = auth.uid()::text);