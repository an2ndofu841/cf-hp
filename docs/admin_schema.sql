-- -----------------------------------------------------------------------------
-- 1. Profiles & Roles
-- -----------------------------------------------------------------------------

-- Create a table to extend auth.users
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Function to handle new user signup automatically
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2. Admin Helper Function
-- -----------------------------------------------------------------------------

-- Function to check if the current user is an admin
create or replace function public.is_admin()
returns boolean as $$
declare
  _role text;
begin
  select role into _role from public.profiles where id = auth.uid();
  return _role = 'admin';
end;
$$ language plpgsql security definer;

-- -----------------------------------------------------------------------------
-- 3. Update RLS Policies for Admin Access
-- -----------------------------------------------------------------------------

-- Helper macro-like instructions: 
-- We will replace the "Authenticated users can do all" policies with "Admins can do all"
-- and keep specific read policies.

-- --- News ---
drop policy if exists "Authenticated users can do all on news" on news;
create policy "Admins can do all on news" on news for all using (is_admin());

-- --- Lives ---
drop policy if exists "Authenticated users can do all on lives" on lives;
create policy "Admins can do all on lives" on lives for all using (is_admin());

-- --- Venues ---
drop policy if exists "Venues are editable by authenticated users" on venues;
create policy "Admins can do all on venues" on venues for all using (is_admin());

-- --- Members ---
drop policy if exists "Authenticated users can do all on members" on members;
create policy "Admins can do all on members" on members for all using (is_admin());

-- --- Discography ---
drop policy if exists "Authenticated users can do all on disco" on discography;
create policy "Admins can do all on disco" on discography for all using (is_admin());

-- --- Movies ---
drop policy if exists "Authenticated users can do all on movies" on movies;
create policy "Admins can do all on movies" on movies for all using (is_admin());

-- --- Goods ---
drop policy if exists "Authenticated users can do all on goods" on goods;
create policy "Admins can do all on goods" on goods for all using (is_admin());

-- --- Gallery ---
drop policy if exists "Authenticated users can do all on gallery" on gallery;
create policy "Admins can do all on gallery" on gallery for all using (is_admin());

-- --- PressKit ---
drop policy if exists "Authenticated users can do all on presskit" on presskit_assets;
create policy "Admins can do all on presskit" on presskit_assets for all using (is_admin());

-- --- Settings ---
drop policy if exists "Authenticated users can do all on settings" on settings;
create policy "Admins can do all on settings" on settings for all using (is_admin());

-- -----------------------------------------------------------------------------
-- 4. Storage Policies (Example for 'images' bucket)
-- -----------------------------------------------------------------------------
-- Note: You need to create the 'images' bucket in the Supabase dashboard if it doesn't exist.

-- allow public read
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'images' );

-- allow admin insert/update/delete
-- create policy "Admin Insert" on storage.objects for insert with check ( bucket_id = 'images' and is_admin() );
-- create policy "Admin Update" on storage.objects for update using ( bucket_id = 'images' and is_admin() );
-- create policy "Admin Delete" on storage.objects for delete using ( bucket_id = 'images' and is_admin() );
