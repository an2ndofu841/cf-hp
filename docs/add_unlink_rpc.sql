-- RPC: unlink_user_group
-- Unlinks a user from a group (allows re-linking with a NEW code)
create or replace function unlink_user_group(p_group_id bigint)
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Delete the link
  delete from user_profile_links
  where user_id = v_user_id and group_id = p_group_id;
  
  -- Note: We do NOT delete user_points or user_trophies so data is preserved if they link again.
  -- We also do NOT reset the used code, as codes are one-time use.
end;
$$;
