import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListFilter, ChevronDown, Check } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard utility function (usually found in lib/utils.ts)
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "a-z", label: "Name (A-Z)" },
  { value: "z-a", label: "Name (Z-A)" },
  { value: "time-short", label: "Read Time (Short)" },
  { value: "time-long", label: "Read Time (Long)" },
];

const PremiumSort = ({ sortOption, setSortOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortOption)?.label || "Sort By";

  return (
    <div className="relative" ref={containerRef}>
      {/* 1. THE TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          // Base Styles
          "relative flex w-full min-w-[180px] items-center justify-between rounded-lg border px-10 py-2.5 text-sm transition-all duration-300",
          "bg-transparent outline-none hover:border-emerald-500/50",

          // Light Mode Colors
          "border-black/10 text-zinc-900",

          // Dark Mode Colors
          "dark:border-white/10 dark:text-white",

          // Active State (Overrides borders)
          isOpen && "border-emerald-500 ring-1 ring-emerald-500/20"
        )}
      >
        {/* Left Icon */}
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <ListFilter
            className={cn(
              "w-4 h-4 transition-colors",
              isOpen ? "text-emerald-500" : "text-zinc-500"
            )}
          />
        </div>

        {/* Selected Value */}
        <span className="truncate">{currentLabel}</span>

        {/* Right Icon (Animated) */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-colors",
                isOpen ? "text-emerald-500" : "text-zinc-500"
              )}
            />
          </motion.div>
        </div>
      </button>

      {/* 2. THE CUSTOM MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 top-full z-50 mt-2 w-full min-w-[200px] overflow-hidden rounded-xl border py-1 shadow-xl",
              // Light Mode Menu
              "bg-white border-black/10",
              // Dark Mode Menu
              "dark:bg-[#09090b] dark:border-white/10"
            )}
          >
            {SORT_OPTIONS.map((option) => {
              const isSelected = sortOption === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortOption(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-emerald-500/10 text-emerald-500"
                      : cn(
                          "text-zinc-500",
                          "hover:bg-zinc-100 hover:text-zinc-900", // Light Hover
                          "dark:hover:bg-white/5 dark:hover:text-white" // Dark Hover
                        )
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumSort;
