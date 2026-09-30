import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const SESSION_STORAGE_KEY = "dipfolio_analytics_session";
const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      import.meta.env.VITE_SUPABASE_ANON_KEY),
);

const getSessionId = () => {
  try {
    const existingId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existingId) return existingId;

    const sessionId = window.crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    return sessionId;
  } catch {
    return window.crypto.randomUUID();
  }
};

const getReferrerOrigin = () => {
  if (!document.referrer) return null;

  try {
    return new URL(document.referrer).origin;
  } catch {
    return null;
  }
};

const PageViewTracker = () => {
  const { pathname } = useLocation();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured || lastTrackedPath.current === pathname) return;

    let cancelled = false;
    const trackPageView = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        if (cancelled || !supabase || lastTrackedPath.current === pathname) return;

        lastTrackedPath.current = pathname;
        const { error } = await supabase.from("visitor_events").insert({
          session_id: getSessionId(),
          page_path: pathname,
          referrer_origin: getReferrerOrigin(),
        });

        if (error && import.meta.env.DEV) {
          console.error("Could not record page view:", error.message);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Could not record page view:", error);
        }
      }
    };

    let idleCallbackId;
    let timeoutId;
    if ("requestIdleCallback" in window) {
      idleCallbackId = window.requestIdleCallback(trackPageView, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(trackPageView, 500);
    }

    return () => {
      cancelled = true;
      if (idleCallbackId !== undefined) window.cancelIdleCallback(idleCallbackId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
};

export default PageViewTracker;