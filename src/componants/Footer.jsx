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
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const FooterSystem = () => {
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);

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

  return (
    <footer className="w-full bg-[#09090b] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between text-xs font-sans text-zinc-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-help">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="group-hover:text-zinc-300 transition-colors">
              SYSTEM_ONLINE
            </span>
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <div className="hidden sm:block hover:text-zinc-300 transition-colors">
            LOC_TIME: {time}
          </div>
        </div>

        <div className="hidden md:block opacity-50">DIPANKAR_BARIK © 2024</div>

        <div className="flex items-center gap-6">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 hover:text-white transition-colors group relative"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-emerald-500 font-bold"
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
                  <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">COPY_MAIL</span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className="h-4 w-[1px] bg-white/10" />

          <div className="flex items-center gap-4">
            <SocialLink
              href="https://github.com/Dipankar-source"
              icon={Github}
              label="GH"
            />
            <SocialLink
              href="https://linkedin.com/in/dipankarbarik"
              icon={Linkedin}
              label="LI"
            />
            <SocialLink
              href="https://x.com/_dipankarsource"
              icon={Twitter}
              label="TW"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon: Icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-1 hover:text-white transition-colors"
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="w-0 overflow-hidden group-hover:w-auto group-hover:ml-1 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100">
        {label}
      </span>
    </a>
  );
};

export default FooterSystem;
