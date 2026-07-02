import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Github, Twitter, Linkedin, Download } from "lucide-react";

const FooterSystem = () => {
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);

  // 1. Time Update Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
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
    <footer className="w-full mb-20 bg-[#FFFFFF] dark:bg-[#09090B] transition-colors duration-300 py-6 border-t border-neutral-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Status & Time */}
        <div className="flex items-center gap-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 cursor-help group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="group-hover:text-black dark:group-hover:text-white transition-colors">Available for work</span>
          </div>
          
          <div className="h-3 w-[1px] bg-gray-300 dark:bg-gray-700" />
          
          <span className="tabular-nums tracking-tight hover:text-black dark:hover:text-white transition-colors cursor-default">
            {time || "00:00"}
          </span>
        </div>

        {/* Center: Copyright */}
        <div className="hidden md:block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Dipankar Barik
        </div>

        {/* Right: Socials & Copy Email */}
        <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400">
          
          <button 
            onClick={handleCopy} 
            className="group flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors text-xs sm:text-sm font-medium relative"
            aria-label="Copy Email"
          >
            <Copy className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  className="text-emerald-500 dark:text-emerald-400"
                >
                  Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                >
                  Email
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className="h-3 w-[1px] bg-gray-300 dark:bg-gray-700 hidden sm:block" />

          <div className="flex items-center gap-4">
            <SocialLink href="https://github.com/Dipankar-source" icon={Github} label="GitHub" />
            <SocialLink href="https://linkedin.com/in/dipankarbarik" icon={Linkedin} label="LinkedIn" />
            <SocialLink href="https://x.com/_dipankarsource" icon={Twitter} label="Twitter" />
            <SocialLink href="/Resume_Portfolio.pdf" icon={Download} label="CV" />
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
      className="group flex items-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
      aria-label={label}
    >
      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
      <span className="w-0 overflow-hidden transition-all duration-300 ease-out group-hover:w-auto group-hover:ml-1.5 opacity-0 group-hover:opacity-100 text-xs font-medium whitespace-nowrap">
        {label}
      </span>
    </a>
  );
};

export default FooterSystem;
