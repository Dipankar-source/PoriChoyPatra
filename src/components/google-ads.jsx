import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ADSENSE_CLIENT = "ca-pub-5444056349971184";

export function GoogleAdSlot({
  slot = import.meta.env.VITE_GOOGLE_ADS_SLOT,
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
          "fixed bottom-4 right-4 z-[60] w-[min(17rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-background/95 p-2.5 shadow-lg backdrop-blur-sm",
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between pr-8">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Sponsored
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Close advertisement"
          title="Close advertisement"
            className="absolute right-1 top-1 z-[61] flex h-6 w-6 items-center justify-center rounded-sm bg-background/90 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
            <X className="h-3.5 w-3.5" />
        </button>
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
            <div className="pointer-events-none absolute inset-0 flex items-center gap-2 bg-background">
            <div className="h-11 w-11 shrink-0 rounded-sm bg-muted" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-2.5 w-3/4 rounded-sm bg-muted" />
              <div className="h-2 w-full rounded-sm bg-muted/70" />
              <div className="h-2 w-2/3 rounded-sm bg-muted/70" />
              <p className="pt-1 text-[10px] text-muted-foreground">{placeholderText}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
