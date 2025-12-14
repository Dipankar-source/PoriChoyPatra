"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Github,
  Twitter,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext"; // Import your theme context
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const FooterSystem = () => {
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme(); // Use your theme context

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("dipankarbarik2002@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const footerClasses = cn(
    "w-full border-t mt-auto",
    "transition-colors duration-300",
    isDark ? "bg-[#09090b] border-white/10" : "bg-white border-black/10"
  );

  const textClasses = cn(
    "text-xs font-sans transition-colors duration-300",
    isDark ? "text-zinc-500" : "text-zinc-600"
  );

  const separatorClasses = cn(
    "h-4 w-[1px] transition-colors duration-300",
    isDark ? "bg-white/10" : "bg-black/10"
  );

  const hoverTextClasses = cn(
    "transition-colors duration-200",
    isDark ? "hover:text-white" : "hover:text-black"
  );

  const statusDotClasses = cn(
    "relative flex h-2 w-2",
    isDark ? "bg-emerald-500" : "bg-emerald-600"
  );

  const statusPingClasses = cn(
    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
    isDark ? "bg-emerald-400" : "bg-emerald-500"
  );

  const copyButtonClasses = cn(
    "flex items-center gap-2 transition-colors duration-200 group relative",
    isDark ? "hover:text-white text-zinc-500" : "hover:text-black text-zinc-600"
  );

  return (
    <footer className={footerClasses}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className={textClasses}>
          <div className="flex items-center gap-6">
            <div
              className={cn(
                "flex items-center gap-2 group cursor-help",
                hoverTextClasses
              )}
            >
              <span className={statusDotClasses}>
                <span className={statusPingClasses}></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-inherit "></span>
              </span>
              <span className="transition-colors">SYSTEM_ONLINE</span>
            </div>

            <div className={cn(separatorClasses, "hidden sm:block")} />

            <div
              className={cn(
                "hidden sm:block transition-colors",
                hoverTextClasses
              )}
            >
              LOC_TIME: {time}
            </div>
          </div>
        </div>

        <div className={cn("hidden md:block opacity-70", textClasses)}>
          DIPANKAR_BARIK © 2024
        </div>

        <div className={textClasses}>
          <div className="flex items-center gap-6">
            <button onClick={handleCopy} className={copyButtonClasses}>
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={cn(
                      "font-bold",
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    )}
                  >
                    COPIED!
                  </motion.span>
                ) : (
                  <motion.span
                    key="email"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2"
                  >
                    <Copy
                      className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        "group-hover:scale-110",
                        isDark
                          ? "text-zinc-500 group-hover:text-white"
                          : "text-zinc-600 group-hover:text-black"
                      )}
                    />
                    <span className="hidden sm:inline">COPY_MAIL</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className={separatorClasses} />

            <div className="flex items-center gap-4">
              <SocialLink
                href="https://github.com/Dipankar-source"
                icon={Github}
                label="GH"
                isDark={isDark}
              />
              <SocialLink
                href="https://linkedin.com/in/dipankarbarik"
                icon={Linkedin}
                label="LI"
                isDark={isDark}
              />
              <SocialLink
                href="https://x.com/_dipankarsource"
                icon={Twitter}
                label="TW"
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon: Icon, label, isDark }) => {
  const linkClasses = cn(
    "group flex items-center gap-1 transition-colors duration-200",
    isDark ? "text-zinc-500 hover:text-white" : "text-zinc-600 hover:text-black"
  );

  const iconClasses = cn(
    "w-3.5 h-3.5 transition-colors duration-200",
    isDark
      ? "text-zinc-500 group-hover:text-white"
      : "text-zinc-600 group-hover:text-black"
  );

  const labelClasses = cn(
    "w-0 overflow-hidden transition-all duration-300 ease-out",
    "group-hover:w-auto group-hover:ml-1",
    isDark
      ? "opacity-0 group-hover:opacity-100 text-zinc-300"
      : "opacity-0 group-hover:opacity-100 text-zinc-700"
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClasses}
      aria-label={label}
    >
      <Icon className={iconClasses} />
      <span className={labelClasses}>{label}</span>
    </a>
  );
};

export default FooterSystem;
