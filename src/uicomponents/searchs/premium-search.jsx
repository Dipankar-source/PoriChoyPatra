//;
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  FileText,
  Loader2,
  X,
  BookType,
  BriefcaseBusiness,
  FolderRoot,
  Phone,
  FileUser,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const STATIC_SEARCH_ITEMS = [
  {
    id: 101,
    title: "Portfolio",
    icon: BriefcaseBusiness,
    path: "/",
    category: "Pages",
    desc: "View Portfolio",
  },
  {
    id: 102,
    title: "Blog",
    icon: BookType,
    path: "/blog",
    category: "Pages",
    desc: "Read The Ideas",
  },
  {
    id: 103,
    title: "Contact",
    icon: Phone,
    path: "/contact",
    category: "Pages",
    desc: "Need a help?",
  },
  {
    id: 104,
    title: "Projects",
    icon: FolderRoot,
    path: "/projects",
    category: "Pages",
    desc: "View my projects",
  },
  {
    id: 105,
    title: "Resume/CV",
    icon: FileUser,
    path: "/Resume_Portfolio.pdf",
    category: "Sections",
    desc: "View my CV",
  },
];

const EMPTY_BLOG_POSTS = [];

// Updated to accept dynamic blogPosts
export function PremiumSearch({ blogPosts = EMPTY_BLOG_POSTS }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Combine static items with dynamic blog posts
  const allSearchableItems = [
    ...STATIC_SEARCH_ITEMS,
    ...blogPosts.map((post) => ({
      id: `blog-${post.id}`,
      title: post.title,
      icon: FileText,
      path: `/blog/${post.id}`,
      category: "Blogs",
      desc: post.excerpt,
    })),
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);

      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredResults.length) % filteredResults.length
        );
      }
      if (e.key === "Enter" && filteredResults.length > 0) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredResults]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setTimeout(() => {
        inputRef.current?.focus();
        setIsLoading(false);
      }, 300);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchQuery = query.trim().toLowerCase();

    // Filter logic
    let results = allSearchableItems;
    if (searchQuery !== "") {
      results = allSearchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.desc.toLowerCase().includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery)
      );
    }
    setFilteredResults(results);
    setSelectedIndex(0);

    // Grouping Logic
    const grouped = results.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
    setGroupedResults(grouped);
  }, [query, blogPosts]); // Re-run if blogPosts changes

  const handleSelectItem = (item) => {
    setIsOpen(false);

    // Special handling for PDF files
    if (item.path.endsWith(".pdf")) {
      // Direct window location change for PDF files
      window.location.href = item.path;
      return;
    }

    if (item.path.startsWith("http")) {
      window.open(item.path, "_blank", "noopener,noreferrer");
    } else if (item.path.startsWith("#")) {
      const element = document.querySelector(item.path);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Search"
        title="Search pages and content"
        aria-keyshortcuts="Control+K Meta+K"
        className="group inline-flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-[#542A52]/20 bg-white/70 px-0 text-[#542A52] shadow-sm transition-colors hover:border-[#542A52]/45 hover:bg-[#FFB39A]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#542A52]/40 md:ml-1 md:w-auto md:justify-between md:gap-1.5 md:px-2 dark:border-[#FFB39A]/25 dark:bg-neutral-900/70 dark:text-[#FFB39A] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,179,154,0.12)] dark:hover:bg-[#542A52]/25 dark:hover:shadow-[0_3px_10px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,179,154,0.22)] dark:focus-visible:ring-[#FFB39A]/50"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden text-xs font-medium md:inline">Search</span>
        <kbd className="hidden items-center justify-center rounded border border-[#542A52]/15 px-1 py-0.5 font-mono text-[10px] font-medium text-[#542A52]/75 md:inline-flex dark:border-[#FFB39A]/20 dark:text-[#FFB39A]/75">
          ⌘ K
        </kbd>
      </button>

      {createPortal(
        <AnimatePresence mode="wait">
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white dark:bg-[#09090b] shadow-2xl border border-zinc-200 dark:border-white/10 pointer-events-auto z-50"
              >
                {/* Search Input Section */}
                <div className="relative flex items-center border-b border-zinc-200 dark:border-white/5 px-4 py-4">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                  ) : (
                    <Search className="h-5 w-5 text-zinc-400" />
                  )}
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Where would you like to go?"
                    className="flex-1 bg-transparent px-4 text-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Search"
                    className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Results Section */}
                <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                  {filteredResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-zinc-500">
                      <Search className="h-12 w-12 mb-2 opacity-50" />
                      <p>No results found</p>
                    </div>
                  ) : (
                    Object.entries(groupedResults).map(([category, items]) => (
                      <div key={category} className="mb-4">
                        <h4 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          {category}
                        </h4>
                        <div className="space-y-1">
                          {items.map((item) => {
                            const globalIdx = filteredResults.findIndex(
                              (x) => x.id === item.id,
                            );
                            const isActive = globalIdx === selectedIndex;
                            return (
                              <motion.div
                                key={item.id}
                                onClick={() => handleSelectItem(item)}
                                onMouseEnter={() => setSelectedIndex(globalIdx)}
                                className={cn(
                                  "group flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-all duration-200",
                                  isActive
                                    ? "bg-zinc-100 dark:bg-white/10 shadow-sm"
                                    : "hover:bg-zinc-50 dark:hover:bg-white/5",
                                )}
                              >
                                <div className="flex items-center gap-4">
                                  <div
                                    className={cn(
                                      "flex h-8 w-8 items-center justify-center rounded-lg border",
                                      isActive
                                        ? "bg-white dark:bg-zinc-800 border-zinc-200"
                                        : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
                                    )}
                                  >
                                    <item.icon className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <h3
                                      className={cn(
                                        "text-sm font-medium",
                                        isActive
                                          ? "text-zinc-900 dark:text-white"
                                          : "text-zinc-700 dark:text-zinc-300",
                                      )}
                                    >
                                      {item.title}
                                    </h3>
                                    <p className="text-xs text-zinc-500 line-clamp-1">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                                {isActive && (
                                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
