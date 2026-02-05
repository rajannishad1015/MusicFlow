-- Add attachment_url column to ticket_messages logic
ALTER TABLE ticket_messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;

-- Create storage bucket for support attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('support-attachments', 'support-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload files to support-attachments
CREATE POLICY "Authenticated users can upload support attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'support-attachments');

-- Policy: Allow authenticated users to view support attachments
CREATE POLICY "Authenticated users can view support attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'support-attachments');
