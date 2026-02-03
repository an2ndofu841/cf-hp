-- Allow users to insert their own links
create policy "Users can insert own links" on user_profile_links for insert with check (auth.uid() = user_id);

-- Allow users to update their own links (needed for upsert)
create policy "Users can update own links" on user_profile_links for update using (auth.uid() = user_id);
