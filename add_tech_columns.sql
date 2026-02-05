-- Add tech columns to tracks table
alter table tracks 
add column if not exists bitrate integer, -- in bps
add column if not exists sample_rate integer, -- in Hz
add column if not exists encoding text, -- e.g. 'mp3', 'flac'
add column if not exists channels integer, -- 1=mono, 2=stereo
add column if not exists file_size integer; -- in bytes

-- Optional: Add constraint for min bitrate if we want to enforce at DB level, 
-- but usually flexible is better and enforce in app logic.
