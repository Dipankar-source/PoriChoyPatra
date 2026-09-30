import { useEffect, useState } from "react";
import { AnimatedParagraph } from "./ui/animated-paragraph";
import { ScrollFountain } from "./ui/scroll-fountain-text";

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

/* ---------- shimmer skeleton ---------- */

const shimmerCss = `
.shimmer{
  background:linear-gradient(90deg,rgba(128,128,128,.10) 0%,rgba(128,128,128,.24) 50%,rgba(128,128,128,.10) 100%);
  background-size:200% 100%;
  animation:shimmer 1.4s ease-in-out infinite;
}
@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
@media (prefers-reduced-motion:reduce){.shimmer{animation:none}}
`;

const Shimmer = ({ className = "" }) => (
  <div className={`shimmer rounded-md ${className}`} />
);

/* ---------- chart frame with horizontal grid ---------- */

const Frame = ({ labels, children, footer }) => (
  <div>
    <div className="flex">
      <div className="relative h-56 w-9 shrink-0">
        {labels.map((label, i) => (
          <span
            key={i}
            className="absolute right-3 -translate-y-1/2 text-[11px] tabular-nums text-neutral-400"
            style={{ top: `${(i / 3) * 100}%` }}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="relative h-56 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-x-0 h-px bg-neutral-200 dark:bg-neutral-800"
            style={{ top: `${(i / 3) * 100}%` }}
          />
        ))}
        {children}
      </div>
    </div>
    <div className="ml-9 mt-3 flex justify-between text-[11px] text-neutral-400">
      {footer}
    </div>
  </div>
);

const ChartSkeleton = () => (
  <Frame
    labels={["", "", "", ""]}
    footer={
      <>
        <Shimmer className="h-3 w-10" />
        <Shimmer className="h-3 w-10" />
      </>
    }
  >
    <div
      className="shimmer absolute inset-0 opacity-60"
      style={{
        clipPath:
          "polygon(0 62%,12% 50%,26% 58%,42% 34%,58% 46%,74% 22%,88% 32%,100% 18%,100% 100%,0 100%)",
      }}
    />
  </Frame>
);

/* ---------- chart ---------- */

const Chart = ({ daily, range }) => {
  const [hover, setHover] = useState(null);
  const n = daily.length;
  const raw = Math.max(
    1,
    ...daily.map((d) => Math.max(+d.page_views || 0, +d.visitors || 0)),
  );
  const step = Math.ceil(raw / 3);
  const top = step * 3;

  const X = (i) => (n <= 1 ? 50 : (i / (n - 1)) * 100);
  const Y = (v) => 100 - ((+v || 0) / top) * 100;
  const line = (key) =>
    daily.map((d, i) => `${i ? "L" : "M"}${X(i)},${Y(d[key])}`).join(" ");
  const area = (key) => `${line(key)} L${X(n - 1)},100 L${X(0)},100 Z`;

  const series = [
    { key: "page_views", name: "Page views", color: VIEWS, id: "gv" },
    { key: "visitors", name: "Visitors", color: VISITORS, id: "gs" },
  ];

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setHover(Math.min(n - 1, Math.max(0, Math.round(ratio * (n - 1)))));
  };

  const ticks = [...new Set([0, Math.floor((n - 1) / 2), n - 1])].filter(
    (i) => i >= 0 && i < n,
  );
  const active = hover !== null ? daily[hover] : null;

  return (
    <Frame
      labels={[top, step * 2, step, 0]}
      footer={ticks.map((i) => (
        <span key={i}>{fmtDate(daily[i].date, range)}</span>
      ))}
    >
      {n > 0 && (
        <>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              {series.map((s) => (
                <linearGradient
                  key={s.id}
                  id={s.id}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="currentColor"
                    stopOpacity="0.22"
                  />
                  <stop
                    offset="100%"
                    stopColor="currentColor"
                    stopOpacity="0"
                  />
                </linearGradient>
              ))}
            </defs>
            {series.map((s) => (
              <g key={s.key} className={s.color}>
                <path d={area(s.key)} fill={`url(#${s.id})`} />
                <path
                  d={line(s.key)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>

          <div
            className="absolute inset-0 touch-pan-y"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          >
            {active && (
              <>
                <div
                  className="absolute inset-y-0 w-px bg-neutral-300 dark:bg-neutral-700"
                  style={{ left: `${X(hover)}%` }}
                />
                {series.map((s) => (
                  <span
                    key={s.key}
                    className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current ring-2 ring-white dark:ring-neutral-950 ${s.color}`}
                    style={{
                      left: `${X(hover)}%`,
                      top: `${Y(active[s.key])}%`,
                    }}
                  />
                ))}
                <div
                  className="pointer-events-none absolute -top-2 z-10 -translate-y-full whitespace-nowrap rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
                  style={{
                    left: `${X(hover)}%`,
                    transform: `translate(-${X(hover)}%, -100%)`,
                  }}
                >
                  <p className="mb-1 text-neutral-400">
                    {fmtDate(active.date, range)}
                  </p>
                  {series.map((s) => (
                    <p
                      key={s.key}
                      className="flex items-center gap-2 text-neutral-900 dark:text-white"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full bg-current ${s.color}`}
                      />
                      <span className="tabular-nums">{fmt(active[s.key])}</span>
                      <span className="text-neutral-400">{s.name}</span>
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Frame>
  );
};

/* ---------- stat ---------- */

const Stat = ({ label, value, color, loading }) => (
  <div>
    <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
      <span className={`h-0.5 w-4 rounded-full bg-current ${color}`} />
      {label}
    </p>
    {loading ? (
      <Shimmer className="h-10 w-28" />
    ) : (
      <p className="text-4xl font-light tabular-nums tracking-tight text-neutral-900 dark:text-white">
        {fmt(value)}
      </p>
    )}
  </div>
);

/* ---------- main ---------- */

const VisitorAnalytics = () => {
  const [data, setData] = useState(() => analyticsCache.get("30D") ?? null);
  const [error, setError] = useState(false);
  const [range, setRange] = useState("30D");
  const [isLoading, setIsLoading] = useState(!analyticsCache.has("30D"));

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
      <style>{shimmerCss}</style>

      <div className="flex items-center justify-between py-4 px-5">
        <div>
          <p
            className="font-medium text-gray-900 dark:text-white mb-2 leading-tight tracking-tight"
            style={{ fontSize: "clamp(18px, 4vw, 24px)" }}
          >
            <ScrollFountain particleCount={40}>Visitors</ScrollFountain>
          </p>
          <AnimatedParagraph className="tracking-wider dark:text-white/30 text-sm italic">
            Who are there?
          </AnimatedParagraph>
        </div>

        <div className="flex gap-1">
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

      {error && !data ? (
        <p className="py-10 text-sm text-neutral-500">Unavailable.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 py-6 px-6">
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
          <div className="py-6">
            {loading ? (
              <ChartSkeleton />
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
