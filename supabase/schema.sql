create table if not exists public.visitor_events (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  page_path text not null check (
    char_length(page_path) <= 2048 and left(page_path, 1) = '/'
  ),
  referrer_origin text check (
    referrer_origin is null or char_length(referrer_origin) <= 255
  ),
  created_at timestamptz not null default now()
);

create index if not exists visitor_events_created_at_idx
  on public.visitor_events (created_at desc);

create index if not exists visitor_events_session_id_idx
  on public.visitor_events (session_id);

create table if not exists public.visitor_analytics_baseline (
  id boolean primary key default true check (id),
  total_visitors bigint not null default 0 check (total_visitors >= 0),
  total_page_views bigint not null default 0 check (total_page_views >= 0),
  baseline_at timestamptz not null default now()
);

alter table public.visitor_analytics_baseline
  add column if not exists baseline_at timestamptz not null default now();

insert into public.visitor_analytics_baseline (id, total_visitors, total_page_views)
select
  true,
  greatest(0, 3691 - count(distinct events.session_id)::bigint),
  greatest(0, 5270 - count(events.id)::bigint)
from public.visitor_events as events
on conflict (id) do nothing;

alter table public.visitor_analytics_baseline enable row level security;
revoke all on public.visitor_analytics_baseline from anon, authenticated;

alter table public.visitor_events enable row level security;

revoke all on public.visitor_events from anon, authenticated;
grant insert on public.visitor_events to anon, authenticated;

drop policy if exists "Allow anonymous page view inserts"
  on public.visitor_events;
create policy "Allow anonymous page view inserts"
  on public.visitor_events
  for insert
  to anon, authenticated
  with check (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'visitor_events'
  ) then
    alter publication supabase_realtime add table public.visitor_events;
  end if;
end
$$;

create or replace function public.get_public_visitor_analytics()
returns table (
  total_visitors bigint,
  total_page_views bigint,
  daily jsonb
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (
      select baseline.total_visitors + count(distinct events.session_id)::bigint
      from public.visitor_analytics_baseline as baseline
      left join public.visitor_events as events on true
      where baseline.id
      group by baseline.total_visitors
    ),
    (
      select baseline.total_page_views + count(events.id)::bigint
      from public.visitor_analytics_baseline as baseline
      left join public.visitor_events as events on true
      where baseline.id
      group by baseline.total_page_views
    ),
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'date', calendar.calendar_day::date,
            'visitors', coalesce(daily.visitors, 0),
            'page_views', coalesce(daily.page_views, 0)
          )
          order by calendar.calendar_day
        )
        from generate_series(
          (timezone('UTC', now())::date - 29)::timestamp,
          timezone('UTC', now())::date::timestamp,
          interval '1 day'
        ) as calendar(calendar_day)
        left join (
          select
            (events.created_at at time zone 'UTC')::date as calendar_day,
            count(distinct events.session_id)::bigint as visitors,
            count(*)::bigint as page_views
          from public.visitor_events as events
          where events.created_at >= (
            (timezone('UTC', now())::date - 29)::timestamp at time zone 'UTC'
          )
          group by 1
        ) as daily on daily.calendar_day = calendar.calendar_day::date
      ),
      '[]'::jsonb
    );
$$;

revoke all on function public.get_public_visitor_analytics() from public;
grant execute on function public.get_public_visitor_analytics() to anon, authenticated;

create table if not exists public.public_like_counter (
  id boolean primary key default true check (id),
  likes bigint not null default 1296 check (likes >= 0)
);

insert into public.public_like_counter (id, likes)
values (true, 1296)
on conflict (id) do nothing;

alter table public.public_like_counter enable row level security;
revoke all on public.public_like_counter from anon, authenticated;

create or replace function public.get_public_like_count()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select counter.likes
  from public.public_like_counter as counter
  where counter.id;
$$;

create or replace function public.change_public_like_count(p_delta integer)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_count bigint;
begin
  if p_delta not in (-1, 1) then
    raise exception 'Like count changes must be -1 or 1' using errcode = '22023';
  end if;

  update public.public_like_counter as counter
  set likes = greatest(0, counter.likes + p_delta)
  where counter.id
  returning counter.likes into updated_count;

  return updated_count;
end;
$$;

revoke all on function public.get_public_like_count() from public;
revoke all on function public.change_public_like_count(integer) from public;
grant execute on function public.get_public_like_count() to anon, authenticated;
grant execute on function public.change_public_like_count(integer) to anon, authenticated;