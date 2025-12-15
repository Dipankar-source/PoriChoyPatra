"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Github,
  Twitter,
  Linkedin,
  ArrowUpRight,
  Download,
  ArrowDown, // Added ArrowDown
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const FooterSystem = () => {
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);
  const [showArrow, setShowArrow] = useState(false); // State for arrow visibility
  const footerRef = useRef(null); // Ref for the footer
  const { isDark } = useTheme();

  // 1. Time Update Effect
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

  // 2. Intersection Observer to trigger the arrow
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowArrow(true);
          // Hide arrow after 3 seconds
          const timeout = setTimeout(() => {
            setShowArrow(false);
          }, 7000);

          // Disconnect observer so it only runs once per page load
          observer.disconnect();
          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the footer is visible
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("dipankarbarik2002@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const footerClasses = cn(
    "w-full border-t mt-auto relative", // Added relative
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
    <footer ref={footerRef} className={footerClasses}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Side: System Status & Time */}
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

        {/* Center: Copyright */}
        <div className={cn("hidden md:block opacity-70", textClasses)}>
          DIPANKAR_BARIK © 2024
        </div>

        {/* Right Side: Copy Email & Socials */}
        <div className={textClasses}>
          <div className="flex items-center gap-6">
            {/* Copy Email Button */}
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

            {/* Social Links */}
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

              {/* CV Download Button with Arrow Animation */}
              <div className="relative">
                <AnimatePresence>
                  {showArrow && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none",
                        isDark ? "text-white" : "text-black"
                      )}
                    >
                      <span className="text-[10px] font-mono mb-1 whitespace-nowrap opacity-80">
                        Get CV
                      </span>
                      <ArrowDown className="w-4 h-4 animate-bounce text-emerald-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <SocialLink
                  href="/CV.pdf"
                  icon={Download}
                  label="CV"
                  isDark={isDark}
                />
              </div>
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
