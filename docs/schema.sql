-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Enum Types & Common Definitions
-- -----------------------------------------------------------------------------

-- Content Status: draft (下書き), published (公開), archived (アーカイブ)
create type content_status as enum ('draft', 'published', 'archived');

-- -----------------------------------------------------------------------------
-- 2. Venues (Venue Master)
-- -----------------------------------------------------------------------------
create table venues (
  id uuid primary key default uuid_generate_v4(),
  name_ja text not null,
  name_en text,
  address_ja text,
  address_en text,
  map_url text,
  access_ja text,
  access_en text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table venues enable row level security;
create policy "Venues are viewable by everyone" on venues for select using (true);
create policy "Venues are editable by authenticated users" on venues for all using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 3. News
-- -----------------------------------------------------------------------------
create table news (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title_ja text not null,
  title_en text,
  body_ja text,
  body_en text,
  category text, -- e.g. 'release', 'live', 'media'
  tags text[], -- Array of tags
  eyecatch_url text,
  pinned boolean default false,
  status content_status default 'draft',
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users(id)
);

-- RLS
alter table news enable row level security;
create policy "Public news are viewable by everyone" on news for select using (status = 'published' and published_at <= now());
create policy "Authenticated users can do all on news" on news for all using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 4. Lives
-- -----------------------------------------------------------------------------
create table lives (
  id uuid primary key default uuid_generate_v4(),
  title_ja text not null,
  title_en text,
  description_ja text,
  description_en text,
  date timestamp with time zone not null, -- Event date
  open_time text, -- e.g. "18:00"
  start_time text, -- e.g. "19:00"
  venue_id uuid references venues(id),
  price_ja text,
  price_en text,
  performers_ja text, -- or text[]
  performers_en text,
  ticket_urls jsonb, -- e.g. [{"label": "eplus", "url": "..."}]
  notes_ja text,
  notes_en text,
  status content_status default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table lives enable row level security;
create policy "Public lives are viewable by everyone" on lives for select using (status = 'published');
create policy "Authenticated users can do all on lives" on lives for all using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 5. Members
-- -----------------------------------------------------------------------------
create table members (
  id uuid primary key default uuid_generate_v4(),
  name_ja text not null,
  name_en text,
  profile_ja text,
  profile_en text,
  job_ja text, -- e.g. "Vocal / Hero"
  job_en text,
  sns_links jsonb, -- e.g. {"twitter": "...", "instagram": "..."}
  image_url text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table members enable row level security;
create policy "Members are viewable by everyone" on members for select using (true);
create policy "Authenticated users can do all on members" on members for all using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 6. Discography
-- -----------------------------------------------------------------------------
create table discography (
  id uuid primary key default uuid_generate_v4(),
  title_ja text not null,
  title_en text,
  type text, -- 'single', 'album', 'ep'
  release_date date,
  jacket_url text,
  tracks_ja jsonb, -- List of tracks
  tracks_en jsonb,
  streaming_links jsonb, -- e.g. {"spotify": "...", "apple": "..."}
  status content_status default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table discography enable row level security;
create policy "Public disco are viewable by everyone" on discography for select using (status = 'published');
create policy "Authenticated users can do all on disco" on discography for all using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 7. Movies
-- -----------------------------------------------------------------------------
create table movies (
  id uuid primary key default uuid_generate_v4(),
  title_ja text not null,
  title_en text,
  youtube_id text not null,
  category text, -- 'mv', 'live', 'comment'
  published_at timestamp with time zone default now(),
  status content_status default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table movies enable row level security;
create policy "Public movies are viewable by everyone" on movies for select using (status = 'published');
create policy "Authenticated users can do all on movies" on movies for all using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 8. Goods
-- -----------------------------------------------------------------------------
create table goods (
  id uuid primary key default uuid_generate_v4(),
  name_ja text not null,
  name_en text,
  description_ja text,
  description_en text,
  price_text_ja text, -- "¥3,000 (tax in)"
  price_text_en text, -- "3,000 JPY"
  image_urls text[], -- Array of image URLs
  external_url text,
  sold_out boolean default false,
  status content_status default 'draft',
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table goods enable row level security;
create policy "Public goods are viewable by everyone" on goods for select using (status = 'published');
create policy "Authenticated users can do all on goods" on goods for all using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 9. Gallery
-- -----------------------------------------------------------------------------
create table gallery (
  id uuid primary key default uuid_generate_v4(),
  title_ja text,
  title_en text,
  image_urls text[] not null,
  category text, -- 'live', 'artist', 'offshot'
  credit text,
  event_date date,
  status content_status default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table gallery enable row level security;
create policy "Public gallery are viewable by everyone" on gallery for select using (status = 'published');
create policy "Authenticated users can do all on gallery" on gallery for all using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 10. Press Kit Assets
-- -----------------------------------------------------------------------------
create table presskit_assets (
  id uuid primary key default uuid_generate_v4(),
  type text not null, -- 'logo', 'photo', 'text'
  file_url text not null,
  label_ja text,
  label_en text,
  usage_note_ja text,
  usage_note_en text,
  status content_status default 'draft',
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table presskit_assets enable row level security;
create policy "Public presskit are viewable by everyone" on presskit_assets for select using (status = 'published');
create policy "Authenticated users can do all on presskit" on presskit_assets for all using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 11. Settings (Key-Value Store for Site Config)
-- -----------------------------------------------------------------------------
create table settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table settings enable row level security;
create policy "Settings are viewable by everyone" on settings for select using (true); -- Filter sensitive keys in API if needed
create policy "Authenticated users can do all on settings" on settings for all using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 12. Storage Buckets (Setup instructions - cannot be done via SQL fully usually, but policies can)
-- -----------------------------------------------------------------------------
-- This requires the 'storage' schema extension which is default in Supabase.
-- Just a reminder: You need to create buckets: 'images', 'files'

-- Policy example for storage (if buckets existed)
-- create policy "Public Access" on storage.objects for select using ( bucket_id in ('images', 'files') );
-- create policy "Auth Upload" on storage.objects for insert using ( auth.role() = 'authenticated' );
