-- Create a policy to allow users to delete their own tracks
DROP POLICY IF EXISTS "Users can delete own tracks" ON tracks;

CREATE POLICY "Users can delete own tracks"
ON tracks
FOR DELETE
USING (auth.uid() = artist_id);
