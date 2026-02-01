-- Insert additional test code
do $$
declare
  v_group_id bigint;
begin
  -- Get the existing group ID (Crazy Fantasy Official FC)
  select id into v_group_id from groups where name = 'Crazy Fantasy Official FC' limit 1;

  if v_group_id is not null then
    -- Insert the specific code requested by the user
    insert into point_card_codes (code, group_id, expires_at, is_used)
    values ('6J3M-QBMK', v_group_id, now() + interval '1 year', false)
    on conflict (code) do update 
    set is_used = false; -- Reset if it exists so it can be used for testing
  end if;
end;
$$;
