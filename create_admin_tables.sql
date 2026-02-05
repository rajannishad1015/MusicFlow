-- Create Admin Notes Table
create table if not exists admin_notes (
  id uuid default gen_random_uuid() primary key,
  track_id uuid references tracks(id) on delete cascade not null,
  admin_id uuid references auth.users(id) not null,
  note text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Admin Notes
alter table admin_notes enable row level security;

-- Only Admins can view/create notes (Assuming admin check is done via role in profiles or metadata)
-- For simplicity in this SQL, we'll allow authenticated users for now, relying on app logic to restrict to admins
create policy "Admins can view all notes"
  on admin_notes for select
  using ( auth.role() = 'authenticated' );

create policy "Admins can insert notes"
  on admin_notes for insert
  with check ( auth.role() = 'authenticated' );

-- Create Activity Logs Table
create table if not exists admin_activity_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references auth.users(id) not null,
  action text not null, -- 'APPROVED', 'REJECTED', 'EDITED_METADATA', 'LOGIN'
  target_id uuid, -- Can be track_id, user_id, etc.
  target_type text, -- 'TRACK', 'USER', 'TICKET'
  details jsonb, -- Store changes or reasons
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table admin_activity_logs enable row level security;

create policy "Admins can view logs"
  on admin_activity_logs for select
  using ( auth.role() = 'authenticated' );

create policy "Admins can insert logs"
  on admin_activity_logs for insert
  with check ( auth.role() = 'authenticated' );
