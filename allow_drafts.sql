-- Make file_url nullable to support drafts
ALTER TABLE tracks ALTER COLUMN file_url DROP NOT NULL;

-- Make other fields nullable if they are not strictly required for a draft
ALTER TABLE tracks ALTER COLUMN duration DROP NOT NULL;
ALTER TABLE tracks ALTER COLUMN is_explicit DROP NOT NULL;
