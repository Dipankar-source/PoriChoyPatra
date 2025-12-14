import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Home", href: "#" },
  { name: "Work", href: "#" },
  { name: "About", href: "#" },
  { name: "Notes", href: "#" },
];

export default function PremiumNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="flex justify-center">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative flex items-center justify-between px-6 py-3 transition-all duration-500 ease-in-out",
          "rounded-full border border-white/10 shadow-2xl",
          scrolled
            ? "w-[100%] bg-black/60 backdrop-blur-xl"
            : "w-[100%] md:w-[100%] bg-black/30 backdrop-blur-md"
        )}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex items-center gap-1 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-600 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <div className="w-4 h-4 bg-white rounded-full blur-[8px] opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-bold text-white tracking-tight ml-2 text-lg">
            Ishani<span className="text-neutral-500">.ui</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.span
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatePresence>
              {item.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center relative z-10">
          <button className="group relative flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-all active:scale-95">
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

            <div className="absolute inset-0 rounded-full bg-white blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
          </button>
        </div>

        <div className="md:hidden flex items-center z-10">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl md:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-neutral-300 hover:text-white border-b border-white/5 pb-2"
              >
                {item.name}
              </a>
            ))}
            <button className="w-full mt-2 py-3 bg-white text-black font-bold rounded-xl">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
