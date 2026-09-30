create or replace function public.get_public_visitor_analytics_range(p_range text)
returns table (
  total_visitors bigint,
  total_page_views bigint,
  daily jsonb
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  selected_range text := upper(coalesce(p_range, '30D'));
  bucket_size interval;
  bucket_count integer;
  range_size interval;
  range_start_utc timestamp without time zone;
begin
  case selected_range
    when '24H' then
      bucket_size := interval '1 hour';
      bucket_count := 24;
      range_size := interval '24 hours';
    when '7D' then
      bucket_size := interval '1 day';
      bucket_count := 7;
      range_size := interval '7 days';
    when '30D' then
      bucket_size := interval '1 day';
      bucket_count := 30;
      range_size := interval '30 days';
    when 'ALL' then
      bucket_size := interval '1 day';
      bucket_count := 0;
      range_size := interval '0';
    else
      raise exception 'Unsupported analytics range: %', p_range using errcode = '22023';
  end case;

  range_start_utc := timezone('UTC', now()) - range_size;

  return query
    with all_time_bounds as (
      select
        least(
          coalesce(
            (
              select min((events.created_at at time zone 'UTC')::date)
              from public.visitor_events as events
            ),
            (baseline.baseline_at at time zone 'UTC')::date
          ),
          (baseline.baseline_at at time zone 'UTC')::date
        )::timestamp as start_day,
        timezone('UTC', now())::date::timestamp as end_day
      from public.visitor_analytics_baseline as baseline
      where baseline.id
    ),
    time_buckets as (
      select range_start_utc + (indexes.bucket_index * bucket_size) as bucket
      from generate_series(0, bucket_count - 1) as indexes(bucket_index)
      where selected_range <> 'ALL'
      union all
      select calendar.calendar_day
      from all_time_bounds as bounds
      cross join lateral generate_series(
        bounds.start_day,
        bounds.end_day,
        interval '1 day'
      ) as calendar(calendar_day)
      where selected_range = 'ALL'
    ),
    filtered_events as (
      select
        events.id,
        events.session_id,
        case
          when selected_range = 'ALL' then
            date_trunc('day', events.created_at at time zone 'UTC')
          else
            date_bin(
              bucket_size,
              events.created_at at time zone 'UTC',
              range_start_utc
            )
        end as bucket
      from public.visitor_events as events
      where selected_range = 'ALL'
        or (
          events.created_at >= (range_start_utc at time zone 'UTC')
          and events.created_at <= now()
        )
    ),
    totals as (
      select
        case
          when selected_range = 'ALL' then
            baseline.total_visitors + count(distinct filtered_events.session_id)::bigint
          else count(distinct filtered_events.session_id)::bigint
        end as visitors,
        case
          when selected_range = 'ALL' then
            baseline.total_page_views + count(filtered_events.id)::bigint
          else count(filtered_events.id)::bigint
        end as page_views,
        baseline.total_visitors as baseline_visitors,
        baseline.total_page_views as baseline_page_views,
        baseline.baseline_at
      from public.visitor_analytics_baseline as baseline
      left join filtered_events on true
      where baseline.id
      group by
        baseline.total_visitors,
        baseline.total_page_views,
        baseline.baseline_at
    ),
    grouped_events as (
      select
        filtered_events.bucket,
        count(distinct filtered_events.session_id)::bigint as visitors,
        count(*)::bigint as page_views
      from filtered_events
      group by filtered_events.bucket
    ),
    first_seen_visitors as (
      select
        first_seen.first_day as bucket,
        count(*)::bigint as visitors
      from (
        select
          events.session_id,
          min((events.created_at at time zone 'UTC')::date)::timestamp as first_day
        from public.visitor_events as events
        group by events.session_id
      ) as first_seen
      group by first_seen.first_day
    ),
    chart_points as (
      select
        time_buckets.bucket,
        case
          when selected_range = 'ALL' then
            sum(coalesce(first_seen_visitors.visitors, 0)) over (order by time_buckets.bucket)
              + case
                  when time_buckets.bucket::date >= (totals.baseline_at at time zone 'UTC')::date
                    then totals.baseline_visitors
                  else 0
                end
          else coalesce(grouped_events.visitors, 0)
        end as visitors,
        case
          when selected_range = 'ALL' then
            sum(coalesce(grouped_events.page_views, 0)) over (order by time_buckets.bucket)
              + case
                  when time_buckets.bucket::date >= (totals.baseline_at at time zone 'UTC')::date
                    then totals.baseline_page_views
                  else 0
                end
          else coalesce(grouped_events.page_views, 0)
        end as page_views
      from time_buckets
      left join grouped_events on grouped_events.bucket = time_buckets.bucket
      left join first_seen_visitors on first_seen_visitors.bucket = time_buckets.bucket
      cross join totals
    )
    select
      totals.visitors,
      totals.page_views,
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'date', to_char(chart_points.bucket, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
              'visitors', chart_points.visitors,
              'page_views', chart_points.page_views
            )
            order by chart_points.bucket
          )
          from chart_points
        ),
        '[]'::jsonb
      )
    from totals;
end;
$$;

revoke all on function public.get_public_visitor_analytics_range(text) from public;
grant execute on function public.get_public_visitor_analytics_range(text) to anon, authenticated;