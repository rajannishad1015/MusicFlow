-- Add status and admin_notes columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create an index for faster lookups by status if needed
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
