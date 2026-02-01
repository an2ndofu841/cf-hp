-- =============================================================================
-- Point Card System Schema (Add-on)
-- =============================================================================

-- 1. Groups (Point Card Groups / Fan Clubs)
create table if not exists groups (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamp with time zone default now()
);

-- 2. Point Card Codes (Codes for linking users to groups)
create table if not exists point_card_codes (
  code text primary key,
  group_id bigint references groups(id),
  is_used boolean default false,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- 3. User Profile Links (Link Auth User to Group)
create table if not exists user_profile_links (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id),
  group_id bigint references groups(id),
  linked_at timestamp with time zone default now(),
  unique(user_id, group_id)
);

-- 4. User Points (Level & EXP)
create table if not exists user_points (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id),
  group_id bigint references groups(id),
  level integer default 1,
  total_points integer default 0,
  next_remaining integer default 100,
  updated_at timestamp with time zone default now(),
  unique(user_id, group_id)
);

-- 5. Trophies (Master Data)
create table if not exists trophies (
  id bigint generated always as identity primary key,
  group_id bigint references groups(id),
  name text not null,
  description text,
  rarity text check (rarity in ('common', 'rare', 'epic', 'legendary')),
  created_at timestamp with time zone default now()
);

-- 6. User Trophies (Achievements)
create table if not exists user_trophies (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id),
  trophy_id bigint references trophies(id),
  achieved_at timestamp with time zone default now(),
  unique(user_id, trophy_id)
);

-- =============================================================================
-- RLS Policies
-- =============================================================================

alter table groups enable row level security;
create policy "Groups viewable by everyone" on groups for select using (true);

alter table user_profile_links enable row level security;
create policy "Users can view own links" on user_profile_links for select using (auth.uid() = user_id);

alter table user_points enable row level security;
create policy "Users can view own points" on user_points for select using (auth.uid() = user_id);

alter table trophies enable row level security;
create policy "Trophies viewable by everyone" on trophies for select using (true);

alter table user_trophies enable row level security;
create policy "Users can view own trophies" on user_trophies for select using (auth.uid() = user_id);

-- =============================================================================
-- RPC Functions
-- =============================================================================

-- RPC: claim_user_link_code
-- Links a user to a group using a valid code
create or replace function claim_user_link_code(p_code text)
returns json
language plpgsql
security definer
as $$
declare
  v_group_id bigint;
  v_user_id uuid;
  v_link_id bigint;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Validate Code
  select group_id into v_group_id
  from point_card_codes
  where code = p_code
    and is_used = false
    and (expires_at is null or expires_at > now());

  if v_group_id is null then
    raise exception 'Invalid or expired code';
  end if;

  -- Create Link (Ignore if already linked, but consume code? Or error? Let's just link)
  insert into user_profile_links (user_id, group_id)
  values (v_user_id, v_group_id)
  on conflict (user_id, group_id) do nothing;

  -- Initialize Points (if not exists)
  insert into user_points (user_id, group_id, level, total_points, next_remaining)
  values (v_user_id, v_group_id, 1, 0, 100)
  on conflict (user_id, group_id) do nothing;

  -- Mark code as used
  update point_card_codes
  set is_used = true
  where code = p_code;

  return json_build_object(
    'group_id', v_group_id,
    'point_user_id', v_user_id
  );
end;
$$;

-- RPC: get_linked_level
-- Returns level info for a specific group
create or replace function get_linked_level(p_group_id bigint)
returns json
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_result json;
begin
  v_user_id := auth.uid();
  
  select json_build_object(
    'level', level,
    'total_points', total_points,
    'next_remaining', next_remaining
  ) into v_result
  from user_points
  where user_id = v_user_id and group_id = p_group_id;

  if v_result is null then
     return json_build_object('level', 1, 'total_points', 0, 'next_remaining', 100);
  end if;

  return v_result;
end;
$$;

-- RPC: get_linked_trophies
-- Returns trophies list with achieved status
create or replace function get_linked_trophies(p_group_id bigint)
returns json
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();

  return (
    select json_agg(
      json_build_object(
        'id', t.id,
        'name', t.name,
        'description', t.description,
        'rarity', t.rarity,
        'achieved', (ut.id is not null),
        'achieved_at', ut.achieved_at
      )
    )
    from trophies t
    left join user_trophies ut on t.id = ut.trophy_id and ut.user_id = v_user_id
    where t.group_id = p_group_id
  );
end;
$$;

-- =============================================================================
-- Seed Data (For Testing)
-- =============================================================================

do $$
declare
  v_group_id bigint;
begin
  -- Create Group
  insert into groups (name) values ('Crazy Fantasy Official FC')
  on conflict do nothing;
  
  select id into v_group_id from groups where name = 'Crazy Fantasy Official FC' limit 1;

  if v_group_id is not null then
    -- Create Test Code
    insert into point_card_codes (code, group_id, expires_at)
    values ('WELCOME-HERO-2026', v_group_id, now() + interval '1 year')
    on conflict (code) do nothing;
    
    -- Create Trophies
    insert into trophies (group_id, name, description, rarity)
    select v_group_id, 'First Login', 'Logged in for the first time', 'common'
    where not exists (select 1 from trophies where name = 'First Login' and group_id = v_group_id);

    insert into trophies (group_id, name, description, rarity)
    select v_group_id, 'Live Master', 'Attended 10 lives', 'epic'
    where not exists (select 1 from trophies where name = 'Live Master' and group_id = v_group_id);
    
    insert into trophies (group_id, name, description, rarity)
    select v_group_id, 'Secret Treasure', 'Found the hidden item', 'legendary'
    where not exists (select 1 from trophies where name = 'Secret Treasure' and group_id = v_group_id);
  end if;
end;
$$;
