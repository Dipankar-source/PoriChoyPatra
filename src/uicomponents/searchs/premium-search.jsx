"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  ArrowRight,
  FileText,
  Settings,
  User,
  CreditCard,
  Loader2,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SEARCHABLE_ITEMS = [
  {
    id: 1,
    title: "Analytics Dashboard",
    icon: FileText,
    path: "/analytics",
    category: "Pages",
    desc: "View project analytics",
  },
  {
    id: 2,
    title: "Account Settings",
    icon: Settings,
    path: "/settings",
    category: "Pages",
    desc: "Manage your account",
  },
  {
    id: 3,
    title: "Projects",
    icon: FileText,
    path: "#projects",
    category: "Sections",
    desc: "View my projects",
  },
  {
    id: 4,
    title: "Blog",
    icon: FileText,
    path: "/blog",
    category: "Pages",
    desc: "Read my latest articles",
  },
  {
    id: 5,
    title: "Contact",
    icon: User,
    path: "#contact",
    category: "Sections",
    desc: "Get in touch with me",
  },
  {
    id: 6,
    title: "Home",
    icon: CreditCard,
    path: "/",
    category: "Pages",
    desc: "Return to homepage",
  },
  {
    id: 7,
    title: "GitHub Profile",
    icon: User,
    path: "https://github.com/Dipankar-source",
    category: "External",
    desc: "View my GitHub",
  },
  {
    id: 8,
    title: "LinkedIn",
    icon: User,
    path: "https://linkedin.com/in/dipankarbarik",
    category: "External",
    desc: "Connect on LinkedIn",
  },
];

export function PremiumSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const allItems = filteredResults;

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
        setSelectedIndex((prev) => (prev + 1) % allItems.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + allItems.length) % allItems.length
        );
      }
      if (e.key === "Enter" && allItems.length > 0) {
        handleSelectItem(allItems[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, allItems]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setTimeout(() => {
        inputRef.current?.focus();
        setIsLoading(false);
      }, 500);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchQuery = query.trim().toLowerCase();

    if (searchQuery === "") {
      setFilteredResults(SEARCHABLE_ITEMS);
    } else {
      const filtered = SEARCHABLE_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.desc.toLowerCase().includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery)
      );
      setFilteredResults(filtered);
    }

    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const grouped = filteredResults.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    setGroupedResults(grouped);
  }, [filteredResults]);

  const handleSelectItem = (item) => {
    setIsOpen(false);

    if (item.path.startsWith("http")) {
      window.open(item.path, "_blank", "noopener,noreferrer");
    } else if (item.path.startsWith("#")) {
      const element = document.querySelector(item.path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-3 rounded-sm w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all w-64 shadow-sm hover:shadow-md justify-center"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 font-mono">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-[#09090b] shadow-2xl border border-zinc-200 dark:border-white/10"
            >
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
                  placeholder="Search for pages, sections, or external links..."
                  className="flex-1 bg-transparent px-4 text-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 transition-colors mr-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                {filteredResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Search className="h-12 w-12 text-zinc-400 mb-4" />
                    <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      No results found
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-md">
                      Try searching for "projects", "blog", or "settings"
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category} className="mb-4">
                      <h4 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        {category} ({items.length})
                      </h4>

                      <div className="space-y-1">
                        {items.map((item, itemIdx) => {
                          const globalIdx = allItems.findIndex(
                            (x) => x.id === item.id
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
                                  ? "bg-zinc-100 dark:bg-white/10 shadow-sm scale-[0.99]"
                                  : "hover:bg-zinc-50 dark:hover:bg-white/5"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-lg border shadow-sm transition-colors",
                                    isActive
                                      ? "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                                      : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
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
                                        : "text-zinc-700 dark:text-zinc-300"
                                    )}
                                  >
                                    {item.title}
                                  </h3>
                                  <p className="text-xs text-zinc-500">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                  {item.path.startsWith("http")
                                    ? "External"
                                    : item.path.startsWith("#")
                                    ? "Section"
                                    : "Page"}
                                </span>
                                {isActive && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-zinc-400"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}

                <div className="mt-4 border-t border-zinc-200 dark:border-white/5 px-4 py-3">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>
                      {filteredResults.length === SEARCHABLE_ITEMS.length
                        ? "Showing all items"
                        : `Found ${filteredResults.length} result${
                            filteredResults.length !== 1 ? "s" : ""
                          }`}
                    </span>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <ArrowUpIcon /> <ArrowDownIcon /> to navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <EnterIcon /> to select
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const ArrowUpIcon = () => (
  <svg
    className="w-3 h-3 bg-zinc-200 dark:bg-zinc-800 rounded p-0.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const ArrowDownIcon = () => (
  <svg
    className="w-3 h-3 bg-zinc-200 dark:bg-zinc-800 rounded p-0.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);
const EnterIcon = () => (
  <svg
    className="w-3 h-3 bg-zinc-200 dark:bg-zinc-800 rounded p-0.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 10l5 5 5-5" />
  </svg>
);
