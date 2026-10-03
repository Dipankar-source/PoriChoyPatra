import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ChevronDown, ListTree, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const SECTIONS = [
  { id: "hero", title: "The Beginning" },
  { id: "about", title: "Why hire me?" },
  { id: "experience", title: "What I've done" },
  { id: "github", title: "How I learn" },
  { id: "projects", title: "What I've built" },
  { id: "paperwork", title: "What I've explored" },
  { id: "testimonials", title: "What people say" },
  { id: "visitors", title: "Who's there" },
  { id: "contact", title: "Get in touch" },

];

const TableOfContents = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const { isDark } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

        if (visibleSections[0]) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -58% 0px",
        threshold: [0, 0.15, 0.35, 0.6, 1],
      },
    );

    SECTIONS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const activeIndex = Math.max(
    0,
    SECTIONS.findIndex((section) => section.id === activeSection),
  );
  const currentSection = SECTIONS[activeIndex];

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-90 h-36 bg-linear-to-t from-[#F7F7F4]/95 via-[#F7F7F4]/35 to-transparent backdrop-blur-[10px] mask-[linear-gradient(to_top,#000_8%,transparent_100%)] dark:from-[#0F0F0F]/95 dark:via-[#0F0F0F]/45"
      />
      <div className="fixed inset-x-0 bottom-4 z-100 mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] flex-col items-center px-3 sm:bottom-5">
        <AnimatePresence>
          {isOpen && (
            <motion.div
            id="toc-panel"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`mb-2 w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-lg border shadow-[0_16px_48px_-24px_rgba(0,0,0,0.45)] backdrop-blur-xl ${
              isDark
                ? "border-white/10 bg-[#111111]/95 text-neutral-100"
                : "border-neutral-300/80 bg-[#FAFAF8]/95 text-neutral-900"
            }`}
          >
            <div className="flex items-center justify-between border-b border-neutral-200/70 px-4 py-3 dark:border-neutral-800">
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
                  On this page
                </p>
                <p className="mt-0.5 truncate text-sm font-medium">
                  {currentSection.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close table of contents"
                className="ml-3 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Page sections"
              className="max-h-[min(55dvh,28rem)] overflow-y-auto overscroll-contain p-1.5"
            >
              {SECTIONS.map((section, index) => {
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`group/section relative flex min-h-9 w-full items-center gap-3 rounded-sm px-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-500 ${
                      isActive
                        ? "bg-neutral-200/65 text-neutral-950 dark:bg-white/8 dark:text-white"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-100"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="toc-active-marker"
                        className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-neutral-800 dark:bg-neutral-200"
                      />
                    )}
                    <span className="w-5 shrink-0 font-mono text-[10px] tabular-nums text-neutral-400 dark:text-neutral-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                      {section.title}
                    </span>
                    <span className="size-1 shrink-0 rounded-full bg-current opacity-0 transition-opacity group-hover/section:opacity-50" />
                  </button>
                );
              })}
            </nav>
            </motion.div>
          )}
        </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="toc-panel"
        aria-label={`${isOpen ? "Close" : "Open"} table of contents. Current section: ${currentSection.title}`}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={`relative flex h-11 w-[min(340px,calc(100vw-1.5rem))] items-center gap-3 overflow-hidden rounded-md border px-3.5 text-left shadow-lg backdrop-blur-xl transition-colors ${
          isDark
            ? "border-white/10 bg-[#111111]/95 text-neutral-100 hover:bg-[#191919]"
            : "border-neutral-300/80 bg-[#FAFAF8]/95 text-neutral-900 hover:bg-white"
        }`}
      >
        <ListTree className="size-4 shrink-0 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
          {currentSection.title}
        </span>
        <span className="shrink-0 font-mono text-[10px] tabular-nums text-neutral-400 dark:text-neutral-500">
          {String(activeIndex + 1).padStart(2, "0")}
          <span className="mx-1 opacity-50">/</span>
          {String(SECTIONS.length).padStart(2, "0")}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-neutral-500 transition-transform duration-200 dark:text-neutral-400 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-neutral-800/70 dark:bg-neutral-200/70"
          style={{ scaleX: scrollYProgress }}
        />
      </motion.button>
      </div>
    </>
  );
};

export default TableOfContents;