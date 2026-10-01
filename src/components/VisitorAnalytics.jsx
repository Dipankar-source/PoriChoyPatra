import { useEffect, useState } from "react";
import PageGridLines, { GridSectionHeader } from "@/components/PageGridLines";

const VIEWS = "text-[#542A52] dark:text-[#d9a6d3]";
const VISITORS = "text-[#FFB39A]";

const fmt = (v) => Number(v || 0).toLocaleString();

const fmtDate = (v, range) =>
  new Date(v).toLocaleString(
    undefined,
    range === "24H"
      ? { hour: "numeric", timeZone: "UTC" }
      : range === "ALL"
        ? { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }
        : { month: "short", day: "numeric", timeZone: "UTC" },
  );

const analyticsCache = new Map();
const inflightRequests = new Map();

/* ---------- compact chart ---------- */

const Chart = ({ daily, range }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const n = daily.length;
  const maxValue = Math.max(
    1,
    ...daily.map((d) => Math.max(+d.page_views || 0, +d.visitors || 0)),
  );
  const x = (index) => (n <= 1 ? 50 : (index / (n - 1)) * 100);
  const y = (value) => 30 - ((Number(value) || 0) / maxValue) * 26;

  const series = [
    { key: "page_views", name: "Page views", color: "#d9a6d3" },
    { key: "visitors", name: "Visitors", color: "#FFB39A" },
  ];

  const updateHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !n) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHoverIndex(Math.round(ratio * (n - 1)));
  };

  const active = hoverIndex === null ? null : daily[hoverIndex];
  const tooltipLeft = active ? Math.min(86, Math.max(14, x(hoverIndex))) : 0;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center gap-4 text-[10px] text-neutral-500">
        {series.map((item) => (
          <span key={item.key} className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name}
          </span>
        ))}
      </div>

      <div
        className="relative h-[88px] touch-pan-y"
        onPointerMove={updateHover}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {n > 0 && (
          <svg
            viewBox="0 0 100 34"
            preserveAspectRatio="none"
            role="img"
            aria-label="Visitors and page views over time"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <line x1="0" y1="32" x2="100" y2="32" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" />
            {series.map((item) => {
              const path = daily
                .map((entry, index) => `${index ? "L" : "M"}${x(index)},${y(entry[item.key])}`)
                .join(" ");

              return (
                <path
                  key={item.key}
                  d={path}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

          </svg>
        )}

        <div
          aria-hidden={!active}
          className="pointer-events-none absolute top-1 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-sm border border-neutral-200 bg-background/95 px-1.5 py-1 text-[9px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-opacity duration-150 dark:border-neutral-800"
          style={{ left: `${tooltipLeft}%`, opacity: active ? 1 : 0 }}
        >
          {active && (
            <>
              <span className="text-neutral-500">{fmtDate(active.date, range)}</span>
              {series.map((item) => (
                <span
                  key={item.key}
                  className="tabular-nums leading-none"
                  style={{ color: item.color }}
                >
                  {fmt(active[item.key])}
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
        <span>{n ? fmtDate(daily[0].date, range) : "No activity"}</span>
        {n > 1 && <span>{fmtDate(daily[n - 1].date, range)}</span>}
      </div>
    </div>
  );
};

/* ---------- stat ---------- */

const Stat = ({ label, value, color, loading }) => (
  <div>
    <p className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase text-neutral-500">
      <span className={`h-0.5 w-4 rounded-full bg-current ${color}`} />
      {label}
    </p>
    {loading ? (
      <span
        role="status"
        aria-label="Loading metric"
        className="block h-6 w-16 rounded-sm bg-neutral-200 dark:bg-neutral-800"
      />
    ) : (
      <p className="text-2xl font-light tabular-nums leading-none text-neutral-900 dark:text-white">
        {fmt(value)}
      </p>
    )}
  </div>
);

/* ---------- main ---------- */

const VisitorAnalytics = () => {
  const [data, setData] = useState(() => analyticsCache.get("24H") ?? null);
  const [error, setError] = useState(false);
  const [range, setRange] = useState("24H");
  const [isLoading, setIsLoading] = useState(!analyticsCache.has("24H"));

  useEffect(() => {
    let active = true;
    const cached = analyticsCache.get(range);

    if (cached) {
      setData(cached);
      setError(false);
      setIsLoading(false);
    } else {
      setData(cached ?? null);
      setError(false);
      setIsLoading(true);
    }

    const load = async () => {
      if (inflightRequests.has(range)) {
        const freshData = await inflightRequests.get(range);
        if (active) {
          setData(freshData ?? cached ?? null);
          setError(!freshData);
          setIsLoading(false);
        }
        return;
      }

      const request = (async () => {
        const { supabase } = await import("@/lib/supabase");
        const { data: res, error } = await supabase.rpc(
          "get_public_visitor_analytics_range",
          { p_range: range },
        );
        if (error) throw error;

        const row = Array.isArray(res) ? res[0] : res;
        const normalized = row
          ? {
              visitors: row.total_visitors,
              views: row.total_page_views,
              daily: Array.isArray(row.daily) ? row.daily : [],
            }
          : null;

        if (normalized) analyticsCache.set(range, normalized);
        return normalized;
      })();

      inflightRequests.set(range, request);

      try {
        const freshData = await request;
        if (active) {
          setData(freshData ?? cached ?? null);
          setError(!freshData);
          setIsLoading(false);
        }
      } catch {
        if (active) {
          setError(true);
          setData(cached ?? null);
          setIsLoading(false);
        }
      } finally {
        inflightRequests.delete(range);
      }
    };

    load();
    const timer = setInterval(load, 30_000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [range]);

  const loading = isLoading || !data;

  return (
    <section className="w-full divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
      <PageGridLines section sectionOffset={27} />

      <GridSectionHeader className="flex items-center justify-between ">
        <div className="flex items-center justify-between px-2 sm:px-4">
          <div>
            <p className="aktura-font tracking-wider text-[28px] leading-tight text-neutral-950 dark:text-neutral-50 mt-9 mb-3">
              Visitors
            </p>
          </div>

          <div className="flex gap-1 mt-6">
            {["24H", "7D", "30D", "ALL"].map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setRange(o)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  range === o
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </GridSectionHeader>

      {error && !data ? (
        <p className="py-10 text-sm text-neutral-500">Unavailable.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <Stat
              label="Visitors"
              value={data?.visitors}
              color={VISITORS}
              loading={loading}
            />
            <Stat
              label="Page views"
              value={data?.views}
              color={VIEWS}
              loading={loading}
            />
          </div>
          <div className="px-5 py-4">
            {loading ? (
              <div className="h-[88px] border-b border-neutral-200 dark:border-neutral-800" />
            ) : (
              <Chart daily={data.daily} range={range} />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default VisitorAnalytics;
