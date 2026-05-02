create or replace function is_group_member (g_id uuid) 
returns boolean
language sql
security definer
set search_path = public
stable 
as $$
  select exists (
    select 1
    from group_members
    where group_id = g_id
    and member_id = auth.uid()
  );
$$;

-- create policy "allow select for members"
-- on "public"."announcements"
-- as PERMISSIVE
-- for SELECT
-- to authenticated
-- using (
-- ( SELECT is_group_member(announcements.group_id) AS is_group_member)
-- );