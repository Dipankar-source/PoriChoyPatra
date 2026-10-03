import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  BookOpen,
  BriefcaseBusiness,
  ChartNoAxesColumn,
  ChevronDown,
  FlaskConical,
  FolderKanban,
  Github,
  House,
  LockKeyhole,
  LoaderCircle,
  Mail,
  Menu,
  Moon,
  Search,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "@/lib/supabase";
import clickSoundPath from "../assets/sounds/click.mp3";

const MotionDiv = motion.div;
const MotionSection = motion.section;
const BLOG_ADMIN_EMAIL = (import.meta.env.VITE_BLOG_ADMIN_EMAIL || "")
  .trim()
  .toLowerCase();
const BLOG_LOGIN_RATE_KEY = "dipfolio_blog_login_rate_v1";
const BLOG_LOGIN_LOCK_MS = 10 * 60 * 1000;

const readBlogLoginRate = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(BLOG_LOGIN_RATE_KEY) || "{}");
    if (saved.lockoutUntil && saved.lockoutUntil <= Date.now()) {
      localStorage.removeItem(BLOG_LOGIN_RATE_KEY);
      return { attempts: 0, lockoutUntil: 0 };
    }
    return {
      attempts: Math.min(2, Number(saved.attempts) || 0),
      lockoutUntil: Number(saved.lockoutUntil) || 0,
    };
  } catch {
    return { attempts: 0, lockoutUntil: 0 };
  }
};

const formatLockoutTime = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const PremiumSearch = lazy(() =>
  import("@/uicomponents/searchs/premium-search").then((module) => ({
    default: module.PremiumSearch,
  })),
);

const primaryLinks = [
  { label: "Home", description: "Profile and introduction", path: "/" },
  { label: "Projects", description: "Selected work and case studies", path: "/projects" },
  { label: "Experience", description: "Career and skills", path: "/experience" },
];

const moreGroups = [
  {
    label: "Portfolio",
    items: [
      {
        label: "About",
        description: "My journey, skills, and background",
        path: "/",
        section: "about",
      },
      {
        label: "Experience",
        description: "Roles and teams that shaped my work",
        path: "/experience",
      },
    ],
  },
  {
    label: "Selected work",
    items: [
      {
        label: "Projects",
        description: "Products, experiments, and case studies",
        path: "/projects",
      },
      {
        label: "Research",
        description: "Papers and applied AI work",
        path: "/",
        section: "paperwork",
      },
    ],
  },
  {
    label: "Explore",
    compact: true,
    items: [
      { label: "Blog", description: "Articles on design and development", path: "/blog" },
      { label: "Write Blog", description: "Create and manage blog posts", path: "/blog-writing" },
      { label: "GitHub activity", description: "Open-source work and contributions", path: "/", section: "github" },
      { label: "Visitor analytics", description: "Portfolio traffic overview", path: "/", section: "visitors" },
      { label: "Contact", description: "Discuss a project", path: "/contact" },
    ],
  },
];

const secondaryLinks = moreGroups.flatMap((group) => group.items);
const mobileMoreLinks = secondaryLinks.filter(
  (item) => !primaryLinks.some((primaryItem) => primaryItem.label === item.label),
);

const mobileLinkIcons = {
  Home: { Icon: House, color: "from-blue-500 to-blue-700", tint: "59, 130, 246" },
  Projects: { Icon: FolderKanban, color: "from-orange-500 to-orange-700", tint: "249, 115, 22" },
  Experience: { Icon: BriefcaseBusiness, color: "from-emerald-500 to-emerald-700", tint: "16, 185, 129" },
  About: { Icon: UserRound, color: "from-cyan-500 to-cyan-700", tint: "6, 182, 212" },
  Research: { Icon: FlaskConical, color: "from-amber-500 to-amber-700", tint: "245, 158, 11" },
  Blog: { Icon: BookOpen, color: "from-rose-500 to-rose-700", tint: "244, 63, 94" },
  "Write Blog": { Icon: LockKeyhole, color: "from-rose-500 to-rose-700", tint: "244, 63, 94" },
  "GitHub activity": { Icon: Github, color: "from-slate-600 to-slate-800", tint: "71, 85, 105" },
  "Visitor analytics": { Icon: ChartNoAxesColumn, color: "from-teal-500 to-teal-700", tint: "20, 184, 166" },
  Contact: { Icon: Mail, color: "from-red-500 to-red-700", tint: "239, 68, 68" },
};

const routePreloaders = {
  "/": () => import("../pages/Home"),
  "/projects": () => import("../pages/Projects"),
  "/experience": () => import("../pages/Experience"),
  "/blog": () => import("../pages/Blog"),
  "/blog-writing": () => import("../pages/BlogWritting"),
  "/contact": () => import("./Contact"),
};

const preloadRoute = (item) => {
  const path = item.section ? "/" : item.path;
  const loaders =
    path === "/blog-writing"
      ? [
          routePreloaders[path],
          () => import("../components/BlogWritingAccess"),
        ]
      : path.startsWith("/blog/")
        ? [() => import("../pages/EachBlogById")]
        : [routePreloaders[path] || (() => import("../pages/NotFound"))];

  loaders.forEach((load) => void load().catch(() => {}));
};

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [blogLoginOpen, setBlogLoginOpen] = useState(false);
  const [blogPassword, setBlogPassword] = useState("");
  const [blogLoginError, setBlogLoginError] = useState("");
  const [blogLoginSubmitting, setBlogLoginSubmitting] = useState(false);
  const [blogLoginRate, setBlogLoginRate] = useState(readBlogLoginRate);
  const [rateClock, setRateClock] = useState(Date.now());
  const [sectionSelection, setSectionSelection] = useState(() => ({
    locationKey: location.key,
    section: location.hash.slice(1) || "hero",
  }));
  const activeSection =
    sectionSelection.locationKey === location.key
      ? sectionSelection.section
      : location.hash.slice(1) || "hero";
  const lockoutSeconds = Math.max(
    0,
    Math.ceil((blogLoginRate.lockoutUntil - rateClock) / 1000),
  );

  useEffect(() => {
    if (!blogLoginRate.lockoutUntil) return undefined;

    const updateClock = () => {
      const now = Date.now();
      setRateClock(now);
      if (blogLoginRate.lockoutUntil <= now) {
        const reset = { attempts: 0, lockoutUntil: 0 };
        setBlogLoginRate(reset);
        try {
          localStorage.removeItem(BLOG_LOGIN_RATE_KEY);
        } catch {
          // Supabase Auth still applies its own rate limits if storage is unavailable.
        }
        setBlogLoginError("");
      }
    };

    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, [blogLoginRate.lockoutUntil]);

  const handleThemeToggle = useCallback(() => {
    try {
      const audio = new Audio(clickSoundPath);
      audio.volume = 0.5;
      void audio.play().catch(() => {});
    } catch {
      // Theme switching should still work if audio playback is unavailable.
    }
    toggleTheme();
  }, [toggleTheme]);

  const requestBlogWriting = async () => {
    setMoreOpen(false);
    setMobileOpen(false);
    setBlogLoginError("");

    if (!supabase || !BLOG_ADMIN_EMAIL) {
      setBlogLoginError("Blog sign-in is not configured.");
      setBlogLoginOpen(true);
      return;
    }

    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email?.trim().toLowerCase() === BLOG_ADMIN_EMAIL) {
        navigate("/blog-writing");
        return;
      }
    } catch {
      setBlogLoginError("Unable to check your sign-in. Please try again.");
    }

    setBlogLoginOpen(true);
  };

  const saveFailedLogin = () => {
    const attempts = blogLoginRate.attempts + 1;
    const nextRate =
      attempts >= 3
        ? { attempts: 0, lockoutUntil: Date.now() + BLOG_LOGIN_LOCK_MS }
        : { attempts, lockoutUntil: 0 };

    setBlogLoginRate(nextRate);
    try {
      localStorage.setItem(BLOG_LOGIN_RATE_KEY, JSON.stringify(nextRate));
    } catch {
      // Supabase Auth still applies its own rate limits if storage is unavailable.
    }

    if (nextRate.lockoutUntil) {
      setBlogLoginError("Too many failed attempts. Try again in 10:00.");
    } else {
      setBlogLoginError(
        `Password incorrect. ${3 - attempts} attempt${attempts === 2 ? "" : "s"} remaining.`,
      );
    }
  };

  const submitBlogLogin = async (event) => {
    event.preventDefault();
    if (lockoutSeconds > 0 || blogLoginSubmitting) return;
    if (!supabase || !BLOG_ADMIN_EMAIL) {
      setBlogLoginError("Blog sign-in is not configured.");
      return;
    }

    setBlogLoginSubmitting(true);
    setBlogLoginError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: BLOG_ADMIN_EMAIL,
        password: blogPassword,
      });

      if (error || data?.user?.email?.trim().toLowerCase() !== BLOG_ADMIN_EMAIL) {
        saveFailedLogin();
        return;
      }

      const reset = { attempts: 0, lockoutUntil: 0 };
      setBlogLoginRate(reset);
      try {
        localStorage.removeItem(BLOG_LOGIN_RATE_KEY);
      } catch {
        // The authenticated session remains valid without local storage.
      }
      setBlogLoginOpen(false);
      setBlogPassword("");
      navigate("/blog-writing");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setBlogLoginError("Unable to sign in. Check your connection and try again.");
    } finally {
      setBlogLoginSubmitting(false);
    }
  };

  const scrollToSection = (section) => {
    const target = document.getElementById(section);
    if (!target) return;

    const alignTarget = () => {
      const top = window.scrollY + target.getBoundingClientRect().top - 54;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    alignTarget();

    let settleTimer;
    const getPageHeight = () => document.documentElement.scrollHeight;
    let previousHeight = getPageHeight();
    const observer = new ResizeObserver(() => {
      const nextHeight = getPageHeight();
      if (nextHeight === previousHeight) return;

      previousHeight = nextHeight;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        alignTarget();
        observer.disconnect();
      }, 180);
    });

    observer.observe(document.body);
    observer.observe(document.documentElement);
    window.setTimeout(() => {
      window.clearTimeout(settleTimer);
      alignTarget();
      observer.disconnect();
    }, 2500);
  };

  useEffect(() => {
    const handleShortcut = (event) => {
      const target = event.target;
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (
        event.shiftKey &&
        event.key.toLowerCase() === "t" &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !isTypingTarget
      ) {
        event.preventDefault();
        handleThemeToggle();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [handleThemeToggle]);

  const goTo = (item) => {
    setMoreOpen(false);
    setMobileOpen(false);
    preloadRoute(item);

    if (item.label === "Home") {
      navigate("/");
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
      return;
    }

    if (item.label === "Write Blog") {
      requestBlogWriting();
      return;
    }

    if (item.section) {
      setSectionSelection({ locationKey: location.key, section: item.section });
      if (location.pathname !== "/") {
        navigate(`/#${item.section}`);
        window.setTimeout(() => {
          scrollToSection(item.section);
        }, 100);
        return;
      }

      scrollToSection(item.section);
      return;
    }

    navigate(item.path);
  };

  const isActive = (item) => {
    if (item.section) {
      return (
        (location.pathname === "/" && activeSection === item.section) ||
        (item.section === "projects" && location.pathname.startsWith("/projects"))
      );
    }
    return location.pathname === item.path;
  };

  const renderLink = (item, mobile = false) => {
    const mobileIcon = mobileLinkIcons[item.label];
    const MobileIcon = mobileIcon?.Icon;

    return (
    <button
      key={item.label}
      type="button"
      onClick={() => goTo(item)}
      onPointerEnter={() => preloadRoute(item)}
      onFocus={() => preloadRoute(item)}
      style={mobile && isActive(item) ? {
        backgroundImage: `linear-gradient(110deg, rgba(${mobileIcon.tint}, ${isDark ? 0.18 : 0.11}), rgba(${mobileIcon.tint}, 0.025))`,
      } : undefined}
      className={`relative flex text-left transition-colors ${mobile ? "group min-h-[54px] w-full flex-row items-center gap-2 rounded-md border border-neutral-200/80 bg-white/60 px-2 py-1 dark:border-neutral-800 dark:bg-neutral-900/60" : "min-h-10 items-center px-2.5 text-[13px] font-medium leading-none tracking-[0.01em]"} ${isActive(item) ? "font-semibold text-neutral-950 dark:text-white" : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"}`}
    >
      {mobile ? (
        <>
          <span
            aria-hidden="true"
            className={`relative inline-flex size-7 shrink-0 items-center justify-center rounded-[5px] border border-white/45 bg-linear-to-br ${mobileIcon.color} text-white shadow-[0_3px_7px_rgba(15,23,42,0.22),inset_0_1px_1px_rgba(255,255,255,0.45)] ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105`}
          >
            <span className="absolute inset-x-1 top-0.5 h-px bg-white/50" />
            <MobileIcon className="size-3.5" strokeWidth={2.4} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-medium">{item.label}</span>
            {item.description && (
              <span className="mt-0.5 block line-clamp-1 text-[9px] font-normal leading-tight text-neutral-500 dark:text-neutral-400">
                {item.description}
              </span>
            )}
          </span>
        </>
      ) : (
        <span>{item.label}</span>
      )}
      {isActive(item) && !mobile && (
        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-neutral-900 dark:bg-white" />
      )}
      {mobile && isActive(item) && (
        <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white" />
      )}
    </button>
    );
  };

  return (
    <nav
      aria-label="Main navigation"
      className="relative flex h-[54px] items-center justify-between bg-[#F7F7F4]/95 px-3 backdrop-blur dark:bg-[#0F0F0F]/95 sm:px-5"
    >
      <button
        type="button"
        onClick={() => goTo(primaryLinks[0])}
        className="aktura-font text-[32px] leading-none text-neutral-950 dark:text-white"
        aria-label="Dipankar Barik, home"
      >
        D
      </button>

      <div className="hidden h-full items-center gap-1 md:flex">
        {primaryLinks.map((item) => renderLink(item))}
        <div
          className="relative flex h-full items-center"
          onMouseEnter={() => setMoreOpen(true)}
          onMouseLeave={() => setMoreOpen(false)}
          onFocus={() => setMoreOpen(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setMoreOpen(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setMoreOpen(false);
          }}
        >
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-haspopup="true"
            aria-controls="more-navigation-panel"
            onClick={() => setMoreOpen(true)}
            className="inline-flex h-10 items-center gap-1 px-2.5 text-[13px] font-medium leading-none tracking-[0.01em] text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
          >
            <span className="leading-none">More</span>
          </button>
          {moreOpen && (
            <nav
              id="more-navigation-panel"
              aria-label="More navigation"
              className="animate-in fade-in slide-in-from-top-2 duration-150 fixed left-1/2 top-[54px] z-50 w-[min(48rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-neutral-200/90 bg-[#F7F7F4] p-2 shadow-xl dark:border-neutral-800 dark:bg-[#151515]"
            >
              <div className="grid grid-cols-3 divide-x divide-neutral-200 dark:divide-neutral-800">
                {moreGroups.map((group) => (
                  <div key={group.label} className="min-w-0 px-3 py-2 sm:px-5">
                    <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                      {group.label}
                    </h2>
                    <div className={group.compact ? "space-y-1" : "space-y-3"}>
                      {group.items.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => goTo(item)}
                          onPointerEnter={() => preloadRoute(item)}
                          onFocus={() => preloadRoute(item)}
                          aria-current={isActive(item) ? "page" : undefined}
                          className={`block w-full rounded-sm text-left transition-colors ${
                            group.compact
                              ? "px-2 py-1.5 text-[13px]"
                              : "px-2 py-1.5"
                          } ${
                            isActive(item)
                              ? "text-neutral-950 dark:text-white"
                              : "text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 text-[13px] font-medium">
                            {item.label}
                            {item.label === "Write Blog" && (
                              <LockKeyhole className="size-3 text-neutral-400" aria-hidden="true" />
                            )}
                          </span>
                          {item.description && (
                            <span className="mt-1 block max-w-[15rem] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                              {item.description}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </nav>
          )}
        </div>
        <Suspense
          fallback={
            <button
              type="button"
              aria-label="Search"
              disabled
              className="ml-1 inline-flex h-9 w-9 items-center justify-center text-neutral-600 dark:text-neutral-300"
            >
              <Search className="h-4 w-4" />
            </button>
          }
        >
          <PremiumSearch />
        </Suspense>
        <button
          type="button"
          onClick={handleThemeToggle}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          aria-keyshortcuts="Shift+T"
          title={`Switch to ${isDark ? "light" : "dark"} theme (Shift+T)`}
          className="group relative ml-1 inline-flex h-9 w-9 items-center justify-center text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-full z-[70] mt-1 whitespace-nowrap rounded-full border border-neutral-300/80 bg-[#F7F7F4] px-2.5 py-1 text-[10px] font-medium text-neutral-600 opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-neutral-700 dark:bg-[#171717] dark:text-neutral-200"
          >
            Shift + T
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1 md:hidden">
        <Suspense
          fallback={
            <button
              type="button"
              aria-label="Search"
              disabled
              className="inline-flex h-9 w-9 items-center justify-center text-neutral-600 dark:text-neutral-300"
            >
              <Search className="h-4 w-4" />
            </button>
          }
        >
          <PremiumSearch />
        </Suspense>
        <button
          type="button"
          onClick={handleThemeToggle}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          aria-keyshortcuts="Shift+T"
          title={`Switch to ${isDark ? "light" : "dark"} theme (Shift+T)`}
          className="group relative inline-flex h-9 w-9 items-center justify-center text-neutral-600 dark:text-neutral-300"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-full z-[70] mt-1 whitespace-nowrap rounded-full border border-neutral-300/80 bg-[#F7F7F4] px-2.5 py-1 text-[10px] font-medium text-neutral-600 opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-neutral-700 dark:bg-[#171717] dark:text-neutral-200"
          >
            Shift + T
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          className="inline-flex h-9 w-9 items-center justify-center text-neutral-700 dark:text-neutral-200"
        >
          {mobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <MotionDiv
              className="fixed inset-0 z-[80] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileOpen(false)}
                className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
              />
              <MotionSection
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="absolute inset-x-3 bottom-3 flex max-h-[min(78dvh,42rem)] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-[#F7F7F4] p-4 shadow-2xl dark:border-neutral-800 dark:bg-[#121212]"
              >
                <header className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
                  <div>
                    <p className="dancing-font tracking-wider text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
                      Menu
                    </p>
                    <h2 className="dancing-font tracking-wider mt-1 text-base font-bold text-neutral-950 dark:text-white">
                      Explore DipFolio
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation menu"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </header>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain space-y-5 mb-14">
                  <div>
                    <h3 className="dancing-font tracking-wider mb-2 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                      Main navigation
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {primaryLinks.map((item) =>
                        renderLink(item, true),
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="dancing-font mb-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-neutral-400 dark:text-neutral-500">
                      More to explore
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {mobileMoreLinks.map((item) => renderLink(item, true))}
                    </div>
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-t from-[#F7F7F4]/95 to-transparent backdrop-blur-[6px] mask-[linear-gradient(to_top,#000_15%,transparent)] dark:from-[#121212]/95"
                />
              </MotionSection>
            </MotionDiv>
          )}
        </AnimatePresence>,
        document.body,
      )}
      {createPortal(
        <AnimatePresence>
          {blogLoginOpen && (
            <MotionDiv
              key="blog-writing-login"
              role="dialog"
              aria-modal="true"
              aria-labelledby="blog-login-title"
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setBlogLoginOpen(false);
                  setBlogPassword("");
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setBlogLoginOpen(false);
                  setBlogPassword("");
                }
              }}
            >
              <MotionDiv
                className="relative w-full max-w-sm rounded-md border border-neutral-300/80 bg-[#F7F7F4]/95 p-6 text-neutral-950 shadow-2xl backdrop-blur-md dark:border-neutral-700/80 dark:bg-[#121212]/95 dark:text-neutral-50"
                initial={{ y: 10, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 8, scale: 0.98 }}
                transition={{ duration: 0.16 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setBlogLoginOpen(false);
                    setBlogPassword("");
                  }}
                  aria-label="Close blog sign-in"
                  className="absolute right-3 top-3 inline-flex size-8 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-white"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>

                <h2
                  id="blog-login-title"
                  className="display-font mt-4 text-2xl tracking-wider"
                >
                  Write Blog
                </h2>

                {!supabase || !BLOG_ADMIN_EMAIL ? (
                  <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
                    Blog sign-in is not configured.
                  </p>
                ) : (
                  <form onSubmit={submitBlogLogin} className="mt-5 space-y-3">
                    <label className="sr-only" htmlFor="blog-admin-password">
                      Password
                    </label>
                    <input
                      id="blog-admin-password"
                      type="password"
                      autoComplete="current-password"
                      autoFocus
                      value={blogPassword}
                      onChange={(event) => setBlogPassword(event.target.value)}
                      placeholder="Password"
                      disabled={lockoutSeconds > 0 || blogLoginSubmitting}
                      className="w-full rounded-md border border-neutral-300 bg-neutral-100 px-4 py-3 text-sm text-neutral-950 shadow-inner outline-none transition-colors placeholder:text-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 dark:border-neutral-700 dark:bg-[#242424] dark:text-white dark:placeholder:text-neutral-400 dark:focus:border-blue-400"
                      required
                    />
                    {blogLoginError && (
                      <p role="alert" className="text-xs leading-5 text-red-600 dark:text-red-400">
                        {lockoutSeconds > 0
                          ? `Too many failed attempts. Try again in ${formatLockoutTime(lockoutSeconds)}.`
                          : blogLoginError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={blogLoginSubmitting || lockoutSeconds > 0}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-[0_3px_8px_rgba(37,99,235,0.28)] transition-colors hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-wait disabled:opacity-60 dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
                    >
                      {blogLoginSubmitting ? (
                        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <LockKeyhole className="size-4" aria-hidden="true" />
                      )}
                      {lockoutSeconds > 0
                        ? `Wait ${formatLockoutTime(lockoutSeconds)}`
                        : blogLoginSubmitting
                          ? "Checking password"
                          : "Unlock writing"}
                    </button>
                  </form>
                )}
              </MotionDiv>
            </MotionDiv>
          )}
        </AnimatePresence>,
        document.body,
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full z-[2] w-screen -translate-x-1/2 border-t border-dashed border-neutral-300/80 dark:border-neutral-800"
      />
    </nav>
  );
};

export default Navbar;