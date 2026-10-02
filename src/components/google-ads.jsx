import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ADSENSE_CLIENT = "ca-pub-5444056349971184";

export function GoogleAdSlot({
  slot = import.meta.env.VITE_GOOGLE_ADS_SLOT,
  placement = "floating",
  className,
}) {
  const adRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const ad = adRef.current;
    if (!import.meta.env.PROD) {
      setStatus("preview");
      return;
    }

    if (!ad || !slot) {
      setStatus("unconfigured");
      return;
    }

    setStatus("loading");
    const observer = new MutationObserver(() => {
      const adStatus = ad.getAttribute("data-ad-status");
      if (adStatus === "filled") setStatus("filled");
      if (adStatus === "unfilled") setStatus("unfilled");
    });
    observer.observe(ad, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });

    const timeout = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "unavailable" : current));
    }, 10000);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      setStatus("unavailable");
    }

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [slot]);

  if (dismissed) return null;

  const showPlaceholder = status !== "filled";
  const placeholderText = {
    unconfigured: "Ad unit slot required",
    unfilled: "No ad available",
    unavailable: "Ad temporarily unavailable",
    loading: "Loading sponsored ad",
    preview: "Ad preview · production only",
  }[status];

  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        placement === "inline"
          ? "relative block w-full overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none backdrop-blur-none md:hidden"
          : "hidden md:fixed md:bottom-4 md:right-4 md:z-[60] md:block md:w-[min(17rem,calc(100vw-2rem))] md:overflow-hidden md:rounded-md md:border md:border-border md:bg-background/95 md:p-2.5 md:shadow-lg md:backdrop-blur-sm",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center",
          placement === "inline"
            ? "justify-between border-b border-dashed border-border/70 px-3 py-2.5"
            : "mb-2 justify-between pr-8",
        )}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Sponsored
        </span>
        <div className="flex items-center gap-2">
          {placement === "inline" && (
            <span className="border border-border/70 px-1.5 py-0.5 font-mono text-[9px] leading-none text-muted-foreground">
              AD
            </span>
          )}
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Close advertisement"
            title="Close advertisement"
            className={cn(
              "flex items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              placement === "inline"
                ? "size-7 rounded-sm"
                : "absolute right-1 top-1 z-[61] size-6 rounded-sm bg-background/90",
            )}
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="relative min-h-24">
        {slot && (
          <ins
            ref={adRef}
            className="adsbygoogle block min-h-24 w-full"
            style={{ display: "block" }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={slot}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        )}
        {showPlaceholder && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center bg-background",
              placement === "inline" ? "gap-3 px-3 py-3" : "gap-2",
            )}
          >
            <div
              className={cn(
                "shrink-0 bg-muted",
                placement === "inline" ? "size-16 rounded-sm" : "size-11 rounded-sm",
              )}
            />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-2.5 w-3/4 rounded-sm bg-muted" />
              <div className="h-2 w-full rounded-sm bg-muted/70" />
              <div className="h-2 w-2/3 rounded-sm bg-muted/70" />
              {placement === "inline" ? (
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <p className="truncate text-[10px] leading-none text-muted-foreground">
                    {placeholderText}
                  </p>
                  <div className="h-5 w-14 shrink-0 rounded-sm bg-muted/80" />
                </div>
              ) : (
                <p className="pt-1 text-[10px] text-muted-foreground">
                  {placeholderText}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
