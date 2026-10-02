import { cloneElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = (import.meta.env.VITE_BLOG_ADMIN_EMAIL || "")
  .trim()
  .toLowerCase();

const BlogWritingAccess = ({ children }) => {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setCheckingSession(false);
      return undefined;
    }

    let active = true;
    const acceptSession = (nextSession) => {
      const isAdmin =
        nextSession?.user?.email?.trim().toLowerCase() === ADMIN_EMAIL;
      setSession(isAdmin ? nextSession : null);
      setCheckingSession(false);
    };

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        acceptSession(data?.session || null);
      })
      .catch(() => {
        if (!active) return;
        setCheckingSession(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) acceptSession(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  };

  if (session) {
    return cloneElement(children, { onSignOut: handleSignOut });
  }

  if (checkingSession) return null;
  if (!ADMIN_EMAIL || !supabase) return <Navigate to="/" replace />;
  return <Navigate to="/" replace />;
};

export default BlogWritingAccess;