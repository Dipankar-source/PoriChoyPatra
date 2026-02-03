//;
import React, { useState, useEffect, useRef } from "react";
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
    path: "#projects",
    category: "Sections",
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

// Updated to accept dynamic blogPosts
export function PremiumSearch({ blogPosts = [] }) {
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
        className="group relative flex items-center gap-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md"
      >
        <span className="hidden sm:inline">Cmd+K</span>
        <kbd className="sm:hidden inline-flex items-center justify-center rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 font-mono">
          K
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
                                  ? "bg-zinc-100 dark:bg-white/10 shadow-sm"
                                  : "hover:bg-zinc-50 dark:hover:bg-white/5"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-lg border",
                                    isActive
                                      ? "bg-white dark:bg-zinc-800 border-zinc-200"
                                      : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
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
      </AnimatePresence>
    </>
  );
}
