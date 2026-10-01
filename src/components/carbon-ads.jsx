import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const SCRIPT_ID = "_carbonads_js"

export function CarbonAds({
  serve,
  placement,
  format = "responsive",
  className
}) {
  const { pathname } = useLocation()
  const containerRef = useRef(null)
  const [blocked, setBlocked] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const configured = Boolean(serve && placement)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !configured) return

    // carbon.js inserts the ad after its script tag, so the tag lives here.
    // A loading script runs its own init, so refresh only after it loaded.
    const script = document.getElementById(SCRIPT_ID)
    if (script) {
      if (container.contains(script) && script.dataset.loaded) {
        setLoaded(true)
        window._carbonads?.refresh()
      }
      return
    }

    const el = document.createElement("script")
    el.id = SCRIPT_ID
    el.async = true
    el.type = "text/javascript"
    const params = new URLSearchParams({ serve, placement, format })
    el.src = `https://cdn.carbonads.com/carbon.js?${params}`
    el.onload = () => {
      el.dataset.loaded = "true"
      setLoaded(true)
    }
    el.onerror = () => setBlocked(true)
    container.appendChild(el)
  }, [pathname, serve, placement, format, configured])

  if (dismissed) return null

  return (
    <div
      ref={containerRef}
      data-slot="carbon-ads"
      data-format={format}
      className={cn(
        "fixed bottom-4 right-4 z-[60] max-h-[40vh] w-[min(20rem,calc(100vw-2rem))] overflow-auto rounded-md border border-border bg-background/95 p-3 shadow-lg backdrop-blur-sm min-h-39 data-[format=cover]:min-h-70",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close advertisement"
        title="Close advertisement"
        className="absolute right-1.5 top-1.5 z-[61] flex h-7 w-7 items-center justify-center rounded-sm bg-background/90 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      {(!loaded || blocked || !configured) && (
        <div
          aria-label={blocked ? "Sponsored placement unavailable" : "Sponsored placement loading"}
          className="pointer-events-none absolute inset-3 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sponsored
            </span>
            {blocked && (
              <span className="text-[10px] text-muted-foreground">Unavailable</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 rounded-sm bg-muted" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded-sm bg-muted" />
              <div className="h-2.5 w-full rounded-sm bg-muted/70" />
              <div className="h-2.5 w-2/3 rounded-sm bg-muted/70" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
