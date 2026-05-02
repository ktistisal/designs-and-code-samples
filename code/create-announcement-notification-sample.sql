create or replace function public.create_announceent_notification ()
returns trigger
language plpgsql
security definer
set search_path = public 
as $$
  begin
    
    insert into notifications (
      user_id,
      entity_id, 
      entity_type,
      group_id,
      title, 
      body
    ) 

    select
      gm.member_id,
      new.id,
      'ANNOUNCEMENT'::entity_type,
      new.group_id,
      format('**%s**: New Announcement!', g.name),
      format('%s', new.title)

    from public.group_members gm
    join public.groups g on g.id = gm.group_id
    
    where gm.group_id = new.group_id
    and gm.member_id <> new.created_by;
  
    return new;

  end;
$$;

drop trigger if exists after_insert_create_notification on public.announcements;

create trigger after_insert_create_notification
after insert on public.announcements for each row
execute function public.create_announceent_notification ();